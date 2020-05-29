import React, {Fragment} from 'react';
import { 
    disableBodyScroll,
    enableBodyScroll,
} from 'body-scroll-lock';
import {
    BrowserView,
    TabletView,
    MobileOnlyView,
    isBrowser,
} from 'react-device-detect';
import BrowserTraceContainerView from '../../platform/browser/BrowserTraceContainerView';
import MobileTraceContainerView from '../../platform/mobile/MobileTraceContainerView';
import TabletTraceContainerView from '../../platform/tablet/TabletTraceContainerView';
import { AppContext } from '../../../context/AppContext';
import retrieveDataHelper from '../../../helper/retrieveDataHelper';
import pdfPackageGenerator from '../../../helper/pdfPackageGenerator';
import config from '../../../config';
import moment from 'moment';
import {
    locationHistoryByNameColumns,
    locationHistoryByUUIDColumns,
    locationHistoryByAreaColumns,
    locationHistoryByNameGroupBYUUIDColumns
} from '../../../config/tables';
import axios from 'axios';
import dataSrc from '../../../dataSrc';


class TraceContainer extends React.Component{

    static contextType = AppContext
    
    formikRef = React.createRef()

    state = {
        columns:[], 
        data:[],
        options: {
            name: [],
            uuid: [],
        },
        locale: this.context.locale.abbr,
        histories: [],
        breadIndex: -1,
    }
    columns = [];

    defaultActiveKey='nameGroupByArea' 

    title='trace'

    navList = [
        {
            name: 'nameGroupByArea',
            mode: 'nameGroupByArea',
        },
        {
            name: 'nameGroupByUUID',
            mode: 'nameGroupByUUID',
        },
        {
            name: 'area',
            mode: 'area'
        }
    ]


    componentDidMount = () => {

        /** disable the scrollability in body*/
        if (!isBrowser) {
            let targetElement = document.querySelector('body')
            enableBodyScroll(targetElement);
        }

        this.getObjectTable();
        this.getLbeaconTable();
        this.getAreaTable();
        if (this.props.location.state) {
            let { state } = this.props.location
            let endTime = moment();
            let startTime = moment().startOf('day');
            let field = {
                mode: state.mode,
                key: state.key,
                startTime,
                endTime,
                description: state.key.label
            }
            this.getLocationHistory(field, 0)
        }
    }

    componentWillUnmount = () => {
        let targetElement = document.querySelector('body')
        disableBodyScroll(targetElement);
    }

    componentDidUpdate = (prevProps, prevState) => {
        let {
            locale
        } = this.context
        if (this.context.locale.abbr !== prevState.locale) {   
            let columns = _.cloneDeep(this.columns).map(field => {
                field.name = field.Header
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
                return field
            })
            this.state.data.map(item => {
                item.area = locale.texts[item.area_original]
                item.residenceTime = moment(item.startTime).locale(locale.abbr).from(moment(item.endTime), true)
            })
            this.setState({
                locale: locale.abbr,
                columns,
            })
        }
    }

    getObjectTable = () => {
        let {
            locale,
            auth
        } = this.context
        retrieveDataHelper.getObjectTable(
            locale.abbr,
            auth.user.areas_id, 
            [1, 2]
        )
        .then(res => {
            let name = res.data.rows.map(item => {
                return {
                    value: item.name,
                    label: item.name,
                    description: item.name,
                }
            }) 
            this.setState({
                options: {
                    ...this.state.options,
                    nameGroupByArea: name,
                    nameGroupByUUID: name,
                }
            })
        })
    }

    getLbeaconTable = () => {
        let {
            locale
        } = this.context
        retrieveDataHelper.getLbeaconTable(
            locale.abbr
        )
        .then(res => {
            let uuid = res.data.rows.map(lbeacon => {
                return {
                    value: lbeacon.uuid,
                    label: `${lbeacon.description}[${lbeacon.uuid}]`,
                    description: lbeacon.description
                }
            })

            this.setState({
                options: {
                    ...this.state.options,
                    uuid
                }
            })
        })
    }

    getAreaTable = () => {
        let {
            locale
        } = this.context
        retrieveDataHelper.getAreaTable()
            .then(res => {
                let area = res.data.rows.map(area => {
                    return {
                        value: area.name,
                        label: locale.texts[area.name],
                        description: locale.texts[area.name],
                        id: area.id
                    }
                })
                this.setState({
                    options:{
                        ...this.state.options,
                        area
                    }
                })
            })
    }

    getLocationHistory = (fields, breadIndex) => { 
        const {
            locale
        } = this.context

        let key = null
        let timeValidatedFormat = 'YYYY/MM/DD HH:mm:ss'
        /** Set formik status as 0. Would render loading page */
        this.formikRef.current.setStatus(config.AJAX_STATUS_MAP.LOADING)

        switch(fields.mode) {
            case 'nameGroupByArea':
                key = fields.key.value;
                this.columns = locationHistoryByNameColumns;
                break;
            case 'nameGroupByUUID':
                key = fields.key.value;
                this.columns = locationHistoryByNameGroupBYUUIDColumns;
                break;
            case 'uuid':
                key = fields.key.value;
                this.columns = locationHistoryByUUIDColumns;
                break;
            case 'area':
                key = fields.key.value;
                this.columns = locationHistoryByAreaColumns;
                break;
        }

        let columns = _.cloneDeep(this.columns).map(field => {
            field.name = field.Header
            field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            return field
        })

        axios.post(dataSrc.trace.locationHistory, {
            key,
            startTime: moment(fields.startTime).format(), 
            endTime: moment(fields.endTime).format(),
            mode: fields.mode
        })
        .then(res => {
            let data = []
            let ajaxStatus;
            var histories = this.state.histories

            /** Condition handler when no result */
            if (res.data.rowCount == 0) {

                ajaxStatus = config.AJAX_STATUS_MAP.NO_RESULT;
                breadIndex--;

            } else {
                switch(fields.mode) {
                    case 'nameGroupByArea':
                    case 'nameGroupByUUID':
                        data = res.data.rows.map((item, index) => {
                            item.residenceTime = moment.duration(item.duration).locale(locale.abbr).humanize();
                            item.startTime = moment(item.start_time).format(timeValidatedFormat);
                            item.endTime = moment(item.end_time).format(timeValidatedFormat);
                            item.description = locale.texts[item.area_name];
                            item.mode = fields.mode;
                            item.area_original = item.area_name;
                            item.area = locale.texts[item.area_name];
                            return item
                        })
                        break;
                    case 'uuid':
                        data = res.data.rows.map((item, index) => {
                            item.id = index + 1
                            item.mode = fields.mode
                            item.area_original = item.area
                            item.area = locale.texts[item.area]
                            item.description = item.name
                            return item
                        })
                        break;
                    case 'area':
                        data = res.data.rows.map((item, index) => {
                            item.id = index + 1
                            item.mode = fields.mode
                            item.area_original = item.area
                            item.area = locale.texts[item.area]
                            item.description = item.name
                            return item
                        })
                        break;
                }

                ajaxStatus = config.AJAX_STATUS_MAP.SUCCESS;

                if (breadIndex < this.state.histories.length) {
                    histories = histories.slice(0, breadIndex)
                }
                histories.push({
                    key: fields.key,
                    startTime: moment(fields.startTime).format(), 
                    endTime: moment(fields.endTime).format(),
                    mode: fields.mode,
                    data,
                    columns,
                    description: fields.description
                })
            }

            this.setState({
                data,
                columns,
                histories,
                breadIndex,
            }, this.formikRef.current.setStatus(ajaxStatus))

        })
        .catch(err => {
            console.log(`get location history failed ${err}`)
        })
    }

    getInitialValues = () => {
        if (this.props.location.state) {
            let { state } = this.props.location;
            let endTime = moment().toDate();
            let startTime = moment().startOf('day').toDate();
            return {
                mode: state.mode,
                key: state.key,
                startTime,
                endTime,
            }
        }
        return {  
            mode: this.defaultActiveKey,
            key: null,
            description: null,
        }
    }

    onRowClick = (state, rowInfo, column, instance) => {
        let {
            setFieldValue,
        } = this.formikRef.current;
        let {
            locale
        } = this.context
        let values = this.formikRef.current.state.values;
        let startTime;
        let endTime;
        return {
            onClick: (e) => { 
                let key;
                let breadIndex = Number(this.state.breadIndex)
                switch(rowInfo.original.mode) {
                    case 'nameGroupByArea':
                        key = {
                            value: rowInfo.original.area_id,
                            label: locale.texts[rowInfo.original.area_original],
                            description: rowInfo.original.description
                        };
                        startTime = moment(rowInfo.original.startTime).toDate()
                        endTime = moment(rowInfo.original.endTime).toDate()
                        setFieldValue('key', key)
                        setFieldValue('mode', 'area')
                        setFieldValue('startTime', startTime)
                        setFieldValue('endTime', endTime)
                        this.getLocationHistory({
                            ...values,
                            ...rowInfo.original,
                            key,
                            mode: 'area',
                            description: rowInfo.original.description,
                        }, breadIndex + 1)
                        break;
                    case 'nameGroupByUUID':
                        key = {
                            value: rowInfo.original.area_id,
                            label: locale.texts[rowInfo.original.area_original],
                            description: rowInfo.original.description
                        };
                        startTime = moment(rowInfo.original.startTime).toDate()
                        endTime = moment(rowInfo.original.endTime).toDate()
                        setFieldValue('key', key)
                        setFieldValue('mode', 'area')
                        setFieldValue('startTime', startTime)
                        setFieldValue('endTime', endTime)
                        this.getLocationHistory({
                            ...values,
                            ...rowInfo.original,
                            key,
                            mode: 'area',
                            description: rowInfo.original.description,
                        }, breadIndex + 1)
                        break;
                    
                    case 'uuid':
                    case 'area':
                        key = {
                            value: rowInfo.original.name,
                            label: rowInfo.original.name,
                            description: rowInfo.original.description
                        }
                        startTime = moment(values.startTime).toDate()
                        endTime = moment(values.endTime).toDate()
                        setFieldValue('key', key)
                        setFieldValue('mode', 'nameGroupByArea')
                        setFieldValue('startTime', startTime)
                        setFieldValue('endTime', endTime)
                        this.getLocationHistory({
                            ...values,
                            ...rowInfo.original,
                            key,
                            mode: 'nameGroupByArea',
                            description: rowInfo.original.description,
                        }, breadIndex + 1)
                        break;
                }
            },
        }
    }


    handleClick = (e) => {
        let name = e.target.name 

        let {
            auth,
            locale
        } = this.context

        let values = this.formikRef.current.state.values; 

        let {
            setFieldValue,
            setErrors,
            setTouched,
            setStatus
        } = this.formikRef.current

        switch(name) {
            case 'exportCSV':

                let filePackage = pdfPackageGenerator.pdfFormat.getPath(
                    'trackingRecord',
                    {
                        extension: 'csv',
                    }
                )
                let header = this.state.columns.map(column => { 
                    return {
                        id: column.accessor,
                        title: column.name
                    }
                }) 
                let newData = []
                this.state.data.map((item,index)=>{ 
                    newData.push({
                        [locale.texts.AREA]: item.area,
                        [locale.texts.DESCRIPTION] : item.description,
                        UUID : item.uuid,
                        [locale.texts.START_TIME] : item.startTime,
                        [locale.texts.END_TIME] : item.endTime,
                        [locale.texts.RESIDENCE_TIME] : item.residenceTime 
                    }) 
                })

                axios.post(dataSrc.file.export.csv, {
                    data: newData,
                    header,          
                    filePackage
                })
                .then(res => {
                    var link = document.createElement('a');
                    link.href = dataSrc.pdfUrl(filePackage.path)
                    link.download = '';
                    link.click();
                })
                .catch(err => {
                    console.log(`export CSV failed ${err}`)
                })
                break;
            case 'exportPDF':
            
                let pdfPackage = pdfPackageGenerator.getPdfPackage({
                    option: 'trackingRecord',
                    user: auth.user,
                    data: {
                        columns: this.state.columns.filter(column => column.accessor != 'uuid'),
                        data: this.state.data
                    },
                    locale,
                    signature: null,
                    additional: {
                        extension: 'pdf',
                        key: values.key.label,
                        startTime: moment(values.startTime).format('lll'),
                        endTime: moment(values.endTime).format('lll'),
                        type: values.mode
                    }
                })

                axios.post(dataSrc.file.export.pdf, {
                    userInfo: auth.user,
                    pdfPackage,
                }).then(res => {
                    window.open(dataSrc.pdfUrl(pdfPackage.path))
                }).catch(err => {
                    console.log(`export PDF failed ${err}`)
                })
                break;

            case 'nav':
                let mode = e.target.getAttribute('data-rb-event-key')
                setFieldValue('key', null)
                setFieldValue('mode', mode)
                setFieldValue('startTime', null)
                setFieldValue('endTime', null)
                setErrors({})
                setTouched({})
                setStatus(config.AJAX_STATUS_MAP.WAIT_FOR_SEARCH)
                this.setState({
                    data: [],
                    columns: [],
                })
                break;
            case 'bread':
                let {
                    history,
                    index 
                } = JSON.parse(e.target.getAttribute('data'))
                setFieldValue('mode', history.mode)
                setFieldValue('key', history.key) 
                setFieldValue('startTime', moment(history.startTime).toDate())
                setFieldValue('endTime', moment(history.endTime).toDate())
                this.setState({
                    data: history.data,
                    columns: history.columns,
                    breadIndex: parseInt(index)
                })
        }
    }


 
    render(){
 
        let {
            data,
            histories,
            columns,
            options,
            breadIndex
        } = this.state

        let {
            getInitialValues,
            setState,
            navList,
            handleClick,
            getLocationHistory,
            onRowClick,
            title
        } = this

        let propsGroup = {
            /** attributes from this.state */
            data,
            histories,
            columns,
            options,
            breadIndex,

            /** attributes from this */
            getInitialValues,
            setState,
            navList,
            handleClick,
            getLocationHistory,
            onRowClick,
            title
        }

        return (
            <Fragment>
                <BrowserView>
                    <BrowserTraceContainerView
                        {...propsGroup}
                        ref={this.formikRef}
                    /> 
                </BrowserView>
                <TabletView>
                    <TabletTraceContainerView
                        {...propsGroup}
                        ref={this.formikRef}
                    /> 
                </TabletView>
                <MobileOnlyView>
                    <MobileTraceContainerView
                        {...propsGroup}
                        ref={this.formikRef}
                    />
                </MobileOnlyView>
            </Fragment>  
        )
    }
}

export default TraceContainer
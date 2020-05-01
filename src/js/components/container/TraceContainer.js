import React, { Fragment } from 'react';
import { DateTimePicker } from 'react-widgets';
import momentLocalizer from 'react-widgets-moment';
import dataSrc from '../../dataSrc';
import axios from 'axios'; 
import 'react-table/react-table.css'; 
import { 
    Formik,
} from 'formik';
import * as Yup from 'yup';
import { 
    Nav,
    Breadcrumb,
} from 'react-bootstrap';
import styleConfig from '../../config/styleConfig';
import 'react-tabs/style/react-tabs.css';
import { AppContext } from '../../context/AppContext';
import ReactTable from 'react-table';
import {
    locationHistoryByMacColumns,
    locationHistoryByUUIDColumns,
} from '../../config/tables';
import moment from 'moment';
import {
    BOTNavLink,
    BOTNav,
    NoDataFoundDiv,
    BOTContainer,
    PrimaryButton
} from '../BOTComponent/styleComponent';
import Loader from '../presentational/Loader';
import retrieveDataHelper from '../../helper/retrieveDataHelper';
import Select from 'react-select';
import {
    PageTitle
} from '../BOTComponent/styleComponent';
import IconButton from '../BOTComponent/IconButton';
import styleSheet from '../../config/styleSheet';
import ExportModal from '../presentational/ExportModal';
import config from '../../config';
import pdfPackageGenerator from '../../helper/pdfPackageGenerator';

momentLocalizer()

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

    defaultActiveKey='name' 

    statusMap = {
        LOADING: 'loading',
        SUCCESS: 'succcess',
        NO_RESULT: 'not result',
        WAIT_FOR_SEARCH: 'wait for search',
    }

    navList = [
        {
            name: 'name',
            mode: 'name',
        },
        {
            name: 'lbeacon',
            mode: 'uuid'
        }
    ]

    componentDidMount = () => {
        this.getObjectTable();
        this.getLbeaconTable();

        if (this.props.location.state) {
            let { state } = this.props.location
            let now = moment();
            let lastday = moment().subtract(config.TRACING_INTERVAL_VALUE, config.TRACING_INTERVAL_UNIT);
            let field = {
                mode: state.mode,
                key: state.key,
                startTime: lastday,
                endTime: now,
                description: state.key.label
            }
            this.getLocationHistory(field, 0)
        }
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
                    name,
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
    getLocationHistory = (fields, breadIndex) => {

        const {
            locale
        } = this.context

        let key = null
        let timeValidatedFormat = 'YYYY/MM/DD HH:mm:ss'
        
        /** Set formik status as 0. Would render loading page */
        this.formikRef.current.setStatus(this.statusMap.LOADING)

        switch(fields.mode) {
            case 'name':
                key = fields.key.value;
                this.columns = locationHistoryByMacColumns;
                break;
            case 'mac':
                key = fields.key.toLowerCase().replace(/[: ]/g, '').match(/.{1,2}/g).join(':')
                this.columns = locationHistoryByMacColumns
                break;
            case 'uuid':
                key = fields.key.value
                this.columns = locationHistoryByUUIDColumns
                break;
        }

        let columns = _.cloneDeep(this.columns).map(field => {
            field.name = field.Header
            field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            return field
        })

        axios.post(dataSrc.locationHistory, {
            key,
            startTime: moment(fields.startTime).format(), 
            endTime: moment(fields.endTime).format(),
            mode: fields.mode
        })
        .then(res => {
            /** Condition handler when no result */
            if (res.data.rowCount == 0) {
                this.formikRef.current.setStatus(this.statusMap.NO_RESULT)
                this.setState({
                    data: [],
                })
                return
            }

            let prevUUID = '';
            let data = []
            switch(fields.mode) {
                case 'mac':
                case 'name':
                    res.data.rows
                    .map(pt => {
                        if (pt.uuid != prevUUID) {
                            data.push({
                                uuid: pt.uuid,
                                startTime:  moment(pt.record_timestamp).format(timeValidatedFormat),
                                description: pt.description,
                                mode: fields.mode,
                                area_original: pt.area,
                                area: locale.texts[pt.area]
                            })
                            prevUUID = pt.uuid
                        }
                        data[data.length - 1].endTime = moment(pt.record_timestamp).locale(locale.abbr).format(timeValidatedFormat)
                        data[data.length - 1].residenceTime = moment(pt.record_timestamp).locale(locale.abbr).from(moment(data[data.length - 1].startTime), true)
                    })
                    break;
                case 'uuid':
                    data = res.data.rows.map((item, index) => {
                        item.id = index + 1
                        item.mode = fields.mode
                        item.area_original = item.area
                        item.area= locale.texts[item.area]
                        item.description = item.name
                        return item
                    })
                    break;
            }
            var histories = this.state.histories

            if (breadIndex < this.state.histories.length - 1) {
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

            this.setState({
                data,
                columns,
                histories,
                breadIndex,
            }, this.formikRef.current.setStatus(this.statusMap.SUCCESS))

        })
        .catch(err => {
            console.log(`get location history failed ${err}`)
        })
    }

    getInitialValues = () => {
        if (this.props.location.state) {
            let { state } = this.props.location;
            let now = moment().toDate();
            let lastday = moment().subtract(30, 'minutes').toDate();
            return {
                mode: state.mode,
                key: state.key,
                startTime: lastday,
                endTime: now,
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
        let values = this.formikRef.current.state.values;
        let startTime;
        let endTime;

        return {
            onClick: (e) => { 
                let key;
                let breadIndex = Number(this.state.breadIndex)
                switch(rowInfo.original.mode) {
                    case 'name':
                        key = {
                            value: rowInfo.original.uuid,
                            label: rowInfo.original.uuid,
                            description: rowInfo.original.description

                        };
                        startTime = moment(rowInfo.original.startTime).toDate()
                        endTime = moment(rowInfo.original.endTime).toDate()
                        setFieldValue('key', key)
                        setFieldValue('mode', 'uuid')
                        setFieldValue('startTime', startTime)
                        setFieldValue('endTime', endTime)
                        this.getLocationHistory({
                            ...values,
                            ...rowInfo.original,
                            key,
                            mode: 'uuid',
                            description: rowInfo.original.description,
                        }, breadIndex + 1)
                        break;
                    case 'uuid':
                        key = {
                            value: rowInfo.original.name,
                            label: rowInfo.original.name,
                            description: rowInfo.original.description
                        }
                        startTime = moment(values.startTime).toDate()
                        endTime = moment(values.endTime).toDate()
                        setFieldValue('key', key)
                        setFieldValue('mode', 'name')
                        setFieldValue('startTime', startTime)
                        setFieldValue('endTime', endTime)
                        this.getLocationHistory({
                            ...values,
                            ...rowInfo.original,
                            key,
                            mode: 'name',
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
                axios.post(dataSrc.file.export.csv, {
                    data: this.state.data,
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
                let pdfPackage = pdfPackageGenerator.getPdfPackage(
                    'trackingRecord', 
                    auth.user, 
                    {
                        columns: this.state.columns.filter(column => column.accessor != 'uuid'),
                        data: this.state.data
                    },
                    locale,
                    null,
                    {
                        extension: 'pdf',
                        key: values.key.label,
                        startTime: moment(values.startTime).format('lll'),
                        endTime: moment(values.endTime).format('lll'),
                        type: values.mode

                    }
                )  

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
                let {
                    setFieldValue,
                    setErrors,
                    setTouched,
                    setStatus
                } = this.formikRef.current
                let mode = e.target.getAttribute('data-rb-event-key')
                setFieldValue('key', null)
                setFieldValue('mode', mode)
                setFieldValue('startTime', null)
                setFieldValue('endTime', null)
                setErrors({})
                setTouched({})
                setStatus(this.statusMap.WAIT_FOR_SEARCH)
                this.setState({
                    data: [],
                    columns: [],
                })
                break;

        }
    }
 
    render(){

        const { locale } = this.context
 
        const timeValidatedFormat = 'YYYY/MM/DD HH:mm:ss'

        let initialValues = this.getInitialValues()

        return (
            <BOTContainer>
                <BOTContainer></BOTContainer>
                <div className='d-flex justify-content-between'>
                    <PageTitle>                                            
                        {locale.texts.TRACKING_HISTORY}
                    </PageTitle>
                    {this.state.data.length !== 0 &&
                        <div>
                            <IconButton
                                iconName='fas fa-download'
                                name='exportPDF'
                                onClick={this.handleClick}
                            >
                                {locale.texts.EXPORT_PDF}
                            </IconButton>
                            <IconButton
                                iconName='fas fa-download'
                                name='exportCSV'
                                onClick={this.handleClick}
                            >
                                {locale.texts.EXPORT_CSV}
                            </IconButton>
                        </div>
                    }
                </div>
                <Formik     
                    initialValues={initialValues}

                    ref={this.formikRef}

                    initialStatus={this.statusMap.WAIT_FOR_SEARCH}
                    
                    validateOnChange={false}

                    validateOnBlur={false}
                    
                    validationSchema = {
                        Yup.object().shape({

                            key: Yup.object()
                                .nullable()
                                .required(locale.texts.REQUIRED),
                                // .when('mode', {
                                //     is: 'mac',
                                //     then: Yup.string().test(
                                //         'mode', 
                                //         locale.texts.MAC_ADDRESS_FORMAT_IS_NOT_CORRECT,
                                //         value => {  
                                //             if (value == undefined) return false
                                //             let pattern = new RegExp('^[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}$');
                                //             return value.match(pattern)
                                //         }
                                //     )
                                // })
                                // .when('mode', {
                                //     is: 'uuid',
                                //     then: Yup.object().test(
                                //         'uuid', 
                                //         locale.texts.LBEACON_FORMAT_IS_NOT_CORRECT,
                                //         value => {  
                                //             if (value == undefined) return false
                                //             let pattern = new RegExp('^[0-9A-Fa-f]{8}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{12}$');
                                //             return value.value.match(pattern)
                                //         }
                                //     )
                                // }),

                            startTime: Yup.string()
                                .required(locale.texts.START_TIME_IS_REQUIRED)
                                .test(
                                    'startTime', 
                                    locale.texts.TIME_FORMAT_IS_INCORRECT,
                                    value => {  
                                        let test = moment(value).format(timeValidatedFormat)
                                        return moment(test, timeValidatedFormat, true).isValid()
                                    }
                                ),

                            endTime: Yup.string()
                                .required(locale.texts.END_TIME_IS_REQUIRED)
                                .test(
                                    'endTime', 
                                    locale.texts.TIME_FORMAT_IS_INCORRECT,
                                    value => {  
                                        let test = moment(value).format(timeValidatedFormat)
                                        return moment(test, timeValidatedFormat, true).isValid()
                                    }
                                ),
                    })}

                    onSubmit={(values) => {
                        this.getLocationHistory({
                            ...values,
                            description: values.key.description
                        }, this.state.breadIndex + 1)
                    }}
                
                    render={({ 
                        values, 
                        errors, 
                        status, 
                        touched, 
                        isSubmitting, 
                        setFieldValue, 
                        submitForm, 
                    }) => (
                        <Fragment>
                            <Breadcrumb 
                                className='my-2'
                            >
                                {this.state.histories.map((history, index) => {
                                    return (
                                        <Breadcrumb.Item
                                            key={index}
                                            active={this.state.breadIndex == index}
                                            name='bread'
                                            onClick={(e) => {
                                                setFieldValue('mode', history.mode)
                                                setFieldValue('key', history.key)
                                                setFieldValue('startTime', moment(history.startTime).toDate())
                                                setFieldValue('endTime', moment(history.endTime).toDate())
                                                this.setState({
                                                    data: history.data,
                                                    columns: history.columns,
                                                    breadIndex: index
                                                })
                                            }}
                                        >
                                            {history.description}
                                        </Breadcrumb.Item>
                                    )
                                })}
                            </Breadcrumb>
                            <BOTNav>
                                {this.navList.map((nav, index) => {
                                    return (
                                        <Nav.Item
                                            key={index}
                                        >
                                            <BOTNavLink 
                                                eventKey={nav.mode}
                                                active={values.mode == nav.mode}                               
                                                onClick={this.handleClick}
                                                name='nav'
                                            >
                                                {locale.texts[nav.name.toUpperCase().replace(/ /g, '_')]}
                                            </BOTNavLink>
                                        </Nav.Item>
                                    )
                                })}
                            </BOTNav>
                            <div className='d-flex justify-content-between my-4'>
                                <div className='d-flex justify-content-start'>
                                    <div
                                        className='mx-2'
                                        style={{
                                            position: 'relative'
                                        }}
                                    >
                                        <Select
                                            name='key'
                                            value={values.key}
                                            className='float-right'
                                            onChange={(value) => { 
                                                setFieldValue('key', value)
                                            }}
                                            isClearable={true}
                                            isSearchable={true}
                                            options={this.state.options[values.mode]}
                                            styles={styleConfig.reactSelectSearch}
                                            components={styleConfig.reactSelectSearchComponent}         
                                            placeholder={locale.texts[`SEARCH_FOR_${values.mode.toUpperCase()}`]}                           
                                        />
                                        {errors.key && (
                                            <div 
                                                className='text-left'
                                                style={{
                                                    fontSize: '0.6rem',
                                                    color: styleSheet.warning,
                                                    position: 'absolute',
                                                    left: 0,
                                                    bottom: -18,
                                                }}
                                            >
                                                {errors.key}
                                            </div>
                                        )}
                                    </div>
                                    <DateTimePicker 
                                        name='startTime'
                                        className='mx-2'
                                        value={values.startTime}
                                        onChange={(value) => {
                                            setFieldValue('startTime', moment(value).toDate())
                                        }}
                                        placeholder={locale.texts.START_TIME}
                                    />
                                    <DateTimePicker 
                                        name='endTime'
                                        className='mx-2'
                                        value={values.endTime}
                                        onChange={(value) => {
                                            setFieldValue('endTime', moment(value).toDate())
                                        }}
                                        placeholder={locale.texts.END_TIME}
                                    />
                                  
                                </div>
                                
                                <div
                                    className='d-flex align-items-center'
                                >
                                    <PrimaryButton
                                        type='button' 
                                        disabled={this.state.done}
                                        onClick={submitForm}
                                    >
                                        {locale.texts.SEARCH}
                                    </PrimaryButton>
                                </div>
                            </div>
                            {status == this.statusMap.LOADING && <Loader />}
                            <hr/>
                            {this.state.data.length != 0 ? 
                                (
                                    <ReactTable
                                        keyField='id'
                                        data={this.state.data}
                                        columns={this.state.columns}
                                        className='-highlight mt-4'
                                        style={{maxHeight: '65vh'}} 
                                        pageSize={this.state.data.length}
                                        {...styleConfig.reactTable}
                                        getTrProps={this.onRowClick}
                                    />
                                )
                                :   <NoDataFoundDiv>{locale.texts[status.toUpperCase().replace(/ /g, '_')]}</NoDataFoundDiv>
                            }         
                        </Fragment>
                    )}
                />
                <ExportModal
                    show={this.state.showModal}
                />
            </BOTContainer>
        )
    }
}

export default TraceContainer

import React, { Fragment } from 'react';
import { DateTimePicker } from 'react-widgets';
import momentLocalizer from 'react-widgets-moment';
import dataSrc from '../../../dataSrc';
import axios from 'axios'; 
import 'react-table/react-table.css'; 
import { 
    Formik,
} from 'formik';
import * as Yup from 'yup';
import { 
    Nav,
    Breadcrumb,
    Row,
    Col
} from 'react-bootstrap';
import styleConfig from '../../../config/styleConfig';
import 'react-tabs/style/react-tabs.css';
import { AppContext } from '../../../context/AppContext';
import moment from 'moment';
import {
    BOTNavLink,
    BOTNav,
    NoDataFoundDiv,
    BOTContainer,
    PrimaryButton
} from '../../BOTComponent/styleComponent';
import Loader from '../../presentational/Loader';
import retrieveDataHelper from '../../../helper/retrieveDataHelper';
import Select from 'react-select';
import {
    PageTitle
} from '../../BOTComponent/styleComponent';
import IconButton from '../../BOTComponent/IconButton';
import styleSheet from '../../../config/styleSheet';
import ExportModal from '../../presentational/ExportModal';
import config from '../../../config';
import pdfPackageGenerator from '../../../helper/pdfPackageGenerator';

momentLocalizer()

class TraceContainer extends React.Component{

    static contextType = AppContext
    
    formikRef = React.createRef()

    state = {
        options: {
            name: [],
            uuid: [],
        },
        locale: this.context.locale.abbr,
        histories: [],
        breadIndex: -1,
        result: {},
    }

    defaultActiveKey='name' 

    statusMap = {
        LOADING: 'loading',
        SUCCESS: 'succcess',
        NO_RESULT: 'not result',
        WAIT_FOR_SEARCH: 'wait for search',
    }

    componentDidMount = () => {
        this.getObjectTable();
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

    async getLocationHistory (fields, breadIndex){
        
        /** Set formik status as 0. Would render loading page */
        this.formikRef.current.setStatus(this.statusMap.LOADING)


        let lastday = moment().subtract(1, 'days');
        let now = moment();
        var parents = [];
        let level = 0;
        let maxLevel = 3;

        let contactTree = this.getContactTree(
            {}, 
            fields.key.value,
            parents,
            lastday,
            now,
            maxLevel,
            level
        )

        let result = await contactTree

        console.log('in the context')
        console.log(result)

        let processedData = this.processContactTree(result)
        console.log(processedData)
        let test = this.test(processedData)

        
        this.setState({
            result,
        })
        this.formikRef.current.setStatus(this.statusMap.SUCCESS)

    }

    test = (data) => {
        let obj = {};
        // Object.values(data).map(level => {
        //     console.log(level)
        // })
        let duplicated = []
        for (let level in data) {
            for (let parent in data[level]) {
                data[level][parent]
                    .filter(item => !duplicated.includes(item))
                    .map(item => duplicated.push(item))
            }
        }
        console.log(data)
    }

    processContactTree = (result) => {
        const data = {
            name: 'joe',
            parent: '',
            level: 0,
            children: [
                {
                    name: 'HCC',
                    parent: 'joe',
                    level: 1,
                },
                {
                    name: 'jason',
                    parent: 'joe',
                    level: 1,
                    children: [
                        {
                            name: 'jane',
                            parent: 'jason',
                            level: 2,
                            children: [
                                {
                                    name: 'Mr. Wang',
                                    parent: 'jane',
                                    level: 3
                                }
                            ]
                        },
                        {
                            name: 'joey',
                            parent: 'jason',
                            level: 2,
                        },
                        {
                            name: 'tony',
                            parent: 'jason',
                            level: 2
                        }
                    ]
                },
                {
                    name: 'jimmy',
                    parent: 'joe',
                    level: 1,
                    children: [
                        {
                            name: 'vera',
                            parent: 'jimmy',
                            level: 2,
                        },
                    ]
                }
            ]
        }
        var collection = {}
        var duplicate = []

        const collect = node => {
            if (!collection[node.level]) {
                collection[node.level] = {}
            }
            if (!collection[node.level][node.parent]) {
                collection[node.level][node.parent] = []
            }

            collection[node.level][node.parent].push(node.name)
            
            if (node.children) {
                node.children.map(child => {
                    if (!duplicate.includes(child.name)) {
                        duplicate.push(child.name)
                    }
                })
                node.children.map(child => {
                    collect(child)
                })
            }
        }
        collect(result)
        return collection
    }


    getTreeIterate = (name, startTime, endTime, maxLevel) => {
        let level = 1;
        let tree = {
            [level]: {
                name: [],
            }
        };
        while(level < maxLevel) {

        }

    }

    async getContactTree (node, name, parents, startTime, endTime, maxLevel, level, att = '') {
        node.name = name;
        node.level = level;
        node.parent = att;
        let parentsCopy = Array.from(parents)
 
        if (!parentsCopy.includes(name)) parentsCopy.push(name)
        if (level == maxLevel) return node;
        else {
            const getChildren = this.getChildren(
                name,
                parents,
                startTime,
                endTime,
            )
            .then(res => {
                level++
                // if (!parents.includes(name)) parents.push(name)
                // console.log(res.data.rows)
                return res.data.rows.map(child => {
                    // if (!parents.includes(child.child)) parents.push(child.child)
                    return this.getContactTree(
                        {},
                        child.child,
                        parentsCopy,
                        child.start_time,
                        endTime,
                        maxLevel,
                        level,
                        child.parent
                    )
                })

            })
            let children = await getChildren
            node.children = await Promise.all(children).then(res => {
                return res
            })

            return node




            // this.getNode(
            //     name,
            //     parents,
            //     startTime,
            //     endTime
            // )
            // .then(res => {
            //     level++
            //     node.children = res.data.rows.map(child => {

            //         return this.getContactTree(
            //             {},
            //             child.child,
            //             parents,
            //             child.start_time,
            //             child.end_time,
            //             level
            //         )
            //     })

            //     console.log(node)

            //     return node
            // })
        }
    }

    getChildren = (child, parents, startTime, endTime) => {
        return axios.post(dataSrc.trace.contactTree, {
            child,
            parents,
            startTime,
            endTime,
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


    handleClick = (e) => {
        let name = e.target.name 
        let {
            auth,
            locale
        } = this.context
        let values = this.formikRef.current.state.values;
        switch(name) {
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
        }
    }
 
    render(){

        const { locale } = this.context
 
        let initialValues = this.getInitialValues()

        
        return (
            <BOTContainer>
                <div className='d-flex justify-content-between'>
                    <PageTitle>                                            
                        {locale.texts.CONTACT_TREE}
                    </PageTitle>
                    {this.state.result.length !== 0 &&
                        <div>
                            <IconButton
                                iconName='fas fa-download'
                                name='exportPDF'
                                onClick={this.handleClick}
                            >
                                {locale.texts.EXPORT_PDF}
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
                            Level 1
                            
                            {/* {Object.values(this.state.result).length != 0 
                                ?   (
                                    <Row>
                                        <Col>
                                            {this.state.result.name}
                                        </Col>
                                        <Col
                                            className='d-flex-column'
                                        >
                                            {this.state.result.children.map(child => {
                                                return (
                                                    <div>
                                                        {child.name}
                                                    </div>

                                                )
                                            })}
                                        </Col>
                                    </Row>
                                )
                                : ""
                            
                            } */}
        
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

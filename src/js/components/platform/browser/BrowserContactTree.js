import React, { Fragment } from 'react';
import dataSrc from '../../../dataSrc';
import axios from 'axios'; 
import 'react-table/react-table.css'; 
import { 
    Formik,
} from 'formik';
import * as Yup from 'yup';
import styleConfig from '../../../config/styleConfig';
import 'react-tabs/style/react-tabs.css';
import { AppContext } from '../../../context/AppContext';
import moment from 'moment';
import {
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
import config from '../../../config';
import pdfPackageGenerator from '../../../helper/pdfPackageGenerator';
import {
    Row,
    Col
} from 'react-bootstrap';
import NumberPicker from '../../container/NumberPicker';

class TraceContainer extends React.Component{

    static contextType = AppContext
    
    formikRef = React.createRef()

    state = {
        options: [],
        locale: this.context.locale.abbr,
        histories: [],
        breadIndex: -1,
        result: {},
        final: {},
    }

    defaultActiveKey='name' 


    componentDidMount = () => {
        this.getObjectTable();
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
            let options = res.data.rows.map(item => {
                return {
                    value: item.name,
                    label: item.name,
                    description: item.name,
                }
            })
            this.setState({
                options,
            })
        })
    }

    async getLocationHistory (fields){
        
        /** Set formik status as 0. Would render loading page */
        this.formikRef.current.setStatus(config.AJAX_STATUS_MAP.LOADING)

        console.log(fields)
        let startTime = moment().subtract(config.DEFAULT_CONTACT_TREE_INTERVAL_VALUE, config.DEFAULT_CONTACT_TREE_INTERVAL_UNIT);
        let endTime = moment();
        var parents = [];
        let level = 0;
        let maxLevel = fields.level;

        let contactTree = this.getContactTree(
            {}, 
            fields.key.value,
            parents,
            startTime,
            endTime,
            maxLevel,
            level
        )

        let result = await contactTree

        let processedData = this.processContactTree(result)
        let final = this.filterDuplicated(processedData)
        
        this.setState({
            final,
        })
        this.formikRef.current.setStatus(config.AJAX_STATUS_MAP.SUCCESS)

    }

    filterDuplicated = (data) => {
        let duplicated = []
        Object.keys(data)
            .map(level => {
                Object.keys(data[level]).map(parent => {
                    data[level][parent] = data[level][parent]
                        .filter(child => {
                            return !duplicated.includes(child)
                        })
                        .map(child => {
                            duplicated.push(child)
                            return child
                        })
                    
                }) 
        })
        return data
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

    async getContactTree (node, name, parents, startTime, endTime, maxLevel, level, att = '') {
        node.name = name;
        node.level = level;
        node.parent = att;
        // let parentsCopy = Array.from(parents)
 
        // if (!parentsCopy.includes(name)) parentsCopy.push(name)
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
                        parents,
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

    handleClick = (e) => {
        let name = e.target.name 
        let {
            auth,
            locale
        } = this.context
        let values = this.formikRef.current.state.values;
        switch(name) {
            case 'exportPDF':

                const pdfOptions = {
                    format: 'A4',
                    orientation: 'landscape',
                    border: '1cm',
                    timeout: '12000'
                }

                let pdfPackage = pdfPackageGenerator.getPdfPackage({
                    option: 'contactTree',
                    user: auth.user,
                    data: this.state.final,
                    locale,
                    signature: null,
                    additional:
                    pdfOptions,
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
        }
    }

    DrawTreeTextForm = (data) => {
        let {
            locale
        } = this.context
        return (
            <Row>
                {Object.keys(data)
                    .filter(level => {
                        return level != 0 && Object.values(data[level].length != 0)
                    })
                    .map((level, index) => {
                        return (
                            <Col
                                key={index}
                                lg={2}
                            >
                                {Object.keys(data[level])
                                    .filter(parent => data[level][parent].length != 0)
                                    .map((parent, index) => {
                                        return (
                                            <div>
                                                <div>
                                                    {locale.texts.LEVEL} {level}
                                                </div>
                                                <Row
                                                    key={index}
                                                >
                                                    <Col>
                                                        {parent}
                                                    </Col>
                                                    <Col>
                                                        <i class="fas fa-arrow-right"></i>                                                    
                                                    </Col>
                                                    <Col
                                                        className='d-flex-column'
                                                    >
                                                        {data[level][parent].map((child, index) => {
                                                            return (
                                                                <div
                                                                    key={index}
                                                                >
                                                                    {child}
                                                                </div>
                                                            )
                                                        })}
                                                    </Col>
                                                </Row>
                                            </div>
                                        )
                                })}                
                            </Col>
                        )
                    })}
            </Row>
        )
    }
 
    render () {

        const { locale } = this.context
 
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
                    initialValues={{
                        key: null,
                        level: null,
                    }}

                    ref={this.formikRef}

                    initialStatus={config.AJAX_STATUS_MAP.WAIT_FOR_SEARCH}
                    
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
                        })
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
                                            options={this.state.options}
                                            styles={styleConfig.reactSelectSearch}
                                            components={styleConfig.reactSelectSearchComponent}         
                                            placeholder={locale.texts.SEARCH}                           
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
                                    <NumberPicker
                                        name='level'
                                        value={values.level}
                                        onChange={(level) => setFieldValue('level', level)}
                                        length={6}
                                        placeholder={locale.texts.SELECT_LEVEL}
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
                            {status == config.AJAX_STATUS_MAP.LOADING && <Loader />}
                            <hr/>
                            {status == config.AJAX_STATUS_MAP.SUCCESS && (
                                this.DrawTreeTextForm(this.state.final)
                            )}
                        </Fragment>
                    )}
                />
            </BOTContainer>
        )
    }
}

export default TraceContainer

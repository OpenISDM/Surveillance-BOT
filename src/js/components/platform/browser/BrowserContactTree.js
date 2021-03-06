/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BrowserContactTree.js

    File Description:
        BOT UI component

    Version:
        1.0, 20200601

    Abstract:
        BeDIS uses LBeacons to deliver 3D coordinates and textual descriptions of
        their locations to users' devices. Basically, a LBeacon is an inexpensive,
        Bluetooth device. The 3D coordinates and location description of every 
        LBeacon are retrieved from BeDIS (Building/environment Data and Information 
        System) and stored locally during deployment and maintenance times. Once 
        initialized, each LBeacon broadcasts its coordinates and location 
        description to Bluetooth enabled user devices within its coverage area. It 
        also scans Bluetooth low-energy devices that advertise to announced their 
        presence and collect their Mac addresses.

    Authors:
        Tony Yeh, LT1stSoloMID@gmail.com
        Wayne Kang, b05505028@ntu.edu.tw
        Edward Chen, r08921a28@ntu.edu.tw
        Joe Chou, jjoe100892@gmail.com
*/

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
    PrimaryButton,
    NoDataFoundDiv
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
    Col,
    Card
} from 'react-bootstrap';
import NumberPicker from '../../container/NumberPicker';
import { DateTimePicker } from 'react-widgets';
import momentLocalizer from 'react-widgets-moment';

momentLocalizer()


class BrowserContactTree extends React.Component{

    static contextType = AppContext
    
    formikRef = React.createRef()

    state = {
        options: [],
        locale: this.context.locale.abbr,
        final: {},
        collection: [],
    }

    defaultActiveKey='name' 


    componentDidMount = () => {
        this.getObjectTable();
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

    /** Get location history */
    async getLocationHistory (fields) {
        let {
            level,
            key
        } = fields
        let duplicate = [];
        let wait = [];
        let collection = [];
        // let startTime = '2020/05/13 00:00:00';
        // let endTime = '2020/05/14 00:00:00';
        // let startTime = moment().startOf('day');
        // let endTime = moment();
        let startTime = moment(fields.startTime).format();
        let endTime = moment(fields.endTime).format();

        wait.push({
            name: key.value,
            level: 0,
            parent: "",
            startTime,
        })
        duplicate.push(key.value)

        this.setState({
            collection,
        })

        this.formikRef.current.setStatus(config.AJAX_STATUS_MAP.LOADING)

        while (wait.length != 0) {
            let parent = wait.shift();
            if (parent.level > level - 1) break;
            let childrenPromise = this.getChildren(
                parent.name, 
                duplicate,
                parent.startTime,
                endTime,
            ).then(res => {
                return res.data.rows
                    .filter(child => !duplicate.includes(child.child))
                    .map(child => {
                        child.name = child.child
                        child.startTime = child.start_time
                        child.level = parent.level + 1
                        wait.push(child)
                        duplicate.push(child.child)

                        delete child.start_time
                        this.mountChild(collection, child)
                        return child
                    })
            })
            await childrenPromise
            this.setState({
                collection
            })
        }

        /** set status code of fetching contact tracing data */
        if (this.state.collection.length == 0) {
            this.formikRef.current.setStatus(config.AJAX_STATUS_MAP.NO_RESULT)
        }
        else this.formikRef.current.setStatus(config.AJAX_STATUS_MAP.SUCCESS)

    }

    /** Append child data into collection */
    mountChild = (collection, child) => {
        if (!collection[child.level]) {
            collection[child.level] = {}
        }

        if (!collection[child.level][child.parent]) {
            collection[child.level][child.parent] = [child.child]
        } else {
            collection[child.level][child.parent].push(child.child)
        }
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
                    data: this.state.collection,
                    locale,
                    signature: null,
                    additional: null,
                    // pdfOptions,
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
 
    render () {

        const { locale } = this.context
 
        return (
            <BOTContainer>
                <div className='d-flex justify-content-between'>
                    <PageTitle>                                            
                        {locale.texts.CONTACT_TREE}
                    </PageTitle>
                    {this.state.collection.length !== 0 &&
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
                        endTime: moment().toDate(),
                        startTime: moment().startOf('day').toDate(),
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

                            level: Yup.number()
                                .nullable()
                                .required(locale.texts.REQUIRED)

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
                                    <div
                                        className='mx-2'
                                        style={{
                                            position: 'relative'
                                        }}
                                    >   
                                        <DateTimePicker 
                                            name='startTime'
                                            className='mx-2'
                                            value={values.startTime} 
                                            onkeydown="return false"
                                            onChange={(value) => {  
                                                value != null ?
                                                setFieldValue('startTime', moment(value).toDate())
                                                : setFieldValue('startTime', undefined)
                                            }}  
                                            defaultCurrentDate={moment().startOf("day").toDate()}
                                            placeholder={locale.texts.START_TIME} 
                                        />

                                        {errors.startTime && (
                                            <div 
                                                className='text-left'
                                                style={{
                                                    fontSize: '0.6rem',
                                                    color: styleSheet.warning,
                                                    position: 'absolute',
                                                    left: 10,
                                                    bottom: -18,
                                                }}
                                            >
                                                {errors.startTime}
                                            </div>
                                        )}

                                    </div>
                                    <div
                                        className='mx-2'
                                        style={{
                                            position: 'relative'
                                        }}
                                    >
                                        <DateTimePicker 
                                            name='endTime'
                                            className='mx-2'
                                            value={values.endTime != null ? values.endTime  : undefined} 
                                            onChange={(value) => { 
                                                value != null ?
                                                setFieldValue('endTime', moment(value).toDate())
                                                : setFieldValue('endTime', undefined)
                                            }} 
                                            placeholder={locale.texts.END_TIME}
                                        />
                                        {errors.endTime && (
                                            <div 
                                                className='text-left'
                                                style={{
                                                    fontSize: '0.6rem',
                                                    color: styleSheet.warning,
                                                    position: 'absolute',
                                                    left: 10,
                                                    bottom: -18,
                                                }}
                                            >
                                                {errors.endTime}
                                            </div>
                                        )}
                                    </div>
                                    <div
                                        className='mx-2'
                                        style={{
                                            position: 'relative'
                                        }}
                                    >
                                        <NumberPicker
                                            name='level'
                                            value={values.level}
                                            onChange={level => setFieldValue('level', level)}
                                            length={config.MAX_CONTACT_TRACING_LEVEL}
                                            placeholder={locale.texts.SELECT_LEVEL}
                                        />
                                        {errors.level && (
                                            <div 
                                                className='text-left'
                                                style={{
                                                    fontSize: '0.6rem',
                                                    color: styleSheet.warning,
                                                    position: 'absolute',
                                                    left: 10,
                                                    bottom: -18,
                                                }}
                                            >
                                                {errors.level}
                                            </div>
                                        )}
                                    </div>
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
                            <hr/>
                            <Row
                                // className='d-flex justify-content-start'
                            >
                                {this.state.collection.length != 0 
                                    ?  this.state.collection.map((level, index) => {
                                            return (
                                                <Card 
                                                    style={{ 
                                                        // width: '20rem' 
                                                    }}
                                                    className='col-lg-4 border-0 p-1'
                                                    key={index}
                                                >
                                                    <Card.Body
                                                        style={{
                                                            border: '1px solid rgba(0,0,0,.125)',
                                                            borderRadius: '.25rem'
                                                        }}
                                                        
                                                    >
                                                        <Card.Title
                                                            className='text-capitalize'
                                                        >
                                                            {locale.texts.LEVEL} {index}
                                                        </Card.Title>
                                                        <Card.Text>
                                                            {Object.keys(level).map((parent, index) => {
                                                                return (
                                                                    <Row
                                                                        key={index}
                                                                        className='mb-2'
                                                                    >
                                                                        <Col
                                                                            lg={5}
                                                                        >
                                                                            {parent}
                                                                        </Col>
                                                                        <Col
                                                                            lg={1}
                                                                        >
                                                                            <i className="fas fa-arrow-right"></i>                                                        
                                                                        </Col>
                                                                        <Col
                                                                            lg={5}
                                                                        >
                                                                            {level[parent].map(child => {
                                                                                return (
                                                                                    <p
                                                                                        className='d-flex-column'
                                                                                    >
                                                                                        {child}
                                                                                    </p>
                                                                                )
                                                                            })}
                                                                        </Col>
        
                                                                    </Row>
                                                                )
                                                            })}
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>                                    
                                            )
                                        })
                                    :   <NoDataFoundDiv>{locale.texts[status.toUpperCase().replace(/ /g, '_')]}</NoDataFoundDiv>
                                }
                            </Row>
                            {status == config.AJAX_STATUS_MAP.LOADING && <Loader backdrop={false} />}
                        </Fragment>
                    )}
                />
            </BOTContainer>
        )
    }
}

export default BrowserContactTree

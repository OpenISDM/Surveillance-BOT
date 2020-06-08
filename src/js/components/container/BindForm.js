/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BindForm.js

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


import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AppContext } from '../../context/AppContext';
import Select from 'react-select';
import FormikFormGroup from '../presentational/FormikFormGroup';
import {
    FormFieldName
} from '../BOTComponent/styleComponent';
import dataSrc from '../../dataSrc';

class BindForm extends React.Component {

    static contextType = AppContext

    state = {
        mac:'',
        showDetail: false,
        objectName:'',
        objectType:'',
        alertText:'',
        bindData:'', 
        importData: [],
    }; 


    componentDidUpdate = (prevProps, prevState) => {    
        if (prevProps.show != this.props.show && this.props.show){
            this.getImportedData()  
        } 
    }

    handleClose = (callback) => {
        this.setState({
            mac:'',
            showDetail : false,
            objectName:'',
            bindData:'',
            objectType:'',
            selectData: {},
        },  this.props.handleClose(callback))
    }

    handleSubmit = (formOption) => {
        this.setState({
            mac:'',
            showDetail : false,
            objectName:'',
            bindData:'',
            objectType:'',
            selectData: {},
        },  this.props.handleSubmit(formOption))
    }
 
    getImportedData = () => {
        let { locale } = this.context
        axios.get(dataSrc.importedObject, {
            params: {
                locale: locale.abbr
            }
        })
        .then(res => {   
            this.setState({
                importData: res.data.rows,
            }) 
        })
        .catch(err => {
            console.log(err);
        })
    
    }
 
    render() {
        const { locale } = this.context 
        const areaOptions = this.props.areaTable.map(area => {
            return {
                value: area.name,
                label: locale.texts[area.name.toUpperCase().replace(/ /g, '_')],
                id: area.id
            };
        })

        const style = {
            input: {
                borderRadius: 0,
                borderBottom: '1 solid grey',
                borderTop: 0,
                borderLeft: 0,
                borderRight: 0,
                
            },
            errorMessage: {
                width: '100%',
                marginTop: '0.25rem',
                marginBottom: '0.25rem',
                fontSize: '80%',
                color: '#dc3545'
            },
        }
        let {
            data,
            objectTable,
            show
        } = this.props
        let lock = 0 

        return (
            <Modal 
                show={show} 
                onHide={this.handleClose} 
                size='md'
                className='text-capitalize'
            >
                <Modal.Header 
                    closeButton 
                >
                    {locale.texts.ASSOCIATION}
                </Modal.Header >
                <Modal.Body
                    className='mb-2'
                >
                    <Formik                    
                        initialValues = {{
                           acn:'',
                           mac:'',
                           area:"",
                        }}
                        validationSchema = {
                            Yup.object().shape({
                                acn: Yup.string() 
                                .required(locale.texts.REQUIRED) 
                                .test(
                                    'acn', 
                                    locale.texts.THE_ID_IS_ALREADY_ASSOCIATED,
                                    value => {  
                                        if (value != undefined){
                                            let findFlag = true 
                                            this.props.objectTable.map(item =>{ 
                                            ( (item.asset_control_number.toUpperCase() == value.toUpperCase()) ) ? findFlag =false : null  
                                            }) 
                                            if (findFlag == false ) {lock = 0 }
                                            else {  lock = 1}
                                            return  findFlag
                                        }
                                    }
                                ) 
                                .test(
                                    'acn', 
                                    locale.texts.ID_IS_NOT_FOUND,
                                    value => {
                                        if (value != undefined){
                                            let findFlag = false 
                                            this.state.importData.map(item =>{
                                            if( item.asset_control_number.toUpperCase() == value.toUpperCase() ){
                                                this.setState({bindData:item})
                                                findFlag = true
                                            } 
                                            })
                                            findFlag == true && lock ?  this.setState({showDetail:true}) :  this.setState({showDetail:false})
                                            return findFlag
                                        }
                                    }
                                ) ,


                                mac: Yup.string()
                                .required(locale.texts.MAC_ADDRESS_IS_REQUIRED)

                                /** check if there are duplicated mac address in object table */
                                .test(
                                    'mac_address',
                                    locale.texts.THE_MAC_ADDRESS_IS_ALREADY_USED_OR_FORMAT_IS_NOT_CORRECT,
                                    value => { 
                                        if (value == undefined) return false 
                                        var pattern = new RegExp("^[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}$");
                                        if(value.match(pattern)) {
                                            return (!objectTable.map(item => item.mac_address).includes(value.match(/.{1,2}/g).join(':')))
                                        } 
                                        return false
                                    }
                                ),

                                area: Yup.string().required(locale.texts.AREA_IS_REQUIRED),

                            })
                        }

                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            let formOption = this.state.bindData
                            formOption = {
                                ...formOption,
                                mac_address: values.mac,
                                area_id: values.area.id || 0
                            }
                            this.handleSubmit(formOption)
                        
                        }}

                        render={({ values, errors, status, touched, isSubmitting, setFieldValue, submitForm }) => (
                            <Form>
                                <FormikFormGroup 
                                    type="text"
                                    name="acn"
                                    error={errors.acn}
                                    touched={touched.acn}                                        
                                    label={locale.texts.ID}   
                                    placeholder={locale.texts.PLEASE_TYPE_PERSONA_ID}
                                /> 

                                {this.state.showDetail &&
                                    <div>        
                                        <FormikFormGroup 
                                            type="text"
                                            name="name"
                                            label={locale.texts.NAME}    
                                            disabled
                                            value={this.state.bindData.name}
                                        />                          
                                        <div className="form-group">
                                            <FormFieldName>
                                                {locale.texts.AREA} 
                                            </FormFieldName>
                                            <Select
                                                placeholder = {locale.texts.SELECT_AREA}
                                                name="area"
                                                value = {values.area}
                                                onChange={value => setFieldValue("area", value)}
                                                options={areaOptions}
                                                style={style.select}
                                                components={{
                                                    IndicatorSeparator: () => null
                                                }}
                                            />
                                            <Row className='no-gutters' className='d-flex align-self-center'>
                                                <Col>
                                                    {touched.area && errors.area &&
                                                    <div style={style.errorMessage}>{errors.area}</div>}
                                                </Col>
                                            </Row>   
                                            <ErrorMessage name="area" component="div" className="invalid-feedback" />
                                        </div>

                                        <FormikFormGroup 
                                            type="text"
                                            name="mac"
                                            error={errors.mac}
                                            touched={touched.mac}
                                            label={locale.texts.MAC_ADDRESS}   
                                            placeholder={locale.texts.PLEASE_ENTER_OR_SCAN_MAC_ADDRESS} 
                                        />    
                                    </div>
                                }
                                <Modal.Footer>
                                    <Button 
                                        variant="outline-secondary" 
                                        onClick={this.handleClose}
                                    >
                                        {locale.texts.CANCEL}
                                    </Button>
                                    <Button 
                                        type="button" 
                                        variant="primary" 
                                        disabled={!this.state.showDetail || isSubmitting}
                                        onClick={submitForm}
                                    >
                                        {locale.texts.SAVE}
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        )}
                    />
                </Modal.Body>
            </Modal>
        );
    }
}
  
export default BindForm;
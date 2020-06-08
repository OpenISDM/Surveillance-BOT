/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        GeneralConfirmForm.js

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
import { 
    Modal, 
    Button,
} from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import dataSrc from '../../dataSrc'
import axios from 'axios';
import LocaleContext from '../../context/LocaleContext';

const style = {
    modal: {
        top: '10%',
    },
}

const GeneralConfirmForm = ({
    show,
    handleClose,
    handleSubmit
}) => {
        
    let locale = React.useContext(LocaleContext)
    return (
        <Modal 
            show={show} 
            size="sm" 
            onHide={handleClose}
            style={style.modal}
            className='text-capitalize'
        >
            <Modal.Body>
                <div className='d-flex justify-content-center'>
                    <div className="subtitle my-1">{locale.texts.PLEASE_ENTER_ID_AND_PASSWORD}</div>
                </div>

                <Formik
                    initialValues = {{
                        username: '',
                        password: '',
                    }}

                    validationSchema = {
                        Yup.object().shape({
                        username: Yup.string().required(locale.texts.USERNAME_IS_REQUIRED),
                        password: Yup.string().required(locale.texts.PASSWORD_IS_REQUIRED)
                    })}
                
                    onSubmit={({ username, password, radioGroup }, { setStatus, setSubmitting }) => { 
                        axios.post(dataSrc.confirmValidation, {
                            username,
                            password,
                            locale
                        })
                        .then(res => { 
                            if (!res.data.confirmation) {  
                                setStatus(res.data.message)
                                setSubmitting(false)
                            } else {    
                                handleSubmit(username)
                            }
                        }).catch(error => {
                            console.log(error)
                        })
                    }}

                    render={({ values, errors, status, touched, isSubmitting }) => (
                        <Form>
                            {status &&
                                <div 
                                    className={'alert alert-danger mb-2 warning'}
                                >
                                    <i className="fas fa-times-circle mr-2"/>
                                    {locale.texts[status.toUpperCase().replace(/ /g, "_")]}
                                </div>
                            }
                            <div className="form-group">
                                <Field 
                                    name="username" 
                                    type="text" 
                                    className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} 
                                    placeholder={locale.texts.USERNAME}
                                />
                                <ErrorMessage name="username" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <Field 
                                    name="password" 
                                    type="password" 
                                    className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} 
                                    placeholder={locale.texts.PASSWORD}
                                />
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                            </div>
                            
                            <Modal.Footer>
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    disabled={isSubmitting}
                                >
                                    {locale.texts.CONFIRM}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                />
            </Modal.Body>
        </Modal>
    )
}

export default GeneralConfirmForm
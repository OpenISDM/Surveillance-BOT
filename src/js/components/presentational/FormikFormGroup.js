/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        FormikFormGroup.js

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
    Field, 
    ErrorMessage 
} from 'formik';
import {
    FormFieldName
} from '../BOTComponent/styleComponent'

const FormikFormGroup = ({
   name = "default",
   className = "default",
   label,
   error,
   touched,
   type = 'text',
   disabled,
   placeholder,
   component,
   display = true,
   value,
   onChange,
   example = null,
   autoComplete = true,
}) => {
    let style = {
        container: {
            display: display ? null : 'none',
        },
        error: {
            color: "#dc3545"
        },
        example: {
            color: 'grey'
        },
    }
    return (
        <div 
            className={`${className}`}
            style={style.container}
        >
            <FormFieldName>
                {label}
            </FormFieldName>
            {component 
                ?   component()
                :   (
                        value ?
                            <Field  
                                name={name} 
                                type={type} 
                                value={value}
                                className={'form-control' + (error && touched ? ' is-invalid' : '')} 
                                placeholder={placeholder}
                                disabled={disabled}
                                style={{
                                    letterSpacing: 1,
                                }}
                                autoComplete={autoComplete}
                            />
                        :
                        <div>
                            <Field  
                                name={name} 
                                type={type} 
                                className={'form-control' + (error && touched ? ' is-invalid' : '')} 
                                placeholder={placeholder}
                                disabled={disabled}
                                style={{
                                    letterSpacing: 1,
                                }}
                                autoComplete={autoComplete}
                            />
                        </div>
                    )
            }
            {error && touched && 
                <small 
                    className="form-text"
                    style={style.error}
                >
                    {error}
                </small>
            }
            {example && !error && !touched &&
                <small 
                    className="form-text"
                    style={style.example}
                >
                    {example}
                </small>
            }
        </div>
    );
};

export default FormikFormGroup;
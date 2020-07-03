/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        EditUserForm.js

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
import { 
    Formik, 
    Field, 
    Form, 
} from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';
import config from '../../../config';
import CheckboxGroup from '../CheckboxGroup';
import Checkbox from '../../presentational/Checkbox';
import FormikFormGroup from '../../presentational/FormikFormGroup';
import styleConfig from '../../../config/styleConfig';
import LocaleContext from '../../../context/LocaleContext';
let style = { 
    error: {
        color: "#dc3545"
    }
}
const EditUserForm = ({
    show,
    title,
    selectedUser,
    handleSubmit,
    handleClose,
    roleName,
    data,
    areaTable
}) => { 
    let locale = React.useContext(LocaleContext)  
    const areaOptions = areaTable.map(area => { 
        return {
            value: area.name,
            // label: locale.texts[area.name.toUpperCase().replace(/ /g, '_')], 
            label:locale.texts[area.name],
            id: area.id
        };
    })  

    return (
        <Modal 
            show={show} 
            size="sm" 
            onHide={handleClose}
        >
            <Modal.Header 
                closeButton 
                className='text-capitalize'
            >
                {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
            </Modal.Header >
           
            <Modal.Body>
                <Formik                    
                    initialValues = {{
                        name: selectedUser ? selectedUser.name : '',
                        password: '',
                        roles: selectedUser ? selectedUser.role_type : config.DEFAULT_ROLE,
                        area: selectedUser ? selectedUser.main_area : '',
                    }}

                    validationSchema = {
                        Yup.object().shape({
                            name: Yup.string()
                                .required(locale.texts.USERNAME_IS_REQUIRED)
                                .test({
                                    name: 'name', 
                                    message: locale.texts.THE_USERNAME_IS_ALREADY_TAKEN,
                                    test: value => {  
                                        if (value == undefined) return false;

                                        if (title == 'edit user' && selectedUser.name.toUpperCase() == value.toUpperCase()) { 
                                            return true;
                                        }  
                                        return !data.map(item => item.name.toUpperCase())
                                            .includes(value.toUpperCase())
                                    },
                                })
                                .test(
                                    'name',
                                    locale.texts.CHARACTER_LIMIT,
                                    value => { 

                                        if (value == undefined) return false 

                                        var pattern = new RegExp("[0-9A-Za-z!#$%&()*+,-./:;<=>?@^_`{|}~]+"); 
                                        return value.match(pattern)
                                    }
                                )
                                .max(
                                    20,
                                   ' ',
                                ),
                            area: selectedUser ? null : Yup.object().required(locale.texts.AREA_IS_REQUIRED),
                            password: selectedUser ? '' : 
                                Yup.string().required(locale.texts.PASSWORD_IS_REQUIRED)
                                .test(
                                    'password',
                                    locale.texts.NOT_ALLOW_PUNCTUATION,
                                    value => {   
                                        let punctuationFlag = true
                                        if (value != undefined){   
                                            value.indexOf("'") != -1 ||  value.indexOf('"') != -1 ? punctuationFlag = false : null   
                                        }
                                        return punctuationFlag
                                    }
                                )
                                .test(
                                    'password',
                                    locale.texts.CHARACTER_LIMIT,
                                    value => { 
                                        if (value == undefined) return false  
                                        var pattern = new RegExp("[0-9A-Za-z!#$%&()*+,-./:;<=>?@^_`{|}~]+"); 
                         
                                        if (value.match(pattern)[0] = "" ){
                                            return false
                                        }else{
                                            return value.match(pattern)[0] == value
                                        }
                                        
                                    }
                                )
                                .max(
                                    20,
                                    ' ',
                                ),
                            roles: Yup.string().required(locale.texts.ROLE_IS_REQUIRED)
                        })
                    }

                    onSubmit={values => {  
                        handleSubmit(values)
                    }}

                    render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                        <Form> 
                            <FormikFormGroup 
                                type="text"
                                name="name"
                                label={locale.texts.NAME} 
                                error={errors.name}
                                touched={touched.name}
                                autoComplete="off"
                            />           
                             
                            {errors.name == ' '  && 
                                <small 
                                    className="form-text text-capitaliz"
                                    style={style.error}
                                >
                                    {locale.texts.LIMIT_IN_TWENTY_CHARACTER}
                                </small>
                            }

                            <FormikFormGroup 
                                type="password"
                                name="password"
                                label={locale.texts.PASSWORD}
                                error={errors.password}
                                touched={touched.password}
                                display={!selectedUser}
                                autoComplete="off"
                            />

                            {errors.password == ' '  && 
                                <small 
                                    className="form-text text-capitaliz"
                                    style={style.error}
                                >
                                    {locale.texts.LIMIT_IN_TWENTY_CHARACTER}
                                </small>
                            }
                            <hr/>
                            <FormikFormGroup 
                                name="roles"
                                label={locale.texts.ROLES}
                                error={errors.roles}
                                touched={touched.roles}
                                component={() => (
                                    <CheckboxGroup
                                        id="roles"
                                        value={values.roles}
                                        onChange={setFieldValue}                                            
                                    >
                                        {roleName
                                            .filter(roleName => roleName.name !== 'guest')
                                            .map((roleName, index) => {
                                                return (
                                                    <Field
                                                        component={Checkbox}
                                                        key={index}
                                                        name="roles"
                                                        id={roleName.name}
                                                        label={locale.texts[roleName.name.toUpperCase()]}
                                                    />
                                                )
                                        })}
                                    </CheckboxGroup>
                                )}
                            />
                            <hr/>  
                            <FormikFormGroup 
                                type="text"
                                name="areaName"
                                label={locale.texts.MAIN_AREA}
                                error={errors.area}
                                touched={touched.area}
                                component={() => (
                                    <Select
                                        placeholder = {locale.texts.SELECT_AREA}
                                        name="area"
                                        value={values.area}
                                        onChange={value => setFieldValue("area", value)}
                                        options={areaOptions}
                                        styles={styleConfig.reactSelect}
                                        components={{
                                            IndicatorSeparator: () => null
                                        }}
                                    />
                                )}
                            />
                            <Modal.Footer>
                                <Button 
                                    variant="outline-secondary" 
                                    onClick={handleClose}
                                >
                                    {locale.texts.CANCEL}
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    disabled={isSubmitting}
                                >
                                    {locale.texts.SAVE}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                />
            </Modal.Body>
        </Modal>
    )
}

export default EditUserForm
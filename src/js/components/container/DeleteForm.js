import React from 'react';
import { 
    Modal, 
    Row, 
    Col,
    Button, 
} from 'react-bootstrap';
import { 
    Formik, 
    Field, 
    Form, 
    ErrorMessage 
} from 'formik';
import RadioButtonGroup from './RadioButtonGroup';
import RadioButton from '../presentational/RadioButton'
import * as Yup from 'yup';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import axios from 'axios';
import dataSrc from '../../dataSrc';
import AuthenticationContext from '../../context/AuthenticationContext';


class AddUserForm extends React.Component {
    state = {
        show: false,
        isSignin: false,
    }
    
    componentDidUpdate = (preProps) => {

        if (preProps != this.props)
        this.setState({
            show: this.props.show,
        })
    }

    handleClose = () => {
        this.props.onClose()
    }


    render() {

        const style = {
            input: {
                padding: 10
            }
        }
        const { title } = this.props

        const { show } = this.state;
        const locale = this.context;
        return (
            <AuthenticationContext.Consumer>
                {auth => (
                    <Modal show={show} size="sm" onHide={this.handleClose}>
                        <Modal.Header closeButton className='font-weight-bold text-capitalize'>
                            {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
                        </Modal.Header >
                        <Modal.Body>
                            <Formik                    
                                initialValues = {{
                                    username: '',
                                    password: '',
                                    radioGroup: config.defaultRole
                                }}

                                validationSchema = {
                                    Yup.object().shape({
                                        username: Yup.string()
                                            .required(locale.texts.USERNAME_IS_REQUIRED)
                                            .test(
                                                'username', 
                                                locale.texts.THE_USERNAME_IS_ALREADY_TAKEN,
                                                value => {
                                                    value = value.toLowerCase()
                                                    return new Promise((resolve, reject) => {
                                                        axios.post(dataSrc.validateUsername, {
                                                            username: value
                                                        })
                                                        .then(res => {
                                                            resolve(res.data.precheck)
                                                        },
                                                    );
                                                });
                                            }
                                        ),
                                        password: Yup.string().required(locale.texts.PASSWORD_IS_REQUIRED)
                                    })
                                }

                                onSubmit={(values, { setStatus, setSubmitting }) => {
                                    auth.signup(values.username, values.password, values.radioGroup)
                                        .then(res => {
                                            this.props.onClose()
                                        })
                                        .catch(err => {
                                            console.log(err)
                                        })
                                }}

                                render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                                    <Form className="text-capitalize">
                                        <div className="form-group">
                                            <label htmlFor="name">{locale.texts.NAME}*</label>
                                            <Field 
                                                name="username" 
                                                type="text" 
                                                style={style.input} 
                                                className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} 
                                                placeholder={locale.texts.USERNAME}
                                            />
                                            <ErrorMessage name="username" component="div" className="invalid-feedback" />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="type">{locale.texts.PASSWORD}*</label>
                                            <Field 
                                                name="password" 
                                                type="password" 
                                                className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} 
                                                placeholder={locale.texts.PASSWORD}
                                            />
                                            <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                        </div>
                                        <hr/>
                                        <Row className="form-group my-3 text-capitalize">
                                            <Col>
                                                {/* <RadioButtonGroup
                                                    id="radioGroup"
                                                    label={locale.texts.ROLES}
                                                    value={values.radioGroup}
                                                    error={errors.radioGroup}
                                                    touched={touched.radioGroup}
                                                >
                                                {this.props.roleName
                                                    .filter(roleName => roleName.name !== 'guest')
                                                    .map((roleName, index) => {
                                                        return (
                                                            <Field
                                                                component={RadioButton}
                                                                key={index}
                                                                name="radioGroup"
                                                                id={roleName.name}
                                                                label={locale.texts[roleName.name.toUpperCase()]}
                                                            />
                                                        )
                                                })}
                                                </RadioButtonGroup> */}
                                                <Row className='no-gutters' className='d-flex align-self-center'>
                                                    <Col>
                                                        {touched.radioGroup && errors.radioGroup &&
                                                        <div style={style.errorMessage}>{errors.radioGroup}</div>}
                                                        {touched.select && errors.select &&
                                                        <div style={style.errorMessage}>{errors.select}</div>}
                                                    </Col>
                                                </Row>                                                
                                            </Col>
                                        </Row>
                                        <Modal.Footer>
                                            <Button variant="outline-secondary" className="text-capitalize" onClick={this.handleClose}>
                                                {locale.texts.CANCEL}
                                            </Button>
                                            <Button type="submit" className="text-capitalize" variant="primary" disabled={isSubmitting}>
                                                {locale.texts.SAVE}
                                            </Button>
                                        </Modal.Footer>
                                    </Form>
                                )}
                            />
                        </Modal.Body>
                    </Modal>
                )}
            </AuthenticationContext.Consumer>
        )
    }
}

AddUserForm.contextType = LocaleContext

export default AddUserForm
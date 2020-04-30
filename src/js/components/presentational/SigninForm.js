import React from 'react';
import { 
    Modal, 
    Image, 
    Button 
} from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import AuthenticationContext from '../../context/AuthenticationContext';

const SiginForm = ({
    show,
    handleClose,
}) => {

    let locale = React.useContext(LocaleContext)
    let auth = React.useContext(AuthenticationContext)

    return (
        <Modal 
            show={show} 
            size="sm" 
            onHide={handleClose}
            className='text-capitalize'
            enforceFocus={false}
        >
            <Modal.Body>
                <div className='d-flex justify-content-center'>
                    <Image src={config.logo} rounded width={50} height={50} ></Image>
                </div>
                <div className='d-flex justify-content-center'>
                    <div className="title my-1">{locale.texts.SIGN_IN}</div>
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

                    onSubmit={(values, actions) => {
                        auth.signin(values, actions, handleClose)
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
                                    {locale.texts.SIGN_IN}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                />
            </Modal.Body>
        </Modal>
    )
}

export default SiginForm
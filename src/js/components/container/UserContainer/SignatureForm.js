import React from 'react';
import { 
    Modal, 
    Button, 
} from 'react-bootstrap';
import { 
    Formik, 
    Form, 
} from 'formik';
import Select from 'react-select';
import * as Yup from 'yup';
import axios from 'axios';
import dataSrc from '../../../dataSrc';
import FormikFormGroup from '../../presentational/FormikFormGroup'
import LocaleContext from '../../../context/LocaleContext';

const SignatureForm = ({
    show,
    title,
    handleClose,
    handleSubmit
}) => {
    let locale = React.useContext(LocaleContext)



    return (
        <Modal 
            show={show} 
            size="sm" 
            onHide={handleClose}
            className='text-capitalize'
        >
            <Modal.Header 
                closeButton 
            >
                {title.toUpperCase().replace(/ /g, '_')}
            </Modal.Header >

            <Modal.Body>
                <Formik                    
                    initialValues = {{
                        name: ''
                    }}

                    validationSchema = {
                        null
                    }

                    onSubmit={(values, { setStatus, setSubmitting }) => {
                        handleSubmit(values)
                    }}

                    render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                      
                        <Form className="text-capitalize">
                            <FormikFormGroup 
                                type="text"
                                name="name"
                                label={locale.texts.NAME}
                                error={errors.name}
                                touched={touched.name}
                                placeholder=""
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

export default SignatureForm
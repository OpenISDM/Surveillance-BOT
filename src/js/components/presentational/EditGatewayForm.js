import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import LocaleContext from '../../context/LocaleContext';
import { Formik, Field, Form } from 'formik';
import FormikFormGroup from './FormikFormGroup';
/**
 * EditGatewayForm will update if user selects one of the object table.
 * The selected object data will transfer from ObjectMangentContainer to EditGatewayForm
 */
  
const EditGatewayForm = ({
    title,
    selectedObjectData,
    show,
    handleClose,
    handleSubmit
}) => {

    let locale = React.useContext(LocaleContext)

    let {
        uuid,
        description,
        comment
    } = selectedObjectData

    return (
        <Modal 
            show={show} 
            onHide={handleClose} 
            size="md"
            className='text-capitalize'
        >
            <Modal.Header 
                closeButton 
            >
                {locale.texts[title.toUpperCase().replace(/ /g, '_')]}
            </Modal.Header >
            <Modal.Body>
                <Formik
                    initialValues = {{
                        description: description || '',
                        uuid: uuid,
                        comment: comment,
                    }}

                    onSubmit={values => {
                        let {
                            comment
                        } = values
                        let settingPackage = {
                            ...selectedObjectData,
                            comment
                        }
                        handleSubmit(settingPackage)
                    }}

                    render={({ values, errors, status, touched, isSubmitting }) => (
                        <Form >
                            <FormikFormGroup 
                                type="text"
                                name="comment"
                                label={locale.texts.COMMENT}
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
                                    {locale.texts.SEND}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                />
            </Modal.Body>
        </Modal>
    );
}
        
export default EditGatewayForm;
import React from 'react';
import { 
    Modal, 
    Button,
} from 'react-bootstrap';
import { 
    Formik, 
    Form
} from 'formik';
import {
    ListGroup 
} from 'react-bootstrap'
import LocaleContext from '../../context/LocaleContext';
import config from '../../config'
import AuthenticationContext from '../../context/AuthenticationContext';

const EditAreasForm = ({
    show,
    handleClose,
    handleSubmit,
    areaTable,
}) => {
        
    let locale = React.useContext(LocaleContext)
    let auth = React.useContext(AuthenticationContext)

    return (
        <Modal 
            show={show} 
            size="md" 
            onHide={handleClose}
            className='text-capitalize'
        >
            <Modal.Header 
                closeButton
            >
                {locale.texts.EDIT_SECONDARY_AREAS}
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues = {{
                        areas_id: auth.user.areas_id
                    }}
                
                    onSubmit={(values, { setStatus, setSubmitting }) => {
                        handleSubmit(values.areas_id)
                    }}

                    render={({ values, errors, status, touched, isSubmitting, setFieldValue}) => (
                        <Form>
                            <div
                                className="subtitle"
                            >   
                                {locale.texts.SELECTED_AREAS}
                            </div>
                            <ListGroup>
                                {
                                    Object.values(areaTable)
                                        .filter(area => {
                                            return (
                                                auth.user.main_area != area.id && 
                                                values.areas_id.includes(area.id)
                                            )
                                        })
                                        .map((area,index) => {
                                            let element = 
                                                <ListGroup.Item
                                                    as="a"
                                                    key = {index}
                                                    action
                                                    name={area.id}
                                                    onClick={(e) => {
                                                        let name = e.target.getAttribute('name')
                                                        let areasId = values.areas_id.filter(area => {
                                                            return area != name
                                                        })
                                                        setFieldValue('areas_id', areasId)
                                                    }}
                                                >
                                                    {locale.texts[area.name]}
                                                </ListGroup.Item>
                                            return element
                                        })
                                }
                            </ListGroup>
                            <div
                                className="subtitle"
                            >   
                                {locale.texts.NOT_SELECTED_AREAS}
                            </div>
                            <ListGroup>
                                {
                                    Object.values(areaTable)
                                        .filter(area => {
                                            return (
                                                auth.user.main_area != area.id && 
                                                !values.areas_id.includes(area.id)
                                            )
                                        })
                                        .map((area,index) => {
                                            let element = 
                                                <ListGroup.Item
                                                    as="a"
                                                    key = {index}
                                                    action
                                                    name={area.id}
                                                    onClick={(e) => {
                                                        let name = e.target.getAttribute('name')
                                                        let areasId = values.areas_id
                                                        areasId.push(parseInt(name))
                                                        setFieldValue('areas_id', areasId)
                                                    }}
                                                >
                                                    {locale.texts[area.name]}
                                                </ListGroup.Item>
                                            return element
                                        })
                                }
                            </ListGroup>
                            
                            <Modal.Footer>
                                <Button 
                                    type="button"
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

export default EditAreasForm
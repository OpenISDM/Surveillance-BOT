/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        DeleteConfirmationForm.js

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
    Button
} from 'react-bootstrap'
import { 
    Formik,
    Form
} from 'formik';
import LocaleContext from '../../context/LocaleContext';

const DeleteConfirmationForm = ({
    handleClose,
    handleSubmit,
    show
}) => {

    const locale = React.useContext(LocaleContext);

    return (
        <Modal  
            show={show} 
            onHide={handleClose} 
            size="md" 
            id='DeleteConfirmationForm' 
            className='text-capitalize'
        >
            <Modal.Header 
                closeButton 
            >
                {locale.texts.WARNING}
            </Modal.Header >
            <Modal.Body>
                <Formik
                    onSubmit={() => {
                        handleSubmit()
                    }}
                    render={({ values, errors, status, touched, isSubmitting, setFieldValue }) => (
                        <Form className="text-capitalize">
                            <div className="mb-5">
                                {locale.texts.ARE_YOU_SURE_TO_DELETE}
                            </div>
                            <Modal.Footer>
                                <Button 
                                    variant="outline-secondary" 
                                    className="text-capitalize" 
                                    onClick={handleClose}
                                >
                                    {locale.texts.CANCEL}
                                </Button>
                                <Button 
                                    type="submit" 
                                    className="text-capitalize" 
                                    variant="primary" 
                                    disabled={isSubmitting}
                                >
                                    {locale.texts.YES}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                />
            </Modal.Body>
        </Modal>
    );
}
  
export default DeleteConfirmationForm;

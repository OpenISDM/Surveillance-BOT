import React from 'react';
import { 
    Modal, 
    Button 
} from 'react-bootstrap'
import { 
    Formik, 
    Form 
} from 'formik';
import dataSrc from '../../dataSrc'
import LocaleContext from '../../context/LocaleContext';

const style = {
    modal: {
        top: '10%',
        zIndex: 6000,
        padding: 0,
    },
    deviceList: {
        maxHeight: '20rem',
        overflow: 'hidden scroll' 
    },
}
  
const DownloadPdfRequestForm = ({
    handleClose,
    pdfPath,
    show
}) => {
    
    let locale = React.useContext(LocaleContext)

    const handleClickButton = e => {
        
        let { name } = e.target
        switch(name) {
            case "view":
                window.open(dataSrc.pdfUrl(pdfPath));
                break;
            case "download":
                var link = document.createElement('a');
                link.href = dataSrc.pdfUrl(pdfPath);
                link.download = "";
                link.click();
                break;
            case "close":
                handleClose()
                break;
        }
    }


    return (
        <Modal 
            id='downloadPdfRequest' 
            show={show} 
            onHide={handleClose} 
            size="md"
            style={style.modal}
            className='text-capitalize'
        >
            <Modal.Header 
                closeButton 
            >
                {locale.texts.PROCESS_IS_COMPLETED}
            </Modal.Header>
            <Modal.Body className="py-2">
                <Formik    
                    render={() => (
                        <Form>
                            <div className="mb-5">
                                {locale.texts.NOW_YOU_CAN_DO_THE_FOllOWING_ACTION}
                            </div>
                            <Modal.Footer>
                                <Button 
                                    variant="outline-secondary" 
                                    className="text-capitalize"
                                    onClick={handleClickButton}
                                    name="close"
                                >
                                    {locale.texts.CLOSE}
                                </Button>
                                <Button 
                                    variant="primary" 
                                    className="text-capitalize"
                                    onClick={handleClickButton}
                                    name="view"
                                    className="mx-3"
                                >
                                    {locale.texts.VIEW}
                                </Button>
                                <Button 
                                    variant="primary" 
                                    className="text-capitalize"
                                    onClick={handleClickButton}
                                    name="download"
                                >
                                    {locale.texts.DOWNLOAD}
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                />
            </Modal.Body>
        </Modal>
    );
}
  
export default DownloadPdfRequestForm;
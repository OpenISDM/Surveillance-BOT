import React from 'react';
import { 
    Modal, 
    Button,
} from 'react-bootstrap';
import axios from 'axios';
import dataSrc from '../../dataSrc'
import moment from 'moment'
import config from '../../config';
import { AppContext } from '../../context/AppContext'
import GeneralConfirmForm from '../presentational/GeneralConfirmForm'
import retrieveDataHelper from '../../service/retrieveDataHelper'
import DownloadPdfRequestForm from './DownloadPdfRequestForm'
import Select from 'react-select';
import messageGenerator from '../../service/messageGenerator'
import { Formik, Field, Form } from 'formik';
import {
    getDescription
} from '../../service/descriptionGenerator'

const style = {
    modalBody: {
        height: '60vh',
        overflow: 'hidden scroll'
    },
    row: {
        wordBreak: 'break-all'
    },
    item: {
        minWidth: 30,
    },
    select: {
        control: (provided) => ({
            ...provided,
            width: 200,
        }),
    }
}

class ShiftChange extends React.Component {

    static contextType = AppContext
    
    state = {
        searchResult: {
            foundResult: [],
            notFoundResult: [],
        },
        patients: {
            foundPatients: [],
            notFoundPatients: []
        },
        fileUrl: '',
        showPdfDownloadForm: false,
        showConfirmForm: false,
        showDownloadPdfRequest: false,
    }

    componentDidUpdate = (prevProps) => {
        if (this.props.show && !prevProps.show) {
            this.getTrackingData()
        }
    }

    getTrackingData = () => {
        let { 
            locale, 
            auth, 
            stateReducer 
        } = this.context
        let [{areaId}] = stateReducer
        retrieveDataHelper.getTrackingData(
            locale.abbr, 
            auth.user, 
            areaId
        )
        .then(res => {
            let {
                myDevice
            } = auth.user

            let foundResult = []
            let notFoundResult = []
            let foundPatients= []
            let notFoundPatients= []

            res.data
                .filter(item => myDevice.includes(item.asset_control_number))
                .map(item => {
                    
                    switch(item.object_type) {
                        case '0':
                            if (item.found) foundResult.push(item)
                            else notFoundResult.push(item)
                            break;
                        case '1':
                        case '2':
                            if (item.found) foundPatients.push(item)
                            else notFoundPatients.push(item)
                            break
                    }
            })
            this.setState({
                searchResult: {
                    foundResult,
                    notFoundResult,
                },
                patients: {
                    foundPatients,
                    notFoundPatients
                }
            })
        })
        .catch(err => {
            console.log(`get tracking data failed ${err}`)
        })
    }

    confirmShift = (values) => {
        this.setState({
            showConfirmForm: true,
            shift: values.shift
        })
    }

    handleConfirmFormSubmit = (authentication) => { 

        let { 
            locale, 
            auth 
        } = this.context   

        let shiftChangeObjectPackage = {
            searchResult: this.state.searchResult, 
            patients: this.state.patients
        }
  
        let pdfPackage = config.getPdfPackage(
            'shiftChange', 
            auth.user, 
            shiftChangeObjectPackage, 
            locale,
            authentication,
            this.state.shift
        )  

        this.state.patients.foundPatients.reduce((pkg, object) => {   

            let temp = config.getPdfPackage(
                'patientRecord', 
                auth.user, 
                object, 
                locale,
                authentication,
            )
            
            if (pkg.pdf) {
                pkg.pdf += `
                    <div style="page-break-before:always"></div>
                `
                pkg.pdf += temp.pdf
            } else {
                pkg = temp
            }
            return pkg
        }, pdfPackage)

        axios.post(dataSrc.addShiftChangeRecord, {
            userInfo: auth.user,
            pdfPackage,
            shift: this.state.shift,
        }).then(res => {
            let callback = () => {
                this.props.handleClose(() => {
                    messageGenerator.setSuccessMessage(
                        'save shift change success'
                    )
                })
            }

            this.setState({
                fileUrl: pdfPackage.path,
                showConfirmForm: false,
                showDownloadPdfRequest: true
            }, callback)
        }).catch(err => {
            console.log(`add shift change record failed ${err}`)
        })
    }

    handleClose = () => {
        this.setState({
            showConfirmForm: false,
            showDownloadPdfRequest: false
        })
    }

    render() {   
        const { 
            locale, 
            auth,
        } = this.context

        const { 
            show,
            handleClose
        } = this.props

        const { 
            foundResult, 
            notFoundResult 
        } = this.state.searchResult

        const {
            foundPatients,
            notFoundPatients
        } = this.state.patients

        const nowTime = moment().locale(locale.abbr)
        const hasFoundResult = foundResult.length !== 0;
        const hasNotFoundResult = notFoundResult.length !== 0;
        const hasFoundPatients = foundPatients.length !== 0;
        const hasNotFoundPatients = notFoundPatients.length !== 0;
        
        const shiftOptions = Object.values(config.shiftOption).map(shift => { 
            return { 
                value: shift,
                label: locale.texts[shift.toUpperCase().replace(/ /g, '_')]
            };
        }) 

        const defaultShiftOption = {
            value: config.getShift(),
            label: locale.texts[config.getShift().toUpperCase().replace(/ /g, '_')]
        }

        return ( 
            <div>
                <Modal 
                    show={show} 
                    size="lg" 
                    onHide={handleClose}
                    className='text-capitalize'
                >
                    <Formik            
                        initialValues = {{
                            shift: defaultShiftOption
                        }}

                        onSubmit={(values, { setStatus, setSubmitting }) => {
                            this.confirmShift(values)
                        }}

                        render={({ values, errors, status, touched, isSubmitting, setFieldValue, submitForm }) => (
                            <div>
                                <Modal.Header
                                    className='d-flex flex-column'
                                >
                                    <div className="title">
                                        {locale.texts.SHIFT_CHANGE_RECORD}
                                    </div>                                
                                    <div>
                                        {locale.texts.DATE_TIME}: {nowTime.format(config.regularTimeFormat)}
                                    </div> 
                                    <div 
                                    >
                                        {locale.texts.DEVICE_LOCATION_STATUS_CHECKED_BY}: {auth.user.name} 
                                    </div>
                                    <div 
                                        className="d-flex align-items-center"
                                    >   
                                        {locale.texts.SHIFT }: 
                                        &nbsp;
                                        <Select 
                                            name="shift"
                                            options={shiftOptions} 
                                            value={values.shift}
                                            onChange={(value) => setFieldValue('shift', value)}  
                                            styles={style.select}
                                        />  
                                    </div>
                                </Modal.Header>
                                <Modal.Body       
                                    style ={style.modalBody}
                                    id="shiftChange"
                                >
                                    <Form className="text-capitalize">
                                        {!hasFoundResult && !hasNotFoundResult && 
                                            <div className="d-flex justify-content-center">
                                                <p className="font-italic ">{locale.texts.NOT_ASSIGNED_TO_ANY_DEVICES}</p>
                                            </div>
                                        }    
                                        <TypeBlock
                                            title={locale.texts.DEVICES_FOUND}
                                            hasType={hasFoundResult} 
                                            typeArray={foundResult}
                                        /> 
                                        <TypeBlock
                                            title={locale.texts.DEVICES_NOT_FOUND}
                                            hasType={hasNotFoundResult} 
                                            typeArray={notFoundResult}
                                        /> 
                                        <TypeBlock
                                            title={locale.texts.PATIENTS_FOUND}
                                            hasType={hasFoundPatients} 
                                            typeArray={foundPatients}
                                        /> 
                                        <TypeBlock
                                            title={locale.texts.PATIENTS_NOT_FOUND}
                                            hasType={hasNotFoundPatients} 
                                            typeArray={notFoundPatients}
                                        /> 
                                    </Form> 
                                    </Modal.Body>
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
                                            onClick={submitForm}
                                            disabled={!hasFoundResult && !hasNotFoundResult}
                                        >
                                            {locale.texts.CONFIRM}
                                        </Button>
                                    </Modal.Footer>   
                                </div>
                        )}
                    />
                </Modal>     
                <GeneralConfirmForm
                    show={this.state.showConfirmForm}
                    handleSubmit={this.handleConfirmFormSubmit}
                    handleClose={this.handleClose}
                />
                <DownloadPdfRequestForm
                    show={this.state.showDownloadPdfRequest} 
                    pdfPath={this.state.fileUrl}
                    handleClose={this.handleClose}
                /> 
            </div>
        )
    }
}

export default ShiftChange

const TypeBlock = ({
    title,
    hasType,
    typeArray,
}) => {
    let appContext = React.useContext(AppContext)

    let {
        locale,
        auth,
        stateReducer
    } = appContext

    return (
        <div>
            {hasType && 
                <div
                    className="subtitle"
                >
                    {title} 
                </div>
            }     
            {hasType && typeArray.map((item, index) => { 
                return (
                    <div 
                        className='d-flex justify-content-start'
                        key={index}
                    >
                        <div 
                            style={style.item}
                            className='d-flex justify-content-center'
                        >
                            {index + 1}.
                        </div>
                        <div 
                            key={index} 
                            className="pb-1"
                            style={style.row}
                        >     
                            {getDescription(item, locale, config)}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

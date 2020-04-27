import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form'
import FormControl from 'react-bootstrap/FormControl'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormCheck from 'react-bootstrap/FormCheck';
import VerticalTable from '../presentational/VerticalTable';
import Select from 'react-select';
import config from '../../config';
import LocaleContext from '../../context/LocaleContext';
import axios from 'axios';
import dataSrc from '../../dataSrc';

const transferredLocations = config.transferredLocation;

const options = transferredLocations.map( location => {
    let locationObj = {};
    locationObj["value"] = location;
    locationObj["label"] = location;
    return locationObj
})
  
class ModalForm extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            show: this.props.show,
            isShowForm: false,
            formOption: {
                checkedStatus: 'Normal', 
                selectedOption: null,
            }
        };


        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheck = this.handleCheck.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }
  
    handleClose() {
        this.setState({ 
            show: false 
        });
    }
  
    handleShow() {
        this.setState({ 
            show: true 
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps != this.props) {
            this.setState({
                show: this.props.show,
                isShowForm: true,
            })
        }
    }

    handleSubmit(e) {
        console.log(this.state.formOption)
        const button = e.target
        axios.post(dataSrc.editObject, {
            formOption: this.state.formOption
        }).then(res => {
            button.style.opacity = 0.4
            setTimeout(
                function() {
                   this.setState ({
                       show: false,
                   }) 
                }
                .bind(this),
                1000
            )
        }).catch( error => {
            console.log(error)
        })

    
    }

    handleCheck(e) {
        this.setState({
            formOption: {
                ...this.state.formOption,
                checkedStatus: e.target.value,
            }
        })
    }

    handleSelect(selectedOption) {
        this.setState({
            formOption: {
                ...this.state.formOption,
                selectedOption: selectedOption,
            }
        })
    }

  
    render() {

        const { title, selectedObjectData } = this.props;
        const { checkedStatus, selectedOption } = this.state.formOption;


        const style = {
            button: {
                
            }
        }

        return (
            <>
                <Modal show={this.state.show} onHide={this.handleClose} size="lg">
                    <Modal.Header closeButton>{title}</Modal.Header >
                    <Modal.Body>
                        <Form >
                            <Row>
                                <Col sm={3} className="font-weight-bold">
                                    Device Name
                                </Col>
                                <Col sm={9}>
                                    {selectedObjectData ? selectedObjectData.name : null}
                                </Col>

                            </Row>
                            <Row>
                                <Col sm={3} className="font-weight-bold">
                                    Device Type
                                </Col>
                                <Col sm={9}>
                                    {selectedObjectData ? selectedObjectData.type : null}
                                </Col>

                            </Row>
                            <Row>
                                <Col sm={3} className="font-weight-bold">
                                    ACN
                                </Col>
                                <Col sm={9}>
                                    {selectedObjectData ? selectedObjectData.id : null}
                                </Col>

                            </Row>
                            {/* <Form.Group as={Row} >
                                <Form.Label column sm={4}>
                                    Device Name
                                </Form.Label>
                                <Col sm={8} >
                                    <Form.Control type="text" placeholder={selectedObjectData ? selectedObjectData.name : null} disabled/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm={3} >
                                    Device Type
                                </Form.Label>
                                <Col sm={9} >
                                    <Form.Control type="input" placeholder={selectedObjectData ? selectedObjectData.type : null} disabled/>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm={5}>
                                    ACN
                                </Form.Label>
                                <Col sm={7} >
                                    <Form.Control type="text" placeholder={selectedObjectData ? selectedObjectData.id : null} disabled/>
                                </Col>
                            </Form.Group> */}
                            <hr></hr>
                            <fieldset>
                                <Form.Group as={Row}>
                                    <Form.Label as="legend" column sm={3}>
                                        Status
                                    </Form.Label>
                                    <Col sm={9}>
                                        <Form.Check
                                            custom
                                            type="radio"
                                            label="Normal"
                                            name="formHorizontalRadios"
                                            id="formHorizontalRadios1"
                                            value="Normal"
                                            checked={checkedStatus === 'Normal'}
                                            onChange={this.handleCheck}                                     
                                        />
                                        <Form.Check
                                            custom
                                            type="radio"
                                            label="Broken"
                                            name="formHorizontalRadios"
                                            id="formHorizontalRadios2"
                                            value="Broken"
                                            checked={checkedStatus === 'Broken'}

                                            onChange={this.handleCheck}   
                                        />
                                        <Form.Row>
                                            <Form.Group as={Col} sm={4}>
                                                <Form.Check
                                                    custom
                                                    type="radio"
                                                    label="Transferred"
                                                    name="formHorizontalRadios"
                                                    id="formHorizontalRadios3"
                                                    value="Transferred"
                                                    checked={checkedStatus === 'Transferred'}

                                                    onChange={this.handleCheck}   
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} sm={8} >
                                                {/* <Form.Control as="select" disabled = {checkedStatus === "Transferred" ? false : true } onChange={this.handleCheck} >
                                                    <option>Choose...</option>
                                                    <option>...</option>
                                                </Form.Control> */}
                                                    <Select
                                                        placeholder = "Select Location"
                                                        value = {selectedOption}
                                                        onChange={this.handleSelect}
                                                        options={options}
                                                        isDisabled = {checkedStatus === 'Transferred' ? false : true}
                                                    />
                                            </Form.Group>
                                            
                                        </Form.Row>
                                    </Col>
                                </Form.Group>
                             </fieldset>
                        </Form>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.handleSubmit}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }
}

Modal.contextType = LocaleContext;
  
export default ModalForm;
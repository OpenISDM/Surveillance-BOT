import React from 'react';
import searchIcon from '../../../img/icon/search.png';
import { Form, Button } from 'react-bootstrap';
import {
    isMobileOnly
} from 'react-device-detect'

class Searchbar extends React.Component {
    
    state = {
        value: '',
    }

    componentDidUpdate = (prepProps) => {
        if (prepProps.clearSearchResult !== this.props.clearSearchResult && !prepProps.clearSearchResult) {
            this.setState({
                value: '',
            })
        }
    }

    handleSubmit = (e) => { 
        e.preventDefault();
        this.props.getSearchKey(this.state.value);
        if (isMobileOnly) this.props.handleShowResultListForMobile();
    }

    handleChange = (e) => {
        this.setState({
            value: e.target.value
        })
    }

    render() {

        const style = {
            form: {
                border: "2px solid rgba(227, 222, 222, 0.447)",
                borderRadius : '25px',
                fontSize: '0.8rem',
                width:300,
                minHeight: '1.2rem',
                position: 'relative'
            },
            input: {
                background: 'rgba(0,0,0,0)',
                fontSize: '1rem',
            }
        }

        const { value } = this.state;
        return (            
            <Form className="d-flex justify-content-around" style={style.form}>
                <Form.Group 
                    className='flex-grow-1 mb-0'
                    style={{maxWidth: 250}}
                >
                    <Form.Control 
                        id='searchbarText' 
                        type='text' 
                        style={style.input} 
                        className='border-0 pl-3 w-90 pb-0' 
                        value={value} 
                        onChange={this.handleChange}
                    />
                </Form.Group>
                <Button 
                    type="submit" 
                    variant='link' 
                    className="btn btn-link btn-sm bd-highlight" 
                    onClick={this.handleSubmit}
                    style={{left: '100px'}}
                >
                    <img src={searchIcon} width="23px" />
                </Button>
            </Form>
        );
    }
}

export default Searchbar;
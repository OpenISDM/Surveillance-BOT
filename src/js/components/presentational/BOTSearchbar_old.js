/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BOTSearchbar_old.js

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
import { Form, Button } from 'react-bootstrap'; 

class BOTSearchbar extends React.Component {
    
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
    }

    handleChange = (e) => {
        this.setState({
            value: e.target.value
        })
    }

    render() {
        
        const style = {
            form: {
                border: '2px solid rgba(227, 222, 222, 0.447)',
                borderRadius : '25px',
                fontSize: '0.8rem',
                width: this.props.width,
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
            

            <Form 
                style={style.form}
                className='d-flex justify-content-around'
            > 
                <Form.Group 
                    className='d-flex justify-content-center align-items-center mb-0 mx-1'
                    style={{
                        minWidth: parseInt(this.props.width) * 0.9
                    }}
                >
                    <i 
                        className='fas fa-search'
                        style={{
                            color: 'black',
                            fontSize: '1.2rem',
                            marginLeft: 10,
                        }}
                    />
                       
                    <Form.Control 
                        id='BOTSearchbarText' 
                        type='text' 
                        style={style.input} 
                        className='border-0 w-100' 
                        value={value} 
                        onChange={this.handleChange}
                        autoComplete="off"
                        autoFocus={false}
                    />
         
           
                </Form.Group>
                <Button 
                    type='submit' 
                    variant='link' 
                    className='btn btn-link btn-sm bd-highlight'
                    style={{
                        width: 0,
                    }} 
                    onClick={this.handleSubmit}
                ></Button> 
            </Form> 
        );
    }
}



export default BOTSearchbar;
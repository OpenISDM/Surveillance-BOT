/*
    Copyright (c) 2020 Academia Sinica, Institute of Information Science

    License:
        GPL 3.0 : The content of this file is subject to the terms and conditions

    Project Name:
        BiDae Object Tracker (BOT)

    File Name:
        BOTSearchbar.js

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
import Autosuggest from 'react-autosuggest'; 
import themeCSS from '../../../../src/css/SearchBar.css'
import retrieveDataHelper from '../../../js/helper/retrieveDataHelper'

let suggestData = []; 
let load_suggest = false;
  // Teach Autosuggest how to calculate suggestions for any given input value.
  const getSuggestions = value => { 
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;    

    // return inputLength === 0 ? [] : suggestData.filter(lang =>
    //   lang.toLowerCase().slice(0, inputLength) === inputValue
    // );
 
    // limit count by 5
    let suggestTemp = [] 
    suggestTemp = suggestData.filter(lang =>lang.toLowerCase().slice(0, inputLength) === inputValue) 
    let suggestLimit =[]
    suggestTemp.map((item,index)=>{
      index < 5 ? suggestLimit.push(item) : null
    })

   return inputLength === 0 ? [] :  suggestLimit

  };
  const getSuggestionValue = suggestion => suggestion ;
 
  // Use your imagination to render suggestions.
  const renderSuggestion = suggestion => ( 
    <div> 
      {suggestion  || null}
    </div>
  ); 

  const renderInputComponent = inputProps => (
    <div className="inputContainer">
       <i  className='fas fa-search icon'  /> 
      <input {...inputProps} />
    </div>
  );

  

class BOTSearchbar extends React.Component {
    
    state = {
        value: '',
        suggestions :[], 

    }   

    componentDidUpdate = (prepProps) => {
        if (prepProps.clearSearchResult !== this.props.clearSearchResult && !prepProps.clearSearchResult) {
          this.setState({
                value: '',
            }) 
        }  
        if(!load_suggest){ 
          suggestData  = this.props.suggestData
          load_suggest = true 
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




    onChange = (event, { newValue }) => {
        this.setState({
          value: newValue
        });
      };
    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
          suggestions: getSuggestions(value)
        });
      };
     
      // Autosuggest will call this function every time you need to clear suggestions.
      onSuggestionsClearRequested = () => {
        this.setState({
          suggestions: []
        });
      };

      
    render() {
 
      // console.log(suggestArray) 
      // console.log(this.props.suggestData) 
      // console.log(suggestData)

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
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: '',
            value,
            onChange: this.onChange
          };
 

        return (          
 

            <Form   
                className='d-flex justify-content-around'
            > 
                <Form.Group 
                    className='d-flex justify-content-center   mb-0 mx-1'
                    style={{
                        minWidth: parseInt(this.props.width) * 0.9
                    }}
                >
                
                        
                    
                <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
                renderInputComponent={renderInputComponent} 
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
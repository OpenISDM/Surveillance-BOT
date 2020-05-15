import React from 'react';
import { 
    Button, 
    ButtonToolbar
} from 'react-bootstrap';
import { AppContext } from '../../../context/AppContext';
import axios from 'axios';
import EditAreasForm from '../../presentational/EditAreasForm';
import retrieveDataHelper from '../../../helper/retrieveDataHelper';
import EditPwdForm from '../../presentational/EditPwdForm';
import messageGenerator from '../../../helper/messageGenerator';
import dataSrc from '../../../dataSrc';
import {
    ListTitle
} from '../../BOTComponent/styleComponent';
 

class UserProfile extends React.Component{

    static contextType = AppContext

    state= {
        show: false,
        showEditPwd: false,
        areaTable: []
    }
    
    componentDidMount = () => {
        this.getAreaTable()
    }

    /** get area table from database */
    getAreaTable = () => {

        retrieveDataHelper.getAreaTable()
            .then(res => {
                let areaTable = res.data.rows.reduce((table, area) => {
                    table[area.id] = area
                    return table
                }, {})
                this.setState({
                    areaTable,
                })
            })
            .catch(err => {
                console.log(`get area table failed ${err}`)
            })
    }

    handleClick = (e) => {
        let name = e.target.name
        switch(name) {
            case 'secondaryArea':
                this.setState({
                    show: true
                })
                break;
            case 'password':
                this.setState({ 
                    showEditPwd: true
                })
                break;
        }   
    }

    handleClose = () => {
        this.setState({
            show: false,
            showEditPwd:false
        })
    }

    handleSubmit = (values) => {
        let formIndex = [this.state.show, this.state.showEditPwd].indexOf(true);

        let callback = () => messageGenerator.setSuccessMessage(
            'save success'
        ) 
        var { auth } = this.context
        switch(formIndex) {

            case 0:

                auth.setArea(values.areas_id)
                this.setState({
                    show: false,
                    showEditPwd:false
                }, callback)
                break;

            case 1:

                axios.post(dataSrc.userInfo.password, {
                    user_id: auth.user.id,
                    password : values.check_password
                })
                .then(res => {
                    this.setState({
                        show: false,
                        showEditPwd:false
                    }, callback)
                    
                })
                .catch(err => {
                    console.log(err)
                }) 
                break;
        }

    }

    render(){
        const { 
            locale,
            auth 
        } = this.context

        const {
            areaTable
        } = this.state

        return(
            <div
                className='d-flex flex-column'
            >
                <ButtonToolbar
                    className='mb-2'
                >
                    <Button 
                        variant='outline-primary' 
                        className='text-capitalize mr-2'
                        name='secondaryArea'
                        size='sm'
                        onClick={this.handleClick}
                    >
                        {locale.texts.EDIT_SECONDARY_AREA}
                    </Button>
                    <Button 
                        variant='outline-primary' 
                        className='text-capitalize mr-2'
                        name='password'
                        size='sm'
                        onClick={this.handleClick}
                    >
                        {locale.texts.EDIT_PASSWORD}
                    </Button> 
                </ButtonToolbar>
                <div>
                    <ListTitle>
                        {locale.texts.ABOUT_YOU}
                    </ListTitle>
                    <p>
                        {locale.texts.NAME}: {auth.user.name}
                    </p>
                </div>
                <hr/>
                <div>
                    <ListTitle>
                        {locale.texts.YOUR_SERVICE_AREAS}
                    </ListTitle>
                    <p>
                        {locale.texts.MAIN_AREA}: {areaTable.length != 0 
                            && auth.user.main_area
                            && locale.texts[areaTable[auth.user.main_area].name]
                        }
                    </p>
                    <p>
                        {locale.texts.SECONDARY_AREAS}: {
                            Object.values(this.state.areaTable)
                                .filter(area => {
                                    return auth.user.main_area != area.id && auth.user.areas_id.includes(area.id)
                                })
                                .map(area => {
                                    return locale.texts[area.name]
                                })
                                .join('/')
                        }
                    </p>
                </div>
                <hr/>
                <EditAreasForm 
                    show={this.state.show} 
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmit}
                    areaTable={this.state.areaTable}
                />
                <EditPwdForm
                    show={this.state.showEditPwd} 
                    handleClose={this.handleClose}
                    handleSubmit={this.handleSubmit}
                />
            </div>
        )
    }
}

export default UserProfile;
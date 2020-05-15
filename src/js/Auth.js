import React from 'react';
import AuthenticationContext from './context/AuthenticationContext';
import Cookies from 'js-cookie';
import axios from 'axios';
import dataSrc from './dataSrc';
import config from './config';
import permissionsTable from './config/roles';


class Auth extends React.Component {

    state = {
        authenticated: Cookies.get('authenticated') ? true : false,
        user: Cookies.get('user') ? {...JSON.parse(Cookies.get('user'))} : config.DEFAULT_USER,
        accessToken: ""
    }

    signin = (userInfo, actions, callback) => {
        let {
            username,
            password
        } = userInfo;

        axios.post(dataSrc.auth.signin, {
            username,
            password,
        })
        .then(res => {
            if (!res.data.authentication) { 
                actions.setStatus(res.data.message)
                actions.setSubmitting(false)
            } else {
                let {
                    userInfo
                } = res.data

                if (userInfo.roles.includes("dev")) {
                    userInfo.permissions = 
                        Object.keys(permissionsTable).reduce((permissions, role) => {
                            permissionsTable[role].permission.map(item => {
                                if (!permissions.includes(item)) {
                                    permissions.push(item)
                                }
                            })
                            return permissions
                        }, [])
                } else {
                    userInfo.permissions = 
                        userInfo.roles.reduce((permissions, role) => {
                            permissionsTable[role].permission.map(item => {
                                if (!permissions.includes(item)) {
                                    permissions.push(item)
                                }
                            })
                            return permissions
                        }, [])
                }
                Cookies.set('authenticated', true)
                Cookies.set('user', userInfo)
                // locale.reSetState(userInfo.locale)
                this.setState({
                    authenticated: true,
                    user: userInfo
                }, callback())
            }
        }).catch(error => {
            console.log(error)
        })
    };
  
    signout = () => {
        axios.post(dataSrc.auth.signout, {
            
        })
        .then(res => {
            Cookies.remove('authenticated')
            Cookies.remove('user')
            this.setState({
                authenticated: false,
                user: config.DEFAULT_USER,
                accessToken: ""
            });
        })
        .catch(err => {
            console.log(`signout failed ${err}`)
        })
    }; 

    signup = (values, callback) => {
        let { 
            name, 
            password, 
            roles, 
            area, 
        } = values
        axios.post(dataSrc.user, {
            name: name.toLowerCase(),
            password,
            roles,
            area_id: area.id,
            ...values
        })
        .then(res => {
            callback()
        })
    }

    setUser = (user, callback) => {
        axios.put(dataSrc.user, {
            user
        })
        .then(res => {
            callback()
        })
        .catch(err => {
            console.log(`set user info failed ${err}`)
        })
    }

    setArea = (areas_id, callback) => {
        let user = {
            ...this.state.user,
            areas_id
        }
        axios.post(dataSrc.userInfo.area.secondary, {
            user
        })
        .then(res => {
            this.setCookies('user', user)
            this.setState({
                ...this.state,
                user, 
            }, callback)
        })
        .catch(err => {
            console.log(`set secondary area failed ${err}`)
        })
    }
  
    handleAuthentication = () => {
    };
  
    setSession(authResult) {
    }

    setCookies(key, value) {
        Cookies.set(key, value)
    }

    setSearchHistory = (searchHistory) => {
        let userInfo = {
            ...this.state.user,
            searchHistory,
        }
        this.setCookies('user', userInfo)
        this.setState({
            ...this.state,
            user: {
                ...this.state.user,
                searchHistory,
            }
        })
    } 

    setMyDevice = (myDevice) => {
        this.setState({
            ...this.state,
            user: {
                ...this.state.user,
                myDevice
            }
        })
    }

    setUserInfo = (status, value) =>{
        this.setState({
            ...this.state,
            user: {
                ...this.state.user,
                [status]: value,
            }
        })
        this.setCookies('user', {
                ...this.state.user,
                [status]: value,
            })
    }

    render() {
        const authProviderValue = {
            ...this.state,
            signin: this.signin,
            signup: this.signup,
            signout: this.signout,
            handleAuthentication: this.handleAuthentication,
            setSearchHistory: this.setSearchHistory,
            setMyDevice: this.setMyDevice,
            setUserInfo: this.setUserInfo,
            setCookies: this.setCookies,
            setUser: this.setUser,
            setArea: this.setArea
        };

        return (
            <AuthenticationContext.Provider value={authProviderValue}>
                {this.props.children}
            </AuthenticationContext.Provider>
        );
      }
}

export default Auth;
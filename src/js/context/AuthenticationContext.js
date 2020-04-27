import React from 'react';

const AuthenticationContext = React.createContext({

    /** to check if authenticated or not */
    authenticated: false, 

    /** store all the user details */
    user: {}, 

    /** accessToken of user for Auth0 */
    accessToken: "", 

    /** to start the signin process */
    signin: () => {},

    /** to start the signup process */
    signout: () => {},

    /** signout the user */
    signout: () => {}, // logout the user

    /** handle Auth0 login process */
    handleAuthentication: () => {}, 

    /** set the user's search history */
    setSearchHistory: () => {}

});

export default AuthenticationContext;
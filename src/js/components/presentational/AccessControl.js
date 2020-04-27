import React from 'react';
import AuthContext from '../../context/AuthenticationContext'
import {
    isBrowser,
    isMobile,
    isTablet
} from 'react-device-detect'

const AccessControl = ({
    permission,
    children,
    renderNoAccess,
    platform = [true]
}) => {
    const auth = React.useContext(AuthContext);

    let ownedPermissions = auth.user.permissions
    const permitted = permission ? ownedPermissions.includes(permission) : true

    const platformSupported = platform.map(item => {
        switch(item) {
            case 'browser': 
                return isBrowser
            case 'mobile': 
                return isMobile
            case 'tablet':
                return isTablet
            default: 
                return true
        }
    }).includes(true)

    if (permitted && platformSupported) {
        return children;
    }
    return renderNoAccess();
};

export default AccessControl
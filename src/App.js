import React from 'react';
import { BrowserRouter as Router,Switch, Route,  } from "react-router-dom";
import NavbarContainer from './js/components/container/NavbarContainer'
import { renderRoutes } from 'react-router-config';
import routes from './js/config/routes';
import CombinedContext from './js/context/AppContext'
import { ToastContainer } from 'react-toastify';
import config from './js/config'

const App = () => {
    return (
        <CombinedContext>
            <Router>          
                <NavbarContainer/>
                <Switch>
                    {renderRoutes(routes)}
                </Switch>
            </Router>
            <ToastContainer {...config.toastProps} />
        </CombinedContext>
    );
};

export default App;




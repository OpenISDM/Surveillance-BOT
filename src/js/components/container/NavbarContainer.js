import React from 'react';
import { 
    BrowserRouter as Router, 
    Link, 
} from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { 
    Navbar, 
    Nav, 
    Image, 
    Dropdown  
} from 'react-bootstrap';
import SiginForm from '../presentational/SigninForm';
import config from '../../config';
import AccessControl from '../presentational/AccessControl';
import { AppContext } from '../../context/AppContext';
import BatteryLevelNotification from './BatteryLevelNotification';
import { navbarNavList } from '../../config/pageModules';

class NavbarContainer extends React.Component {

    static contextType = AppContext

    state = {
        showSignin: false,
        showShiftChange: false,
    }

    navList = navbarNavList

    handleClose = () => {
        this.setState({
            showSignin: false,
            showShiftChange: false
        })
    }

    handleClick = (e) => {
        let name = e.target.getAttribute('name')
        switch(name) {
            case 'shiftChange':
            e.preventDefault()
            this.setState({
                showShiftChange: true
            })
            break;
            case 'signin':
            this.setState({
                showSignin: true,
            })
            break;
        }
    }

    render= () => {
        const style = {
            navbar: {
                boxShadow: '0 1px 6px 0 rgba(32,33,36,0.28)',
                fontWeight: '450',
            },
            navbarBrand: {
                color: 'black',
            },
            nav: {
                padding: '.5rem 1.4rem'
            },
            select: {
                border: 0,
            },
        }

        const { 
            locale, 
            auth, 
        } = this.context;

        const { 
            showSignin, 
            showShiftChange
        } = this.state;

        return (
            <Navbar
                id='navbar'  
                bg='white' 
                className='navbar sticky-top navbar-light text-capitalize' 
                expand='lg'
                fixed='top' 
                collapseOnSelect
                style={style.navbar}
            >
                <Navbar.Brand className='px-0 mx-0'>  
                    <Nav.Item 
                        className='nav-link nav-brand d-flex align-items-center' 
                        style={style.navbarBrand}
                    >
                        <Image
                            alt=''
                            src={config.logo}
                            width={50}
                            className='d-inline-block align-top px-1'
                        />
                    </Nav.Item> 
                </Navbar.Brand>
                
                <Navbar.Toggle 
                    aria-controls='responisve-navbar-nav' 
                />
                <Navbar.Collapse id='responsive-navbar-nav'>  
                    <Nav className='mr-auto my-auto' >
                        {this.navList.map(nav => {
                            return (
                                <AccessControl
                                    permission={nav.permission}
                                    renderNoAccess={() => null}
                                    platform={nav.platform}
                                    key={nav.alias}
                                >
                                    <Nav.Item>
                                        <Link 
                                            to={nav.path} 
                                            className='nav-link nav-route'
                                            name={nav.alias}
                                            onClick={nav.hasEvent && this.handleClick}
                                            key={nav.alias}
                                            style={style.nav}
                                        >
                                            {locale.texts[nav.name.toUpperCase().replace(/ /g, '_')]}
                                        </Link>
                                    </Nav.Item>
                                </AccessControl>
                            )
                        })}
                    </Nav>

                    <Nav>
                        <AccessControl
                            permission={'user:batteryNotice'}
                            renderNoAccess={() => null}
                            platform={['browser', 'tablet']}
                        >
                            <BatteryLevelNotification />
                        </AccessControl>
                        <Nav.Item 
                            className='nav-link nav-route' 
                            name={'en'}
                            onClick={(e) => locale.changeLocale(e, auth)}                         
                        >
                            {locale.toggleLang().nextLangName}
                        </Nav.Item>
                        {auth.authenticated
                            ?   (
                                <Dropdown>
                                    <Dropdown.Toggle 
                                        variant='light'
                                        id='collasible-nav-dropdown' 
                                    >
                                        <i className='fas fa-user-alt' />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu
                                        bsPrefix='bot-dropdown-menu-right  dropdown-menu '
                                    >
                                        <div className='dropdownWrapper'>
                                            <LinkContainer to='/page/userSetting' className='bg-white'>
                                                <Dropdown.Item className='lang-select'>
                                                    {auth.user.name}
                                                </Dropdown.Item>
                                            </LinkContainer>
                                            <Dropdown.Divider />
                                            <LinkContainer to='/page/about' className='bg-white'>
                                                <Dropdown.Item className='lang-select'>
                                                    {locale.texts.ABOUT}
                                                </Dropdown.Item>
                                            </LinkContainer>
                                            <Dropdown.Divider />
                                            <LinkContainer to='/' className='bg-white'>
                                                <Dropdown.Item className='lang-select' onClick={auth.signout}>
                                                    {locale.texts.SIGN_OUT}
                                                </Dropdown.Item>
                                            </LinkContainer>
                                        </div>
                                    </Dropdown.Menu>
                                </Dropdown> 
                            )

                            :   (
                                <Nav.Item 
                                    className='nav-link nav-route' 
                                    onClick={this.handleClick}
                                    name='signin'
                                >
                                    {locale.texts.SIGN_IN}
                                </Nav.Item>
                            )
                        }
                    </Nav>
                </Navbar.Collapse>

                <SiginForm 
                    show={showSignin}
                    handleClose={this.handleClose}
                />
            </Navbar>
        );
    }
}

export default NavbarContainer;
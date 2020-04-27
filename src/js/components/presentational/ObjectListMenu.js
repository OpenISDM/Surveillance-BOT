import React from 'react';
import { push as Menu } from 'react-burger-menu';

export default class ObjectListMenu extends React.Component {
    constructor(){
        super()
        this.state = {
            customBurgerIcon: false,
            width: 400,
            noOverlay: true,
            isOpen: true,
        }

    }
    render(){
        const { menuOption, objectList } = this.props;

        const customListStyle = {
            paddingRight: '0.5em',
        }
        return (    
            <div id="outer-container">
                <Menu pageWrapId={ "page-wrap" } outerContainerId={ "outer-container" } {...this.state} {...menuOption}>
                        <div className="list-group list-group-flush" style={customListStyle}>
                            hello
                        </div>
                </Menu>
            </div>
        );
    }   
};

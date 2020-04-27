import React from 'react';

import { ListGroup, Nav } from 'react-bootstrap';

const SearchableObjectType = (props) => {

    const style = {

        /** Customized CSS of sectionIndexItem */
        sectionIndexItem: {
            paddingTop: 0,
            paddingBottom: 0,
        },

        /** Customized CSS of sectionTitle */
        sectionTitle: {
            display: props.isShowSectionTitle ? null : 'none',
            overflow: 'auto',
            maxHeight: '70vh',
            position: 'relative',
            /* font-size: 2em; */
            border: 'solid 2px rgba(227, 222, 222, 0.619)',
            padding: 0,    
        }
    }


    const { sectionTitleList, isShowSectionTitle } = props

    return (        
        <div className='d-flex'>
            <div  className='flex-grow-1 bd-highlight border-0' data-spy="scroll" data-target="#sectionIndex" data-offset="0">
                {sectionTitleList.length === 0 && isShowSectionTitle
                    ?<div className="text-right" style={{color: 'grey'}}> no result </div>
                    
                    :<ListGroup className='list-group' variant="flush" style={style.sectionTitle} id='sectionTitle'>
                        {sectionTitleList.map(item => {
                                return item
                        })}
                    </ListGroup>
                }
            </div>
            
            <div id="sectionIndex" className='bd-highlight'>
                <Nav className="flex-column" >
                    {props.sectionIndexList.map( (letter, index) => {
                        const toggleClassName = props.sectionIndex === letter ? 'activeIndex' : '';
                        return <Nav.Link 
                                    key={index} 
                                    active={false} 
                                    href={'#' + letter} 
                                    className={ toggleClassName + ' sectionIndexItem' + ' px-3'}  
                                    style={style.sectionIndexItem} 
                                    onMouseOver={props.handleMouseOver} 
                                    onTouchStart={props.handleTouchStart} 
                                    onTouchMove={props.handleTouchMove}
                                >
                                    {letter}
                                </Nav.Link>
                    })} 
                </Nav>
            </div>
        </div>
    );

}

export default SearchableObjectType
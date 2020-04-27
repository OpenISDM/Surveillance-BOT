import React from 'react';
import {
    Row,
    Col
} from 'react-bootstrap';
import Searchbar from '../../presentational/Searchbar';
import TabletObjectTypeList from './TabletObjectTypeList';

const TabletSearchContainer = ({
    searchKey,
    objectTypeList,
    getSearchKey,
    handleTouchMove,
    clearSearchResult,
    hasGridButton,
}) => {    

    return (
        <div id='searchContainer' className="py-1" onTouchMove={handleTouchMove}>
            <Row id='searchBar' className='d-flex justify-content-center align-items-center pb-2'>
                <Searchbar 
                    placeholder={searchKey}
                    getSearchKey={getSearchKey}
                    clearSearchResult={clearSearchResult}    
                />
            </Row>
            <div id='searchOption' className="pt-2">
                <Row>
                    <Col className='px-0'>
                        <TabletObjectTypeList
                            getSearchKey={getSearchKey}  
                            clearSearchResult={clearSearchResult}   
                            hasGridButton={hasGridButton} 
                            objectTypeList={objectTypeList}
                        />                            
                    </Col>
                </Row>
            </div>
        </div>
    )
}
export default TabletSearchContainer
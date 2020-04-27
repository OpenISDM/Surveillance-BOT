import React from 'react';
import {
    Row,
    Col
} from 'react-bootstrap';
import Searchbar from '../../presentational/Searchbar';
import TabletObjectTypeList from '../tablet/TabletObjectTypeList';

const MobileSearchContainer = ({
    searchKey,
    objectTypeList,
    getSearchKey,
    handleTouchMove,
    clearSearchResult,
    hasGridButton,
    handleShowResultListForMobile
}) => {
    const style = {    
        textForMobile: {
            fontSize: '2rem'
        }
    }
    return (
        <div id='searchContainer' className="py-1" onTouchMove={handleTouchMove}>
            <Row id='searchBar' className='d-flex justify-content-center align-items-center pb-2'>
                <Searchbar 
                    placeholder={searchKey}
                    getSearchKey={getSearchKey}
                    clearSearchResult={clearSearchResult}
                    handleShowResultListForMobile={handleShowResultListForMobile}    
                />
            </Row>
            <div id='searchOption' className="pt-2" style={style.textForMobile}>
                <Row>
                    <Col className='px-0'>
                        <TabletObjectTypeList
                            getSearchKey={getSearchKey}  
                            clearSearchResult={clearSearchResult}   
                            hasGridButton={hasGridButton} 
                            objectTypeList={objectTypeList}
                            handleShowResultListForMobile={handleShowResultListForMobile}   
                        />                            
                    </Col>
                </Row>
            </div>
        </div>
    )
}
export default MobileSearchContainer
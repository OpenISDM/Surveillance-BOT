import React from 'react';
import {
    Row,
    Image
} from 'react-bootstrap';
import BOTSearchbar from '../../presentational/BOTSearchbar';
import config from '../../../config';

const BrowserSearchContainer = ({
    searchKey,
    getSearchKey,
    handleTouchMove,
    clearSearchResult,
}) => {
    return (
        <div 
            id='searchContainer' 
            className="py-1" 
            onTouchMove={handleTouchMove}
        >
            <Image src={config.logo} rounded />
            <Row id='searchBar' className='d-flex justify-content-center align-items-center pb-2'>
                <BOTSearchbar
                    placeholder={searchKey}
                    getSearchKey={getSearchKey}
                    clearSearchResult={clearSearchResult}    
                />
            </Row>
        </div>
    )
}

export default BrowserSearchContainer
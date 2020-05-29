import React from 'react';
import {
    Row,
    Image
} from 'react-bootstrap';
import BOTSearchbar from '../../presentational/BOTSearchbar';
import config from '../../../config';

const MobileSearchContainer = ({
    searchKey,
    getSearchKey,
    handleTouchMove,
    clearSearchResult,
    suggestData 
}) => {
    return (
        <div 
            id='searchContainer' 
            className="py-1" 
            onTouchMove={handleTouchMove}
        >
            <Image src={config.LOGO} rounded width={100}/>
            <Row id='searchBar' className='d-flex justify-content-center align-items-center my-4'>
                <BOTSearchbar
                    placeholder={searchKey}
                    getSearchKey={getSearchKey}
                    clearSearchResult={clearSearchResult}    
                    width={250}
                    suggestData  ={suggestData }
                />
            </Row>
        </div>
    )
}

export default MobileSearchContainer
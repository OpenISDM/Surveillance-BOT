import React, { Fragment } from 'react';
import {
    BrowserView,
    TabletView,
    MobileOnlyView
} from 'react-device-detect';
import TabletSearchContainer from '../platform/tablet/TabletSearchContainer';
import MobileSearchContainer from '../platform/mobile/MobileSearchContainer';
import BrowserSearchContainer from '../platform/browser/BrowserSearchContainer';

const SearchContainer = ({
    searchKey,
    getSearchKey,
    clearSearchResult,
    handleShowResultListForMobile,
}) => {

    const propsGroup = {
        searchKey,
        getSearchKey,
        clearSearchResult,
        handleShowResultListForMobile
    }
    
    return (
        <Fragment>
            <BrowserView>                   
                <BrowserSearchContainer
                    {...propsGroup}
                />
            </BrowserView>
            <TabletView>
                <TabletSearchContainer 
                    {...propsGroup}
                />
            </TabletView>
            <MobileOnlyView>
                <MobileSearchContainer
                    {...propsGroup}
                />
            </MobileOnlyView>
        </Fragment>
    );
}


export default SearchContainer;
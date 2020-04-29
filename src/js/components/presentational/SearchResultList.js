import React, { Fragment } from 'react';
import _ from 'lodash';
import { AppContext } from '../../context/AppContext';
import {
    BrowserView,
    TabletView,
    MobileOnlyView
} from 'react-device-detect';
import TabletSearchResultList from '../platform/tablet/TabletSearchResultList';
import MobileSearchResultList from '../platform/mobile/MobileSearchResultList';
import BrowserSearchResultList from '../platform/browser/BrowserSearchResultList';


class SearchResult extends React.Component {

    static contextType = AppContext

    state = {
        selectedObjectData: [],
        showNotFoundResult: false,
        showPatientResult: false,
        selection: [],
        editedObjectPackage: [],
        showAddDevice: false,
        showDownloadPdfRequest: false,
        showPath: false,
        signatureName:'',
        showPatientView: false,
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (!(_.isEqual(prevProps.searchKey, this.props.searchKey))) {
            this.setState({
                showNotFoundResult: false
            })
        } 
    }


    render() {
        const { locale } = this.context;
        const { 
            searchKey,
            highlightSearchPanel
        } = this.props;

        const {
            handleToggleNotFound,
            onSelect
        } = this
        
        const {
            selection,
            showNotFoundResult
        } = this.state

        let foundResult = this.props.searchResult.filter(item => item.found)
        let notFoundResult = this.props.searchResult.filter(item => !item.found)
        let searchResult = this.state.showNotFoundResult 
            ? notFoundResult
            : foundResult

        let title = this.state.showNotFoundResult 
            ? locale.texts.SEARCH_RESULTS_NOT_FOUND
            : locale.texts.SEARCH_RESULTS_FOUND

        let propsGroup = {
            searchResult,
            title,

            /** function */
            handleToggleNotFound,
            onSelect,
            highlightSearchPanel,
            /** state */
            selection,
            showNotFoundResult
        }
        return(
            <Fragment>
                <BrowserView>
                    <BrowserSearchResultList
                        {...propsGroup}
                    />
                </BrowserView>
                <TabletView>
                    <TabletSearchResultList 
                        {...propsGroup}
                    />
                </TabletView>
                <MobileOnlyView>
                    <MobileSearchResultList
                        {...propsGroup}
                    />
                </MobileOnlyView>
            </Fragment>
        )
    }
}

export default SearchResult

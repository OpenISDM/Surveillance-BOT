import React from 'react';
import { AppContext } from '../../context/AppContext';
import {
    BrowserView,
    TabletView,
    MobileOnlyView
} from 'react-device-detect'
import retrieveDataHelper from '../../service/retrieveDataHelper';
import TabletSearchContainer from '../platform/tablet/TabletSearchContainer';
import MobileSearchContainer from '../platform/mobile/MobileSearchContainer';
import BrowserSearchContainer from '../platform/browser/BrowserSearchContainer';

class SearchContainer extends React.Component {

    static contextType = AppContext

    state = {
        isShowSectionTitle: false,
        hasSearchKey: false,
        isShowSearchOption: false,
        searchKey:'',
        sectionTitleList: [],
        sectionIndex:'',
        searchResult: [],
        hasSearchableObjectData: false,
        objectTypeList: [],        
    }

    componentDidMount = () => {
        this.getObjectTable()
    }

    componentDidUpdate = (prepProps) => {
        
        /** Refresh the search result automatically 
         *  This feature can be adjust by the user by changing the boolean value in config */
        if (this.state.refreshSearchResult 
            && this.state.hasSearchKey 
            && !this.props.hasGridButton) {
            this.props.getSearchKey(this.state.searchKey)            
        }
        if (prepProps.clearSearchResult !== this.props.clearSearchResult && this.props.clearSearchResult) {
            this.setState({
                searchKey: '',
            })
        }
        if (prepProps.hasSearchKey !== this.props.hasSearchKey && prepProps.hasSearchKey) {
            this.setState({
                hasSearchKey: this.props.hasSearchKey,
            })
        }

    }
    /** Get the searchable object type. */
    getObjectTable = () => {
        const {
            locale,
            auth
        } = this.context

        retrieveDataHelper.getObjectTable(
            locale.abbr,
            null,
            [0]
        )
        .then(res => {
            let objectTypeList = res.data.rows.reduce((objectTypeList, item) => {
                if (!objectTypeList.includes(item.type)) {
                    objectTypeList.push(item.type)
                }
                return objectTypeList
            }, [])
            this.setState({
                objectTypeList
            })
        })
        .catch(err => {
            console.log(err)
        })
    }

    /* Handle the cursor hover events in device that can use mouse.*/
    handleMouseOver = (e) => {
        location.href = '#' + e.target.innerText;
        this.setState({
            isShowSectionTitle: true,
            sectionIndex: e.target.innerText,
        })
    }

    /* Handle the touch start events in mobile device */
    handleTouchStart = (e) => { 
        if (e.target.classList.contains("sectionIndexItem")) {
            location.href = '#' + sectionIndex;
        }
        this.setState({
            isShowSectionTitle: true,
            sectionIndex: e.target.innerText,
        })
    }

    /* Handle the touch move events in mobile device */
    handleTouchMove = (e) => { 
        
        const pageX = e.changedTouches[0].pageX;
        const pageY = e.changedTouches[0].pageY;
        const element = document.elementFromPoint(pageX, pageY);

        if (element.classList.contains("sectionIndexItem")) {
            location.href = '#' + element.innerText;
            this.setState({
                isShowSectionTitle: true,
                sectionIndex: element.innerText,
            })
        }
    }

    render() {      
        const style = {    
            textForMobile: {
                fontSize: '2rem'
            }
        }
        const {
            searchKey,
            getSearchKey,
            clearSearchResult,
            handleShowResultListForMobile,
        } = this.props

        const {
            objectTypeList
        } = this.state

        const propsGroup = {
            searchKey,
            objectTypeList,
            getSearchKey,
            clearSearchResult,
            handleShowResultListForMobile
        }
        
        return (
            <div>
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
            </div>
        );
    }
}

export default SearchContainer;
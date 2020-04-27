import React  from 'react';
import { Button } from 'react-bootstrap';
import { AppContext } from '../../context/AppContext';
import axios from 'axios'
import { addUserSearchHistory } from '../../dataSrc'

class ObjectTypeList extends React.Component {

    static contextType = AppContext

    state = {
        searchKey: '',
    }

    componentDidUpdate = (prepProps) => {
        if (prepProps.clearSearchResult !== this.props.clearSearchResult && !prepProps.clearSearchResult) {
            this.setState({
                searchKey: '',
            })
        }
        if (prepProps.hasGridButton !== this.props.hasGridButton && this.props.hasGridButton) {
            this.setState({
                searchKey: ''
            })
        }
    }

    handleClick = (e) => {
        const itemName = e.target.name;
        this.props.getSearchKey(itemName)        
        this.addSearchHistory(itemName)
        this.checkInSearchHistory(itemName)
    }

    /** Set search history to auth */
    addSearchHistory(searchKey) {
        let { auth } = this.context
        if (!auth.authenticated) return;
        const searchHistory = auth.user.searchHistory || []
        let flag = false; 
        const toReturnSearchHistory = searchHistory.map( item => {
            if (item.name === searchKey) {
                item.value = item.value + 1;
                flag = true;
            }
            return item
        })
        flag === false ? toReturnSearchHistory.push({name: searchKey, value: 1}) : null;
        const sortedSearchHistory = this.sortSearchHistory(toReturnSearchHistory)
        auth.setSearchHistory(sortedSearchHistory)
    }

    /** Sort the user search history and limit the history number */
    sortSearchHistory(history) {
        let toReturn = history.sort( (a,b) => {
            return b.value - a.value
        })
        return toReturn
    }

    /** Insert search history to database */
    checkInSearchHistory(itemName) {
        let { 
            auth 
        } = this.context

        axios.post(addUserSearchHistory, {
            username: auth.user.name,
            keyType: 'object type search',
            keyWord: itemName
        }).then(res => {
            this.setState({
                searchKey: itemName
            })
        }).catch(err => {
            console.log(`check in search history fail ${err}`)
        })
    }

    render() {
        const style = {
            titleText: {
                color: 'rgb(80, 80, 80, 1)'
            }, 
            list: {
                maxHeight: this.props.maxHeigh,
                overflow: "hidden scroll",
            },
        }

        const { 
            locale, 
        } = this.context

        return (
            <div>
                <div className='text-capitalize title'>
                    {locale.texts.OBJECT_TYPE}
                </div>
                <div style={style.list} className="d-inline-flex flex-column searchOption">
                    {this.props.objectTypeList
                        .map((item, index) => {
                            return ( 
                                <Button
                                    variant="outline-custom"
                                    className="text-none"
                                    onClick={this.handleClick} 
                                    // active={this.state.searchKey === item.toLowerCase()} 
                                    key={index}
                                    name={item}
                                >
                                    {item}
                                </Button>
                            )
                    })}
                </div>
            </div>
                
        )
    }
}

export default ObjectTypeList;
import React from 'react';
import { Col, Row, ListGroup, Nav, Button } from 'react-bootstrap';


import LocaleContext from '../../context/LocaleContext';


// import '../../../css/hideScrollBar.css'
// import '../../../css/shadow.css'
import '../../../css/SearchableObjectType.css'
import axios from 'axios';
import { getObjectTable } from '../../dataSrc'
import Cookies from 'js-cookie'
import {
    addUserSearchHistory
} from '../../dataSrc'
/*
    this class contain three two components
        1. sectionIndexList : this is the alphabet list for user to search their objects by the first letter of their type
        2. sectionTitleList : when you hover a section Index List letter, the section title list will show a row of object types of same first letter (i.e. bed, bladder scanner, ...) 
*/
class SearchableObjectType extends React.Component {

    constructor(){
        super()
        this.state = {
            sectionIndexList: ['A','B','C', 'D','E','F','G','H', 'I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
            IsShowSection : false,
            changeState: 0,
            firstLetterMap: [],
        }
        this.data = {
            sectionTitleData : [],
            floatUp: false
        }
        this.shouldUpdate = false
        this.onSubmit = null

        this.API = {
            // setObjectList : (objectList) => {
            //     var firstLetterMap = new Array()
            //     if(objectList.length !== 0){
            //         objectList.map((name) => {
            //             firstLetterMap[name[0]] 
            //                 ? firstLetterMap[name[0]].push(name)
            //                 : firstLetterMap[name[0]] = [name]
            //         })
            //     }
            //     this.shouldUpdate = true
                
            //     this.data.sectionTitleData = firstLetterMap
            //     this.setState({})
                
            // },
            setOnSubmit : (func) => {
                this.onSubmit = func
            },
            floatUp : () => {
                this.shouldUpdate = true
                this.data.floatUp = true
                this.setState({})
            },
            floatDown: () => {
                this.shouldUpdate = true
                this.data.floatUp = false
                this.setState({})
            }
        }
        this.handleHoverEvent = this.handleHoverEvent.bind(this)
        this.mouseClick = this.mouseClick.bind(this)
        this.mouseLeave = this.mouseLeave.bind(this)
        this.sectionIndexHTML= this.sectionIndexHTML.bind(this)
    }

    
    

    componentDidMount(){
        axios.post(getObjectTable, {
        })
        .then(res => {
            let objectTypeList = []
            res.data.rows.map(item => {
                objectTypeList.includes(item.type) ? null : objectTypeList.push(item.type)
            })
            let firstLetterMap = this.getObjectIndexList(objectTypeList)
            this.setState({
                firstLetterMap
            })
        })
        .catch(err => {
            console.log(err)
        })

        // if(this.props.getAPI){
        //     this.props.getAPI(this.API)
        // }else if(this.props.onSubmit){
        //     this.onSubmit = this.props.onSubmit
        // }else{
        //     console.error('onSubmit is empty')
        // }
    }

    // componentWillUnmount = () => {
    //     console.log(123)
    // }

    getObjectIndexList = (objectList) => {
        var firstLetterMap = []
        if(objectList.length !== 0){
            objectList.map((name) => {
                firstLetterMap[name[0]] 
                    ? firstLetterMap[name[0]].push(name)
                    : firstLetterMap[name[0]] = [name]
            })
        }
        this.shouldUpdate = true
        return firstLetterMap
        // this.data.sectionTitleData = firstLetterMap
        // console.log(firstLetterMap)
        // this.setState({})
    }
    
    shouldComponentUpdate(nextProps, nexState){
        if(this.shouldUpdate){
            this.shouldUpdate = false
            return true
        }
        // if(!_.isEqual(this.props.objectTypeList, nextProps.objectTypeList) ){
        //     this.API.setObjectList(nextProps.objectTypeList)
        //     return true
        // }
        if(this.props.floatUp !== nextProps.floatUp){
            if(nextProps.floatUp){
                this.API.floatUp()
            }else{
                this.API.floatDown()
            }
        }
        return false
    }

    handleHoverEvent(e){
        location.href = '#' + e.target.parentNode.getAttribute('name')
        this.shouldUpdate = true
        this.setState({
            IsShowSection: true,
        })
    }

    mouseClick(e){
        this.onSubmit(e.target.innerHTML)
        this.shouldUpdate = true
        this.setState({
            IsShowSection: false
        })
    }

    mouseLeave(){

        this.shouldUpdate = true
        this.setState({
            IsShowSection: false
        })
    }

    sectionIndexHTML = () => {
        const { sectionIndexList } = this.state
        var Data = [];
        let data = [];
        let index = 0;
        // the for loop is to screen out the alphabet without any data, output a html format
        for (var i in sectionIndexList){
            index ++;
            data = 
                <Nav.Link 
                    key={i} 
                    active={false} 
                    href={'#' + sectionIndexList[i]} 
                    className='py-0 pr-0'
                    name={sectionIndexList[i]}
                    onMouseOver={this.handleHoverEvent} 
                    style = {{fontSize: '1rem'}}
                >
                    {(index % 2) ? <div>{sectionIndexList[i]}</div> : <div >&bull;</div>}
                </Nav.Link>
            ;

            Data.push(data)
        }
        return Data;
    }

    sectionTitleListHTML = () => {

        var Data = [];
        let first = []; 

        for(var titleData in this.state.firstLetterMap){
            first = titleData
            Data.push (
                <div 
                    id={first} 
                    key={first} 
                    className="text-right text-dark" 
                >
                    <h5 className="my-2">{first}</h5>
                </div>
            )

            for (let i in this.state.firstLetterMap[first]){
                let name = this.state.firstLetterMap[first][i]
                Data.push(
                    <div 
                        key={name} 
                        name={name} 
                        className="my-0 py-0 w-100 text-right" 
                        style={{cursor: 'pointer'}} 
                        onClick={this.handleClick} 
                    >
                        {name}
                    </div>
                )
            }
        }       
        return Data

    }

    handleClick = (e) => {
        let searchKey = e.target.innerText
        this.props.getSearchKey(searchKey)

        this.addSearchHistory(searchKey)

        this.shouldUpdate = true
        this.setState({
            IsShowSection: false
        })
    }

    addSearchHistory(searchKey) {
        let { auth } = this.props
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
        this.checkInSearchHistory(auth.user.name, sortedSearchHistory)
    }

    /** Sort the user search history and limit the history number */
    sortSearchHistory(history) {
        let toReturn = history.sort( (a,b) => {
            return b.value - a.value
        })
        return toReturn
    }

    checkInSearchHistory(username, searchHistory) {
        console.log(searchHistory)
        axios.post(addUserSearchHistory, {
            username,
            searchHistory,
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        var  Setting = {

            SectionIndex: {
            } ,
            SectionListBackgroundColor:{

                backgroundColor:'rgba(240, 240, 240, 0.95)',
            },
            SectionList: {
                borderRadius: '10px',
                overflowY: 'scroll', 
                height: '70vh',
                // width: '30vw',
                // zIndex: 1500,
                display: this.state.IsShowSection ? 'block':'none'
            },
            // SearchableObjectType:{
            //     position: 'relative',
            //     top: '-25vh',
            //     right: '1%'
                
            // }
        }

        const style = {
            cross: {
                cursor: 'pointer',
                fontSize: '1.3rem'
            }
        }
        return(
            <div
                id='searchableObjectType' 
                onMouseLeave={this.mouseLeave} 
                className="hideScrollBar mx-2 float-right" 
            >
                {/** this section shows the layout of sectionIndexList (Alphabet List)*/}
                <Col id="SectionIndex"  className = "float-right d-flex flex-column align-items-center" style = {{zIndex: (this.data.floatUp) ? 1080 : 1}}>
                    {this.sectionIndexHTML()}  
                </Col>

                {/** this section shows the layout of sectionTitleList (the search results when you hover the section Index List */}
                <div  
                    id="SectionList" 
                    className="hideScrollBar shadow border border-primary float-right mx-0 px-3 py-2 border-secondary" 
                    style={{
                        ...Setting.SectionListBackgroundColor,
                        ...Setting.SectionList,
                    }}
                >
                    <div 
                        className='d-flex justify-content-start'
                        style={style.cross}
                        onClick={this.mouseLeave}
                    >
                        &#10005;
                    </div>
                    {this.sectionTitleListHTML(Setting)}
                </div>
            </div>
        )
            
        
    }
}

export default SearchableObjectType
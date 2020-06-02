import React, { Fragment } from 'react';
import { AppContext } from '../../../context/AppContext';
import ReactTable from 'react-table'; 
import styleConfig from '../../../config/styleConfig';
import selecTableHOC from 'react-table/lib/hoc/selectTable';
import BindForm from '../../container/BindForm';
import DeleteConfirmationForm from '../../presentational/DeleteConfirmationForm';
import axios from 'axios';
import EditPatientForm from '../../container/EditPatientForm';
import messageGenerator from '../../../helper/messageGenerator';
const SelectTable = selecTableHOC(ReactTable);
import { patientTableColumn } from '../../../config/tables';
import retrieveDataHelper from '../../../helper/retrieveDataHelper';
import dataSrc from '../../../dataSrc';
import {
    BrowserView,
    MobileOnlyView,
    TabletView,
} from 'react-device-detect';
import BrowserObjectTableView from '../../platform/browser/BrowserObjectTableView';
import MobileObjectTableView from '../../platform/mobile/MobileObjectTableView';
import TabletObjectTableView from '../../platform/tablet/TableObjectTableView';
import SiteModuleTW from '../../../../../site_module/locale/zh-TW';
import SiteModuleEN from '../../../../../site_module/locale/en-US';
import moment from 'moment';

class ObjectTableContainer extends React.Component{
    
    static contextType = AppContext
    
    state = {
        isShowBind:false,
        isPatientShowEdit:false,
        showDeleteConfirmation:false,
        selectedRowData:'',
        selectAll: false,
        selection: [],
        formPath:'',
        formTitle:'',
        disableASN: false,
        done:false,
        data: [],
        columns: [],
        areaTable: [],
        physicianList: [],
        roomOptions: [],
        objectFilter: [],
        objectTable: [],
        importData: [],
        filteredData: [],
        filterSelection: {},
        locale: this.context.locale.abbr,
    }

    componentDidMount = () => { 
        this.getData();
        this.getAreaTable();
    }

    componentDidUpdate = (prevProps, prevState) => {    

        if (this.context.locale.abbr !== prevState.locale) {    
            this.getRefresh()
            this.setState({ 
                locale: this.context.locale.abbr
            }) 
        } 
    }

    getRefresh = () =>{
        this.getAreaTable()

        let columns = _.cloneDeep(patientTableColumn) 

        columns.map(field => {
            field.Header = this.context.locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
        }) 
        this.state.data.map(item=>{
            this.context.locale.lang == 'en' 
            ? item.area_name.label = SiteModuleEN[item.area_name.value]
            : item.area_name.label = SiteModuleTW[item.area_name.value]
            item.registered_timestamp = moment(item.registered_timestamp._i).locale(this.context.locale.abbr).format("lll")
            item.area_name.label == undefined ?   item.area_name.label = '*site module error*' : null 
        })

        this.state.filteredData.map(item=>{
            this.context.locale.lang == 'en' 
            ? item.area_name.label = SiteModuleEN[item.area_name.value]
            : item.area_name.label = SiteModuleTW[item.area_name.value]
            item.registered_timestamp = moment(item.registered_timestamp._i).locale(this.context.locale.abbr).format("lll")
            item.area_name.label == undefined ?   item.area_name.label = '*site module error*' : null
        })
       
        this.setState({
            columns,
            locale: this.context.locale.abbr
        }) 
    }

    getData = (callback) => {
        let { 
            locale,
            auth
        } = this.context

        retrieveDataHelper.getObjectTable(
            locale.abbr,
            auth.user.areas_id,
            [0, 1, 2]
        )
        .then(res => {
            let columns = _.cloneDeep(patientTableColumn)
            let data = [] 

            columns.map(field => {
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })

            res.data.rows
            .filter(item => item.object_type != 0)
            .map(item => {
                
                item.area_name = {
                    value:item.area_name,
                    label: locale.texts[item.area_name] || '*site module error*',
                    id: item.area_id
                }
                data.push(item)
            })  
            this.setState({
                data,
                isShowEdit: false,
                isShowBind: false,
                showDeleteConfirmation: false,
                isPatientShowEdit: false,
                disableASN: false, 
                columns,
                objectTable: res.data.rows,
                locale: locale.abbr,
                filteredData:data 
            }, callback) 
        })
        .catch(err => {
            console.log(err);
        })
    }

    getAreaTable = () => {
        let {
            locale
        } = this.context
        retrieveDataHelper.getAreaTable()
            .then(res => {
                let areaSelection = res.data.rows.map(area => {
                    return {
                        value: area.name,
                        label: locale.texts[area.name]
                    }
                })
                this.setState({
                    areaTable: res.data.rows,
                    areaSelection,
                    filterSelection: {
                        ...this.state.filterSelection,
                        areaSelection,
                    }
                })
            })
            .catch(err => {
                console.log(`get area table failed ${err}`)
            })
    }

    handleClose = () => {
        this.setState({
            isShowBind:false,
            isPatientShowEdit:false,
            showDeleteConfirmation:false,
            selectedRowData:'',
            disableASN:false,
        })
    }

    handleClick = (e) => {
        this.setState({
            disableASN: false,
            isPatientShowEdit: true,
            formTitle: 'add persona',
            apiMethod: 'post',
            selectedRowData:'',
        })
    }

    handleSubmitForm = (formOption, cb) => {
        let {
            apiMethod
        } = this.state
        this.setState({isShowBind:false})
        axios[apiMethod](dataSrc.object, {
            formOption,
            mode: 'PERSONA',
        }).then(res => { 
            let callback = () => {
                messageGenerator.setSuccessMessage(
                    'save success'
                )
            }
            this.getData(callback)
        }).catch( error => {
            console.log(error)
        })
    }

    toggleSelection = (key, shift, row) => {
         
        let selection = [...this.state.selection];
        key = key.split('-')[1] ? key.split('-')[1] : key
        const keyIndex = selection.indexOf(key);
        if (keyIndex >= 0) {
            selection = [
            ...selection.slice(0, keyIndex),
            ...selection.slice(keyIndex + 1)
            ];
        } else {
            selection.push(key);
        }
        this.setState({ 
            selection 
        });
    };

    toggleAll = () => {
      
        const selectAll = this.state.selectAll ? false : true;
        let selection = [];
        let rowsCount = 0 ; 
        if (selectAll) {
            const wrappedInstance = this.selectTable.getWrappedInstance();
           // const currentRecords = wrappedInstance.props.data
 
            const currentRecords = wrappedInstance.getResolvedState().sortedData ; 
            currentRecords.forEach(item =>{
                rowsCount++; 
                if ((rowsCount > wrappedInstance.state.pageSize * wrappedInstance.state.page) && ( rowsCount <= wrappedInstance.state.pageSize +wrappedInstance.state.pageSize * wrappedInstance.state.page) ){
                    selection.push(item._original.id)
                } 
            });
 
        }else{
            selection = [];
        }
         this.setState({ selectAll, selection });

    };

    isSelected = (key) => {
        return this.state.selection.includes(key);
    };


    handleClickButton = (e) => {

        let { name } = e.target
        switch(name) {
            case 'associate':
                this.setState({
                    isShowBind: true,
                    bindCase: 2,
                    apiMethod: 'post',
                })
            break;
            case 'delete':
                this.setState({
                    showDeleteConfirmation: true,
                    warningSelect : 0,
                })
            break;
        }

    }

    objectMultipleDelete = () => {
        let formOption = []
        var deleteArray = [];
        var deleteCount = 0; 
        this.state.data.map (item => {
         
            this.state.selection.map(itemSelect => {
                itemSelect === item.id
                ? 
                 deleteArray.push(deleteCount.toString()) 
                : 
                null          
            })
                 deleteCount +=1
        })
        
        deleteArray.map( item => {
         
            this.state.data[item] === undefined ?
                null
                :
                formOption.push(this.state.data[item].mac_address)
            })

        axios.delete(dataSrc.object, {
            data: {
                formOption
            }
        })
        .then(res => {
            let callback = () => {
                messageGenerator.setSuccessMessage(
                    'save success'
                )
            }
            this.getData(callback)
        })
        .catch(err => {
            console.log(err)
        }) 
       
        this.setState({selection:[]})
    }


    filterData = (data, key, filteredAttribute) => { 
        const { locale } = this.context   
        
        key = key.toLowerCase()
        let filteredData = data.filter(obj => { 
            if(filteredAttribute.includes('name')){

                let keyRex = new RegExp(key)
                if(obj.name.toLowerCase().match(keyRex)){
                    return true
                }
            }

            if(filteredAttribute.includes('acn')){
                let keyRex = new RegExp(key)
                if(obj.asset_control_number.toLowerCase().match(keyRex)) return true

            }

            if (filteredAttribute.includes('area')){ 
                let keyRex = new RegExp(key) 
                if (obj.area_name.label != undefined){
                    if (obj.area_name.label.match(keyRex)) {
                       return true 
                    }
                } 
            }

            if  (filteredAttribute.includes('macAddress')){

                let keyRex = key.replace(/:/g, '')
                if (obj.mac_address.replace(/:/g, '').toLowerCase().match(keyRex)) return true
            }

            return false
        })
        return filteredData
    }

    addObjectFilter = (key, attribute, source) => {  
        this.state.objectFilter = this.state.objectFilter.filter(filter => source != filter.source)
        
        this.state.objectFilter.push({
            key, attribute, source
        })
        this.filterObjects() 
    }

    removeObjectFilter = (source) => {
        this.state.objectFilter = this.state.objectFilter.filter(filter => source != filter.source)
        this.filterObjects()
    }

    filterObjects = () => {
        let filteredData = this.state.objectFilter.reduce((acc, curr) => {
            return this.filterData(acc, curr.key, curr.attribute)
        }, this.state.data)

        this.setState({
            filteredData
        })
    }

    render(){

        const {  
            selectedRowData,
            selectAll,
            selectType,
            filterSelection,
            selection
        } = this.state

        const {
            toggleSelection,
            toggleAll,
            isSelected,
            addObjectFilter,
            removeObjectFilter,
            handleClickButton,
            handleClick
        } = this;

        const extraProps = {
            selectAll,
            isSelected,
            toggleAll,
            toggleSelection,
            selectType
        };

        const propsGroup = {
            addObjectFilter,
            removeObjectFilter,
            filterSelection,
            handleClickButton,
            handleClick,
            selection
        }

        return(
            <Fragment> 
                <BrowserView>
                    <BrowserObjectTableView
                        {...propsGroup}
                    />                    
                </BrowserView>
                <TabletView>
                    <TabletObjectTableView
                        {...propsGroup}
                    />
                </TabletView>
                <MobileOnlyView>
                    <MobileObjectTableView
                        {...propsGroup}
                    />                    

                </MobileOnlyView>
                <hr/> 
                <SelectTable
                    keyField='id'
                    data={this.state.filteredData}
                    columns={this.state.columns}
                    ref={r => (this.selectTable = r)} 
                    className='-highlight text-none'
                    style={{maxHeight:'70vh'}} 
                    onPageChange={(e) => {this.setState({selectAll:false,selection:''})}} 
                    onSortedChange={(e) => {this.setState({selectAll:false,selection:''})}}
                    {...extraProps}
                    {...styleConfig.reactTable}
                    NoDataComponent={() => null}
                    getTrProps={(state, rowInfo, column, instance) => {
                        return {
                            onClick: (e) => {  
                                if (!e.target.type) { 
                                    this.setState({
                                        isPatientShowEdit:true,
                                        selectedRowData: this.state.data[rowInfo.index],
                                        formTitle: 'edit info',
                                        disableASN: true,
                                        apiMethod: 'put',
                                    })
                                } 
                            },
                        }
                    }} 
                />
                <EditPatientForm
                    show = {this.state.isPatientShowEdit} 
                    title= {this.state.formTitle} 
                    selectedRowData={selectedRowData  || ''} 
                    handleSubmit={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    handleClose={this.handleClose}
                    data={this.state.data}
                    objectTable= {this.state.objectTable}
                    physicianList={this.state.physicianList}
                    roomOptions={this.state.roomOptions}
                    disableASN = {this.state.disableASN}
                    areaTable={this.state.areaTable}
                />  
                <BindForm 
                    show = {this.state.isShowBind} 
                    bindCase = {this.state.bindCase}
                    title={this.state.formTitle} 
                    handleSubmit={this.handleSubmitForm}
                    formPath={this.state.formPath}
                    handleClose={this.handleClose}
                    objectTable={this.state.objectTable}
                    areaTable={this.state.areaTable}
                    data={this.state.importData.reduce((dataMap, item) => {
                        dataMap[item.asset_control_number] = item 
                        return dataMap
                        }, {})
                    }
                />
                <DeleteConfirmationForm
                    show={this.state.showDeleteConfirmation} 
                    handleClose={this.handleClose}
                    handleSubmit={
                        
                    this.state.warningSelect == 0 ?  this.objectMultipleDelete :null
              
                    } 
                />
            </Fragment>
        )
    }
}
export default ObjectTableContainer

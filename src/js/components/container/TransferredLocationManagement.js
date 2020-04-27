import React from 'react';
import { 
    Button, 
} from 'react-bootstrap';
import { AppContext } from '../../context/AppContext';
import config from '../../config';
import { MDBBtn, MDBTable, MDBTableBody, MDBTableHead  } from 'mdbreact';
import axios from 'axios';
import dataSrc from "../../dataSrc"
import {
    Row,
    Col,
} from "react-bootstrap"
import locale from 'antd/lib/date-picker/locale/en_US';
import { 
    TransferredLocationColumn
} from '../../config/tables'


const defaultBranchName = 'new branch'
const defaultDepartmentName = 'new department'


class TranferredLocationManagement extends React.Component{

    static contextType = AppContext 
    state= { 
        transferredLocationOptions: [],
        unFoldBranches: [], 
    } 


    getColumn = () => {
            const { locale } = this.context
            let column = _.cloneDeep(TransferredLocationColumn) 
            column.map(item => {
                item.headerStyle = {
                    textAlign: 'left',
                }
                item.label = locale.texts[item.field.toUpperCase().replace(/ /g, '_')]
            })  
            return column
    }

    
    componentDidMount = () => {
        this.getColumn()
        this.getTransferredLocation()
    }
   
    getTransferredLocation = () => {
        axios.get(dataSrc.getTransferredLocation)
            .then(res => {
                res.data.map(branch => {
                    if(!branch.department){
                        branch.department = []                       
                    }
                })
                this.setState({
                    transferredLocationOptions: res.data
                })
            }).catch(err => {
                console.log(err)
            })           
    }
    generateDataRows = () => {
        const { locale } = this.context
        let rows = []
        this.state.transferredLocationOptions.map((branch)=> {
            rows.push({
                fold: <i 
                    className= {this.state.unFoldBranches.includes(branch.id) ?"fas fa-caret-down d-flex justify-content-center" : "fas fa-caret-right d-flex justify-content-center" }
                    style={{lineHeight:'100%', fontSize:'30px'}}
                    onClick = {this.changeFold.bind(this, branch.id)}></i>,
                level: <h6>{locale.texts.BRANCH}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</h6>,
                name: <input 
                    type="text" 
                    value={branch.branch_name} 
                    onBlur={this.renameBranchToBackend.bind(this, branch.id)} 
                    onChange={this.renameBranchToState.bind(this, branch.id)} />,
                remove: <i 
                    className="fas fa-minus d-flex justify-content-center" 
                    onClick={() => {this.removeBranch(branch.id)}}/>,
                add: <i 
                    className="fas fa-plus d-flex justify-content-center" 
                    onClick={() => {
                        this.addDepartment(branch.id)
                        this.unfold(branch.id)
                    }}></i>,
            })
            if (this.state.unFoldBranches.includes(branch.id)) {
                let {department} = branch
                department.map( (department, index) => {
                    rows.push({
                        fold: null,
                        level: <h6>department</h6>,
                        name: <input 
                            type="text" 
                            value={department} 
                            onBlur={this.renameDepartmentToBackend.bind(this, branch.id, index)} 
                            onChange={this.renameDepartmentToState.bind(this, branch.id, index)}/>,
                        remove: <i 
                            className="fas fa-minus d-flex justify-content-center" 
                            onClick={() => {this.removeDepartment(branch.id, index)}} />,
                        add:null,
                    })
                })
            }
            
        })
        return rows
    }
    unfold = (id) => {
        if(!this.state.unFoldBranches.includes(id)){
            this.state.unFoldBranches.push(id)
            this.setState({})
        }
    }
    fold = (id) => {
        this.setState({
            unFoldBranches:  this.state.unFoldBranches.filter(branch_id => branch_id !== id)  
        })
    }
    changeFold = (id) => {
        if(this.state.unFoldBranches.includes(id)){
            this.fold(id)
        }else{
            this.unfold(id)
        }      
    }
    addBranch = (e) => {
        axios.post(dataSrc.modifyTransferredLocation, {
            type: 'add branch',
            data: {
                name: defaultBranchName
            }
        }).then(res => {
            this.getTransferredLocation()
        })
    }
    renameBranchToState = (branch_id, e) => {
        let newName = e.target.value
        this.state.transferredLocationOptions.map(branch => {
            if (branch.id == branch_id){
                branch.branch_name = newName
            }
        })
        this.setState({})
    }
    renameBranchToBackend = (branch_id, e) => {
        const newName = e.target.value
        axios.post(dataSrc.modifyTransferredLocation, {
            type: 'rename branch',
            data: {
                branch_id: branch_id,
                name: newName
            }
        }).then(res => {
            this.getTransferredLocation()
        })
    }
    removeBranch = (branch_id) => {
        axios.post(dataSrc.modifyTransferredLocation, {
            type: 'remove branch',
            data: {
                branch_id,
            }
        }).then(res => {
            this.getTransferredLocation()
        })
    }
    addDepartment = (branch_id) => {
        axios.post(dataSrc.modifyTransferredLocation, {
            type: 'add department',
            data: {
                branch_id,
                name: defaultDepartmentName
            }
        }).then(res => {
            this.getTransferredLocation()
        })
    }
    renameDepartmentToState = (branch_id, index, e) => {
        let newName = e.target.value
        this.state.transferredLocationOptions.map(branch => {
            if (branch.id == branch_id){
                branch.department[index] = newName
            }
        })
        this.setState({})
    }
    renameDepartmentToBackend = (branch_id, index, e) => {
        let newName = e.target.value
        axios.post(dataSrc.modifyTransferredLocation, {
            type: 'rename department',
            data: {                                   
                branch_id,
                departmentIndex: index,
                name: newName
            }
        }).then(res => {
            this.getTransferredLocation()
        })
    }
    removeDepartment = (branch_id, departmentIndex) => {
        axios.post(dataSrc.modifyTransferredLocation, {
            type: 'remove department',
            data: {
                branch_id,
                departmentIndex
            }
        }).then(res => {
            this.getTransferredLocation()
        })
    }

    render(){  
        const { locale } = this.context
        let dataRows = this.generateDataRows() 
        let column = this.getColumn()  
        return(
            <Col lg={8}>
                <MDBTable autoWidth={false}
                >
                    <MDBTableHead columns={column} />
                    <MDBTableBody rows={dataRows} color='#000000'/>
                </MDBTable>
           <Button variant="light" onClick={this.addBranch}>{locale.texts.ADD_BRANCH}</Button>
            </Col> 
        )
    }
}

export default TranferredLocationManagement;
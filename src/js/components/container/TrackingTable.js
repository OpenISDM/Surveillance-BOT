import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { AppContext } from '../../context/AppContext';
import {
    trackingTableColumn
} from '../../config/tables'
import retrieveDataHelper from '../../service/retrieveDataHelper'
import { toast } from 'react-toastify';
import messageGenerator from '../../service/messageGenerator';
import styleConfig from '../../config/styleConfig';
 

class TrackingTable extends React.Component{

    static contextType = AppContext

    state = {
        trackingData: [],
        trackingColunm: [],
        tabIndex: 0,
        locale: this.context.locale.abbr,
    }

    toastId = null;

    componentDidUpdate = (prevProps, prevState) => {
        let { locale } = this.context
        if (locale.abbr !== prevState.locale) {
            this.getTrackingData();
        }
    }

    componentDidMount = () => {
        this.getTrackingData()
    }

    componentWillUnmount = () => {
        toast.dismiss(this.toastId)
    }


    getTrackingData = () => {
        let { locale, auth, stateReducer } = this.context
        let [{areaId}] = stateReducer

        retrieveDataHelper.getTrackingData(
            locale.abbr,
            auth.user,
            areaId
        )
        .then(res => {
            this.setMessage('clear')
            let column = _.cloneDeep(trackingTableColumn)
            column.map(field => {
                field.headerStyle = {
                    textAlign: 'left',
                    textTransform: 'capitalize'
                }
                if (field.accessor == '_id') {
                    field.headerStyle = {
                        textAlign: 'center',
                    }
                }
                field.Header = locale.texts[field.Header.toUpperCase().replace(/ /g, '_')]
            })
            res.data.map((item, index) => {
                item.status = locale.texts[item.status.toUpperCase()]
                item.transferred_location = ''
                item._id = index + 1;
                // item.transferred_location 
                //     ? locale.texts[item.transferred_location.toUpperCase().replace(/ /g, '_')]
                //     : ''
            })
            this.setState({
                trackingData: res.data,
                trackingColunm: column,
                locale: locale.abbr,
            })
        })
        .catch(err => {
            this.setMessage(
                'error',
                'connect to database failed',
                true,
            )

            console.log(`get tracking data failed ${err}`);
        })
    }

    setMessage = (type, msg, isSetting) => {

        switch(type) {
            case 'success':
                this.toastId = messageGenerator.setSuccessMessage(msg)
                break;
            case 'error':
                if (isSetting && !this.toastId) {
                    this.toastId = messageGenerator.setErrorMessage(msg)
                } 
                break;
            case 'clear':
                this.toastId = null;
                toast.dismiss(this.toastId)
                break;
        }
    }

    render(){
        return  (
            <ReactTable 
                style={{maxHeight:'85vh'}}
                data={this.state.trackingData} 
                columns={this.state.trackingColunm} 
                resizable={true}
                freezeWhenExpanded={false}
                {...styleConfig.reactTable}
                pageSize={this.state.trackingData.length}
            />
        )
    }
}

export default TrackingTable;
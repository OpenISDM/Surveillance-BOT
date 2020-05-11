import React from 'react'
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
import { 
    Row, 
    Dropdown
} from 'react-bootstrap';
import _ from 'lodash';
import { AppContext } from '../../context/AppContext';
import config from '../../config';
import { getDescription } from '../../helper/descriptionGenerator';
import retrieveDataHelper from '../../helper/retrieveDataHelper';

class BatteryLevelNotification extends React.Component {
    
    static contextType = AppContext
    
    state = {
        data: [],
        locale: this.context.locale.abbr,
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr !== prevState.locale) {
            this.getTrackingData()
        }
    }

    componentDidMount = () => {
        this.getTrackingData();
    }

    getTrackingData = () => {
        let { 
            auth, 
            locale, 
            stateReducer 
        } = this.context

        let [
            {areaId}, 
        ] = stateReducer

        retrieveDataHelper.getTrackingData(
            locale.abbr,
            auth.user,
            areaId,
        )
        .then(res => {
            this.setState({
                data: res.data.filter(item => item.battery_indicator == 2),
                locale: this.context.locale.abbr
            })
        })
    }

    render() {
        const {
            data,
        } = this.state

        let { 
            locale 
        } = this.context

        const style = {
            list: {
                wordBreak: 'keep-all',
                zIndex: 1,
                overFlow: 'hidden scroll'
            },
            dropdown: {
                overflow: 'hidden scroll',
                maxHeight: '300px',
                marginBottom: 5
            },
            title: {
                background: '#8080801a',
                fontSize: '1rem',
                minWidth: 300
            },
            icon: {
                fontSize: '15px'
            }
        }

        return (
            <Dropdown>
                <Dropdown.Toggle 
                    variant='light'
                    id="battery-notice-btn"
                >
                    <i className="fas fa-bell" style={style.icon}>
                        <NotificationBadge 
                            count={data.length} 
                            effect={Effect.SCALE}
                            style={{
                                top: '-28px',
                                right: '-10px',    
                            }}
                        />
                    </i>
                </Dropdown.Toggle>
                <Dropdown.Menu
                    alignRight
                    bsPrefix='bot-dropdown-menu-right dropdown-menu '
                >
                    <div
                        className="px-5 py-2"
                        style={style.title}
                    >
                        <Row>
                            <div 
                                className='d-inline-flex justify-content-start' 
                            >   
                                {locale.texts.BATTERY_NOTIFICATION}
                            </div>
                        </Row>
                    </div>
                    <div 
                        id="batteryNoticeDiv"
                        style={style.dropdown}
                    >
                        {data.length != 0 
                            ?  (
                                data.map(item => {
                                    return (
                                        <Dropdown.Item 
                                            key={item.mac_address}
                                            disabled
                                            style={{color: "black"}}
                                        >
                                            <div 
                                                className={
                                                    null
                                                    // 'd-inline-flex justify-content-start text-left' 
                                                }
                                                style={style.list}
                                            >   
                                                <p className='d-inline-block mx-2'>&#8729;</p>
                                                {getDescription(item, locale, config)}
                                                {locale.texts.BATTERY_VOLTAGE}:{(item.battery_voltage/10).toFixed(1)}
                                            </div>
                                        </Dropdown.Item>
                                    )
                                })

                            )
                            : (
                                <Dropdown.Item 
                                    disabled
                                >
                                    {locale.texts.NO_NOTIFICATION}
                                </Dropdown.Item>
                            )
                        }
                       
                    </div>
                        
                </Dropdown.Menu>
            </Dropdown> 
        )
    }
};

export default BatteryLevelNotification


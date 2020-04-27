import React from 'react'
import NotificationBadge from 'react-notification-badge';
import { Effect } from 'react-notification-badge';
import { NavDropdown, Row, Dropdown, NavLink, DropdownButton } from 'react-bootstrap'
import _ from 'lodash'
import { AppContext } from '../../context/AppContext'
import config from '../../config'
import { getDescription } from '../../service/descriptionGenerator'
import retrieveDataHelper from '../../service/retrieveDataHelper'

class BatteryLevelNotification extends React.Component {
    
    static contextType = AppContext
    
    state = {
        runOutPowerItems: [],
        locale: this.context.locale.abbr,
    }

    componentDidUpdate = (prevProps, prevState) => {
        if (this.context.locale.abbr !== prevState.locale) {
            this.getTrackingData()
            this.setState({
                locale: this.context.locale.abbr
            })
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
                runOutPowerItems: res.data.filter(item => item.battery_indicator == 2)
            })
        })
    }

    render() {
        const {
            runOutPowerItems,
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
                fontSize: '1rem'
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
                    disabled={runOutPowerItems.length == 0}
                >
                    <i className="fas fa-bell" style={style.icon}>
                        <NotificationBadge 
                            count={runOutPowerItems.length} 
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
                        {runOutPowerItems.map(item => {
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
                        })}
                    </div>
                </Dropdown.Menu>
            </Dropdown> 
        )
    }
};

export default BatteryLevelNotification


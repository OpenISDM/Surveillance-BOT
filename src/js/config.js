import BOT_LOGO from '../img//logo/BOT_LOGO_RED.png';
import moment from 'moment';

const config = {

    version: 'v1.1 b.1869',

    TRACING_INTERVAL_UNIT: 'minutes',

    TRACING_INTERVAL_VALUE: 30,

    DEFAULT_AREA_ID: 1,
    
    DEFAULT_USER: {
        roles: 'guest',
        areas_id: [0],
        permissions:[
            'form:view',
        ],
        locale: 'tw',
        main_area: 0,
    },

    DEFAULT_LOCALE: 'tw' ,

    LOGO: BOT_LOGO,

    getLbeaconDataIntervalTime: process.env.GET_LBEACON_DATA_INTERVAL_TIME_IN_MILLI_SEC || 3600000,

    getGatewayDataIntervalTime: process.env.GET_GATEWAY_DATA_INTERVAL_TIME_IN_MILLI_SEC || 3600000,

    FOLDER_PATH: {

        trackingRecord: `tracking_record`
    },

    TIME_FORMAT: 'lll',

    defaultRole: ['care_provider'], 

    HEALTH_STATUS_MAP: {
        0: 'normal',
        9999: 'n/a',
    },

    PRODUCT_VERSION_MAP: {
        9999: 'n/a',
    },

    TOAST_PROPS: {
        position: 'bottom-right',
        autoClose: false,
        newestOnTop: false,
        closeOnClick: true,
        rtl: false,
        pauseOnVisibilityChange: true,
        draggable: true
    },

    GET_SHIFT: () => {
        const hour = moment().hours()
        if (hour < 17 && hour > 8){
            return config.shiftOption[0]
        }else if(hour < 24 && hour > 17){
            return config.shiftOption[1]
        }else{
            return config.shiftOption[2]
        }
    },

    /** Create pdf package, including header, body and the pdf path
     * options include shiftChange, searchResult, broken report, transffered report
     */
    getPdfPackage: (option, user, data, locale, signature, additional) => {
        const header = config.pdfFormat.getHeader(user, locale, option, signature, additional, data, )
        const body = config.pdfFormat.getBody[option](data, locale, user, location, signature, additional)
        const path = config.pdfFormat.getPath(option, additional).path
        const pdf = header + body
        
        return {
            pdf,
            path,
            options: config.pdfFormat.pdfOptions
        }
    },

    /** Pdf format config */
    pdfFormat: {

        getHeader: (user, locale, option, signature, additional, data) => {
            let title = config.pdfFormat.getTitle(option, locale)
            let subTitle = config.pdfFormat.getSubTitle[option](locale, user, signature, additional, data)
            return title + subTitle
        },

        getTitle: (option, locale) => {
            return `
                <h3 style='text-transform: capitalize;'>
                    ${locale.texts[config.pdfFormat.pdfTitle[option]].toUpperCase()}
                </h3>
            `
        },
    
        pdfTitle: {
            broken: 'REQUEST_FOR_DEVICE_REPARIE',
            transferred: 'DEVICE_TRANSFER_RECORD',
            shiftChange: 'SHIFT_CHANGE_RECORD',
            searchResult: 'SEARCH_RESULT',
            patientRecord: 'PATIENT_RECORD',
            trackingRecord: 'TRACKING_RECORD',
        },
    

        getPath: (option, additional) =>{
            let directory = config.FOLDER_PATH[option]
            let name = config.pdfFormat.getFileName[option](option, additional)
            let path = `${directory}/${name}`
            return {
                directory,
                name,
                path
            }
        },
    
        getFileName: {
            broken: (option) => {
                return `${option}_report_${moment().format(config.pdfFileNameTimeFormat)}.pdf`
            },
            transferred: (option) => {
                return `${option}_report_${moment().format(config.pdfFileNameTimeFormat)}.pdf`
            },
            shiftChange: (option, additional) => {
                return `${additional.name}_${moment().format(config.pdfFileNameTimeFormat)}.pdf`
            },
            searchResult: option => {
                return `${option}_${moment().format(config.pdfFileNameTimeFormat)}.pdf`
            },
            patientRecord: option => {
                return `${option}_${moment().format(config.pdfFileNameTimeFormat)}.pdf`
            },
            trackingRecord: (option, additional) => {
                return `${option}_${moment().format(config.pdfFileNameTimeFormat)}.${additional.extension}`
            }
            
        },
    
        getBody: {
            broken: (data, locale) => {
                let title = config.pdfFormat.getBodyItem.getBodyTitle('broken device list', locale)
                let list = config.pdfFormat.getBodyItem.getDataContent(data, locale)
                let notes = config.pdfFormat.getBodyItem.getNotes(data, locale)
                return title + list + notes
            },
            transferred: (data, locale, user, location,signature) => {

                let area = data[0].transferred_location_label
                let signature_title = config.pdfFormat.getBodyItem.getBodyTitle('transferred to', locale, area)
                let list_title = config.pdfFormat.getBodyItem.getBodyTitle('transferred device list', locale)
                let signatureName = config.pdfFormat.getBodyItem.getSignature(locale,signature)
                let list = config.pdfFormat.getBodyItem.getDataContent(data, locale,signature)
                let notes = config.pdfFormat.getBodyItem.getNotes(data, locale,signature)
                return signature_title + signatureName + list_title + list + notes
            },

            shiftChange: (data, locale, user) => {
                let area =  locale.texts[config.mapConfig.areaOptions[parseInt(user.areas_id[0])]]
                let foundTitle = config.pdfFormat.getBodyItem.getBodyTitle(
                    'devices found', 
                    locale, 
                    area,
                    data.searchResult.foundResult.length !== 0
                )
                let foundResultList = config.pdfFormat.getBodyItem.getDataContent(
                    data.searchResult.foundResult, 
                    locale
                )
                let notFoundTitle = config.pdfFormat.getBodyItem.getBodyTitle(
                    'devices not found', 
                    locale, 
                    area,
                    data.searchResult.notFoundResult.length !== 0
                )
                let notFoundResultList = config.pdfFormat.getBodyItem.getDataContent(
                    data.searchResult.notFoundResult, 
                    locale
                )
                let patientFoundTitle  = config.pdfFormat.getBodyItem.getBodyTitle(
                    'patients found', 
                    locale, 
                    area,
                    data.patients.foundPatients.length !== 0
                )

                let patientFoundList = config.pdfFormat.getBodyItem.getPatientContent(
                    data.patients.foundPatients, 
                    locale
                )

                let patientNotFoundTitle  = config.pdfFormat.getBodyItem.getBodyTitle(
                    'patients not found', 
                    locale, 
                    area,
                    data.patients.notFoundPatients.length !== 0
                )

                let patientNotFoundList = config.pdfFormat.getBodyItem.getPatientContent(
                    data.patients.notFoundPatients, 
                    locale
                )

                return (
                    foundTitle + 
                    foundResultList + 
                    notFoundTitle + 
                    notFoundResultList + 
                    patientFoundTitle + 
                    patientFoundList +
                    patientNotFoundTitle +
                    patientNotFoundList
                )
            },

            searchResult: (data, locale, user, location) => {
                let area =  locale.texts[config.mapConfig.areaOptions[parseInt(user.areas_id[0])]]
                let foundTitle = config.pdfFormat.getBodyItem.getBodyTitle(
                    'devices found', 
                    locale, 
                    area, 
                    data.foundResult.length !== 0
                )
                let foundResultList = config.pdfFormat.getBodyItem.getDataContent(data.foundResult, locale)
                let notFoundTitle = config.pdfFormat.getBodyItem.getBodyTitle(
                    'devices not found', 
                    locale, 
                    area,
                    data.notFoundResult.length !== 0
                )
                let notFoundResultList = config.pdfFormat.getBodyItem.getDataContent(data.notFoundResult, locale)
                return foundTitle + foundResultList + notFoundTitle + notFoundResultList
            },

            patientRecord: (data, locale, user) => {
                let title = config.pdfFormat.getBodyItem.getBodyTitle(
                    'patient historical record', 
                    locale, 
                    '',
                    true
                )
                let content = config.pdfFormat.getBodyItem.getPatientData(
                    data, 
                    locale
                )

                return title + content
            },

            trackingRecord: (data, locale, user, location, signature, additional) => {
                let table;
                switch(additional.type) {
                    case 'name':
                        table = config.pdfFormat.getBodyItem.getLocationHistoryByNameAsTable(data, locale)
                        break;
                    case 'uuid':
                        table = config.pdfFormat.getBodyItem.getLocationHistoryByUUIDAsTable(data, locale)
                }                
                return table
            },
        },
        getBodyItem: {

            getBodyTitle: (title, locale, area, hasTitle = true) => {
                return hasTitle 
                    ?   `
                        <h4 style='
                            text-transform: capitalize;
                            margin-bottom: 5px; 
                            padding-bottom: 5px;
                            border-bottom: 1px solid black;'
                        >
                            ${locale.texts[title.toUpperCase().replace(/ /g, '_')].toUpperCase()}
                            ${area ? area : ''}
                        </h4>
                    `
                    : ``;
            },
    
            getDataContent: (data, locale) => {
                return data.map((item, index) => {
                    return `
                        <div style='margin-bottom: 10px;' key=${index}>
                            ${index + 1}. 
                            &nbsp;
                            ${item.name}, 
                            ${locale.texts.LAST_FOUR_DIGITS_IN_ACN}: ${item.last_four_acn.slice(-4)}, 
                            ${locale.texts.NEAR} ${item.location_description},
                            ${item.residence_time}
                        </div>
                    `
                }).join(' ')
            },

            getLocationHistoryByName: (data, locale) => {
                return data.map((item, index) => {
                    return `
                        <div style='margin-bottom: 10px;' key=${index}>
                            ${index + 1}. 
                            &nbsp;
                            ${item.area}, 
                            ${locale.texts.LAST_FOUR_DIGITS_IN_ACN}: ${item.last_four_acn.slice(-4)}, 
                            ${locale.texts.NEAR} ${item.location_description},
                            ${item.residence_time}
                        </div>
                    `
                }).join(' ')
            },

            getLocationHistoryByNameAsTable: (dataObject, locale) => {
                let {
                    columns, 
                    data
                } = dataObject

                let headers = columns.map(field => {
                    return `
                        <th 
                            style='text-align: left'
                        >
                            ${field.Header}
                        </th>
                    `
                }).join(' ')
                return `
                    <table 
                        style='width:100%; font-size: 0.8rem;'
                    >
                        ${headers}
                        ${data.map((item, index) => {
                            return `
                                <tr>
                                    <td>${item.area}</td>
                                    <td>${item.description}</td>
                                    <td>${item.startTime}</td>
                                    <td>${item.endTime}</td>
                                    <td>${item.residenceTime}</td>
                                </tr>
                            `
                        }).join(' ')}
                    </table>
                `
            },

            getLocationHistoryByUUIDAsTable: (dataObject, locale) => {
                let {
                    columns, 
                    data
                } = dataObject

                let headers = columns.map(field => {
                    return `
                        <th
                            style='text-align: left'
                        >
                            ${field.Header}
                        </th>
                    `
                }).join(' ')
                return `
                    <table 
                        style='width:100%; font-size: 0.8rem;'
                    >
                        ${headers}
                        ${data.map((item, index) => {
                            return `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${item.name}</td>
                                    <td>${item.mac_address}</td>
                                    <td>${item.area}</td>
                                    <td>${item.description}</td>
                                </tr>
                            `
                        }).join(' ')}
                    </table>
                `
            },

            getPatientContent: (data, locale) => {
                return data.map((item, index) => {
                    return `
                        <div style='margin-bottom: 10px;' key=${index}>
                            ${index + 1}. 
                            &nbsp;
                            ${item.name}, 
                            ${locale.texts.LAST_FOUR_DIGITS_IN_ACN}: ${item.last_four_acn.slice(-4)}, 
                            ${locale.texts.NEAR} ${item.location_description},
                            ${item.residence_time}
                        </div>
                    `
                }).join(' ')
            },

            getPatientData: (data, locale) => {
                return data.records.map((item, index) => {
                    return `
                        <div style='margin-bottom: 15px;' key=${index}>
                            <div 
                                style='margin-bottom: 5px; margin-top: 0px;'
                            >
                                &bull;
                                <div
                                    style='display: inline-block'
                                >
                                    ${item.recorded_user}
                                </div>
                                &nbsp;
                                <div style='font-size: 0.8em;display: inline-block;'>
                                    ${moment(item.created_timestamp).locale(locale.abbr).format('lll')}
                                </div>
                            </div>
                            <div 
                                style='text-align: justify;text-justify:inter-ideograph;font-size: 0.8em'
                                class='text-muted'
                            >
                                ${item.record}
                            </div>
                        </div>
                    `
                }).join(' ')
            },
    
            getNotes: (data, locale) => {
                return `
                    <h3 style='text-transform: capitalize; margin-bottom: 5px; font-weight: bold'>
                        ${data[0].notes ? `${locale.texts.NOTE}:` : ''}
                    </h3>
                    <div style='margin: 10px;'>
                        ${data[0].notes ? data[0].notes : ''}
                    </div>
                `
            },

            getSignature: (locale,signature) => {
                return `
                    <div style='text-transform: capitalize; margin: 10px width: 200px;'>
                        <div style='text-transform: capitalize; margin: 10px width: 100%;'>
                            <p style='display: inline'>${locale.texts.RECEIVER_ID}:</p>
                            <input 
                                style='
                                    width: 100%; 
                                    border-bottom: 1px solid black; 
                                    border-top: 0;
                                    border-left: 0;
                                    border-right: 0;
                                    display: inline-block'
                            />
                        </div>
                        <div style='text-transform: capitalize; margin: 10px width: 100%;'>
                            <p style='display: inline'>${locale.texts.RECEIVER_NAME}:</p>
                            <input 
                                style='
                                    width: 100%; 
                                    border-bottom: 1px solid black; 
                                    border-top: 0;
                                    border-left: 0;
                                    border-right: 0;
                                    display: inline-block'
                            />   
                        </div>
                        <div style='text-transform: capitalize; margin: 10px width: 100%;'>
                            <p style='display: inline'>${locale.texts.RECEIVER_SIGNATURE}:</p>
                            <input 
                                style='
                                    width: 100%; 
                                    border-bottom: 1px solid black; 
                                    border-top: 0;
                                    border-left: 0;
                                    border-right: 0;
                                    display: inline-block';
                                    value = ${signature}
                            />                  
                        </div>
                    </div>
                `
            }
        },
    
        getSubTitle: {
            shiftChange: (locale, user, signature, shiftOption) => {
                let timestamp = config.pdfFormat.getTimeStamp(locale)

                const lastShiftIndex = (config.shiftOption.indexOf(shiftOption.value) + 2) % config.shiftOption.length
                const lastShift = locale.texts[config.shiftOption[lastShiftIndex].toUpperCase().replace(/ /g, '_')]
                const thisShift = shiftOption.label
                let shift = `<div style='text-transform: capitalize;'>
                        ${locale.texts.SHIFT}: ${lastShift} ${locale.texts.SHIFT_TO} ${thisShift}
                    </div>`
                let confirmedBy = `<div style='text-transform: capitalize;'>
                    ${locale.abbr == 'en' 
                        ? `${locale.texts.CONFIRMED_BY} ${signature}`
                        : `${locale.texts.CONFIRMED_BY}: ${signature}`
                    }
                </div>`
                let checkby = `<div style='text-transform: capitalize;'>
                        ${locale.texts.DEVICE_LOCATION_STATUS_CHECKED_BY}: ${user.name}, ${shiftOption.label}
                    </div>`
                return timestamp + confirmedBy + shift + checkby
            },
    
            searchResult: (locale, user) => {
                let timestamp = config.pdfFormat.getTimeStamp(locale)
                let username = config.pdfFormat.getSubTitleInfo.username(locale, user)
                return timestamp + username
            },
            broken: (locale, user) => {
                let timestamp = config.pdfFormat.getTimeStamp(locale)
                let username = config.pdfFormat.getSubTitleInfo.username(locale, user)
                return timestamp + username
            },
            transferred: (locale, user) => {
                let timestamp = config.pdfFormat.getTimeStamp(locale)
                let username = config.pdfFormat.getSubTitleInfo.username(locale, user)
                return timestamp + username
            },

            patientRecord: (locale, user, name, additional, data) => {
                let timestamp = config.pdfFormat.getTimeStamp(locale)
                let patientName = config.pdfFormat.getSubTitleInfo.patientName(locale, data)
                let providerName = config.pdfFormat.getSubTitleInfo.providerName(locale, data)
                let patientID = config.pdfFormat.getSubTitleInfo.patientID(locale, data)
                return timestamp + patientName + patientID + providerName
            },

            trackingRecord: (locale, user, name, additional, data) => {
                let {
                    key,
                    startTime,
                    endTime,
                    mode,
                } = additional

                let timestamp = config.pdfFormat.getTimeStamp(locale)
                key = config.pdfFormat.getSubTitleInfo.field(locale, 'KEY', key)
                startTime = config.pdfFormat.getSubTitleInfo.field(locale, 'START_TIME', startTime)
                endTime = config.pdfFormat.getSubTitleInfo.field(locale, 'END_TIME', endTime)

                return timestamp + key + startTime + endTime
            }
        },
    
        getSubTitleInfo: {
            username: (locale, user) => {
                return `
                    <div style='text-transform: capitalize;'>
                        ${locale.texts.USERNAME}: ${user.name}
                    </div>
                `
            },
            patientName: (locale, object) => {
                return `
                    <div style='text-transform: capitalize;'>
                        ${locale.texts.PATIENT_NAME}: ${object.name}
                    </div>
                `
            },
            patientID: (locale, object) => {
                return `
                    <div style='text-transform: capitalize;'>
                        ${locale.texts.PATIENT_NUMBER}: ${object.asset_control_number}
                    </div>
                `
            },
            providerName: (locale, object) => {
                return `
                    <div style='text-transform: capitalize;'>
                        ${locale.texts.PHYSICIAN_NAME}: ${object.physician_name}
                    </div>
                `
            },
            startTime: (locale, value) => {
                return `
                    <div style='text-transform: capitalize;'>
                        ${locale.texts.START_TIME}: ${value}
                    </div>
                `
            },
            field: (locale, key, value) => {
                return `
                    <div style='text-transform: capitalize;'>
                        ${locale.texts[key]}: ${value}
                    </div>
                `
            }
        },

        /** The pdf option setting in html-pdf */
        pdfOptions: {
            'format': 'A4',
            'orientation': 'portrait',
            'border': '1cm',
            'timeout': '12000'
        },

        getTimeStamp: (locale) => {
            return `
                <div style='text-transform: capitalize;'>
                    ${locale.texts.DATE_TIME}: ${moment().locale(locale.abbr).format('LLL')}
                </div>
            `
        },
    },
}

export default config


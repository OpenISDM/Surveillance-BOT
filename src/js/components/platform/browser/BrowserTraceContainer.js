import React, { Fragment } from 'react';
import { DateTimePicker } from 'react-widgets';
import momentLocalizer from 'react-widgets-moment';
import 'react-table/react-table.css'; 
import { 
    Formik,
} from 'formik';
import * as Yup from 'yup';
import { 
    Nav,
    Breadcrumb,
} from 'react-bootstrap';
import styleConfig from '../../../config/styleConfig';
import 'react-tabs/style/react-tabs.css';
import ReactTable from 'react-table';
import moment from 'moment';
import {
    BOTNavLink,
    BOTNav,
    NoDataFoundDiv,
    BOTContainer,
    PrimaryButton
} from '../../BOTComponent/styleComponent';
import Loader from '../../presentational/Loader';
import Select from 'react-select';
import {
    PageTitle
} from '../../BOTComponent/styleComponent';
import IconButton from '../../BOTComponent/IconButton';
import styleSheet from '../../../config/styleSheet';
import config from '../../../config';
import LocaleContext from '../../../context/LocaleContext';

momentLocalizer()

const BrowseTraceContainer = React.forwardRef(({
    getInitialValues,
    breadIndex,
    data,
    histories,
    setState,
    navList,
    handleClick,
    options,
    columns,
    getLocationHistory,
    onRowClick
}, ref) => {
    const locale = React.useContext(LocaleContext);
    const timeValidatedFormat = 'YYYY/MM/DD HH:mm:ss'

    let initialValues = getInitialValues()

    return (
        <BOTContainer
        >
            <div className='d-flex justify-content-between'>
                <PageTitle>                                            
                    {locale.texts.TRACKING_HISTORY}
                </PageTitle>
                {data.length !== 0 &&
                    <div>
                        <IconButton
                            iconName='fas fa-download'
                            name='exportPDF'
                            onClick={handleClick}
                        >
                            {locale.texts.EXPORT_PDF}
                        </IconButton>
                        <IconButton
                            iconName='fas fa-download'
                            name='exportCSV'
                            onClick={handleClick}
                        >
                            {locale.texts.EXPORT_CSV}
                        </IconButton>
                    </div>
                }
            </div>
            <Formik     
                initialValues={initialValues}

                ref={ref}

                initialStatus={config.AJAX_STATUS_MAP.WAIT_FOR_SEARCH}
                
                validateOnChange={false}

                validateOnBlur={false}
                
                validationSchema = {
                    Yup.object().shape({

                        key: Yup.object()
                            .nullable()
                            .required(locale.texts.REQUIRED),
                            // .when('mode', {
                            //     is: 'mac',
                            //     then: Yup.string().test(
                            //         'mode', 
                            //         locale.texts.MAC_ADDRESS_FORMAT_IS_NOT_CORRECT,
                            //         value => {  
                            //             if (value == undefined) return false
                            //             let pattern = new RegExp('^[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}:?[0-9a-fA-F]{2}$');
                            //             return value.match(pattern)
                            //         }
                            //     )
                            // })
                            // .when('mode', {
                            //     is: 'uuid',
                            //     then: Yup.object().test(
                            //         'uuid', 
                            //         locale.texts.LBEACON_FORMAT_IS_NOT_CORRECT,
                            //         value => {  
                            //             if (value == undefined) return false
                            //             let pattern = new RegExp('^[0-9A-Fa-f]{8}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{4}-?[0-9A-Fa-f]{12}$');
                            //             return value.value.match(pattern)
                            //         }
                            //     )
                            // }),

                        startTime: Yup.string()
                            .required(locale.texts.START_TIME_IS_REQUIRED)
                            .test(
                                'startTime', 
                                locale.texts.TIME_FORMAT_IS_INCORRECT,
                                value => {   
                                    let test = moment(value).format(timeValidatedFormat)
                                    return moment(test, timeValidatedFormat, true).isValid() 
                                }
                            ),

                        endTime: Yup.string()
                            .required(locale.texts.END_TIME_IS_REQUIRED)
                            .test(
                                'endTime', 
                                locale.texts.TIME_FORMAT_IS_INCORRECT,
                                value => {  
                                    let test = moment(value).format(timeValidatedFormat)
                                    return moment(test, timeValidatedFormat, true).isValid()
                                }
                            ),
                })}

                onSubmit={(values) => {   
                    getLocationHistory({
                        ...values,
                        description: values.key.description
                    }, breadIndex + 1)
                }}
            
                render={({ 
                    values, 
                    errors, 
                    status, 
                    touched, 
                    isSubmitting, 
                    setFieldValue, 
                    submitForm, 
                }) => (
                    <Fragment>
                        {console.log(breadIndex)}
                        <Breadcrumb 
                            className='my-2'
                        >
                            {histories.map((history, index) => { 
                                return ( 
                                    <Breadcrumb.Item
                                        key={index}
                                        active={breadIndex == index}
                                        name='bread'
                                        // onClick={(e) => {

                                        //     setFieldValue('mode', history.mode)
                                        //     setFieldValue('key', history.key) 
                                        //     setFieldValue('startTime', moment(history.startTime).toDate())
                                        //     setFieldValue('endTime', moment(history.endTime).toDate())
                                        //     setState({
                                        //         data: history.data,
                                        //         columns: history.columns,
                                        //         breadIndex: index
                                        //     })
                                        // }}
                                    >
                                        {history.description}
                                    </Breadcrumb.Item>
                                )
                            })}
                        </Breadcrumb>
                        <BOTNav>
                            {navList.map((nav, index) => {
                                return (
                                    <Nav.Item
                                        key={index}
                                    >
                                        <BOTNavLink 
                                            eventKey={nav.mode}
                                            active={values.mode == nav.mode}                               
                                            onClick={handleClick}
                                            name='nav'
                                        >
                                            {locale.texts[nav.name.toUpperCase().replace(/ /g, '_')]}
                                        </BOTNavLink>
                                    </Nav.Item>
                                )
                            })}
                        </BOTNav>
                        <div className='d-flex justify-content-between my-4'>
                            <div className='d-flex justify-content-start'>
                                <div
                                    className='mx-2'
                                    style={{
                                        position: 'relative'
                                    }}
                                >
                                    <Select
                                        name='key'
                                        value={values.key}
                                        className='float-right'
                                        onChange={(value) => { 
                                            setFieldValue('key', value)
                                        }}
                                        isClearable={true}
                                        isSearchable={true}
                                        options={options[values.mode]}
                                        styles={styleConfig.reactSelectSearch}
                                        components={styleConfig.reactSelectSearchComponent}         
                                        placeholder={locale.texts[`SEARCH_FOR_${values.mode.toUpperCase()}`]}                           
                                    />
                                    {errors.key && (
                                        <div 
                                            className='text-left'
                                            style={{
                                                fontSize: '0.6rem',
                                                color: styleSheet.warning,
                                                position: 'absolute',
                                                left: 0,
                                                bottom: -18,
                                            }}
                                        >
                                            {errors.key}
                                        </div>
                                    )}
                                </div>
                                
                                <div
                                    className='mx-2'
                                    style={{
                                        position: 'relative'
                                    }}
                                > 
                                    <DateTimePicker 
                                        name='startTime'
                                        className='mx-2'
                                        value={values.startTime} 
                                        onkeydown="return false"
                                        onChange={(value) => { 
                                            value != null ?
                                            setFieldValue('startTime', moment(value).toDate())
                                            : setFieldValue('startTime', undefined)
                                        }}  
                                    
                                        placeholder={locale.texts.START_TIME} 
                                    />

                                    {errors.startTime && (
                                    <div 
                                        className='text-left'
                                        style={{
                                            fontSize: '0.6rem',
                                            color: styleSheet.warning,
                                            position: 'absolute',
                                            left: 10,
                                            bottom: -18,
                                        }}
                                    >
                                        {errors.startTime}
                                    </div>
                                )}

                                </div>


                                <div
                                    className='mx-2'
                                    style={{
                                        position: 'relative'
                                    }}
                                >
                                

                                <DateTimePicker 
                                    name='endTime'
                                    className='mx-2'
                                    value={values.endTime}
                                    onChange={(value) => { 
                                        value != null ?
                                        setFieldValue('endTime', moment(value).toDate())
                                        : setFieldValue('endTime', undefined)
                                    }} 
                                    placeholder={locale.texts.END_TIME}
                                />
                                    {errors.endTime && (
                                    <div 
                                        className='text-left'
                                        style={{
                                            fontSize: '0.6rem',
                                            color: styleSheet.warning,
                                            position: 'absolute',
                                            left: 10,
                                            bottom: -18,
                                        }}
                                    >
                                        {errors.endTime}
                                    </div>
                                )}

                                </div>
                            </div>
                            <div
                                className='d-flex align-items-center'
                            >
                                <PrimaryButton
                                    type='button' 
                                    onClick={submitForm}
                                >
                                    {locale.texts.SEARCH}
                                </PrimaryButton>
                            </div>
                        </div>
                        
                        {status == config.AJAX_STATUS_MAP.LOADING && <Loader />}

                        <hr/>
                        {data.length != 0 ? 
                            (
                                <ReactTable
                                    keyField='id'
                                    data={data}
                                    columns={columns}
                                    className='-highlight'
                                    style={{maxHeight: '65vh'}} 
                                    {...styleConfig.reactTable}
                                    getTrProps={onRowClick}
                                />
                            )
                            :   <NoDataFoundDiv>{locale.texts[status.toUpperCase().replace(/ /g, '_')]}</NoDataFoundDiv>
                        }         
                    </Fragment>
                )}
            />
        </BOTContainer>
    )
})

export default BrowseTraceContainer

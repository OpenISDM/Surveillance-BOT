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

const TabletTraceContainerView = React.forwardRef(({
    getInitialValues,
    breadIndex,
    data,
    histories,
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
                        <Breadcrumb 
                            className='my-2'
                        >
                            {histories.map((history, index) => {
                                return (
                                    <Breadcrumb.Item
                                        key={index}
                                        active={breadIndex == index}
                                        name='bread'
                                        data={JSON.stringify({
                                            history,
                                            index
                                        })}
                                        onClick={handleClick}
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
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                fontSize: '1rem',
                                                minHeight: '3rem',
                                                position: 'none',
                                                width: '300px',
                                                borderRadius: 0                                
                                            }),
                                            valueContainer: base => ({
                                                ...base,
                                                paddingLeft: 35
                                            }),
                                        }}
                                        options={options[values.mode]}
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
                                <DateTimePicker 
                                    name='startTime'
                                    className='mx-2'
                                    value={values.startTime} 
                                    onkeydown="return false"
                                    onChange={(value) => { 
                                        value != null ?
                                        setFieldValue('startTime', moment(value).toDate())
                                        : null
                                    }}  
                                
                                    placeholder={locale.texts.START_TIME} 
                                />
                                <DateTimePicker 
                                    name='endTime'
                                    className='mx-2'
                                    value={values.endTime}
                                    onChange={(value) => { 
                                        value != null ?
                                        setFieldValue('endTime', moment(value).toDate())
                                        : null
                                    }} 
                                    placeholder={locale.texts.END_TIME}
                                />
                            
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

export default  TabletTraceContainerView

import React from 'react';
import { Alert } from 'react-bootstrap'
import { AppContext } from '../../context/AppContext';
import {
    BrowserView,
    TabletView,
    MobileOnlyView
} from 'react-device-detect'

const style = {
    alertText: {
        fontSize: '1.2rem',
        fontWeight: 700
    },
    alertTextTitle: {
        fontSize: '1.2rem',
        color: 'rgba(101, 111, 121, 0.78)',
    },
    alerTextTitleForTablet: {
        fontSize: '1.2rem',
        fontWeight: 500,
        color: 'black'
    }
}

const InfoPrompt = ({
    searchKey,
    searchResult,
}) => {
    const appContext = React.useContext(AppContext);
    const { locale } = appContext
    return (
        <div>
            <BrowserView>
                <Alert variant='secondary' className='d-flex justify-content-start'>
                    <div 
                        className='text-capitalize mr-2' 
                        style={style.alertTextTitle}
                    >
                        {searchKey ? locale.texts.FOUND : locale.texts.PLEASE_SELECT_SEARCH_OBJECT}
                    </div>
                    <div 
                        className="mr-1"
                        style={style.alertText}
                    >
                        {searchKey ? searchResult.filter(item => item.found).length : ""}
                    </div>
                    <div >
                        {searchKey && locale.texts.OBJECTS}
                    </div>
                        {searchKey && <div>&nbsp;</div> }
                    <div 
                        className='text-capitalize mr-2' 
                        style={style.alertTextTitle}
                    >
                        {searchKey && `${locale.texts.NOT_FOUND}`}
                    </div>
                    <div 
                        className="mr-1"
                        style={style.alertText}
                    >
                        {searchKey ? searchResult.filter(item => !item.found).length : ""}
                    </div>
                    <div >
                        {searchKey && locale.texts.OBJECTS}
                    </div>
                </Alert>
            </BrowserView>
            <TabletView>
                <div>
                    <div className='text-capitalize' style={style.alerTextTitleForTablet}>{searchKey ? locale.texts.FOUND : locale.texts.PLEASE_SELECT_SEARCH_OBJECT}</div>
                    <div className='text-capitalize' style={style.alerTextTitleForTablet}>{searchKey ? searchResult.filter(item => item.found).length : ""}</div>
                    <div className='text-capitalize' style={style.alerTextTitleForTablet}>{searchKey 
                            ?   
                                locale.texts.OBJECTS
                            :   ""
                        }</div>
                </div>
            </TabletView>
        </div>
    )

}

export default InfoPrompt
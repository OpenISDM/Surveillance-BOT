import React from 'react';
import LocaleContext from "../../../context/LocaleContext";
import styleConfig from '../../../config/styleConfig';
import BOTInput from '../../presentational/BOTInput';
import { 
    ButtonToolbar,
} from 'react-bootstrap';
import Select from 'react-select';
import {
    PrimaryButton
} from '../../BOTComponent/styleComponent';
import AccessControl from '../../presentational/AccessControl';


const BrowserObjectTableView = ({
    addObjectFilter,
    removeObjectFilter,
    filterSelection,
    handleClickButton,
    selection,
    handleClick
}) => {
    const locale = React.useContext(LocaleContext)

    return (
        <div className='d-flex justify-content-between my-4'>
            <div className='d-flex justify-content-start'>                    
                <BOTInput
                    className='mx-2'
                    placeholder={locale.texts.SEARCH}
                    getSearchKey={(key) => {
                        addObjectFilter(
                            key, 
                            ['name', 'area', 'macAddress', 'acn'], 
                            'search bar'
                        )
                    }}
                    clearSearchResult={null}                                        
                />
                <AccessControl
                    renderNoAccess={() => null}
                    platform={['browser']}
                >
                    <Select
                        className='mx-2 text-capitalize'
                        styles={styleConfig.reactSelectFilter}
                        onChange={(value) => {
                            if(value){
                                addObjectFilter(value.label, ['area'], 'area select')
                            }else{
                                removeObjectFilter('area select')
                            }
                        }}
                        options={filterSelection.areaSelection}
                        isClearable={true}
                        isSearchable={true}
                        placeholder={locale.texts.SELECT_AREA}
                    />
                </AccessControl>
            </div>
            <AccessControl
                renderNoAccess={() => null}
                platform={['browser', 'tablet']} 
            >
                <ButtonToolbar>
                    <PrimaryButton
                        className='text-capitalize mr-2 mb-1'
                        name='associate'
                        onClick={handleClickButton}
                    >
                        {locale.texts.ASSOCIATE}
                    </PrimaryButton>
                    <PrimaryButton
                        className='text-capitalize mr-2 mb-1'
                        onClick={handleClick}
                    >
                        {locale.texts.ADD}
                    </PrimaryButton>
                    <PrimaryButton
                        className='text-capitalize mr-2 mb-1'
                        name='delete'
                        onClick={handleClickButton}
                        disabled={selection.length == 0}
                    >
                        {locale.texts.DELETE}
                    </PrimaryButton>
                </ButtonToolbar>
            </AccessControl>
        </div>
    )
}

export default BrowserObjectTableView
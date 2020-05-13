import React, {Fragment} from 'react';
import { 
    Button,
    Col, 
    Row, 
} from 'react-bootstrap';
import ScrollArea from 'react-scrollbar';
import AccessControl from '../../presentational/AccessControl';
import SearchResultListGroup from '../../presentational/SearchResultListGroup'
import LocaleContext from '../../../context/LocaleContext';
import {
    ListTitle
} from '../../BOTComponent/styleComponent';

const style = {
    noResultDiv: {
        color: 'grey',
        fontSize: '1rem',
    },
    list: {
        maxHeight: '60vh',
        overflow:  'hidden scroll'
    }
}

const BrowserSearchResultList = ({
    searchResult,
    title,
    selection,
    handleToggleNotFound,
    showNotFoundResult,
    onSelect
}) => {

    let locale = React.useContext(LocaleContext);
    return (
        <Fragment>
            <Row className='d-flex justify-content-center'>
                <ListTitle>
                    {title}
                </ListTitle>
            </Row>
            <Row>
                {searchResult.length == 0 
                    ?   <Col className='d-flex justify-content-center font-weight-lighter' style={style.noResultDiv}>
                            {locale.texts.NO_RESULT}
                        </Col> 
                    :   
                        <Col 
                            className="d-flex justify-content-center"
                            style={style.list}
                        >
                            <ScrollArea 
                                smoothScrolling={true}
                                horizontal={false}
                            >                 
                                <AccessControl
                                    permission={'form:edit'}
                                    renderNoAccess={() => (
                                        <SearchResultListGroup 
                                            data={searchResult}
                                            selection={selection}
                                        />
                                    )}
                                >
                                    <SearchResultListGroup 
                                        data={searchResult}
                                        onSelect={onSelect}
                                        selection={selection}
                                        action
                                    />

                                </AccessControl>
                            </ScrollArea>
                        </Col>
                }
            </Row>
            <Row className='d-flex justify-content-center mt-3'>
                <Button
                    variant="link"
                    onClick={handleToggleNotFound}
                    size="lg"
                    disabled={false}
                >
                    {showNotFoundResult
                        ? locale.texts.SHOW_SEARCH_RESULTS_FOUND
                        : locale.texts.SHOW_SEARCH_RESULTS_NOT_FOUND
                    }
                </Button>
            </Row>
        </Fragment>
    )
}

export default BrowserSearchResultList


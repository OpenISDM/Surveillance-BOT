import React from 'react';
import { 
    Button,
    Col, 
    Row, 
} from 'react-bootstrap';
import ScrollArea from 'react-scrollbar';
import AccessControl from '../../presentational/AccessControl';
import SearchResultListGroup from '../../presentational/SearchResultListGroup'
import LocaleContext from '../../../context/LocaleContext';

const SearchResult = ({
    searchKey,
    searchResult,
    title,
    selection,
    handleToggleNotFound,
    showNotFoundResult,
    onSelect
}) => {

    let locale = React.useContext(LocaleContext)

    const style = {
        noResultDiv: {
            color: 'grey',
            fontSize: '1rem',
        },
        titleText: {
            color: 'rgb(80, 80, 80, 0.9)',
        }, 
        searchResultListForTablet: {
            dispaly: searchKey ? null : 'none',
            maxHeight: '28vh'
        }
    }
    

    return(
        <div>
            <div>
                <Row className='d-flex justify-content-center' style={style.titleText}>
                    <h4>
                        {title}
                    </h4>
                </Row>
                <Row>
                    {searchResult.length === 0 
                        ?   <Col className='d-flex justify-content-center font-weight-lighter' style={style.noResultDiv}>
                                <div className='searchResultForDestop'>{locale.texts.NO_RESULT}</div>
                            </Col> 
                        :   
                            <Col className="searchResultListGroupForTablet d-flex justify-content-center">
                                <ScrollArea 
                                    style={style.searchResultListForTablet} 
                                    smoothScrolling={true}
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
            </div>
        </div>
    )
}



export default SearchResult

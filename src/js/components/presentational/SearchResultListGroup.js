import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import config from '../../config';
import { AppContext } from '../../context/AppContext';
import { 
    getDescription, 
    getMacaddress,
    getRSSI 
} from '../../helper/descriptionGenerator';
import AccessControl from './AccessControl';


const SearchResultListGroup = ({
    data,
    onSelect,
    selection,
    action
}) => {

    const { locale } = React.useContext(AppContext);
   
    const style = {

        item: {
            minWidth: 35,
        },
        listGroup: {
            color: 'rgb(33, 37, 41)',
        }
    }

    const dataToLink = (data) => {
        return ({
            pathname: '/page/trace',
            state: {
                key: {
                    value: data.name,
                    label: data.name,
                    description: data.name
                },
                mode: 'name'
            }
        })
    }

    return (
        <ListGroup 
            onSelect={onSelect} 
        >
            {data.map((item,index) => {
                let element = 
                    <Link 
                        to={dataToLink(item)}
                        eventKey={item.found + ':'+ index} 
                        key={index} 
                        action={action}
                        active
                        style={style.listGroup}
                        className='d-flex py-1 text-left justify-content-start' 

                    >   
                        <div 
                            style={style.item}
                            className='d-flex justify-content-center'
                        >
                            <p className='d-inline-block'>{index + 1}.</p>
                        </div>
                        {getDescription(item, locale, config)}
                        {
                            <AccessControl
                                permission={'form:develop'}
                                renderNoAccess={() => null}
                            >
                                {`|${getMacaddress(item, locale)}`}
                            </AccessControl>
                        }
                        {
                            <AccessControl
                                permission={'form:develop'}
                                renderNoAccess={() => null}
                            >
                                {`|${getRSSI(item, locale)}`}
                            </AccessControl>
                        }
                    </Link>
                return element
            })}
        </ListGroup>
    )
}

export default SearchResultListGroup
import React from 'react';
import BOTLogo from '../../../img/BOTLogo.png'



const ListItem = (props) => {

    const { itemName } = props

    return (            
            <div className='listItem list-group-item list-group-item-action d-flex w-100 justify-content-between'>
                <div >
                    <div className="d-flex w-100 justify-content-between">
                        <h4 className="mb-1">{itemName}</h4>
                        <small></small>
                    </div>
                    <p className="mb-1"> </p>
                    <small></small>
                </div> 
                <div>
                    <span className="pull-left ">
                        <img src={BOTLogo} width={100} className="img-reponsive img-rounded" />
                    </span>
                </div>
            </div>

    );
};

export default ListItem

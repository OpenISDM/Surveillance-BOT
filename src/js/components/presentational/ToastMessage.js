import React from 'react'
import LocaleContext from '../../context/LocaleContext'

const ToastMessage = ({
    msg,
}) => {
    const locale = React.useContext(LocaleContext);
    return (
        <div >
            {locale.texts[msg.toUpperCase().replace(/ /g, '_')]}
        </div>
    )
}

export default ToastMessage
import React from 'react';

const LocaleContext = React.createContext({

    /** set the current locale */
    lang: "",

    /** store all the locale text package */
    texts: {},

    /** to change the current locale */
    changeLocale: () => {},

    /** to toggle the current locale when there area only two locale options */
    toggleLang: () => {},
});

export default LocaleContext;
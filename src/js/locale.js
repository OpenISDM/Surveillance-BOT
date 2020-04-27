import tw from '../locale/zh-TW';
import en from '../locale/en-US';
import siteModuleLocaleEn from '../../site_module/locale/en-US'
import siteModuleLocaleTw from '../../site_module/locale/zh-TW'
import React from 'react'
import LocaleContext from './context/LocaleContext'
import config from './config';
import { 
    setLocaleID,
} from "../js/dataSrc"
import axios from 'axios';
import Cookies from 'js-cookie';

const supportedLocale = {
    tw: {
        name:'中文',
        lang: 'tw',
        abbr: 'zh-tw',
        texts: {
            ...tw,
            ...siteModuleLocaleTw,
        },
    },
    en: {
        name:'English',
        lang: 'en',
        abbr: 'en',
        texts: {
            ...en,
            ...siteModuleLocaleEn,
        }    
    }
}


class Locale extends React.Component {

    state = {
        lang:  Cookies.get('authenticated') ? JSON.parse(Cookies.get('user')).locale : config.locale.defaultLocale,
        texts: Cookies.get('authenticated') ? supportedLocale[JSON.parse(Cookies.get('user')).locale].texts : supportedLocale[config.locale.defaultLocale].texts,
        abbr:  Cookies.get('authenticated') ? supportedLocale[JSON.parse(Cookies.get('user')).locale].abbr : supportedLocale[config.locale.defaultLocale].abbr,
    }

    changeTexts = (lang) => {
        return supportedLocale[lang].texts;
    }

    changeAbbr = (lang) => {
        return supportedLocale[lang].abbr;
    }

    toggleLang = () => {
        const langArray = Object.keys(supportedLocale)
        const nextLang = langArray.filter(item => item !== this.state.lang).pop()
        return {
            nextLang,
            nextLangName: supportedLocale[nextLang].name
        }
    }


    changeLocale = (e,auth) => {
        const nextLang = this.toggleLang().nextLang

        axios.post(setLocaleID, {
            userID: auth.user.id,
            lang: nextLang
        })
        .then(resSet => {
            Cookies.set('user', {
                ...JSON.parse(Cookies.get('user')),
                locale: nextLang
            })
        })
        .catch(err => {
            console.log(`set locale fail ${err}`)
        })

        this.setState({
            lang: nextLang,
            texts: this.changeTexts(nextLang),
            abbr: this.changeAbbr(nextLang),            
        })
    }
    

    reSetState = (lang) => {
        this.setState({
            lang,
            texts: this.changeTexts(lang),
            abbr: this.changeAbbr(lang),            
        })
    }


    render() {
        const localeProviderValue = {
            ...this.state,
            changeLocale: this.changeLocale,
            toggleLang: this.toggleLang,
            reSetState : this.reSetState,
        };

       
        return (
            <LocaleContext.Provider value={localeProviderValue}>
                {this.props.children}
            </LocaleContext.Provider>
        )
    }

}

export default Locale;



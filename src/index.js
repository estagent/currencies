import {mergeOptions} from '@revgaming/helpers'
import {mergeTranslations} from '@revgaming/languages'
import {config} from '@revgaming/config'
import {getCountry} from '@revgaming/location'

import Preference from '@revgaming/preference'
import translations from './lang'
import currencies from './currencies'

let options

export const bootCurrencies = opts => {
    options = mergeOptions(opts, {
        iconMainClass: 'icon',
        iconPrefix: 'ia-',
    })
    mergeTranslations('currencies', translations)
    detectCurrencyCode()
    return {
        currency_id: currency_id,
        currency_code: currency_code,
        currency_name: currency_name,
        currency_icon: currency_icon,
        getCurrencies: getCurrencies,
    }
}

export const currency_id = code => {
    return code ? currencies[code] : currency_id(currency_code())
}

export const currency_code = id => {
    if (id) {
        for (let currency_code of Object.keys(currencies)) {
            if (currencies[currency_code] === id) return currency_code
        }
        throw `currency id unknown ${id}`
    }
    return Preference.get('currency', config('app.currency'))
}

export const currency_name = code =>
    __('currencies.codes.'.concat(code ? code : currency_code()))

export const currency_icon = code => {
    return options.iconMainClass
        .concat(' ')
        .concat(options.iconPrefix)
        .concat(code ?? currency_code())
}

export const currency = code => {
    if (!code) code = currency_code()
    return {
        id: currencies[code],
        code: code,
        name: currency_name(code),
        class: currency_icon(code),
    }
}

export const setCurrencyCode = code => {
    if (code && Object.keys(currencies).includes(code)) {
        config({'app.currency': code})

        return true
    }
    return false
}

export const getCurrencies = codes => {
    const arr = []
    for (let code of Object.keys(currencies)) {
        if (codes) {
            if (codes.includes(code)) arr.push(currency(code))
        } else {
            arr.push(currency(code))
        }
    }
    return arr
}

const detectCurrencyCode = () => {
    if (setCurrencyCode(Preference.get('currency'))) return true
    else {
        const country = getCountry()
        return setCurrencyCode(
            country
                ? country.curr
                : config('app.fallback_currency', config('app.currency')),
        )
    }
}

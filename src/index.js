import Preference from '@revgaming/preference';
import {mergeOptions} from '@revgaming/helpers';
import translations from './lang';
import currencies from './currencies';

let options;
let __currency;

const defaults = {
    iconMainClass: 'icon',
    iconPrefix: 'ia-',
};

const currency_id = (code) => {
    return code ? currencies[code] : currency_id(currency_code());
};

const currency_code = (id) => {
    if (id) {
        for (let currency_code of Object.keys(currencies)) {
            if (currencies[currency_code] === id) return currency_code;
        }
        throw `currency id unknown ${id}`;
    }
    return Preference.get('currency', __currency);
};

const currency_name = (code) =>
    __('currencies.codes.'.concat(code ? code : currency_code()));

const currency_icon = (code) => {
    return options.iconMainClass
        .concat(' ')
        .concat(options.iconPrefix)
        .concat(code ?? currency_code());
};

const currency = (code) => {
    if (!code) code = currency_code();
    return {
        id: currencies[code],
        code: code,
        name: currency_name(code),
        class: currency_icon(code),
    };
};

const setCurrencyCode = (code) => {
    if (code && Object.keys(currencies).includes(code)) {
        __currency = code;
        return true;
    }
    return false;
};

export default function (opts) {
    options = mergeOptions(opts, defaults);

    if (window['mergeTranslations'])
        mergeTranslations('currencies', translations);

    return {
        currencies: (codes) => {
            const arr = [];
            for (let code of Object.keys(currencies)) {
                if (codes) {
                    if (codes.includes(code)) arr.push(currency(code));
                } else {
                    arr.push(currency(code));
                }
            }
            return arr;
        },
        currency: currency,
        currency_id: currency_id,
        currency_code: currency_code,
        currency_name: currency_name,
        currency_icon: currency_icon,
        setCurrencyCode: setCurrencyCode,
    };
}

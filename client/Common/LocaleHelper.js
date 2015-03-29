/// <reference path="Collection.ts" />
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var LocaleHelper = (function () {
                function LocaleHelper() {
                }
                LocaleHelper.getLanguagesForCountry = function (countryCode, defaultLang) {
                    if (defaultLang === void 0) { defaultLang = "en"; }
                    var langs = LocaleHelper.countryLanguages[countryCode];
                    if (!Common.Collection.contains(langs, defaultLang))
                        langs.push(defaultLang);
                    return langs;
                };
                LocaleHelper.getStringMapForCountry = function (country, stringMapArray, defaultLang) {
                    if (defaultLang === void 0) { defaultLang = "en"; }
                    var langs = LocaleHelper.getLanguagesForCountry(country, defaultLang);
                    var stringMap = Common.Collection.toHashmap(stringMapArray, function (value) { return value['key']; });
                    // Creates a hash with string keys as key and the first matching language (from langs) existing in the original dictionary
                    // In short - Returns the StringMap fitting for the provided country
                    return Common.Collection.hashSelect(stringMap, function (langStrings) { return Common.Collection.of(langs).selectFirst(function (lang) { return langStrings[lang]; }, function (v) { return v && v.length > 0; }); });
                };
                LocaleHelper.countryLanguages = { "AF": ["ps", "uz", "tk"], "AX": ["sv"], "AL": ["sq"], "DZ": ["ar"], "AS": ["en", "sm"], "AD": ["ca"], "AO": ["pt"], "AI": ["en"], "AQ": [], "AG": ["en"], "AR": ["es", "gn"], "AM": ["hy", "ru"], "AW": ["nl", "pa"], "AU": ["en"], "AT": ["de"], "AZ": ["az", "hy"], "BS": ["en"], "BH": ["ar"], "BD": ["bn"], "BB": ["en"], "BY": ["be", "ru"], "BE": ["nl", "fr", "de"], "BZ": ["en", "es"], "BJ": ["fr"], "BM": ["en"], "BT": ["dz"], "BO": ["es", "ay", "qu"], "BQ": ["nl"], "BA": ["bs", "hr", "sr"], "BW": ["en", "tn"], "BV": [], "BR": ["pt"], "IO": ["en"], "VG": ["en"], "BN": ["ms"], "BG": ["bg"], "BF": ["fr", "ff"], "BI": ["fr", "rn"], "KH": ["km"], "CM": ["en", "fr"], "CA": ["en", "fr"], "CV": ["pt"], "KY": ["en"], "CF": ["fr", "sg"], "TD": ["fr", "ar"], "CL": ["es"], "CN": ["zh"], "CX": ["en"], "CC": ["en"], "CO": ["es"], "KM": ["ar", "fr"], "CG": ["fr", "ln"], "CD": ["fr", "ln", "kg", "sw", "lu"], "CK": ["en"], "CR": ["es"], "HR": ["hr"], "CU": ["es"], "CW": ["nl", "pa", "en"], "CY": ["el", "tr", "hy"], "CZ": ["cs", "sk"], "DK": ["da"], "DJ": ["fr", "ar"], "DM": ["en"], "DO": ["es"], "EC": ["es"], "EG": ["ar"], "SV": ["es"], "GQ": ["es", "fr"], "ER": ["ti", "ar", "en"], "EE": ["et"], "ET": ["am"], "FK": ["en"], "FO": ["fo"], "FJ": ["en", "fj", "hi", "ur"], "FI": ["fi", "sv"], "FR": ["fr"], "GF": ["fr"], "PF": ["fr"], "TF": ["fr"], "GA": ["fr"], "GM": ["en"], "GE": ["ka"], "DE": ["de"], "GH": ["en"], "GI": ["en"], "GR": ["el"], "GL": ["kl"], "GD": ["en"], "GP": ["fr"], "GU": ["en", "ch", "es"], "GT": ["es"], "GG": ["en", "fr"], "GN": ["fr", "ff"], "GW": ["pt"], "GY": ["en"], "HT": ["fr", "ht"], "HM": ["en"], "VA": ["it", "la"], "HN": ["es"], "HK": ["zh", "en"], "HU": ["hu"], "IS": ["is"], "IN": ["hi", "en"], "ID": ["id"], "CI": ["fr"], "IR": ["fa"], "IQ": ["ar", "ku"], "IE": ["ga", "en"], "IM": ["en", "gv"], "IL": ["en", "he", "ar"], "IT": ["it"], "JM": ["en"], "JP": ["ja"], "JE": ["en", "fr"], "JO": ["ar"], "KZ": ["kk", "ru"], "KE": ["en", "sw"], "KI": ["en"], "KW": ["ar"], "KG": ["ky", "ru"], "LA": ["lo"], "LV": ["lv"], "LB": ["ar", "fr"], "LS": ["en", "st"], "LR": ["en"], "LY": ["ar"], "LI": ["de"], "LT": ["lt"], "LU": ["fr", "de", "lb"], "MO": ["zh", "pt"], "MK": ["mk"], "MG": ["fr", "mg"], "MW": ["en", "ny"], "MY": [], "MV": ["dv"], "ML": ["fr"], "MT": ["mt", "en"], "MH": ["en", "mh"], "MQ": ["fr"], "MR": ["ar"], "MU": ["en"], "YT": ["fr"], "MX": ["es"], "FM": ["en"], "MD": ["ro"], "MC": ["fr"], "MN": ["mn"], "ME": ["sr", "bs", "sq", "hr"], "MS": ["en"], "MA": ["ar"], "MZ": ["pt"], "MM": ["my"], "NA": ["en", "af"], "NR": ["en", "na"], "NP": ["ne"], "NL": ["nl"], "NC": ["fr"], "NZ": ["en", "mi"], "NI": ["es"], "NE": ["fr"], "NG": ["en"], "NU": ["en"], "NF": ["en"], "KP": ["ko"], "MP": ["en", "ch"], "NO": ["no", "nb", "nn"], "OM": ["ar"], "PK": ["en", "ur"], "PW": ["en"], "PS": ["ar"], "PA": ["es"], "PG": ["en"], "PY": ["es", "gn"], "PE": ["es"], "PH": ["en"], "PN": ["en"], "PL": ["pl"], "PT": ["pt"], "PR": ["es", "en"], "QA": ["ar"], "XK": ["sq", "sr"], "RE": ["fr"], "RO": ["ro"], "RU": ["ru"], "RW": ["rw", "en", "fr"], "BL": ["fr"], "SH": ["en"], "KN": ["en"], "LC": ["en"], "MF": ["fr"], "PM": ["fr"], "VC": ["en"], "WS": ["sm", "en"], "SM": ["it"], "ST": ["pt"], "SA": ["ar"], "SN": ["fr"], "RS": ["sr"], "SC": ["fr", "en"], "SL": ["en"], "SG": ["en", "ms", "ta", "zh"], "SX": ["nl", "en", "fr"], "SK": ["sk"], "SI": ["sl"], "SB": ["en"], "SO": ["so", "ar"], "ZA": ["af", "en", "nr", "st", "ss", "tn", "ts", "ve", "xh", "zu"], "GS": ["en"], "KR": ["ko"], "SS": ["en"], "ES": ["es", "eu", "ca", "gl", "oc"], "LK": ["si", "ta"], "SD": ["ar", "en"], "SR": ["nl"], "SJ": ["no"], "SZ": ["en", "ss"], "SE": ["sv"], "CH": ["de", "fr", "it"], "SY": ["ar"], "TW": ["zh"], "TJ": ["tg", "ru"], "TZ": ["sw", "en"], "TH": ["th"], "TL": ["pt"], "TG": ["fr"], "TK": ["en"], "TO": ["en", "to"], "TT": ["en"], "TN": ["ar"], "TR": ["tr"], "TM": ["tk", "ru"], "TC": ["en"], "TV": ["en"], "UG": ["en", "sw"], "UA": ["uk"], "AE": ["ar"], "GB": ["en"], "US": ["en"], "UM": ["en"], "VI": ["en"], "UY": ["es"], "UZ": ["uz", "ru"], "VU": ["bi", "en", "fr"], "VE": ["es"], "VN": ["vi"], "WF": ["fr"], "EH": ["es"], "YE": ["ar"], "ZM": ["en"], "ZW": ["en", "sn", "nd"] };
                return LocaleHelper;
            })();
            Common.LocaleHelper = LocaleHelper;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

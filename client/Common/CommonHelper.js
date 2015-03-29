var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            function stringHash(source) {
                var hashValue = 0, i, chr, len;
                if (source.length == 0)
                    return hashValue;
                for (i = 0, len = source.length; i < len; i++) {
                    chr = source.charCodeAt(i);
                    hashValue = ((hashValue << 5) - hashValue) + chr;
                    hashValue |= 0; // Convert to 32bit integer
                }
                return hashValue;
            }
            Common.stringHash = stringHash;
            function randomInt(from, to) {
                var rnd = Math.random();
                return Math.floor(from + (to - from) * rnd);
            }
            Common.randomInt = randomInt;
            // fix length
            function generateGuid(length) {
                var guid = "";
                for (var i = 0; i < length; i++) {
                    var letter = (Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1));
                    guid = guid + letter;
                }
                return guid.substr(0, length);
            }
            Common.generateGuid = generateGuid;
            function generateUUID() {
                var s = [], itoh = '0123456789ABCDEF';
                for (var i = 0; i < 36; i++)
                    s[i] = Math.floor(Math.random() * 0x10);
                // Conform to RFC-4122, section 4.4
                s[14] = 4; // Set 4 high bits of time_high field to version
                s[19] = (s[19] & 0x3) | 0x8; // Specify 2 high bits of clock sequence
                for (var i = 0; i < 36; i++)
                    s[i] = itoh[s[i]];
                // Insert '-'s
                s[8] = s[13] = s[18] = s[23] = '-';
                return s.join('');
            }
            Common.generateUUID = generateUUID;
            function isEquivalent(a, b) {
                if (a == b) {
                    return true;
                }
                // Create arrays of property names
                var aProps = Object.getOwnPropertyNames(a);
                var bProps = Object.getOwnPropertyNames(b);
                // If number of properties is different,
                // objects are not equivalent
                if (aProps.length != bProps.length) {
                    return false;
                }
                for (var i = 0; i < aProps.length; i++) {
                    var propName = aProps[i];
                    // If values of same property are not equal,
                    // objects are not equivalent
                    if (!isEquivalent(a[propName], b[propName])) {
                        return false;
                    }
                }
                // If we made it this far, objects
                // are considered equivalent
                return true;
            }
            Common.isEquivalent = isEquivalent;
            function stringFormat(format) {
                var replacements = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    replacements[_i - 1] = arguments[_i];
                }
                var args = arguments;
                return format.replace(/{(\d+)}/g, function (match, numberString) {
                    var i = parseInt(numberString) + 1;
                    if (typeof args[i] == 'undefined')
                        throw Error("Failed matching format group " + match);
                    return args[i];
                });
            }
            Common.stringFormat = stringFormat;
            function namedStringFormat(format) {
                var replacements = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    replacements[_i - 1] = arguments[_i];
                }
                return format.replace(/{(\w+)}/g, function (match, group) {
                    for (var i = 0; i < replacements.length; i++) {
                        var replacement = replacements[i];
                        if (group in replacement) {
                            return replacement[group];
                        }
                    }
                    throw Error("Failed matching format group " + match);
                });
            }
            Common.namedStringFormat = namedStringFormat;
            function nameOf(instance) {
                var funcNameRegex = /function (.{1,})\(/;
                var results = (funcNameRegex).exec((instance).constructor.toString());
                return (results && results.length > 1) ? results[1] : "";
            }
            Common.nameOf = nameOf;
            function domainFromUrl(url) {
                var a = document.createElement('a');
                a.href = url;
                return a.hostname;
            }
            Common.domainFromUrl = domainFromUrl;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

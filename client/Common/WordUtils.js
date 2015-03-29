/// <reference path="Collection.ts"/>
/// <reference path="Base64.ts"/>
var BD;
(function (BD) {
    var APP;
    (function (APP) {
        var Common;
        (function (Common) {
            var WordUtils = (function () {
                function WordUtils() {
                }
                WordUtils.countWords = function (words) {
                    var wordMap = Common.Collection.of(words).groupBy(function (x) { return x; });
                    var wordCounts = wordMap.selectValues(function (x) { return x.value.length; });
                    return wordCounts;
                };
                WordUtils.countWords_old = function (words) {
                    var groupedWords = Common.Collection.groupByString(words, function (x) { return x; });
                    var wordCounts = Common.Collection.hashSelect(groupedWords, function (x) { return x.length; });
                    return wordCounts;
                };
                WordUtils.getNonTrivialWords = function (str) {
                    var hostPartsRegex = new RegExp("^" + window.location.hostname.replace(/\./g, '|') + "$", "i");
                    var trivialWordsRegex = new RegExp(WordUtils.trivialWordPattern, "i");
                    var unique = [];
                    if (str) {
                        str = WordUtils.cleanString(str).toLowerCase();
                        unique = WordUtils.splitToDistinctWords(str, function (word) {
                            return !trivialWordsRegex.test(word) && !hostPartsRegex.test(word) && word != "|";
                        });
                    }
                    return unique;
                };
                WordUtils.splitToDistinctWords = function (str, filter) {
                    var words = str.match(/\S+/g);
                    return words ? Common.Collection.of(words).distinct(function (x) { return x; }).where(filter).toArray() : [];
                };
                WordUtils.cleanString = function (str) {
                    str = str.replace(/(<([^>]+)>)/ig, ''); // removing HTML tags
                    str = str.replace(/\$\d(?:\d|,|&|\.)*/g, " ");
                    str = str.replace(/\(.*\)/g, " ");
                    // str = str.replace(/[-_//\+\.,'":&=\?\|]/g, ' ');
                    str = str.replace(/[\|,\-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, ' '); // removing punctuations
                    // GUY ONLY REMOVE . if not between two numbers
                    str = str.replace(/\./g, function (match, pos, original) {
                        var digitPrefix = pos != 0 && original[pos - 1].match(/\d/);
                        var digitSuffix = pos != original.length - 1 && original[pos + 1].match(/\d/);
                        return (digitPrefix && digitSuffix) ? "." : " ";
                    });
                    //        // non-printable characters
                    //        str = str.replace(/[\0-\x1F\x7F-\x9F\xAD\u0378\u0379\u037F-\u0383\u038B\u038D\u03A2\u0528-\u0530\u0557\u0558\u0560\u0588\u058B-\u058E\u0590\u05C8-\u05CF\u05EB-\u05EF\u05F5-\u0605\u061C\u061D\u06DD\u070E\u070F\u074B\u074C\u07B2-\u07BF\u07FB-\u07FF\u082E\u082F\u083F\u085C\u085D\u085F-\u089F\u08A1\u08AD-\u08E3\u08FF\u0978\u0980\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09FC-\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF2-\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B55\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B78-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BFB-\u0C00\u0C04\u0C0D\u0C11\u0C29\u0C34\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5A-\u0C5F\u0C64\u0C65\u0C70-\u0C77\u0C80\u0C81\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0D01\u0D04\u0D0D\u0D11\u0D3B\u0D3C\u0D45\u0D49\u0D4F-\u0D56\u0D58-\u0D5F\u0D64\u0D65\u0D76-\u0D78\u0D80\u0D81\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DF1\u0DF5-\u0E00\u0E3B-\u0E3E\u0E5C-\u0E80\u0E83\u0E85\u0E86\u0E89\u0E8B\u0E8C\u0E8E-\u0E93\u0E98\u0EA0\u0EA4\u0EA6\u0EA8\u0EA9\u0EAC\u0EBA\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F48\u0F6D-\u0F70\u0F98\u0FBD\u0FCD\u0FDB-\u0FFF\u10C6\u10C8-\u10CC\u10CE\u10CF\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u137D-\u137F\u139A-\u139F\u13F5-\u13FF\u169D-\u169F\u16F1-\u16FF\u170D\u1715-\u171F\u1737-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17DE\u17DF\u17EA-\u17EF\u17FA-\u17FF\u180F\u181A-\u181F\u1878-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191D-\u191F\u192C-\u192F\u193C-\u193F\u1941-\u1943\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19DD\u1A1C\u1A1D\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1A9F\u1AAE-\u1AFF\u1B4C-\u1B4F\u1B7D-\u1B7F\u1BF4-\u1BFB\u1C38-\u1C3A\u1C4A-\u1C4C\u1C80-\u1CBF\u1CC8-\u1CCF\u1CF7-\u1CFF\u1DE7-\u1DFB\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FC5\u1FD4\u1FD5\u1FDC\u1FF0\u1FF1\u1FF5\u1FFF\u200B-\u200F\u202A-\u202E\u2060-\u206F\u2072\u2073\u208F\u209D-\u209F\u20BB-\u20CF\u20F1-\u20FF\u218A-\u218F\u23F4-\u23FF\u2427-\u243F\u244B-\u245F\u2700\u2B4D-\u2B4F\u2B5A-\u2BFF\u2C2F\u2C5F\u2CF4-\u2CF8\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D71-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E3C-\u2E7F\u2E9A\u2EF4-\u2EFF\u2FD6-\u2FEF\u2FFC-\u2FFF\u3040\u3097\u3098\u3100-\u3104\u312E-\u3130\u318F\u31BB-\u31BF\u31E4-\u31EF\u321F\u32FF\u4DB6-\u4DBF\u9FCD-\u9FFF\uA48D-\uA48F\uA4C7-\uA4CF\uA62C-\uA63F\uA698-\uA69E\uA6F8-\uA6FF\uA78F\uA794-\uA79F\uA7AB-\uA7F7\uA82C-\uA82F\uA83A-\uA83F\uA878-\uA87F\uA8C5-\uA8CD\uA8DA-\uA8DF\uA8FC-\uA8FF\uA954-\uA95E\uA97D-\uA97F\uA9CE\uA9DA-\uA9DD\uA9E0-\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A\uAA5B\uAA7C-\uAA7F\uAAC3-\uAADA\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F-\uABBF\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBC2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFE\uFDFF\uFE1A-\uFE1F\uFE27-\uFE2F\uFE53\uFE67\uFE6C-\uFE6F\uFE75\uFEFD-\uFF00\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFDF\uFFE7\uFFEF-\uFFFB\uFFFE\uFFFF]/g, '');
                    str = str.replace(/\s{2,}/g, ' '); // collapsing many spaces to one
                    str = str.replace(/('|\s$)/g, '');
                    // removing all characters which are not letters, accented letters, numbers, spaces
                    // str = str.replace(/[^A-Z|0-a-z|9|\u00C0-\u017F|\u0410-\u044F|\s]/g, '');
                    // if there's accented characters (e.g. PANTALֳ“N), replace them with the ASCII equivalent
                    if (/[\u00C0-\u017F]/.test(str)) {
                        str = WordUtils.removeDiacritics(str);
                    }
                    return str;
                };
                WordUtils.removeDiacritics = function (str) {
                    var defaultDiacriticsRemovalMap = [
                        { 'base': 'A', 'letters': /[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g },
                        { 'base': 'AA', 'letters': /[\uA732]/g },
                        { 'base': 'AE', 'letters': /[\u00C6\u01FC\u01E2]/g },
                        { 'base': 'AO', 'letters': /[\uA734]/g },
                        { 'base': 'AU', 'letters': /[\uA736]/g },
                        { 'base': 'AV', 'letters': /[\uA738\uA73A]/g },
                        { 'base': 'AY', 'letters': /[\uA73C]/g },
                        { 'base': 'B', 'letters': /[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g },
                        { 'base': 'C', 'letters': /[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g },
                        { 'base': 'D', 'letters': /[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g },
                        { 'base': 'DZ', 'letters': /[\u01F1\u01C4]/g },
                        { 'base': 'Dz', 'letters': /[\u01F2\u01C5]/g },
                        { 'base': 'E', 'letters': /[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g },
                        { 'base': 'F', 'letters': /[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g },
                        { 'base': 'G', 'letters': /[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g },
                        { 'base': 'H', 'letters': /[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g },
                        { 'base': 'I', 'letters': /[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g },
                        { 'base': 'J', 'letters': /[\u004A\u24BF\uFF2A\u0134\u0248]/g },
                        { 'base': 'K', 'letters': /[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g },
                        { 'base': 'L', 'letters': /[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g },
                        { 'base': 'LJ', 'letters': /[\u01C7]/g },
                        { 'base': 'Lj', 'letters': /[\u01C8]/g },
                        { 'base': 'M', 'letters': /[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g },
                        { 'base': 'N', 'letters': /[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g },
                        { 'base': 'NJ', 'letters': /[\u01CA]/g },
                        { 'base': 'Nj', 'letters': /[\u01CB]/g },
                        { 'base': 'O', 'letters': /[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g },
                        { 'base': 'OI', 'letters': /[\u01A2]/g },
                        { 'base': 'OO', 'letters': /[\uA74E]/g },
                        { 'base': 'OU', 'letters': /[\u0222]/g },
                        { 'base': 'P', 'letters': /[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g },
                        { 'base': 'Q', 'letters': /[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g },
                        { 'base': 'R', 'letters': /[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g },
                        { 'base': 'S', 'letters': /[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g },
                        { 'base': 'T', 'letters': /[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g },
                        { 'base': 'TZ', 'letters': /[\uA728]/g },
                        { 'base': 'U', 'letters': /[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g },
                        { 'base': 'V', 'letters': /[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g },
                        { 'base': 'VY', 'letters': /[\uA760]/g },
                        { 'base': 'W', 'letters': /[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g },
                        { 'base': 'X', 'letters': /[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g },
                        { 'base': 'Y', 'letters': /[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g },
                        { 'base': 'Z', 'letters': /[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g },
                        { 'base': 'a', 'letters': /[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g },
                        { 'base': 'aa', 'letters': /[\uA733]/g },
                        { 'base': 'ae', 'letters': /[\u00E6\u01FD\u01E3]/g },
                        { 'base': 'ao', 'letters': /[\uA735]/g },
                        { 'base': 'au', 'letters': /[\uA737]/g },
                        { 'base': 'av', 'letters': /[\uA739\uA73B]/g },
                        { 'base': 'ay', 'letters': /[\uA73D]/g },
                        { 'base': 'b', 'letters': /[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g },
                        { 'base': 'c', 'letters': /[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g },
                        { 'base': 'd', 'letters': /[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g },
                        { 'base': 'dz', 'letters': /[\u01F3\u01C6]/g },
                        { 'base': 'e', 'letters': /[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g },
                        { 'base': 'f', 'letters': /[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g },
                        { 'base': 'g', 'letters': /[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g },
                        { 'base': 'h', 'letters': /[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g },
                        { 'base': 'hv', 'letters': /[\u0195]/g },
                        { 'base': 'i', 'letters': /[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g },
                        { 'base': 'j', 'letters': /[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g },
                        { 'base': 'k', 'letters': /[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g },
                        { 'base': 'l', 'letters': /[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g },
                        { 'base': 'lj', 'letters': /[\u01C9]/g },
                        { 'base': 'm', 'letters': /[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g },
                        { 'base': 'n', 'letters': /[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g },
                        { 'base': 'nj', 'letters': /[\u01CC]/g },
                        { 'base': 'o', 'letters': /[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g },
                        { 'base': 'oi', 'letters': /[\u01A3]/g },
                        { 'base': 'ou', 'letters': /[\u0223]/g },
                        { 'base': 'oo', 'letters': /[\uA74F]/g },
                        { 'base': 'p', 'letters': /[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g },
                        { 'base': 'q', 'letters': /[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g },
                        { 'base': 'r', 'letters': /[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g },
                        { 'base': 's', 'letters': /[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g },
                        { 'base': 't', 'letters': /[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g },
                        { 'base': 'tz', 'letters': /[\uA729]/g },
                        { 'base': 'u', 'letters': /[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g },
                        { 'base': 'v', 'letters': /[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g },
                        { 'base': 'vy', 'letters': /[\uA761]/g },
                        { 'base': 'w', 'letters': /[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g },
                        { 'base': 'x', 'letters': /[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g },
                        { 'base': 'y', 'letters': /[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g },
                        { 'base': 'z', 'letters': /[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g }
                    ];
                    for (var i = 0; i < defaultDiacriticsRemovalMap.length; i++) {
                        str = str.replace(defaultDiacriticsRemovalMap[i].letters, defaultDiacriticsRemovalMap[i].base);
                    }
                    return str;
                };
                //self.exW = "^(search|result|results|com|info|net|item|keyword|keywords|cart|for|accounts|account|customer|service|support|contact|we|description|xml|proxy|stylesheet|shops|shop|shopping|price|min|max|online|id|email|ship|shipping|to|personalized|suchen|lieblingsprodukt|produkt|de|suche|ergebnis|ergebnisse|artikel|stichwort|jobtitel|warenkorb|kundendienst|kundensupport|kontaktieren|unterstützung|wir|beschreibung|einkaufen|geschäfte|preis|schiffs|versand|unterstützung|schuhe|zalando|account|produkte|onlineshop|suchergebnisse|query|langid|markt|media|multichannelsearch|achats|achats|commerce|discount|recherché|recherche|rechercher|recherches|chercher|produit|produits|article|résultat|résultats|suite|consequence|raison|prix|page|asp|aspx|php|choix|prix|électroménager|accueil|homepage|marchand|merchant|händler|url|html|prodotti|programmi|guardare|prezzi|trova|acquisti|ricerca|confronta|offerte|cerca|Iscriviti|Accedi|login|email|e-mail|sconti|lavoretti|menu|corso|benessere|parcheggi|ricaricabile|compara|listsales|returnurl|sales|tag|tagname|offerta)$";
                WordUtils.encodedTrivialWordPattern = "XihzZWFyY2h8cmVzdWx0fHJlc3VsdHN8Y29tfGluZm98bmV0fGl0ZW18a2V5d29yZHxrZXl3b3Jkc3xjYXJ0fGZvcnxhY2NvdW50c3xhY2NvdW50fGN1c3RvbWVyfHNlcnZpY2V8c3VwcG9ydHxjb250YWN0fHdlfGRlc2NyaXB0aW9ufHhtbHxwcm94eXxzdHlsZXNoZWV0fHNob3BzfHNob3B8c2hvcHBpbmd8cHJpY2V8bWlufG1heHxvbmxpbmV8aWR8ZW1haWx8c2hpcHxzaGlwcGluZ3x0b3xwZXJzb25hbGl6ZWR8c3VjaGVufGxpZWJsaW5nc3Byb2R1a3R8cHJvZHVrdHxkZXxzdWNoZXxlcmdlYm5pc3xlcmdlYm5pc3NlfGFydGlrZWx8c3RpY2h3b3J0fGpvYnRpdGVsfHdhcmVua29yYnxrdW5kZW5kaWVuc3R8a3VuZGVuc3VwcG9ydHxrb250YWt0aWVyZW58dW50ZXJzdMO8dHp1bmd8d2lyfGJlc2NocmVpYnVuZ3xlaW5rYXVmZW58Z2VzY2jDpGZ0ZXxwcmVpc3xzY2hpZmZzfHZlcnNhbmR8dW50ZXJzdMO8dHp1bmd8c2NodWhlfHphbGFuZG98YWNjb3VudHxwcm9kdWt0ZXxvbmxpbmVzaG9wfHN1Y2hlcmdlYm5pc3NlfHF1ZXJ5fGxhbmdpZHxtYXJrdHxtZWRpYXxtdWx0aWNoYW5uZWxzZWFyY2h8YWNoYXRzfGFjaGF0c3xjb21tZXJjZXxkaXNjb3VudHxyZWNoZXJjaMOpfHJlY2hlcmNoZXxyZWNoZXJjaGVyfHJlY2hlcmNoZXN8Y2hlcmNoZXJ8cHJvZHVpdHxwcm9kdWl0c3xhcnRpY2xlfHLDqXN1bHRhdHxyw6lzdWx0YXRzfHN1aXRlfGNvbnNlcXVlbmNlfHJhaXNvbnxwcml4fHBhZ2V8YXNwfGFzcHh8cGhwfGNob2l4fHByaXh8w6lsZWN0cm9tw6luYWdlcnxhY2N1ZWlsfGhvbWVwYWdlfG1hcmNoYW5kfG1lcmNoYW50fGjDpG5kbGVyfHVybHxodG1sfHByb2RvdHRpfHByb2dyYW1taXxndWFyZGFyZXxwcmV6eml8dHJvdmF8YWNxdWlzdGl8cmljZXJjYXxjb25mcm9udGF8b2ZmZXJ0ZXxjZXJjYXxJc2NyaXZpdGl8QWNjZWRpfGxvZ2lufGVtYWlsfGUtbWFpbHxzY29udGl8bGF2b3JldHRpfG1lbnV8Y29yc298YmVuZXNzZXJlfHBhcmNoZWdnaXxyaWNhcmljYWJpbGV8Y29tcGFyYXxsaXN0c2FsZXN8cmV0dXJudXJsfHNhbGVzfHRhZ3x0YWduYW1lfG9mZmVydGEpJA==";
                WordUtils.trivialWordPattern = Common.Base64.decode(WordUtils.encodedTrivialWordPattern);
                return WordUtils;
            })();
            Common.WordUtils = WordUtils;
        })(Common = APP.Common || (APP.Common = {}));
    })(APP = BD.APP || (BD.APP = {}));
})(BD || (BD = {}));

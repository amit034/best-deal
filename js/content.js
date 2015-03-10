/**
 * Created by arotbard on 10-Mar-15.
 */
chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        debugger;
        if (request.action == 'getKeyWords') {
            var pageInfos = [];
            $('a').each(function() {
                var pageInfo = {};
                var href = $(this).attr('href');
                if (href != null && href.indexOf("http") == 0)
                {
//only add urls that start with http
                    pageInfo.url = href;
                    pageInfos.push(pageInfo);
                }
            });
            sendResponse(pageInfos);
        }
});
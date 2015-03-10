/**
 * Created by arotbard on 10-Mar-15.
 */
myApp.service('keyWordFinderService', function() {
    this.getKeyWords = function(callback) {
        var model = {};
        chrome.tabs.query({'active': true},
            function (tabs) {
                if (tabs.length > 0)
                {
                    chrome.tabs.sendMessage(tabs[0].id, { 'action': 'getKeyWords' }, function (keyWords) {
                        model.keyWords = keyWords;
                        callback(model);
                    });
                }
            });
    };
})
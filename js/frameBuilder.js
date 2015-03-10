/**
 * Created by arotbard on 10-Mar-15.
 */
var iframe  = document.createElement ("iframe");
iframe.src  = chrome.extension.getURL ("partials/rightFrame.html");
document.body.appendChild(iframe);
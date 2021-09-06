"use strict";

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action == "change_badge_number") {
        chrome.browserAction.setBadgeText({ text: `${request.rate}` });
    }
});


"use strict";

chrome.runtime.onMessage.addListener(receivedMessage);

function receivedMessage(request, sender, sendResponse) {
    if (request.action == "change_badge_number") {
        chrome.action.setBadgeText({ text: `${request.rate}` });
    }
}


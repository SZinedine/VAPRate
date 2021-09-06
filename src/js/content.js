"use strict";

var currentRate = null;     // for easy access
var interval = null;
applyPlaybackRate();
startInterval();


/**
 * Apply the playback rate every 2 seconds
 */
function startInterval() {
    if (!interval)
        interval = setInterval( applyPlaybackRate , 2000 );
}


function stopInterval() {
    if (interval)
        clearInterval(interval);
    interval = null;
}


/**
 * store the playback rate in the extension storage for persistency
 */
function setRate(rate) {
    chrome.storage.sync.set({ "playbackRate": rate });
    currentRate = currentRate;
}


/**
 * fetch the stored playback rate from the extension storage
 * returns a promise
 */
function getRate() {
    return new Promise( (resolve, reject) => {
        chrome.storage.sync.get(["playbackRate"], function(item) {
            if (item.playbackRate == undefined)
                reject(1);
            else resolve(item.playbackRate);
        })
    });
}


/**
 * Set the video/audio elements to the stored playback rate.
 * it sends a message to the service worker to display the new rate in a badge
 */
function applyPlaybackRate() {
    function apply(rate) {
        for (let video of document.querySelectorAll('video'))
            video.playbackRate = rate;

        for (let audio of document.querySelectorAll('audio'))
            audio.playbackRate = rate;

        // send it to background
        chrome.runtime.sendMessage({
            "action": "change_badge_number",
            "rate": rate
        });

        currentRate = rate;
    }
    getRate()
    .then(  rate => { apply(rate); } )
    .catch( rate => { apply(rate); } );
}


/**
 * keyboard shortcuts
 * Ctrl + ArrowUp/ArrowDown to increase and decrease the rate
 */
document.onkeydown = event => {
    if (event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey) {
        if (event.key == "ArrowUp") {
            setRate(currentRate + 0.25);
            applyPlaybackRate();
        }
        else if (event.key == "ArrowDown") {
            if (currentRate >= 0.5) {
                setRate(currentRate - 0.25);
                applyPlaybackRate();
            }
        }
    }
};


/**
 * Process Messages from the popup page/script
 */
function fromPopup(request, sender, sendResponse) {
    if (request.action == "SET") {
        stopInterval();
        setRate( request.speed );
        applyPlaybackRate()
        startInterval();
        sendResponse( {result: "succeed"} );
    }
    else if (request.action == "GET") {
        sendResponse(currentRate);
    }
    else {
        let msg = "content.js: something went wrong";
        console.log(msg);
        sendResponse(msg);
        alert(msg);
    }
}

chrome.runtime.onMessage.addListener(fromPopup);

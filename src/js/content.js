
var rate = 1;
recoverStoredPlaybackRate();
var repeat = window.setInterval(applyPlaybackRate, 2000);

/**
 * store rate in extension storage and apply the same value to the global variable `rate`
 */
function setPlaybackRateValue(rate_) {
    rate = rate_;
    chrome.storage.sync.set({ "playbackRate": rate_ });
}


/**
 * recover rate from extension storage
 */
function recoverStoredPlaybackRate() {
    try {
        chrome.storage.sync.get(["playbackRate"], function(item){
            if (item.playbackRate == undefined)
                rate = 1;
            else rate = item.playbackRate;
        });
    } catch (err) { // nonexistent key may cause an exception
        console.log("Error while recovering the stored playback rate. set it to 1.")
        setPlaybackRateValue(1);
    }
}


/**
 * Match the Youtube keyboard shortcuts
 */
window.addEventListener("keydown", function(event) {
    if (event.shiftKey) {
        if (event.code == "Comma")
            setPlaybackRateValue(rate + 0.25)
        else if (event.code == "KeyM")
            if (rate >= 0.5)
                setPlaybackRateValue(rate - 0.25)
    }
});


/**
 * set the playback rate for all video/audio elements of the current page
 */
function applyPlaybackRate() {
    recoverStoredPlaybackRate();
    // console.log("rate: " + rate);    // for debug
    for (let video of document.querySelectorAll('video'))
        video.playbackRate = rate;

    for (let audio of document.querySelectorAll('audio'))
        audio.playbackRate = rate;
}


chrome.runtime.onMessage.addListener( (response, sender, sendResponse) => {

    if (response.action == "SET") {
        setPlaybackRateValue( response.speed );
        sendResponse( {result: "succeed"} );
    }
    else if (response.action == "GET") {
        sendResponse( rate );
    }
    else {
        let msg = "content.js: something went wrong";
        console.log(msg);
        sendResponse(msg);
        alert(msg);
    }
});

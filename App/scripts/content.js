var url = document.baseURI;
var video = document.querySelector('video');

/**
 * receive a message from the outside (popup.js)
 */
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
    
    if (response.action == "set speed") {
        setPlayRate(response.speed);
        sendResponse( {result: "succeed"} );
    }
    else if (response.action == "get speed") {
        sendResponse( getCurrentPlayRate() );
    }
    else if (response.action == "get url") {
        sendResponse( url );
    }
    else {
        let msg = "content.js: something went wrong";
        console.log(msg);
        sendResponse(msg);
        alert(msg);
    }
});

/**
 * get the current playback rate from the video and return it
 * 
 * @returns {nummber}
 */
function getCurrentPlayRate() {
    return video.playbackRate;
}

/**
 * set the playback rate
 * 
 * @param {nummber} value   the value to set
 */
function setPlayRate(value) {
    video.playbackRate = value;
}

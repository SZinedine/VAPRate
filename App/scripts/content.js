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
        sendResponse( document.baseURI );
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
    let video = document.querySelector('video');
    return video.playbackRate;
}

/**
 * set the playback rate
 * 
 * @param {nummber} value   the value to set
 */
function setPlayRate(value) {
    let video = document.querySelector('video');
    video.playbackRate = value;
}

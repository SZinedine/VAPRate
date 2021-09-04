
var rate = 1;
var repeat = window.setInterval(applyPlaybackRate, 2000);


window.addEventListener("keydown", function(event) {
    if (event.shiftKey) {
        if (event.code == "Comma")
            rate = rate + 0.25;
        else if (event.code == "KeyM")
            if (rate >= 0.5)
                rate = rate - 0.25;
    }
});


/**
 * set the playback rate for all videos of the current page
 */
function applyPlaybackRate() {
    console.log("rate: " + rate);
    for (let video of document.querySelectorAll('video'))
        video.playbackRate = rate;
}

/**
 * check if there is videos on the current page
 */
function pageHasVideos() {
    return document.querySelectorAll('video').length != 0;
}


/**
 * receive a message from the outside (popup.js)
 */
chrome.runtime.onMessage.addListener( (response, sender, sendResponse) => {

    if (response.action == "SET") {
        rate = response.speed;
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

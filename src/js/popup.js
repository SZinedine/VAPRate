const jumpValue = 0.25;
const plusButton = document.querySelector("#plus");
const minusButton = document.querySelector("#minus");
const resetButton = document.querySelector("#reset");
const label = document.querySelector("#label");


/**
 * display the current playback rate in the popup
 */
document.addEventListener('DOMContentLoaded', () => {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action:"GET"}, function(response){

            let res = (response == undefined) ? "/" : response;
            changeLabelValue(res);
        });
    });
});


function changePlaybackRate(spd) {     // spd should be a float
    let toSend = {
        action:"SET",
        speed: spd
    };

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, toSend, function(response){
            if (response.result === "succeed")
                changeLabelValue(parseFloat(spd));
        });
    });
}


/**
 * Match the Youtube keyboard shortcuts
 */
addEventListener("keydown", function(event) {
    if (event.shiftKey) {
        let cur = getLabelValue();
        if (event.code == "Comma")
            changePlaybackRate( cur + jumpValue );
        else if (event.code == "KeyM")
            if (cur >= 0.5)
                changePlaybackRate( cur - jumpValue );
    }
});


/*
 * event listners for buttons
 */
plusButton.onclick = () => {
    changePlaybackRate( getLabelValue() + jumpValue );
};

minusButton.onclick = () => {
    let cur = getLabelValue();
    if (cur > 0.25)
        changePlaybackRate( cur - jumpValue );
};

resetButton.onclick = () => {
    changePlaybackRate( 1 );
};


/**
 * focus on the buttons when hovered
 */
plusButton.onmouseover = () => {
    plusButton.focus();
};

minusButton.onmouseover = () => {
    minusButton.focus();
};


/**
 * log the results inside the popup for debugging purposes
 * think of uncomenting the #log div in the html file before using this function
 * @param {String} content
 */
function addToList(content) {
    let ul = document.querySelector("#log");
    let li = document.createElement("li");
    li.textContent = content;
    ul.appendChild(li);
}


/**
 * print an error inside the popup in case the youtube page isn't loaded
 * or the current website isn't youtube
 */
function printError() {
    let obj = document.querySelector("#error-area");
    let p = document.createElement("p");
    p.textContent = "Go to a youtube page, or wait for the page to load.";
    obj.appendChild(p);
}


/**
 * call content.js to get the current playbackrate of the video
 *
 * @returns {number} playbackrate
 */
function getCurrent() {
    let obj = {
        action: "GET"
    };
    chrome.runtime.sendMessage(obj, function(msg) {
        return msg;
    });
}


/**
 * change the value of the label inside the popup
 */
function changeLabelValue(rate) {
    label.innerText = rate;
}


/**
 * get the value of the label inside the popup
 * @returns {number} the content of the label
 */
function getLabelValue() {
    return parseFloat(label.innerText);
}


/**
 * disable the buttons and change their colors
 */
function disableUI() {
    plusButton.disabled = true;
    minusButton.disabled = true;
    resetButton.disabled = true;
    label.style.color = "grey";
}


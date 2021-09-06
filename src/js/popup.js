"use strict";

const jumpValue = 0.25;
const plusButton = document.querySelector("#plus");
const minusButton = document.querySelector("#minus");
const resetButton = document.querySelector("#reset");
const label = document.querySelector("#label");

document.addEventListener('DOMContentLoaded', openPopup);   // wait until the page is loaded

/**
 * When the popup opens, get the current
 * playback rate from content script and display it
 */
function openPopup() {
    toContent({action: "GET"}, response => changeLabelValue(response));
}


/**
 * call the content script to apply the newly set rate
 *
 * @param {number} rate      // should be a float
 */
function changePlaybackRate(rate) {
    toContent({action: "SET", speed: rate}, response => {
        if (response.result == "succeed")
            changeLabelValue(parseFloat(rate));
        else
            console.error("Something went wront while changing the playback rate.");
    });
}


/**
 * Send a message to the content script
 * pass the response to the callback function provided as a parameter
 *
 * @param {Object} message
 * @param {function} callback
 */
function toContent(message, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, message, response => {
            if (callback)
                callback(response);
        });
    });
}


/**
 * Keyboard shortcuts
 */
document.onkeydown = event => {
    if (event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey) {
        let cur = getLabelValue();
        if (event.key == "ArrowUp") {
            changePlaybackRate( cur + jumpValue );
        }
        else if (event.key == "ArrowDown") {
            if (cur >= 0.5)
                changePlaybackRate( cur - jumpValue );
        }
    }
};


/**
 * event listeners for buttons
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


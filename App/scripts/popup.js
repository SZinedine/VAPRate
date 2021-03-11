const jumpValue = 0.25;
const plusButton = document.querySelector("#plus");
const minusButton = document.querySelector("#minus");
const resetButton = document.querySelector("#reset");
const label = document.querySelector("#label");

/**
 * called when the popup button is clicked
 * set the popup UI according to the current tab.
 */
document.addEventListener('DOMContentLoaded', () => {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action:"GET"}, function(response){
            changeLabelValue(response);
        });
    });
});


/**
 * change the speed of the video
 * by contacting content.js and give it the blaybackrate to set
 * receive a "succeed" string from it
 * then call ChangeLabelValue() to change the speed value in the popup
 * @param {number} spd 
 */
function changeSpeed(spd) {     // recieving a float
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


/****** event listners for buttons ******/
plusButton.addEventListener("click", function() {
    changeSpeed( getLabelValue() + jumpValue );
});

minusButton.addEventListener("click", function() {
    let cur = getLabelValue();
    if (cur > 0.25)
        changeSpeed( cur - jumpValue );
});

resetButton.addEventListener("click", function() {
    changeSpeed( 1 );
});


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
 * 
 * @param {number} speed 
 */
function changeLabelValue(speed) {
    label.innerHTML = speed;
}


/** 
 * get the value of the label inside the popup
 * @returns {number} the content of the label
 */
function getLabelValue() {
    return parseFloat(label.innerHTML);
}

/**
 * disables the buttons and modify their colors
 */
function disableUI() {
    plusButton.disabled = true;
    minusButton.disabled = true;
    resetButton.disabled = true;
    label.style.color = "grey";
}

'use strict';

window.onload = function() {

    document.getElementById("flina-button-start").onclick = function() {

      console.log('on click')

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {eventName: "startVideo"});
      });

      window.close();

    }

    document.getElementById("flina-button-stop").onclick = function() {

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {eventName: "stopVideo"});
      });

      window.close();

    }
}

console.log('\'Allo \'Allo! Popup');

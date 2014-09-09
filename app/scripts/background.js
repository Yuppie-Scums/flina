'use strict';

chrome.runtime.onInstalled.addListener(function (details) {
    console.log('previousVersion', details.previousVersion);
});

chrome.browserAction.setBadgeText({text: '\'Allo'});

console.log(chrome.runtime)

chrome.runtime.onMessage.addListener(
 function(request, sender, sendResponse) {
  console.log('getting')
  if (request.message == "convert_image_url_to_data_url"){
        var canvas = document.createElement("canvas");
        var img = new Image();
        console.log(img)
        img.addEventListener("load", function() {
            canvas.getContext("2d").drawImage(img,  50, 50);
            sendResponse({data: canvas.toDataURL()});
        });
        img.src = request.url;
        }
    }
)
console.log('\'Allo \'Allo! Event Page for Browser Action');

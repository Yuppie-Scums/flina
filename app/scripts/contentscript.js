/*!
 * flina.js
 * MIT licensed
 *
 * Copyright (C) 2014 Yuppie scum
 */

var Flina = (function() {

  'use strict';

  function Flina() {

    var self = this;

    this.inputs = document.querySelectorAll( 'input');;
    this.hasStarted = true;
    this.requestId = undefined;
    this.video = null;

    this.insideInput = false;
    this.canSendSmiley = true;

    self.events();

    console.log(this.inputs[0])

    this.sendKeyEvent(this.inputs[0], 65)


  }

  Flina.prototype = {

    events: function() {

      var self = this;

      console.log('events')

      chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
        switch(message.eventName) {
          case 'startVideo':
            self.startVideo();
            break;
          case 'stopVideo':
            self.stopVideo();
            break;
        }

      });

    },

    startVideo: function() {
      console.log('start video')
      var self = this;
      self.video = self.createVideoDom();
      self.createStream()

    },
    stopVideo: function() {
      var self = this;
      self.video = self.destroyVideoDom(self.video)
    },

    createVideoDom: function() {

      var video = document.createElement('video');
      video.setAttribute("id", "flina");
      video.setAttribute("width", "368");
      video.setAttribute("height", "288");
      video.style.display = 'none';
      video.play();

      return video

    },

    destroyVideoDom: function(video) {

      if (this.requestId) {
        window.cancelAnimationFrame(this.requestId);
        this.requestId = undefined

      }

      // if (video) {

      //   video.pause();
      //   video.src="";
      //   //delete video;
      // }


      return null;

    },

    createStream: function() {

      var self = this;

      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      var constraints = {audio: false, video: true};

      function successCallback(stream) {
        window.stream = stream; // stream available to console
        if (window.URL) {
          self.video.src = window.URL.createObjectURL(stream);
        } else {
          self.video.src = stream;
        }
        self.faceTracker(self.video);
      }

      function errorCallback(error){
        self.video = self.destroyVideoDom(self.video)
        console.log("navigator.getUserMedia error: ", error);
      }

      navigator.getUserMedia(constraints, successCallback, errorCallback);

    },

    sendSmiley: function() {

      // first we check if we are standing in a input;
      // then we need to check if we have already sent a smiley;

      // for

      console.log('here')

      var self = this;
      var focused = document.activeElement;

      if (!focused || focused == document.body) {
        console.log('nooo')
        focused = null;
      } else {
        focused.value = focused.value + ':)';
        var elem = document.body;
        this.sendKeyEvent(focused, 65)
        this.canSendSmiley = false;
      }

      setTimeout(function() {
        self.canSendSmiley = true;
      }, 3000)

    },

    sendKeyEvent: function(element, charCode) {

      // We cannot pass object references, so generate an unique selector
    var attribute = 'robw_' + Date.now();
    element.setAttribute(attribute, '');
    var selector = element.tagName + '[' + attribute + ']';

    var s = document.createElement('script');
    s.textContent = '(' + function(charCode, attribute, selector) {
        // Get reference to element...
        var element = document.querySelector(selector);
        element.removeAttribute(attribute);

        // Create KeyboardEvent instance
        var event = document.createEvent('KeyboardEvents');
        event.initKeyboardEvent(
            /* type         */ 'keypress',
            /* bubbles      */ true,
            /* cancelable   */ false,
            /* view         */ window,
            /* keyIdentifier*/ '',
            /* keyLocation  */ 0,
            /* ctrlKey      */ false,
            /* altKey       */ false,
            /* shiftKey     */ false,
            /* metaKey      */ false,
            /* altGraphKey  */ false
        );
        // Define custom values
        // This part requires the script to be run in the page's context
        var getterCode = {get: function() {return charCode}};
        var getterChar = {get: function() {return String.fromCharCode(charCode)}};
        Object.defineProperties(event, {
            charCode: getterCode,
            which: getterChar,
            keyCode: getterCode, // Not fully correct
            key: getterChar,     // Not fully correct
            char: getterChar
        });

        element.dispatchEvent(event);
    } + ')(' + charCode + ', "' + attribute + '", "' + selector + '")';
    (document.head||document.documentElement).appendChild(s);
    s.parentNode.removeChild(s);

    },

    faceTracker: function(video) {

      var self = this;

      var videoInput = video || document.getElementById('video');

      var ctrack = new clm.tracker({useWebGL : true});
      ctrack.init(pModel);
      ctrack.start(videoInput);

      var ec = new emotionClassifier();
      ec.init(emotionModel);
      var emotionData = ec.getBlank();

      function drawLoop() {
					self.requestId = requestAnimationFrame(drawLoop);
					var cp = ctrack.getCurrentParameters();
					var er = ec.meanPredict(cp);
					if (er) {
						for (var i = 0;i < er.length;i++) {

              if (er[3].value > 0.8 && self.canSendSmiley) {

                self.sendSmiley();

							}

						}
					}
				}

        drawLoop();

    }

  }

  var F = new Flina();

})()


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

    this.inputs = document.querySelectorAll( 'input');
    this.hasStarted = true;
    this.requestId = undefined;
    this.video = null;

    this.insideInput = false;
    this.canSendSmiley = true;

    self.events();

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
      alert('this function doesnt work right now :(')
      // self.video = self.destroyVideoDom(self.video)
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

      var self = this;

      // first we check if we are standing in a input;
      // then we need to check if we have already sent a smiley;

      // for

      var self = this;
      var focused = document.activeElement;

      if (!focused || focused == document.body) {
        console.log('nooo')
        focused = null;
      } else {

        focused.value = focused.value + ':)';
        self.submitKey(focused);
        // var elem = document.body;
        // this.sendKeyEventWontWork(focused, 13)
        this.canSendSmiley = false;
      }

      setTimeout(function() {
        self.canSendSmiley = true;
      }, 3000)

    },

    submitKey: function(element) {
      var node = element;
      while (node.nodeName != 'FORM' && node.parentNode) {
          console.log(node)
          node = node.parentNode;
      }
      if (node === 'FORM') {
        node.submit();
      } else {

      }

    },

    sendKeyEventWontWork: function(element, charCode) {

      // We cannot pass object references, so generate an unique selector
      var attribute = 'robw_' + Date.now();
      element.setAttribute(attribute, '');
      var selector = element.tagName + '[' + attribute + ']';

      var s = document.createElement('script');
      s.textContent = '(' + function(charCode, attribute, selector) {

        var press = jQuery.Event("keypress");
        press.altGraphKey = false;
        press.altKey = false;
        press.bubbles = true;
        press.cancelBubble = false;
        press.cancelable = true;
        press.charCode = 13;
        press.clipboardData = undefined;
        press.ctrlKey = false;
        press.currentTarget = $(selector)[0];
        press.defaultPrevented = false;
        press.detail = 0;
        press.eventPhase = 2;
        press.keyCode = 13;
        press.keyIdentifier = "";
        press.keyLocation = 0;
        press.layerX = 0;
        press.layerY = 0;
        press.metaKey = false;
        press.pageX = 0;
        press.pageY = 0;
        press.returnValue = true;
        press.shiftKey = false;
        press.srcElement = $(selector)[0];
        press.target = $(selector)[0];
        press.type = "keypress";
        press.view = Window;
        press.which = 13;
        $(selector).trigger(press);


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

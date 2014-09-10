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

    setTimeout(function() {
      self.events();
    }, 1000)


  }

  Flina.prototype = {

    events: function() {

      var self = this;

      chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
        switch(message.eventName)
          case 'startVideo':
            self.startVideo();
            break;
          case 'stopVideo':
            self.stopVideo();
            break;
      });

    },

    startVideo: function() {
      var self = this;
      self.video = self.createVideoDom();
      self.createStream()

    },
    stopVideo: function() {},

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

      if (video) {
        video.outerHTML = "";
        //delete video;
      }


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

      var focused = document.activeElement;
      if (!focused || focused == document.body) {
        focused = null;
      } else {
        focused.value = ':)';

        this.canSendSmiley = false;
      }

      setTimeout(function() {
        this.canSendSmiley = true;
      }, 3000)

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

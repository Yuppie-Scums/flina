/*!
 * flina.js
 * MIT licensed
 *
 * Copyright (C) 2014 Yuppie scum
 */

var Flina = (function() {

  'use strict';

  function Flina() {

    this.inputs = document.querySelectorAll( 'input');;
    this.hasStarted = true;
    this.requestId = undefined;
    this.video = null;

    this.insideInput = false;
    this.canSendSmiley = true;
    this.startButton = document.getElementById('flina-button-start')
    this.stopButton = document.getElementById('flina-button-stop')

    this.events();

  }

  Flina.prototype = {

    events: function() {

        var self = this;

        this.startButton.addEventListener('click', self.startVideo, false);
        this.stopButton.addEventListener('click', stopVideo, false);

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
      this.video.play();

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

      // check if we are staning in a input
      // Have we already sent a smiley
      //
    },

    faceTracker: function(video) {

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

              if (er[3].value > 0.6) {
                  console.log('happy')
							}

						}
					}
				}

        drawLoop();

    }

  }

  var F = new Flina();

})()

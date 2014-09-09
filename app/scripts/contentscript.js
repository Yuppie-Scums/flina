/*!
 * flina.js
 * MIT licensed
 *
 * Copyright (C) 2014 Yuppie scum
 */

var Flina = (function() {

  'use strict';

  var container = document.documentElement;
	var	input = document.querySelectorAll( 'input');
  var input2 = document.getElementsByTagName('input')

  console.log(input)
  console.log(input2)

	var	currentState = null;

  for (var i = 0; i < input.length; i++) {
    input[i].onfocus = function() {
      console.log(this)
    }
  }

  input.onfocus = function() {
    console.log(this)
  }

  input2.onfocus = function() {
    console.log(this)
  }


  function Flina(inputs, currentState) {

    this.inputs = inputs;
    this.currentState = currentState;
    this.video = null;
    this.canvas = null;

    this.setup();
    this.events();

  }

  Flina.prototype = {

    setup: function() {


      var self = this;

      this.video = document.createElement('video');
      this.video.setAttribute("id", "flina");
      this.video.setAttribute("width", "368");
      this.video.setAttribute("height", "288");
      this.video.style.display = 'none';
      // this.video.src = 'https://raw.githubusercontent.com/auduno/clmtrackr/dev/examples/media/franck.ogv';
      // this.video.autoPlay = true;

      document.body.appendChild(this.video);

      this.video.play();

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
        console.log("navigator.getUserMedia error: ", error);
      }

      navigator.getUserMedia(constraints, successCallback, errorCallback);

    },

    events: function() {



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
					requestAnimationFrame(drawLoop);
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

  var F = new Flina(input, currentState);



})()

// console.log('\'Allo \'Allo! Content script');
//
//

//
// /********** check and set up video/webcam **********/
//
// function enablestart() {
//     var startbutton = document.getElementById('startbutton');
//     startbutton.value = 'start';
//     startbutton.disabled = null;
// }
//
// navigator.getUserMedia = navigator.getUserMedia ||
//                         navigator.webkitGetUserMedia ||
//                         navigator.mozGetUserMedia ||
//                         navigator.msGetUserMedia;
//
// window.URL = window.URL ||
//             window.webkitURL ||
//             window.msURL ||
//             window.mozURL;
//
// // check for camerasupport
// if (navigator.getUserMedia) {
//     // set up stream
//
//     var videoSelector = {video : true};
//     if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
//         var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
//         if (chromeVersion < 20) {
//             videoSelector = 'video';
//         }
//     }
//
//     navigator.getUserMedia(videoSelector, function( stream ) {
//         if (vid.mozCaptureStream) {
//             vid.mozSrcObject = stream;
//         } else {
//             vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
//         }
//         vid.play();
//     }, function() {
//         //insertAltVideo(vid);
//         alert("There was some problem trying to fetch video from your webcam. If you have a webcam, please make sure to accept when the browser asks for access to your webcam.");
//     });
// } else {
//     //insertAltVideo(vid);
//     alert('This demo depends on getUserMedia, which your browser does not seem to support. :(');
// }
//
// vid.addEventListener('canplay', enablestart, false);
//
// /*********** setup of emotion detection *************/
//
// var ctrack = new clm.tracker({useWebGL : true});
// ctrack.init(pModel);
//
// function startVideo() {
//     // start video
//     vid.play();
//     // start tracking
//     ctrack.start(vid);
//     // start loop to draw face
//     drawLoop();
// }
//
// function drawLoop() {
//     requestAnimFrame(drawLoop);
//     overlayCC.clearRect(0, 0, 400, 300);
//     //psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
//     if (ctrack.getCurrentPosition()) {
//         ctrack.draw(overlay);
//     }
//     var cp = ctrack.getCurrentParameters();
//
//     var er = ec.meanPredict(cp);
//     if (er) {
//         updateData(er);
//         for (var i = 0;i < er.length;i++) {
//             if (er[i].value > 0.4) {
//                 document.getElementById('icon'+(i+1)).style.visibility = 'visible';
//             } else {
//                 document.getElementById('icon'+(i+1)).style.visibility = 'hidden';
//             }
//         }
//     }
// }
//
// var ec = new emotionClassifier();
// ec.init(emotionModel);
// var emotionData = ec.getBlank();
//
// /******** stats ********/
//
// stats = new Stats();
// stats.domElement.style.position = 'absolute';
// stats.domElement.style.top = '0px';
// document.getElementById('container').appendChild( stats.domElement );
//
// // update stats on every iteration
// document.addEventListener('clmtrackrIteration', function(event) {
//     stats.update();
// }, false);

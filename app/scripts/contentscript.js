/*!
 * flina.js
 * MIT licensed
 *
 * Copyright (C) 2014 Yuppie scum
 */

var Flina = (function() {

  'use strict';

 //  var container = document.documentElement;
	// var	input = document.querySelector( 'input' );
	var	currentState = null;

  function Flina(inputs, currentState) {

    this.inputs = inputs;
    this.currentState = currentState;
    this.video = null;
    this.canvas = null;

    // this.init()
    // this.events();
    // faceTracker();
  }

  Flina.prototype = {

    init: function() {

      this.video = document.createElement('video');
      this.video.setAttribute("id", "video");
      this.video.setAttribute("width", "368");
      this.video.setAttribute("height", "288");
      // this.video.style.position = 'fixed';
      // this.video.src = 'https://raw.githubusercontent.com/auduno/clmtrackr/dev/examples/media/franck.ogv';
      this.video.autoPlay = true;
      this.video.load();

      document.body.appendChild(this.video);

      this.source = document.createElement('source');
      this.source.setAttribute('src', '/video/video.ogv');
      this.source.setAttribute('src', './video/video.mp4');

      this.video.appendChild(this.source);
      this.video.play();


      this.canvas = document.createElement('canvas');
      this.canvas.setAttribute("id", "canvas");
      this.canvas.setAttribute("width", "368");
      this.canvas.setAttribute("height", "288");
      // this.canvas.style.position = 'fixed';

      document.body.appendChild(this.canvas);

    },

    events: function() {

      var videoInput = document.getElementById('video');

      var ctracker = new clm.tracker();
      ctracker.init(pModel);
      ctracker.start(videoInput);

			function positionLoop() {
        requestAnimationFrame(positionLoop);
        var positions = ctracker.getCurrentPosition();
        // do something with the positions ...
        // print the positions
        var positionString = "";
        if (positions) {
          for (var p = 0;p < 10;p++) {
            positionString += "featurepoint "+p+" : ["+positions[p][0].toFixed(2)+","+positions[p][1].toFixed(2)+"]<br/>";
          }
          document.getElementById('positions').innerHTML = positionString;
        }
      }
      positionLoop();

			var canvasInput = document.getElementById('canvas');
			var cc = canvasInput.getContext('2d');
			function drawLoop() {
        requestAnimationFrame(drawLoop);
        cc.clearRect(0, 0, canvasInput.width, canvasInput.height);
        ctracker.draw(canvasInput);
      }
      drawLoop();

    },

    faceTracker: function() {



    }



  }

  // var F = new Flina(input, currentState);



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

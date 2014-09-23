
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
        focused = null;
      } else {

        focused.value = focused.value + ':)';
        self.submitKey(focused);
        // var elem = document.body;
        // this.sendKeyEventWontWork(focused, 13)
        self.canSendSmiley = false;
      }

      setTimeout(function() {
        self.canSendSmiley = true;
      }, 10000)

    },

    submitKey: function(element) {
      var self = this;
      var node = element;
<<<<<<< HEAD

      while (node.nodeName != "FORM" && node.parentNode) {
          node = node.parentNode;
      }

      if (node.nodeName === "FORM") {
        console.log('submit found')
        node.submit();
      } else {
        console.log('submit not found')
        self.dispatch(element)
        self.dispatchSecondTry(65)
        sendKeyEventWontWork(element, 13)
      }

    },

    dispatch: function(element)  {

      console.log('dispatch')

      var dispatchKeyboardEvent = function(target, initKeyboradEvent_args) {
        var e = document.createEvent("KeyboardEvents");
        e.initKeyboardEvent.apply(e, Array.prototype.slice.call(arguments, 1));
        target.dispatchEvent(e);
      };
      var dispatchTextEvent = function(target, initTextEvent_args) {
        var e = document.createEvent("TextEvent");
        e.initTextEvent.apply(e, Array.prototype.slice.call(arguments, 1));
        target.dispatchEvent(e);
      };
      var dispatchSimpleEvent = function(target, type, canBubble, cancelable) {
        var e = document.createEvent("Event");
        e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
        target.dispatchEvent(e);
      };

      var canceled = !dispatchKeyboardEvent(element,
          'keydown', true, true,  // type, bubbles, cancelable
          null,  // window
          'h',  // key
          0, // location: 0=standard, 1=left, 2=right, 3=numpad, 4=mobile, 5=joystick
          '');  // space-sparated Shift, Control, Alt, etc.
      dispatchKeyboardEvent(
          element, 'keypress', true, true, null, 'h', 0, '');
      if (!canceled) {
        if (dispatchTextEvent(element, 'textInput', true, true, null, 'h', 0)) {
          element.value += 'h';
          dispatchSimpleEvent(element, 'input', false, false);
          // not supported in Chrome yet
          // if (element.form) element.form.dispatchFormInput();
          dispatchSimpleEvent(element, 'change', false, false);
          // not supported in Chrome yet
          // if (element.form) element.form.dispatchFormChange();
        }

      }
      dispatchKeyboardEvent(
          element, 'keyup', true, true, null, 'h', 0, '');
    },

    dispatchSecondTry: function(key) {
      Podium = {};
      Podium.keydown = function(k) {
          var oEvent = document.createEvent('KeyboardEvent');

          // Chromium Hack
          Object.defineProperty(oEvent, 'keyCode', {
                      get : function() {
                          return this.keyCodeVal;
                      }
          });
          Object.defineProperty(oEvent, 'which', {
                      get : function() {
                          return this.keyCodeVal;
                      }
          });

          if (oEvent.initKeyboardEvent) {
              oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, false, false, false, false, k, k);
          } else {
              oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, false, false, k, 0);
          }

          oEvent.keyCodeVal = k;

          if (oEvent.keyCode !== k) {
              alert("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")");
          }

          document.dispatchEvent(oEvent);
      }
      Podium.keydown(key)
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

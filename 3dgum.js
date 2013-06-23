//Global Constants
var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var VIDEO_WIDTH = 640;
var VIDEO_HEIGHT = 480;

//Global variables
var video;
var canvas;
var copy;
var ouput;
var disp;

var onFailSoHard = function(e) {
    console.log('Reeeejected!', e);
  };

$(function() {
		window.URL = window.URL || window.webkitURL;
		navigator.getUserMedia  = navigator.getUserMedia || navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia || navigator.msGetUserMedia;

		$("#video,#canvas").css("display","none");
		if (navigator.getUserMedia) {
  			navigator.getUserMedia({audio: true, video: true}, function(stream) {
    		video.src = window.URL.createObjectURL(stream);
  		}, onFailSoHard);
		} else {
  			video.src = 'somevideo.webm'; // fallback.
		}

		video = document.getElementById("video");
		canvas = document.getElementById("canvas");
		copy = canvas.getContext('2d');

		output = document.getElementById("output");
		disp = output.getContext('2d');
		
		canvas.width = SCREEN_WIDTH;
		canvas.height = SCREEN_HEIGHT;

		output.width = SCREEN_WIDTH;
		output.height = SCREEN_HEIGHT;

		setInterval(function() {
    		copy.drawImage(video,(SCREEN_WIDTH - VIDEO_WIDTH)/2,(SCREEN_HEIGHT - VIDEO_HEIGHT)/2);
    		// disp.drawImage(canvas,0,0);
    		var redImage = copy.getImageData((SCREEN_WIDTH - VIDEO_WIDTH)/2,(SCREEN_HEIGHT - VIDEO_HEIGHT)/2,VIDEO_WIDTH,VIDEO_HEIGHT);
    		var blueImage = copy.getImageData((SCREEN_WIDTH - VIDEO_WIDTH)/2,(SCREEN_HEIGHT - VIDEO_HEIGHT)/2,VIDEO_WIDTH,VIDEO_HEIGHT);
    		var redData = redImage.data;
    		var blueData = blueImage.data;

            // Colorize algorithm inspired from CamanJS

    		// Colorize red
    		for(var i = 0; i < redData.length; i+=4) {
        		redData[i] -= (redData[i] - 255);
    		}
    		//redImage.data = redData;
    		
    		// Draw the pixels onto the visible canvas
    		//disp.putImageData(redImage,(SCREEN_WIDTH - VIDEO_WIDTH)/2 - 25,(SCREEN_HEIGHT - VIDEO_HEIGHT)/2);
    		
    		// Colorize cyan
    		for(var i = 1; i < blueData.length; i+=4) {
        		blueData[i] -= (blueData[i] - 255);
        		blueData[i+1] -= (blueData[i+1] - 255);
    		}
    		//blueImage.data = blueData;
    		
            // Merge algorithm inspired by an answer from here http://stackoverflow.com/questions/17253085/blending-two-imagedata-into-one-imagedata-with-an-offset-in-javascript
            // Merge red and blue image . Here we have red as the main image
            var mixFactor = 0.5;
            for(var i = 0; i < redData.length; i+=4) {
                redData[i]   = redData[i]   * mixFactor;
                redData[i+1] = redData[i+1] * mixFactor;
                redData[i+2] = redData[i+2] * mixFactor;
            }
            for(var i = 0; i < redData.length; i+=4) {
                redData[100+i] += blueData[i]*(1-mixFactor);
                redData[100+i+1] += blueData[i+1]*(1-mixFactor);
                redData[100+i+2] += blueData[i+2]*(1-mixFactor);
            }
            redImage.data = redData;
    		// Draw the pixels onto the visible canvas
    		disp.putImageData(redImage,(SCREEN_WIDTH - VIDEO_WIDTH)/2 + 25,(SCREEN_HEIGHT - VIDEO_HEIGHT)/2); 

		}, 20);
});

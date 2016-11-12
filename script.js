navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;

addEventListener('load', engage);

var audioArray;
var analyzer;
var context;

function engage() {
	var canvas = document.querySelector('canvas');
	context = canvas.getContext('2d');
	
	canvas.addEventListener('click', function() {
		if(canvas.webkitRequestFullScreen)
			canvas.webkitRequestFullScreen();
	});
	
	
	navigator.getUserMedia( {audio:true}, weGotOurselvesAMicrophone, thatsAnError );
}

function weGotOurselvesAMicrophone(stream) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioContext = new AudioContext();

    var mediaStreamSource = audioContext.createMediaStreamSource( stream );
	
	analyzer = audioContext.createAnalyser();
	//analyzer.fftSize = 32;
	audioArray = new Float32Array(analyzer.frequencyBinCount);

    mediaStreamSource.connect( analyzer );
	
	window.a = analyzer;
	
	requestAnimationFrame(drawStuff);
}

function drawStuff(hrTimeStamp) {
	analyzer.getFloatTimeDomainData(audioArray);
	
	var sum = 0;
	for(var i = 0; i < audioArray.length; i++)
		sum += Math.pow(audioArray[i], 2);
	var rms = Math.sqrt(sum / audioArray.length);
		
	var hue = 360 * rms;
	var color = "hsl("+hue+",100%, 50%)";
	context.fillStyle = color;
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	context.fillStyle = "#FAA2FA";
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	context.globalAlpha = rms;
	context.fillStyle = "#F00";
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	context.globalAlpha = 1;
	
	//drawAnalyzer();
	
	requestAnimationFrame(drawStuff);
}

function drawAnalyzer() {

	context.beginPath();
	for(var i = 0; i < audioArray.length; i++) {
		var y = audioArray[i]*context.canvas.height/2 + context.canvas.height/2;
		context.lineTo(context.canvas.width * i / audioArray.length, y);
	}
	context.stroke();
}

function thatsAnError(e) {
	alert('oops');
}
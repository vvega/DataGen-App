/* © 2009 ROBO Design
 * http://www.robodesign.ro
 */
 var mousePos = [];
 var canvas;
// Keep everything in anonymous function, called on window load.
if(window.addEventListener) {
	window.addEventListener('load', function () {
	  var context, offsetX, offsetY;
	  offsetX = 15;
	  offsetY = 64;

	  // Initialization sequence.
	  function init () {
		canvas = document.getElementById('drawing');
		context = canvas.getContext('2d');
		clearBtn = document.getElementById('clear');
		
		canvas.addEventListener('mousedown', ev_mousedown, false);
		canvas.addEventListener('mouseup', stopDrawing, false);
		canvas.addEventListener('mousemove', ev_mousemove, false);
		canvas.addEventListener('mouseout', stopDrawing, false);
		clearBtn.addEventListener('mousedown', clearCanvas, false);
	  }

	  // The mousemove event handler.
	  var started = false;
	  
	  function clearCanvas() {
		started = false;
		context.closePath();
		context.clearRect(0, 0, canvas.width, canvas.height);
		mousePos = [];
		return;
	  }
	  function stopDrawing() {
		started = false;
	  }
	  function ev_mousedown (ev) {
		started = true;
	  }
	  function ev_mousemove (ev) {
		  if(started) {
				var x, y;

				// Get the mouse position relative to the canvas element.
				if (ev.layerX || ev.layerX == 0) { // Firefox
				  x = ev.layerX - offsetX;
				  y = ev.layerY - offsetY;
				} else if (ev.offsetX || ev.offsetX == 0) { // Opera
				  x = ev.offsetX - offsetX;
				  y = ev.offsetY - offsetY;
				}
				
				//save coordinates
				mousePos.push({"x":x,"y":y});
				
				// The event handler works like a drawing pencil which tracks the mouse 
				// movements. We start drawing a path made up of lines.
				if (!started) {
				  context.beginPath();
				  context.moveTo(x, y);
				  started = true;
				} else {
				  context.lineTo(x, y);
				  context.stroke();
				}
			  }
		  }

	  init();
	}, false); }

// vim:set spell spl=en fo=wan1croql tw=80 ts=2 sw=2 sts=2 sta et ai cin fenc=utf-8 ff=unix:
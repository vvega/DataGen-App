/* © 2009 ROBO Design
 * http://www.robodesign.ro
 */
 var mousePos = [];
 var canvas;
 var prevX = -1;

 //var reverseDraw = null;
// Keep everything in anonymous function, called on window load.
if(window.addEventListener) {
	window.addEventListener('load', function () {
	  var context, offsetX, offsetY;
	  offsetX = 66;
	  offsetY = 66;
	  
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
		
		//draw arrows
		var arrowXCanvas = document.getElementById('x_arrow');
		var arrowYCanvas = document.getElementById('y_arrow');
		var arrowXContext = arrowXCanvas.getContext('2d');
		var arrowYContext = arrowYCanvas.getContext('2d');
		arrowXContext.lineWidth = 1;
		
		arrowXContext.beginPath();
		canvas_arrow(arrowXContext, 0, 20, 460, 20);
		arrowXContext.stroke();
		
		arrowYContext.beginPath();
		canvas_arrow(arrowYContext, 25, 475, 25, 30);
		arrowYContext.stroke();
		
		//append text
		arrowXContext.font = "18px sans-serif";
		arrowYContext.font = "18px sans-serif";
		arrowXContext.fillText("x", 470, 25);
		arrowYContext.fillText("y", 20, 15);
							   
		//chrome test
		var isChrome = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());
		if(isChrome) {
			offsetX = 0;
			offsetY = 0;
			clearCanvas();
		}	
	  }

	  // The mousemove event handler.
	  var started = false;
	  
	  function clearCanvas() {
		started = false;
		context.closePath();
		context.save();
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.clearRect(0, 0, canvas.width, canvas.height);
		mousePos = [];
		context.beginPath();
		//reverseDraw = null;
		prevX = -1;
		return;
	  }
	  function stopDrawing() {
		started = false;
	  }
	  function ev_mousedown (ev) {
		started = true;
	  }
	  function ev_mousemove (ev) {
	//  console.log(reverseDraw);
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
				
				/*if(reverseDraw != null) {
					if(reverseDraw) {
						//save coordinate if it is a lesser x value
						if(x < prevX) {
							mousePos.push({"x":x,"y":y});
							prevX = x;
						}
					} else {*/
						//save coordinate if it is a greater x value
						if(x > prevX) {
							mousePos.push({"x":x,"y":y});
							prevX = x;
						}
			/*		}
				} */
				
				//prevX = x;
				// The event handler works like a drawing pencil which tracks the mouse 
				// movements. We start drawing a path made up of lines.
				if (!started) {
				  context.beginPath();
				  context.moveTo(x, y);
				 // prevX = x;
				  started = true;
				} else {
				  context.lineTo(x, y);
				  context.stroke();
				}
			  }
		  }

	  init();
	}, false); }
	
	function canvas_arrow(context, fromx, fromy, tox, toy){
		var headlen = 10;   // length of head in pixels
		var angle = Math.atan2(toy-fromy,tox-fromx);
		context.moveTo(fromx, fromy);
		context.lineTo(tox, toy);
		context.lineTo(tox-headlen*Math.cos(angle-Math.PI/6),toy-headlen*Math.sin(angle-Math.PI/6));
		context.moveTo(tox, toy);
		context.lineTo(tox-headlen*Math.cos(angle+Math.PI/6),toy-headlen*Math.sin(angle+Math.PI/6));
	}

// vim:set spell spl=en fo=wan1croql tw=80 ts=2 sw=2 sts=2 sta et ai cin fenc=utf-8 ff=unix:
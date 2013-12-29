var xmin, xmax, ymin, ymax, stdev, lxmin, lxmax, lymin, lymax, num_tests;
var newCoords = [];
var canvas_coords = [];
var TAB_FIXED_ENTRY = 0;
var TAB_FIXED_INTERVAL = 1;

function addFields() {
	var numRows = parseInt($("#num_values").val());
	$("#value_entry_container").empty();
	for(var i = 0; i < numRows; i++) {
		var $template = $("#value_entry_template").clone();
		$template.attr("id", i+1);
		var $label = $template.find("span");
		$label.html("x"+(i+1));
		$template.appendTo("#value_entry_container");
	}
}
function showFixed() {
	$("#fixed_content").show();
	$("#random_content").hide();
}
function showRandom() {
	$("#fixed_content").hide();
	$("#random_content").show();
}
function processFixed() {
	
	getGraphInfo();
	scaleCoords();
	
	if($("#fixed_content li.active").val() == TAB_FIXED_ENTRY) {
		processEntries();
	} else if($("#fixed_content li.active").val() == TAB_FIXED_INTERVAL) {
		processIntervals();
	}
}
function processRandom() {
	getGraphInfo();
	scaleCoords();
	processRandom();
}
function getGraphInfo() {
	xmin = $("#xmin").val();
	xmax = $("#xmax").val();
	ymin = $("#ymin").val();
	ymax = $("#ymax").val();
	stdev = $("#stdev").val();
	num_tests = $("#num_tests").val();
}
function scaleCoords() {
	
	var newX, newY, yVal;
	
	findMinAndMax();
	
	for(var k = 0; k < mousePos.length; k++) {
		yVal = Math.abs(canvas.height - mousePos[k].y);
		newX = roundToTwo((((mousePos[k].x)*(xmax-xmin))/(lxmax-lxmin)) + xmin);
		newY = roundToTwo(((yVal*(ymax-ymin))/(lymax-lymin)) + ymin);
		newCoords.push({"x":newX,"y":newY});
	}
	
	console.log("lxmin:"+lxmin+" lxmax:"+lxmax+" lymin:"+lymin+" lymax:"+lymax);
	console.log(newCoords);
}
function findMinAndMax() {

	lxmin = mousePos[0].x;
	lxmax = mousePos[0].x;
	lymin = mousePos[0].y;
	lymax = mousePos[0].y;
	
	for(var i = 1; i < mousePos.length; i++) {
		if(mousePos[i].x > lxmax) {
			lxmax = mousePos[i].x;
		}
		if(mousePos[i].x < lxmin) {
			lxmin = mousePos[i].x;
		}
		//y values are reversed; 
		//lower on the graph means higher y value on the canvas
		if(mousePos[i].y > lymin) {
			lymin = mousePos[i].y;
		}
		if(mousePos[i].y < lymax) {
			lymax = mousePos[i].y;
		}
	}
	if(lxmax > canvas.width) {
		lxmax = canvas.width;
	}
	if(lymax < 0) {
		lymax = 0;
	}
	
	lymax = Math.abs(canvas.height - lymax);
	lymin = Math.abs(canvas.height - lymin);
}
function processEntries() {
}
function approximateYValue(x) {
	//return (x*closestYCoordValue)/closestXCoordValue);
}
function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}
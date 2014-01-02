var xmin, xmax, ymin, ymax, ydev, lxmin, lxmax, lymin, lymax, num_tests;
var newCoords = [];
var dataCoords = [];
var isRandom = false;
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
function applyYDev(y) {

	if(ydev != 0 && ydev != "") {
		return (y + ((Math.random()*2*ydev) - ydev));
	}
	return y;
}
function processFixed() {
	
	getGraphInfo();
	scaleCoords();
	
	if($("#fixed_content li.active").val() == TAB_FIXED_ENTRY) {
		showResults(processEntries());
	} else if($("#fixed_content li.active").val() == TAB_FIXED_INTERVAL) {
		showResults(processIntervals());
	}
}
function processRandom() {

	getGraphInfo();
	scaleCoords();

	showResults(processRandomValues());
}
function processEntries() {
	//populate array with x values based on entries
	var results = [];
	
	$("#value_entry_container input").each(function(index) {
		results.push($(this).val());
	});
	
	return results;
}
function processIntervals() {
	//populate array with x values based on intervals
	var results = [];
	var interval = $("#interval_amount").val();
	//var numX = ((xmax-xmin)/interval) + 1;
	var numX = (xmax-xmin)/interval;
	
	results.push(xmin);
	for(var i = 1; i <= numX; i++) {
		results.push(xmin + (i*interval));
	}

	return results;
}
function processRandomValues() {
	//populate array with random x values
	var results = [];

	for(var i = 0; i < num_tests; i++) {
		results.push(roundToTwo((Math.random()*(xmax-xmin)) + xmin));
	}

	return results;
}
function getGraphInfo() {
	xmin = parseFloat($("#xmin").val());
	xmax = parseFloat($("#xmax").val());
	ymin = parseFloat($("#ymin").val());
	ymax = parseFloat($("#ymax").val());
	ydev = parseFloat($("#ydev").val());
	num_tests = parseInt($("#num_tests").val());
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
	
	//console.log("lxmin:"+lxmin+" lxmax:"+lxmax+" lymin:"+lymin+" lymax:"+lymax);
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
function getApproximateYValue(x) {

	var closest = null;
	var previousIndex, closestIndex, x0, x1, y0, y1;

	for(var i = 0; i < newCoords.length; i++){
	  if (closest == null || Math.abs(newCoords[i].x - x) < Math.abs(closest.x - x)) {
		closest = newCoords[i];
		closestIndex = i;
	  }
	}
	
	if(closestIndex == 0) {
		previousIndex = 0;
	} else {
		previousIndex = closestIndex - 1;
	}
	
	x0 = newCoords[previousIndex].x;
	x1 = newCoords[closestIndex].x;
	y0 = newCoords[previousIndex].y;
	y1 = newCoords[closestIndex].y;

	//return estimation via linear interpolation 
	return applyYDev(y0 + ((y1 - y0)*((x - x0)/(x1 - x0))));
	
}
function showResults(array) {
	
	var resultMarkup = "<table class = 'table table-striped'>";
	var yVal;
	resultMarkup += "<th>x</th>";
	
	if(!isRandom) {	
		for(var k = 0; k < num_tests; k++) {
			resultMarkup += "<th>y"+(k+1)+"</th>";
		}		
	} else {
		resultMarkup += "<th>y</th>";
	}

	$(array).each(function(index){

		dataCoords.push({"x":array[index], "y":[]});
		resultMarkup += "<tr>";
		resultMarkup += "<td>";
		resultMarkup += array[index];
		resultMarkup += "</td>";
		
		for(var i = 0; i < num_tests; i++) {
			
			yVal = roundToTwo(getApproximateYValue(array[index]));
			yVal = isNaN(yVal) ? "Undefined" : yVal;
			
			dataCoords[index].y.push(yVal);
			resultMarkup += "</td><td>";
			resultMarkup += yVal;
			resultMarkup += "</td>";	
			
			if(isRandom) {
				//only retrieve one value
				break;
			}
		}
		
		resultMarkup += "</tr>";		
	});

	if(isRandom) {
		$("#random_results_container").show();
		$("#random_results_container").html(resultMarkup+"</table>");
	} else {
		$("#results_container").show();
		$("#results_container").html(resultMarkup+"</table>");
	}
	//alert("finished!");
	
}
function saveToExcel() {
	if(isRandom) {
		window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#random_results_container').html()));
	}
	else {
		window.open('data:application/vnd.ms-excel,' + encodeURIComponent($('#results_container').html()));
	}
    e.preventDefault();
}
function showFixed() {
	isRandom = false;
	$("#fixed_content").show();
	$("#random_content").hide();
}
function showRandom() {
	isRandom = true;
	$("#fixed_content").hide();
	$("#random_content").show();
}
function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}
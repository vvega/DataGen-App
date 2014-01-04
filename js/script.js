var xmin, xmax, ymin, ymax, ydev, lxmin, lxmax, lymin, lymax, num_tests;
var dataCoords = [];
var newCoords = [];
var isRandom = false;
var TAB_FIXED_ENTRY = 0;
var TAB_FIXED_INTERVAL = 1;
var missing = false;

function addFields() {
	$("#step5").show();
	var numRows = parseInt($("#num_values").val());
	var existingRows = $("#value_entry_container .input-group").length;
	var itemIndex = 0;
	var difference = Math.abs(numRows - existingRows);
	
	if(numRows > existingRows) {
		for(var i = existingRows; i < existingRows + difference; i++) {
			var $template = $("#value_entry_template").clone();
			var $label = $template.find("span");
			$template.attr("id", (i+1));
			$label.html("x"+(i+1));
			$template.appendTo("#value_entry_container");
		}
	} else if(numRows < existingRows) {
		for(var k = existingRows; k > (existingRows - difference); k--) {
			$("#value_entry_container #"+(k)).remove();
		}
	}
	//$("#value_entry_container").empty();

}
function processFixed() {
	
	missing = checkForMissing();
	console.log(missing);
	if(!missing) {
		$("#excel_button").show();
		getGraphInfo();
		scaleCoords();
		
		if($("#fixed_content li.active").val() == TAB_FIXED_ENTRY) {
			showResults(processEntries());
		} else if($("#fixed_content li.active").val() == TAB_FIXED_INTERVAL) {
			showResults(processIntervals());
		}
	}
}
function processRandom() {

	isRandom = true;
	
	missing = checkForMissing();
	
	if(!missing) {
		$("#excel_button").show();
		getGraphInfo();
		scaleCoords();

		showResults(processRandomValues());
	}
}
function processEntries() {
	//populate array with x values based on entries
	var results = [];
	
	$("#value_entry_container .input-group input").each(function(index) {
		results.push($(this).val());
	});
	
	return results;
}
function processIntervals() {
	//populate array with x values based on intervals
	var results = [];
	var interval = $("#interval_amount").val();
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
	
	clearCoords();
	
	var newX, newY, yVal;
	
	findMinAndMax();
	
	newCoords.push({"x":xmin, "y":ymin});
	for(var k = 0; k < mousePos.length; k++) {
		yVal = Math.abs(canvas.height - mousePos[k].y);
		newX = roundToTwo((((mousePos[k].x)*(xmax-xmin))/(lxmax-lxmin)) + xmin);
		newY = roundToTwo(((yVal*(ymax-ymin))/(lymax-lymin)) + ymin);
		newCoords.push({"x":newX,"y":newY});
	}
	newCoords.push({"x":xmax, "y":ymax});
	
	console.log("lxmin:"+lxmin+" lxmax:"+lxmax+" lymin:"+lymin+" lymax:"+lymax);
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
	
	//account for entry of max and min values
	if(x == xmax) {
		return applyYDev(ymax);
	} else if(x == xmin) {
		return applyYDev(ymin);
	}
	
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
		$("#random_content").show();
		$("#random_results_container").show();
		$("#random_results_container").html(resultMarkup+"</table>");
	} else {
		$("#results_container").show();
		$("#results_container").html(resultMarkup+"</table>");
	}
}
function saveToExcel() {
	var fileData;
	var isIE = /msie/.test(navigator.userAgent.toLowerCase());
	
	if(isRandom) {
		fileData = 'data:application/vnd.ms-excel,' + encodeURIComponent($('#random_results_container').html());

	}
	else {
		fileData = 'data:application/vnd.ms-excel,' + encodeURIComponent($('#results_container').html());
	}
	
/*	if(isIE) {		
		$.("#excel_button").attr("href", fileData);
		
		window.location = fileData;
	} else {*/
		window.open(fileData);
	//}
}
function showFixed() {
	isRandom = false;
	$("#excel_button").hide();
	$("#fixed_content").show();
	$("#generate_fixed_button").show();
	$("#generate_random_button").hide();
	$("#random_content").hide();
}
function showRandom() {
	isRandom = true;
	$("#excel_button").hide();
	$("#fixed_content").hide();
	$("#generate_random_button").show();
	$("#generate_fixed_button").hide();
	$("#random_content").show();
}
function applyYDev(y) {

	if(ydev != 0 && ydev != "") {
		return (y + ((Math.random()*2*ydev) - ydev));
	}
	return y;
}
function roundToTwo(num) {
	if(num % 10 == 0) {
		return num;
	}
    return +(Math.round(num + "e+2")  + "e-2");
}
function clearCoords() {
	dataCoords = [];
	newCoords = [];
}
function checkForMissing() {
	missing = false;
	//close existing error messages
	$("#alert_container .alert").each(function() {
		$(this).hide();
	});

	if(!mousePos[0] || mousePos == []) {
		$("#drawing_alert").show();
		return true;
	}
	$("#canvas_form .input-group input").each(function () {
		if(!$(this).val()) {
			$("#graph_info_alert").show();
			missing = true;
			return;
		}
	});
	if(!$("#num_tests").val()) {
		$("#num_tests_alert").show();
			return true;
	}
	if(!isRandom) {
			if($("#fixed_content li.active").val() == TAB_FIXED_ENTRY) {
				if(!$("#num_values").val()) {
					$("#step4_alert").show();
					return true;
				}
				if($("#value_entry_container .input-group input").length == 0) {
					$("#value_entry_alert").show();
					return true;
				}
				$("#value_entry_container .input-group input").each(function () {
					if(!$(this).val()) {
						$("#value_entry_alert").show();
						missing = true;
						return;
					}
				});
			} else if($("#fixed_content li.active").val() == TAB_FIXED_INTERVAL) {
				if(!$("#interval_amount").val()) {
					$("#step4_alert").show();
					return true;
				}
			}	
	}
	
	if(missing) {
		return true;
	}
	
	return false;
}
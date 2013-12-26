function showFixed() {
	//specific or interval
	//calculate button
	$("#fixed_content").show();
	$("#random_content").hide();
}
function showRandom() {
	//calculate button
	$("#fixed_content").hide();
	$("#random_content").show();
}
function addFields() {
	var numRows = parseInt($("#num_values").val());
	$("#value_entry_container").empty();
	for(var i = 0; i < numRows; i++) {
		var $template = $("#value_entry_template").clone();
		$template.attr("id", i+1);
		var $label = $template.find("span");
		$label.html("x"+(i+1));
		console.log($label);
		//$label.attr("value", "x");
		//$template.attr("value",i);
	//	console.log($template);
		$template.appendTo("#value_entry_container");
	}
	/*$("#value_entry_container").addClass("<div class='input-group'><span class='input-group-addon'></span><input type='text' class='form-control' id='num_values'></div>");*/

}
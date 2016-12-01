
function Chart(data){
	var self = this;
	self.data = data;
	
	self.labelHeight = 55;
	self.barWidth = 5;
	self.margin = 4;
	self.barSpace = 1;
	self.dataOrganization = null;
	self.set = "T_";
	self.percentage = false;
	self.regions = true;
	self.previousSet = "T_";
	self.compare = false;

	self.svg = d3.select("#chart");

	self.svgHeight = self.svg.attr("height") - self.labelHeight

	self.scale();
	self.drawKey();
	self.drawFilters("summary");
	self.init()

};

// makes a new scale for the axis
Chart.prototype.scale = function(){

	var self = this;

	var scaleData = self.data.filter(function(d){
		return d.CC != "N/A";
	});

	self.barScaleP = d3.scaleLinear()
		.domain([0, 2])
		.range([0, self.svgHeight - 2*self.margin]);
	self.DDmax = d3.max(scaleData, function(d){
		return parseFloat(d[self.set+"DD"]);
	});
	self.SPmax = d3.max(scaleData, function(d){
		return parseFloat(d[self.set+"SP"]) - parseFloat(d[self.set+"DD"]);
	});
	self.barScale = d3.scaleLinear()
		.domain([0, self.DDmax + self.SPmax])
		.range([0, self.svgHeight - 2*self.margin]);

}

// initialises the chart
Chart.prototype.init = function(){

	var self = this;
	var percentage = false;
	
	// resize div based on window size
	var resize = Math.min(window.innerWidth - 150, 1700)
	document.getElementById("chartDiv").setAttribute("style", "width:"+ resize +"px");
	window.onresize = function(){
			resize = Math.min(window.innerWidth - 150, 1700)
			document.getElementById("chartDiv").setAttribute("style", "width:"+ resize +"px");
		}

	//creating tool tip functionality
	var tip = d3.tip().attr("class", "chartTip")
		.direction(function (){
			if (d3.event.clientX > 1400){ return 'w'}
			return 'e'
		})
		.offset(function(){
			if (d3.event.clientX > 1400){ return [-100,-30]}
			return [-100,30];
		})
		.html(function(d){
			var category = ["EX", "EW", "CR", "EN", "VU", "NT", "LC", "DD"];
			var tooltip_data = [];
			var extinct, redList, unthreatened;

			tooltip_data[0] = d.Country;

			if (self.percentage == true){
				for (var j = 0; j < category.length; j++){
					var number = (d[self.set+category[j]] / d[self.set+"SP"]) * 100;
					number = +number.toFixed(1);
					tooltip_data[j+1] = number + "%";
				}
				number = ((parseFloat(d[self.set+category[0]]) + parseFloat(d[self.set+category[1]])) / d[self.set+"SP"]) * 100;
				number = +number.toFixed(1);
				extinct = number + "%";
				number = ((parseFloat(d[self.set+category[2]]) + parseFloat(d[self.set+category[3]]) + parseFloat(d[self.set+category[4]])) / d[self.set+"SP"]) * 100;
				number = +number.toFixed(1);
				redList = number + "%";
				number = ((parseFloat(d[self.set+category[5]]) + parseFloat(d[self.set+category[6]])) / d[self.set+"SP"]) * 100;
				number = +number.toFixed(1);
				unthreatened = number + "%";
			}
			else{
				for (var j = 0; j < category.length; j++){
					tooltip_data[j+1] = d[self.set+category[j]];
				}
				extinct = parseInt(d[self.set+category[0]]) + parseInt(d[self.set+category[1]]);
				redList = parseInt(d[self.set+category[2]]) + parseInt(d[self.set+category[3]]) + parseInt(d[self.set+category[4]]);
				unthreatened = parseInt(d[self.set+category[5]]) + parseInt(d[self.set+category[6]]);
			}

			var c = ["#262626", "#666666", "#b22222", "#de5454", "#f3bfbf", "#a3c2db", "#4682b4", "#A59688"];

			var text = "<span style = 'font:12pt'><b>" + tooltip_data[0] + "</b><br><table>";
			for (var j = 1; j < tooltip_data.length; j++){
				text += "<tr><td><span style = 'color:" + c[j-1] + "'>" + tooltip_data[j] + "</span></td>";
				if(j == 1) {text += "<td>Extinct: "+ extinct +"</td>";}
				else if(j == 3) {text += "<td>Red List: "+ redList +"</td>";}
				else if(j == 6) {text += "<td>Unthreatened:</td>";}
				else if(j == 7) {text += "<td style = 'text-align:right'>"+ unthreatened +"</td>";}
				text += "</tr>"
			}
			text += "</table></span>"
			return text;
		})

	d3.select("#chart").call(tip);

	//grouping bars
	var g = self.svg.selectAll(".bars")
		.data(self.data, function(d){
			return d.Index;
		});

	var bars = g.enter().append("g")
		.attr("class", "bars");

	bars.attr("transform", function(d, i){
			return "translate(" + (i*(self.barWidth + self.barSpace) + self.margin) + ",0)";
		});

	// add lines by through regions

	var regions = bars.filter(function(d){
		return d.CC == "N/A"
	});

	regions.append("path")
		.attr("d", "M"+ (self.barWidth/2 + 2) +" 0 V"+ (self.svgHeight + 5) + "L"+ (self.labelHeight*2) + " " + self.svg.attr("height"))
		.attr("style", "stroke:#999999; fill:none");

	regions.append("text")
		.attr("class", "keyText")
		//.attr("x", self.barWidth/2 + 2)
		//.attr("y", self.svgHeight)
		.attr("transform", function(d){
			if (d.Region == "North America" || d.Region == "Antarctic"){
				return "translate("+ (self.barWidth) + ", "+ (self.svgHeight + 17) +")rotate(25)"
			}
			return "translate("+ (self.barWidth) + ", "+ (self.svgHeight + 3) +")rotate(25)"
		})
		.text(function(d){
			return d.Region;
		})


	// create bars

	bars = bars.filter(function(d){
		return d.CC != "N/A";
	});

	// make bars to tool-tip interaction
	bars.append("rect")
		.attr("class", "tipBar")
		.attr("x", self.barSpace)
		.attr("y", 0)
		.attr("width", self.barWidth)
		.attr("height", self.svgHeight)
		.style("fill", "#b6cee2")
		.style("stroke", "#6d9dc5")
		.style("opacity", 0)
		.on("mouseover", function(){
			d3.select(this).style("cursor", "pointer");
		})
		.on("mouseout", function(){
			d3.select(this).style("cursor", "default");
		});

	//tool tip events
	bars.on("mouseover", function(d){
			if(d[self.set + "SP"] != "?"){
				var send = d3.select(this).select(".tipBar")
					.style("opacity", 1);
				d3.select(this)
					.style("opacity", .9)
				tip.show(d)
			}
		})
		.on("hover", function(d){
			return tip.show(d);
		})
		.on("mouseout", function(){
			d3.select(this).select(".tipBar")
				.style("opacity", 0);
			d3.select(this)
				.style("opacity", 1)
			tip.hide();
		})


	// create data deficient bars
	bars.append("rect")
		/*.attr("class", function(d,i){
			return "index" + i;
		})*/
		.classed("DD", true)
		.attr("y", function(){
			if (percentage == true){
				return self.barScaleP(1) + self.margin;
			}
			else{
				return self.barScale(self.SPmax) + self.margin;
			}
		})
		.attr("x", self.barSpace)
		.attr("width", self.barWidth)
		.attr("height", function(d){
			if (percentage == true) {
				return self.barScaleP(parseFloat(d.T_DD) / parseFloat(d.T_SP))
			}
			else{
				return self.barScale(parseFloat(d.T_DD));
			}
		})
		.attr("fill", "#A59688");

	// create all other bars
	var placeholder = [];
	for (var i = 0; i < self.data.length; i++){
		placeholder[i] = 0;
	}
	var category = ["LC", "NT", "VU", "EN", "CR", "EW", "EX"];
	var color = ["#5a91bf", "#a3c2db", "#f7d4d4", "#e77e7e", "#d62929", "#8c8c8c", "#666666"];
	for (var j = 0; j < category.length; j++){
		bars.append("rect")
			/*.attr("class", function(d,i){
				return "index" + i;
			})
			.classed(category[j], true)*/
			.attr("class", category[j])
			.attr("y", function(d, i){
				if (percentage == true) {
					return self.barScaleP(1) + self.margin - placeholder[i] - self.barScaleP(parseFloat(d["T_"+category[j]]) / parseFloat(d.T_SP));
				}
				else{
					return self.barScale(self.SPmax) + self.margin - placeholder[i] - self.barScale(parseFloat(d["T_"+category[j]]));
				}
			})
			.attr("x", self.barSpace)
			.attr("width", self.barWidth)
			.attr("height", function(d, i){
				if (percentage == true) {
					placeholder[i] = placeholder[i] + self.barScaleP(parseFloat(d["T_"+category[j]]) / parseFloat(d.T_SP));
					return self.barScaleP(parseFloat(d["T_"+category[j]]) / parseFloat(d.T_SP));
				}
				else{
					placeholder[i] = placeholder[i] + self.barScale(parseFloat(d["T_"+category[j]]));
					return self.barScale(parseFloat(d["T_"+category[j]]));
				}
			})
			.attr("fill", color[j]);
	};

	// make axis
	self.drawAxis();

};

// highlights or un-highlights bars based on country codes
Chart.prototype.update = function(countryCode) {
	var self = this;

	self.separate();

	var bars = self.svg.selectAll("g");

	bars = bars.filter(function (d){
		for (var j = 0; j < countryCode.length; j++)
		{
			if(d.CC == countryCode[j]) {return true;}
		}
		return false;
	});

	var selected = bars.filter(function (){
			return d3.select(this).attr("class") == "bars";
		});

	var deselect = bars.filter(function (){
			return d3.select(this).attr("class") == "selectedBars";
		});


	selected.attr("class", "selectedBars")

	selected.append("line")
		.attr("class", "highlight left")
		.attr("y1", 1)
		.attr("x1", 0)
		.attr("y2", self.svgHeight - 1)
		.attr("x2", 0);
	selected.append("line")
		.attr("class", "highlight")
		.attr("y1", self.svgHeight - 1)
		.attr("x1", 0)
		.attr("y2", self.svgHeight - 1)
		.attr("x2", self.barSpace*2 + self.barWidth);
	selected.append("line")
		.attr("class", "highlight")
		.attr("y1", 1)
		.attr("x1", 0)
		.attr("y2", 1)
		.attr("x2", self.barSpace*2 + self.barWidth);
	selected.append("line")
		.attr("class", "highlight right")
		.attr("y1", 1)
		.attr("x1", self.barSpace*2 + self.barWidth)
		.attr("y2", self.svgHeight - 1)
		.attr("x2", self.barSpace*2 + self.barWidth);

	if (selected.data().length == 0) {
		deselect.attr("class", "bars")
			.selectAll(".highlight")
			.remove();
	}

	self.combine(false);

	//setting up brush --- relied on example https://bl.ocks.org/mbostock/4349545
	/*var brush = d3.brushX()
		.extent([[0, 0], [1800, self.svgHeight]])
		.on("start brush end", brushSelect);

	var groupBrush = d3.select("#chart").append("g")
		.attr("class", "brush")
		.call(brush);

	var handle = groupBrush.selectAll(".brushed")
		.data([{type: "w"}, {type: "e"}])
		.enter().append("path")
		.attr("class", "brushed")
		.attr("fill", "#666")
		.attr("fill-opacity", 0.8)
		.attr("stroke", "#000")
		.attr("stroke-width", 1.5)
		.attr("cursor", "ew-resize");

		groupBrush.call(brush);

	//provides selection update for brush
	function brushSelect() {
		var chartSelect = d3.event.selection;
		var countryBars = d3.selectAll(".bars");//.selectAll("rect");
		countryBars = countryBars["_groups"];

		//console.log(countryBars);
		var selectList = [];

		countryBars[0]
			.forEach(function(d){
				//console.log(d3.select(d).attr("transform"));
				var sTemp = d3.select(d).attr("transform")
				sTemp = parseInt(sTemp.slice(10, -3));
				//console.log(chartSelect);
				if (chartSelect === null){
					console.log("null");
					/* version3
					groupBrush
							.clear()
							.event(d3.select(".brush"));
					*//*
				} else {
					if (chartSelect[0] < sTemp) {
						if (chartSelect[1] > sTemp){
							selectList.push(d);
						};
					};
				};


			});
		console.log(selectList); //to do: implement selection

	}*/

}

// function for percent button
Chart.prototype.percentChange = function() {
	var self = this;

	var button = d3.select("#percentage");

	if (button.attr("class") == "selectedButton"){
		self.percentage = false;
		button.attr("class", "unselectedButton");
	}
	else{
		self.percentage = true;
		button.attr("class", "selectedButton");
	}



	var bars = self.svg.selectAll("g");

	// create data deficient bars
	var bar = bars.select(".DD");
	bar.transition()
		.duration(2000)
		.attr("height", function(d){
			if (self.percentage == true) {
				return self.barScaleP(parseFloat(d[self.set+"DD"]) / parseFloat(d[self.set+"SP"]))
			}
			else{
				return self.barScale(parseFloat(d[self.set+"DD"]));
			}
		})
		.attr("y", function(){
			if (self.percentage == true){
				return self.barScaleP(1) + self.margin;
			}
			else{
				return self.barScale(self.SPmax) + self.margin;
			}
		});

	// create all other bars
	var placeholder = [];
	for (var i = 0; i < self.data.length; i++){
		placeholder[i] = 0;
	}
	var category = ["LC", "NT", "VU", "EN", "CR", "EW", "EX"];
	for (var j = 0; j < category.length; j++){
		bar = bars.select("." + category[j]);
		bar.transition()
			.duration(2000)
			.attr("y", function(d, i){
				if (self.percentage == true) {
					//console.log(d);
					return self.barScaleP(1) + self.margin - placeholder[i] - self.barScaleP(parseFloat(d[self.set+category[j]]) / parseFloat(d[self.set + "SP"]));
				}
				else{
					return self.barScale(self.SPmax) + self.margin - placeholder[i] - self.barScale(parseFloat(d[self.set+category[j]]));
				}
			})
			.attr("height", function(d, i){
				if (self.percentage == true) {
					placeholder[i] = placeholder[i] + self.barScaleP(parseFloat(d[self.set+category[j]]) / parseFloat(d[self.set+"SP"]));
					return self.barScaleP(parseFloat(d[self.set+category[j]]) / parseFloat(d[self.set+"SP"]));
				}
				else{
					placeholder[i] = placeholder[i] + self.barScale(parseFloat(d[self.set+category[j]]));
					return self.barScale(parseFloat(d[self.set+category[j]]));
				}
			});
	};

	// make axis
	self.drawAxis();




}

// function for region button
Chart.prototype.regionChange = function() {
	var self = this;

	self.separate();


	if (d3.select("#regions").attr("class") == "selectedButton") {
		d3.select("#regions").attr("class", "unselectedButton");
		self.regions = false;

		// remove region lines
		var removeLines = self.svg.selectAll("g").filter(function (d) {
			return d.CC == "N/A"
		});

		removeLines.transition()
			.duration(700)
			.style("opacity", 0);


		// reorder lines
		var closeSpaces = self.svg.selectAll("g")
			.filter(function (d) {
				return d.CC != "N/A" && d[self.set + "SP"] != "?";
			});

		closeSpaces.transition()
			.duration(700)
			.attr("transform", function (d, i) {
				return "translate(" + (i * (self.barWidth + self.barSpace) + self.margin) + ",0)";
			});

		self.combine(false);

	}
	else {
		self.regions = true;
		d3.select("#regions").attr("class", "selectedButton")

		// add the region lines back
		var lines = self.svg.selectAll("g").filter(function (d) {
			return d.CC == "N/A"
		});

		lines.style("opacity", 1);

		// reorder lines
		var resort = self.svg.selectAll("g");

		resort.sort(function (a, b) {
				return parseInt(a.Index) - parseInt(b.Index);
			});

		var reorder = self.svg.selectAll("g")
			.filter(function (d) {
				return d[self.set + "SP"] != "?";
			});

		reorder.transition()
			.duration(2000)
			.attr("transform", function (d, i) {
				return "translate(" + (i * (self.barWidth + self.barSpace) + self.margin) + ",0)";
			});

		self.combine(true);

	}

}

// function for summary, mammals, amphibians buttons
Chart.prototype.dataChange = function (file) {
	var self = this;

	self.separate();

	var category = ["LC", "NT", "VU", "EN", "CR", "EW", "EX"];
	var color = ["#5a91bf", "#a3c2db", "#f7d4d4", "#e77e7e", "#d62929", "#8c8c8c", "#666666"];

	var summary = d3.select("#summary");
	var mammals = d3.select("#mammals");
	var amphibians = d3.select("#amphibians");


	if (file == "summary" && summary.attr("class") == "unselectedButton"){
		summary.attr("class", "selectedButton");
		mammals.attr("class", "unselectedButton");
		amphibians.attr("class", "unselectedButton");

		self.set = "T_";
		self.svg.attr("width", 1600)
	}
	if (file == "mammals" && mammals.attr("class") == "unselectedButton"){
		summary.attr("class", "unselectedButton");
		mammals.attr("class", "selectedButton");
		amphibians.attr("class", "unselectedButton");

		self.set = "M_";
		self.svg.attr("width", 1550)
	}
	if (file == "amphibians" && amphibians.attr("class") == "unselectedButton"){
		summary.attr("class", "unselectedButton");
		mammals.attr("class", "unselectedButton");
		amphibians.attr("class", "selectedButton");

		self.set = "A_";
		self.svg.attr("width", 1250)
	}


	var bars = self.svg.selectAll("g");



	// remove bars with no data
	var remove = bars.filter(function(d){
		return d.CC != "N/A" && d[self.set+"SP"] == "?";
	});

	remove.style("opacity", 0);

	remove.select(".DD")
		.remove();

	for (var j = 0; j < category.length; j++){
		remove.select("."+category[j])
			.remove();
	}

	remove.selectAll(".tipBar")
		.style("pointer-events", "none");

	bars = bars.filter(function(d){
		return d.CC != "N/A" && d[self.set+"SP"] != "?";
	});




	self.scale();
	self.drawAxis();



	// update data deficient bars
	var bar = bars.select(".DD");
	bar.transition()
		.duration(2000)
		.attr("height", function(d){
			if (self.percentage == true) {
				return self.barScaleP(parseFloat(d[self.set+"DD"]) / parseFloat(d[self.set+"SP"]))
			}
			else{
				return self.barScale(parseFloat(d[self.set+"DD"]));
			}
		})
		.attr("y", function(){
			if (self.percentage == true){
				return self.barScaleP(1) + self.margin;
			}
			else{
				return self.barScale(self.SPmax) + self.margin;
			}
		});

	// update all other bars
	var placeholder = [];
	for (var i = 0; i < self.data.length; i++){
		placeholder[i] = 0;
	}
	for (var j = 0; j < category.length; j++){
		bar = bars.select("." + category[j]);
		bar.transition()
			.duration(2000)
			.attr("y", function(d, i){
				if (self.percentage == true) {
					//console.log(d);
					return self.barScaleP(1) + self.margin - placeholder[i] - self.barScaleP(parseFloat(d[self.set+category[j]]) / parseFloat(d[self.set + "SP"]));
				}
				else{
					return self.barScale(self.SPmax) + self.margin - placeholder[i] - self.barScale(parseFloat(d[self.set+category[j]]));
				}
			})
			.attr("height", function(d, i){
				if (self.percentage == true) {
					placeholder[i] = placeholder[i] + self.barScaleP(parseFloat(d[self.set+category[j]]) / parseFloat(d[self.set+"SP"]));
					return self.barScaleP(parseFloat(d[self.set+category[j]]) / parseFloat(d[self.set+"SP"]));
				}
				else{
					placeholder[i] = placeholder[i] + self.barScale(parseFloat(d[self.set+category[j]]));
					return self.barScale(parseFloat(d[self.set+category[j]]));
				}
			});
	}

	// order bars before adding new ones
	if (self.regions == true) {
		var reorder = self.svg.selectAll("g")
			.filter(function (d) {
				return d[self.set + "SP"] != "?";
			})

		reorder.transition()
			.duration(2000)
			.attr("transform", function (d, i) {
				return "translate(" + (i * (self.barWidth + self.barSpace) + self.margin) + ",0)";
			});
	}
	else {
		var reorder = self.svg.selectAll("g")
			.filter(function (d) {
				return d.CC != "N/A" && d[self.set + "SP"] != "?";
			})

		reorder.transition()
			.duration(2000)
			.attr("transform", function (d, i) {
				return "translate(" + (i * (self.barWidth + self.barSpace) + self.margin) + ",0)";
			});
	}



	// add bars with a newly functional dataset
	if(self.set == "T_" && self.previousSet == "A_"){
		var enter = bars.filter(function(d){
			return d.CC != "N/A" && d.A_SP == "?";
		})
	}
	if(self.set == "T_" && self.previousSet == "M_"){
		var enter = bars.filter(function(d){
			return d.CC != "N/A" && d.M_SP == "?"
		})
	}
	else if(self.set == "M_" && self.previousSet == "A_"){
		var enter = bars.filter(function(d){
			return d.CC != "N/A" && d.A_SP == "?";
		})
	}
	else if(self.set == "A_" && self.previousSet == "M_"){
		var enter = bars.filter(function(d){
			return d.CC != "N/A" && d.M_SP == "?";
		})
	}

	if(enter != undefined) {

		enter.append("rect")
			.classed("DD", true)
			.attr("x", self.barSpace)
			.attr("width", self.barWidth)
			.attr("y", function () {
				if (self.percentage == true) {
					return self.barScaleP(1) + self.margin;
				}
				else {
					return self.barScale(self.SPmax) + self.margin;
				}
			})
			.attr("fill", "#A59688");

		for (var j = 0; j < category.length; j++) {
			enter.append("rect")
				.attr("class", category[j])
				.attr("x", self.barSpace)
				.attr("y", function () {
					if (self.percentage == true) {
						return self.barScaleP(1) + self.margin;
					}
					else {
						return self.barScale(self.SPmax) + self.margin;
					}
				})
				.attr("width", self.barWidth)
				.attr("fill", color[j]);
		}

		// update data deficient bars
		var bar = enter.select(".DD");
		bar.transition()
			.delay(1500)
			.duration(2000)
			.attr("height", function (d) {
				if (self.percentage == true) {
					return self.barScaleP(parseFloat(d[self.set + "DD"]) / parseFloat(d[self.set + "SP"]))
				}
				else {
					return self.barScale(parseFloat(d[self.set + "DD"]));
				}
			})
			.attr("y", function () {
				if (self.percentage == true) {
					return self.barScaleP(1) + self.margin;
				}
				else {
					return self.barScale(self.SPmax) + self.margin;
				}
			});

		// update all other bars
		var placeholder = [];
		for (var i = 0; i < self.data.length; i++) {
			placeholder[i] = 0;
		}
		for (var j = 0; j < category.length; j++) {
			bar = enter.select("." + category[j]);
			bar.transition()
				.delay(1500)
				.duration(2000)
				.attr("y", function (d, i) {
					if (self.percentage == true) {
						//console.log(d);
						return self.barScaleP(1) + self.margin - placeholder[i] - self.barScaleP(parseFloat(d[self.set + category[j]]) / parseFloat(d[self.set + "SP"]));
					}
					else {
						return self.barScale(self.SPmax) + self.margin - placeholder[i] - self.barScale(parseFloat(d[self.set + category[j]]));
					}
				})
				.attr("height", function (d, i) {
					if (self.percentage == true) {
						placeholder[i] = placeholder[i] + self.barScaleP(parseFloat(d[self.set + category[j]]) / parseFloat(d[self.set + "SP"]));
						return self.barScaleP(parseFloat(d[self.set + category[j]]) / parseFloat(d[self.set + "SP"]));
					}
					else {
						placeholder[i] = placeholder[i] + self.barScale(parseFloat(d[self.set + category[j]]));
						return self.barScale(parseFloat(d[self.set + category[j]]));
					}
				});

			enter.style("opacity", 1);

			enter.selectAll(".tipBar")
				.style("pointer-events", "auto")
		}
	}

	self.previousSet = self.set;
	self.combine(true);
}

// function for key buttons
Chart.prototype.sort = function(order) {
	var self = this;
	var bars;
	self.separate();

	if (self.dataOrganization != order + self.percentage + self.regions + self.set) {

		self.dataOrganization = order + self.percentage + self.regions + self.set;


		if (self.regions == true){

			var reg = ["North America", "Caribbean Islands", "Mesoamerica", "South America", "Europe", "North Africa", "Sub-Saharan Africa", "Antarctic", "North Asia", "West & Central Asia", "East Asia", "South & Southeast Asia", "Oceania"];

			for(var j = 0; j < reg.length; j++ ){
				bars = self.svg.selectAll("g")
					.filter(function (d) {
						return d.CC != "N/A" && d.Region == reg[j] && d[self.set + "SP"] != "?";
					})

				// organize based on selected order and percentage
				if (self.percentage == true) {
					if (order == "extinct") {
						bars.sort(function (a, b) {
							return d3.descending((parseFloat(a[self.set + "EX"]) + parseFloat(a[self.set + "EW"])) / a[self.set + "SP"], (parseFloat(b[self.set + "EX"]) + parseFloat(b[self.set + "EW"])) / b[self.set + "SP"])
						});
					}
					else if (order == "redList") {
						bars.sort(function (a, b) {
							return d3.descending((parseFloat(a[self.set + "CR"]) + parseFloat(a[self.set + "EN"]) + parseFloat(a[self.set + "VU"])) / a[self.set + "SP"], (parseFloat(b[self.set + "CR"]) + parseFloat(b[self.set + "EN"]) + parseFloat(b[self.set + "VU"])) / b[self.set + "SP"])
						});
					}
					else if (order == "unthreatened") {
						bars.sort(function (a, b) {
							return d3.descending((parseFloat(a[self.set + "LC"]) + parseFloat(a[self.set + "NT"])) / a[self.set + "SP"], (parseFloat(b[self.set + "LC"]) + parseFloat(b[self.set + "NT"])) / b[self.set + "SP"])
						});
					}
					else if (order == "dataDeficient") {
						bars.sort(function (a, b) {
							return d3.descending(a[self.set + "DD"] / a[self.set + "SP"], b[self.set + "DD"] / b[self.set + "SP"])
						});
					}
				}
				else {
					if (order == "extinct") {
						bars.sort(function (a, b) {
							return d3.descending(parseInt(a[self.set + "EX"]) + parseInt(a[self.set + "EW"]), parseInt(b[self.set + "EX"]) + parseInt(b[self.set + "EW"]))
						});
					}
					else if (order == "redList") {
						bars.sort(function (a, b) {
							return d3.descending(parseInt(a[self.set + "CR"]) + parseInt(a[self.set + "EN"]) + parseInt(a[self.set + "VU"]), parseInt(b[self.set + "CR"]) + parseInt(b[self.set + "EN"]) + parseInt(a[self.set + "VU"]))
						});
					}
					else if (order == "unthreatened") {
						bars.sort(function (a, b) {
							return d3.descending(parseInt(a[self.set + "LC"]) + parseInt(a[self.set + "NT"]), parseInt(b[self.set + "LC"]) + parseInt(b[self.set + "NT"]))
						});
					}
					else if (order == "dataDeficient") {
						bars.sort(function (a, b) {
							return d3.descending(parseInt(a[self.set + "DD"]), parseInt(b[self.set + "DD"]))
						});
					}
				}

			}

			var regionReorder = self.svg.selectAll("g");

			regionReorder = regionReorder.filter(function (d) {
					return d[self.set + "SP"] != "?";
				});

			regionReorder.transition()
				.duration(2000)
				.attr("transform", function (d, i) {
					return "translate(" + (i * (self.barWidth + self.barSpace) + self.margin) + ",0)";
				});

		}
		else {

			bars = self.svg.selectAll("g")
				.filter(function (d) {
					return d.CC != "N/A" && d[self.set + "SP"] != "?";
				});

			// organize based on selected order and percentage
			if (self.percentage == true) {
				if (order == "extinct") {
					bars.sort(function (a, b) {
						return d3.descending((parseFloat(a[self.set + "EX"]) + parseFloat(a[self.set + "EW"])) / a[self.set + "SP"], (parseFloat(b[self.set + "EX"]) + parseFloat(b[self.set + "EW"])) / b[self.set + "SP"])
					});
				}
				else if (order == "redList") {
					bars.sort(function (a, b) {
						return d3.descending((parseFloat(a[self.set + "CR"]) + parseFloat(a[self.set + "EN"]) + parseFloat(a[self.set + "VU"])) / a[self.set + "SP"], (parseFloat(b[self.set + "CR"]) + parseFloat(b[self.set + "EN"]) + parseFloat(b[self.set + "VU"])) / b[self.set + "SP"])
					});
				}
				else if (order == "unthreatened") {
					bars.sort(function (a, b) {
						return d3.descending((parseFloat(a[self.set + "LC"]) + parseFloat(a[self.set + "NT"])) / a[self.set + "SP"], (parseFloat(b[self.set + "LC"]) + parseFloat(b[self.set + "NT"])) / b[self.set + "SP"])
					});
				}
				else if (order == "dataDeficient") {
					bars.sort(function (a, b) {
						return d3.descending(a[self.set + "DD"] / a[self.set + "SP"], b[self.set + "DD"] / b[self.set + "SP"])
					});
				}
			}
			else{
				if (order == "extinct") {
					bars.sort(function (a, b) {
						return d3.descending(parseInt(a[self.set + "EX"]) + parseInt(a[self.set + "EW"]), parseInt(b[self.set + "EX"]) + parseInt(b[self.set + "EW"]))
					});
				}
				else if (order == "redList") {
					bars.sort(function (a, b) {
						return d3.descending(parseInt(a[self.set + "CR"]) + parseInt(a[self.set + "EN"]) + parseInt(a[self.set + "VU"]), parseInt(b[self.set + "CR"]) + parseInt(b[self.set + "EN"]) + parseInt(b[self.set + "VU"]))
					});
				}
				else if (order == "unthreatened") {
					bars.sort(function (a, b) {
						return d3.descending(parseInt(a[self.set + "LC"]) + parseInt(a[self.set + "NT"]), parseInt(b[self.set + "LC"]) + parseInt(b[self.set + "NT"]))
					});
				}
				else if (order == "dataDeficient") {
					bars.sort(function (a, b) {
						return d3.descending(parseInt(a[self.set + "DD"]), parseInt(b[self.set + "DD"]))
					});
				}
			}

			var reorder = self.svg.selectAll("g")

			reorder = reorder.filter(function (d) {
					return d.CC != "N/A" && d[self.set + "SP"] != "?";
				})

			reorder.transition()
				.duration(2000)
				.attr("transform", function (d, i) {
					return "translate(" + (i * (self.barWidth + self.barSpace) + self.margin) + ",0)";
				});
		}
	}

	self.combine(true);

}

// draws the axis for each data set
Chart.prototype.drawAxis = function(){

	var self = this;

	var percentage = false;
	if (d3.select("#percentage").attr("class") == "selectedButton"){
		percentage = true;
	}
	var axis = d3.select("#axis");

	axis.selectAll(".axis").remove();

	axis.append("line")
		.attr("class", "axis")
		.attr("y1", self.margin)
		.attr("y2", axis.attr("height") - self.labelHeight - self.margin)
		.attr("x1", axis.attr("width") - 1)
		.attr("x2", axis.attr("width") - 1);

	if(percentage == true){
		for (var j = 0; j <= 2; j = j + .5){
			axis.append("line")
				.attr("class", "axis")
				.attr("y1", self.barScaleP(j) + self.margin)
				.attr("y2", self.barScaleP(j) + self.margin)
				.attr("x1", axis.attr("width") - 7)
				.attr("x2", axis.attr("width"));
			axis.append("text")
				.attr("class", "axis")
				.attr("y", function(){
					if (j == 0 ){
						return self.barScaleP(j) + 10;
					}
					else if (j == 2){
						return self.barScaleP(j) + 2;
					}
					else{
						return self.barScaleP(j) + 8;
					}
				})
				.attr("x", axis.attr("width") - 13)
				.text(function(){
					if (j == 0 || j == 2){
						return "100%";
					}
					else if (j == 1){
						return "0%";
					}
					else{
						return "50%";
					}
				})
		}
	}
	else{

		var increment = Math.round(self.DDmax/(2*Math.pow(10, self.DDmax.toString().length - 1))) * Math.pow(10, self.DDmax.toString().length - 1);

		axis.append("line")
			.attr("class", "axis")
			.attr("y1", self.barScale(self.SPmax) + self.margin)
			.attr("y2", self.barScale(self.SPmax) + self.margin)
			.attr("x1", axis.attr("width") - 7)
			.attr("x2", axis.attr("width"));
		axis.append("text")
			.attr("class", "axis")
			.attr("y", self.barScale(self.SPmax) + 8)
			.attr("x", axis.attr("width") - 13)
			.text("0")

		for(var j = 1; j <= self.DDmax/increment; j++){
			axis.append("line")
				.attr("class", "axis")
				.attr("y1", self.barScale(self.SPmax + increment*j) + self.margin)
				.attr("y2", self.barScale(self.SPmax + increment*j) + self.margin)
				.attr("x1", axis.attr("width") - 7)
				.attr("x2", axis.attr("width"));
			axis.append("text")
				.attr("class", "axis")
				.attr("y", self.barScale(self.SPmax + increment*j) + 8)
				.attr("x", axis.attr("width") - 13)
				.text(increment*j)
		}

		for(var j = 1; j <= self.SPmax/increment; j++){
			axis.append("line")
				.attr("class", "axis")
				.attr("y1", self.barScale(self.SPmax - increment*j) + self.margin)
				.attr("y2", self.barScale(self.SPmax - increment*j) + self.margin)
				.attr("x1", axis.attr("width") - 7)
				.attr("x2", axis.attr("width"));
			axis.append("text")
				.attr("class", "axis")
				.attr("y", self.barScale(self.SPmax - increment*j) + 8)
				.attr("x", axis.attr("width") - 13)
				.text(increment*j)

		}
	}
}

// draws the key and creates sorting buttons
Chart.prototype.drawKey = function() {
	var self = this;
	var axisHeight = 5;
	var textWidth = 18;


	var key = d3.select("#key");
	key.selectAll("*").remove();
	var c = ["#666666", "#8c8c8c", "#d62929", "#e77e7e", "#f7d4d4", "#a3c2db", "#5a91bf", "#A59688"];

	key.append("line")
		.attr("x1", 0)
		.attr("y1", key.attr("height"))
		.attr("y2", key.attr("height"))
		.attr("x2", key.attr("width"));

	key.append("line")
		.attr("x1", (key.attr("width") * 2) / c.length)
		.attr("y1", 0)
		.attr("y2", key.attr("height")  - axisHeight)
		.attr("x2", (key.attr("width") * 2) / c.length);
	key.append("line")
		.attr("x1", key.attr("width") - (key.attr("width") * 3) / c.length)
		.attr("y1", 0)
		.attr("y2", key.attr("height")  - axisHeight)
		.attr("x2", key.attr("width") - (key.attr("width") * 3) / c.length);
	key.append("line")
		.attr("x1", key.attr("width") - key.attr("width") / c.length)
		.attr("y1", 0)
		.attr("y2", key.attr("height")  - axisHeight)
		.attr("x2", key.attr("width") - key.attr("width") / c.length);

	var t = key.append("text")
		.attr("class", "keyText")
		.attr("x", 18)
		.attr("y", key.attr("height") / 2 + 5 - axisHeight)
		.text("Extinct");
	t = key.append("text")
		.attr("class", "keyText")
		.attr("x", key.attr("width") / c.length + textWidth)
		.attr("y", (key.attr("height")) / 2 - 2 - axisHeight);
	t.append("tspan")
		.attr("dy", 0)
		.text("Extinct in");
	t.append("tspan")
		.attr("dy", "1em")
		.attr("x", key.attr("width") / c.length + textWidth)
		.text("the Wild");
	t = key.append("text")
		.attr("class", "keyText")
		.attr("x", (key.attr("width") * 2) / c.length + textWidth)
		.attr("y", (key.attr("height")) / 2 - 2 - axisHeight);
	t.append("tspan")
		.attr("dy", 0)
		.text("Critically");
	t.append("tspan")
		.attr("dy", "1em")
		.attr("x", (key.attr("width") * 2) / c.length + textWidth)
		.text("Endangered");
	t = key.append("text")
		.attr("class", "keyText")
		.attr("x", (key.attr("width") * 3) / c.length + textWidth)
		.attr("y", key.attr("height") / 2 + 5 - axisHeight)
		.text("Endangered");
	t = key.append("text")
		.attr("class", "keyText")
		.attr("x", (key.attr("width") * 4) / c.length + textWidth)
		.attr("y", key.attr("height") / 2 + 5 - axisHeight)
		.text("Threatened");
	t = key.append("text")
		.attr("class", "keyText")
		.attr("x", (key.attr("width") * 5) / c.length + textWidth)
		.attr("y", (key.attr("height")) / 2 - 2 - axisHeight);
	t.append("tspan")
		.attr("dy", 0)
		.text("Near");
	t.append("tspan")
		.attr("dy", "1em")
		.attr("x", (key.attr("width") * 5) / c.length + textWidth)
		.text("Threatened");
	t = key.append("text")
		.attr("class", "keyText")
		.attr("x", (key.attr("width") * 6) / c.length + textWidth)
		.attr("y", (key.attr("height")) / 2 - 2 - axisHeight);
	t.append("tspan")
		.attr("dy", 0)
		.text("Least");
	t.append("tspan")
		.attr("dy", "1em")
		.attr("x", (key.attr("width") * 6) / c.length + textWidth)
		.text("Concern");
	t = key.append("text")
		.attr("class", "keyText")
		.attr("x", (key.attr("width") * 7) / c.length + textWidth)
		.attr("y", (key.attr("height")) / 2 - 2 - axisHeight);
	t.append("tspan")
		.attr("dy", 0)
		.text("Data");
	t.append("tspan")
		.attr("dy", "1em")
		.attr("x", (key.attr("width") * 7) / c.length + textWidth)
		.text("Deficient");

	key.selectAll("rect")
		.data(["LC", "NT", "VU", "EN", "CR", "EW", "EX", "DD"])
		.enter()
		.append("rect")
		.attr("x", function (d, i) {
			return 4 + (key.attr("width") * i) / c.length;
		})
		.attr("y", key.attr("height") / 2 - 5 - axisHeight)
		.attr("width", 10)
		.attr("height", 10)
		.attr("fill", function (d, i) {
			return c[i];
		});

	// method for updating data to reflect sorting values
	key.append("rect")
		.attr("class", "unselectedKey")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", (key.attr("width")*2)/c.length)
		.attr("height", key.attr("height") - axisHeight)
		.on("mouseover", function(){
			d3.select(this).style("cursor", "pointer");
			d3.select(this).attr("class", "selectedKey");
		})
		.on("mouseout", function(){
			d3.select(this).style("cursor", "default");
			d3.select(this).attr("class", "unselectedKey");
		})
		.on("click", function(){
			self.sort("extinct");
		});
	key.append("rect")
		.attr("class", "unselectedKey")
		.attr("x", (key.attr("width")*2)/c.length)
		.attr("y", 0)
		.attr("width", (key.attr("width")*3)/c.length)
		.attr("height", key.attr("height") - axisHeight)
		.on("mouseover", function(){
			d3.select(this).style("cursor", "pointer");
			d3.select(this).attr("class", "selectedKey");
		})
		.on("mouseout", function(){
			d3.select(this).style("cursor", "default");
			d3.select(this).attr("class", "unselectedKey");
		})
		.on("click", function(){
			self.sort("redList");
		});
	key.append("rect")
		.attr("class", "unselectedKey")
		.attr("x", (key.attr("width")*5)/c.length)
		.attr("y", 0)
		.attr("width", (key.attr("width")*2)/c.length)
		.attr("height", key.attr("height") - axisHeight)
		.on("mouseover", function(){
			d3.select(this).style("cursor", "pointer");
			d3.select(this).attr("class", "selectedKey");
		})
		.on("mouseout", function(){
			d3.select(this).style("cursor", "default")
			d3.select(this).attr("class", "unselectedKey");
		})
		.on("click", function(){
			self.sort("unthreatened");
		});
	key.append("rect")
		.attr("class", "unselectedKey")
		.attr("x", (key.attr("width")*7)/c.length)
		.attr("y", 0)
		.attr("width", (key.attr("width"))/c.length)
		.attr("height", key.attr("height") - axisHeight)
		.on("mouseover", function(){
			d3.select(this).style("cursor", "pointer");
			d3.select(this).attr("class", "selectedKey");
		})
		.on("mouseout", function(){
			d3.select(this).style("cursor", "default");
			d3.select(this).attr("class", "unselectedKey");
		})
		.on("click", function(){
			self.sort("dataDeficient");
		});



}

// draws the filters and creates buttons
Chart.prototype.drawFilters = function(file){
	var self = this;
	var textHeight = 20;
	var textWidth = 25;
	var axisHeight = 5;
	var boxHeight = 20;
	var margin = 5;
	var filterLength = 7;
	var filterText = ["Summary", "Mammals", "Amphibians", "Percentage", "Regions", "Details", "Clear"]

	var filters = d3.select("#filters");

	filters.selectAll("*").remove();

	filters.append("line")
		.attr("x1", (filters.attr("width") * 3) / filterLength + 18)
		.attr("y1", axisHeight)
		.attr("y2", filters.attr("height")  - axisHeight)
		.attr("x2", (filters.attr("width") * 3) / filterLength + 18)
	filters.append("line")
		.attr("x1", (filters.attr("width") * 4) / filterLength + 23)
		.attr("y1", axisHeight)
		.attr("y2", filters.attr("height")  - axisHeight)
		.attr("x2", (filters.attr("width") * 4) / filterLength + 23)
	filters.append("line")
		.attr("x1", (filters.attr("width") * 5) / filterLength + 16)
		.attr("y1", axisHeight)
		.attr("y2", filters.attr("height")  - axisHeight)
		.attr("x2", (filters.attr("width") * 5) / filterLength + 16)
	filters.append("line")
		.attr("x1", (filters.attr("width") * 6) / filterLength + 2)
		.attr("y1", axisHeight)
		.attr("y2", filters.attr("height")  - axisHeight)
		.attr("x2", (filters.attr("width") * 6) / filterLength + 2)

	filters.append("line")
		.attr("x1", 0)
		.attr("y1", filters.attr("height"))
		.attr("y2", filters.attr("height"))
		.attr("x2", filters.attr("width"));



	filters.append("rect")
		.attr("id", "summary")
		.attr("class", "unselectedButton")
		.attr("x", textWidth - margin)
		.attr("y", textHeight - boxHeight/2 - axisHeight)
		.attr("width", 64)
		.attr("height", boxHeight)
		.on("mouseover", function(){
			d3.select(this).style("cursor", "pointer");
		})
		.on("mouseout", function(){
			d3.select(this).style("cursor", "default");
		})
		.attr("rx", 4)
		.attr("ry", 4);
	filters.append("rect")
		.attr("id", "mammals")
		.attr("class", "unselectedButton")
		.attr("x", (filters.attr("width"))/filterLength + textWidth - margin)
		.attr("y", textHeight - boxHeight/2 - axisHeight)
		.attr("width", 66)
		.attr("height", boxHeight)
		.on("mouseover", function(){
			d3.select(this).style("cursor", "pointer");
		})
		.on("mouseout", function(){
			d3.select(this).style("cursor", "default");
		})
		.attr("rx", 4)
		.attr("ry", 4);
	filters.append("rect")
		.attr("id", "amphibians")
		.attr("class", "unselectedButton")
		.attr("x", (filters.attr("width")*2)/filterLength + textWidth - margin)
		.attr("y", textHeight - boxHeight/2 - axisHeight)
		.attr("width", 78)
		.attr("height", boxHeight)
		.on("mouseover", function(){
			d3.select(this).style("cursor", "pointer");
		})
		.on("mouseout", function(){
			d3.select(this).style("cursor", "default");
		})
		.attr("rx", 4)
		.attr("ry", 4);
	filters.append("rect")
		.attr("id", "percentage")
		.attr("class", "unselectedButton")
		.attr("x", (filters.attr("width")*3)/filterLength + textWidth - margin + 15)
		.attr("y", textHeight - boxHeight/2 - axisHeight)
		.attr("width", 71)
		.attr("height", boxHeight)
		.on("mouseover", function(){
			d3.select(this).style("cursor", "pointer");
		})
		.on("mouseout", function(){
			d3.select(this).style("cursor", "default");
		})
		.on("click", function(){
			self.percentChange();
		})
		.attr("rx", 4)
		.attr("ry", 4);
	filters.append("rect")
		.attr("id", "regions")
		.attr("class", "selectedButton")
		.attr("x", (filters.attr("width")*4)/filterLength + textWidth - margin + 20)
		.attr("y", textHeight - boxHeight/2 - axisHeight)
		.attr("width", 58)
		.attr("height", boxHeight)
		.on("mouseover", function(){
			d3.select(this).style("cursor", "pointer");
		})
		.on("mouseout", function(){
			d3.select(this).style("cursor", "default");
		})
		.on("click", function(){
			self.regionChange()
		})
		.attr("rx", 4)
		.attr("ry", 4);
	filters.append("rect")
		.attr("id", "compare")
		.attr("class", "unselectedButton")
		.attr("x", (filters.attr("width")*5)/filterLength + textWidth - margin + 12)
		.attr("y", textHeight - boxHeight/2 - axisHeight)
		.attr("width", 50)
		.attr("height", boxHeight)
		.on("mouseover", function(){
			d3.select(this).style("cursor", "pointer");
		})
		.on("mouseout", function(){
			d3.select(this).style("cursor", "default");
		})
		.attr("rx", 4)
		.attr("ry", 4);
	filters.append("rect")
		.attr("id", "clear")
		.attr("class", "unselectedButton")
		.attr("x", (filters.attr("width")*6)/filterLength + textWidth - margin)
		.attr("y", textHeight - boxHeight/2 - axisHeight)
		.attr("width", 42)
		.attr("height", boxHeight)
		.on("mouseover", function(){
			d3.select(this).style("cursor", "pointer");
		})
		.on("mouseout", function(){
			d3.select(this).style("cursor", "default");
		})
		.attr("rx", 4)
		.attr("ry", 4);

	filters.select("#"+file)
		.attr("class", "selectedButton");

	var text = filters.selectAll("text").data(filterText);


	text.enter()
		.append("text")
		.attr("class", "buttonText")
		.attr("x", function(d, i){
			var x = (filters.attr("width")*i)/filterLength + textWidth;
			if (d == "Percentage"){x += 15}
			if (d == "Regions"){x += 20}
			if (d == "Details"){x += 12}

			return x;
		})
		.attr("y", textHeight)
		.text(function(d){
			return d;
		});


}

// separates rectangles highlighting bars
Chart.prototype.separate = function(){
	var self = this;

	var bars = self.svg.selectAll("g");

	bars.selectAll(".highlight")
		.style("opacity", 1)
}

// combines rectangles highlighting bars
Chart.prototype.combine = function(transition){
	var self = this;

	var bars = self.svg.selectAll("g");

	var deleteRight = bars.filter(function (d, i, nodes){
		if (i < nodes.length - 1) {
			return (d3.select(this).attr("class") == "selectedBars") && (d3.select(nodes[i + 1]).attr("class") == "selectedBars")
		}
		return false;
		});
	if (transition == true) {
		deleteRight.select(".right")
			.transition()
			.duration(2000)
			.style("opacity", 0);
	}
	else{
		deleteRight.select(".right")
			.style("opacity", 0);
	}

	bars = self.svg.selectAll("g");

	var deleteLeft = bars.filter(function (d, i, nodes){
		return (d3.select(this).attr("class") == "selectedBars") && (d3.select(nodes[i-1]).attr("class") == "selectedBars")
	});
	if (transition == true) {
		deleteLeft.select(".left")
			.transition()
			.duration(2000)
			.style("opacity", 0);
	}
	else{
		deleteLeft.select(".left")
			.style("opacity", 0);
	}


}

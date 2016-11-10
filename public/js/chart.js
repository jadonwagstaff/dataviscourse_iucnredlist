
function Chart(data, percentage){
	self = this;
	self.data = data;

	self.init(data, percentage)
};


// initialises the chart
Chart.prototype.init = function(countryData, percentage){
	// percentage will be a future switch that will change the data view from percentages to actual numbers

	var self = this;
	var barWidth = 3;
	var margin = 2;
	var barSpace = 1;

	// find correct svg
	var svg = d3.select("#chart");
	svg.selectAll("rect").remove();

	// create scale
	if (percentage == true){
		var DDmin = d3.min(countryData, function(d){
			return parseFloat(d.M_DD)/parseFloat(d.M_SP);
		});
		var DDmax = d3.max(countryData, function(d){
			return parseFloat(d.M_DD)/parseFloat(d.M_SP);
		});
		var barScale = d3.scaleLinear()
			.domain([0, 2])
			.range([0, svg.attr("width") - 2*margin]);
	}
	else{

		var DDmax = d3.max(countryData, function(d){
			return parseFloat(d.M_DD);
		});
		var SPmax = d3.max(countryData, function(d){
			return parseFloat(d.M_SP) - parseFloat(d.M_DD);
		});
		var barScale = d3.scaleLinear()
			.domain([0, DDmax + SPmax])
			.range([0, svg.attr("width") - 2*margin]);
	}

	// create data deficient bars
	var ddchart = svg.selectAll(".dd").data(countryData);
	ddchart.enter()
		.append("rect")
		.attr("class", function(d,i){
			return "index" + i;
		})
		.classed("M_DD", true)
		.attr("x", function(){
			if (percentage == true){
				return barScale(1) + margin;
			}
			else{
				return barScale(SPmax) + margin;
			}
		})
		.attr("y", function(d, i){
			return i*(barWidth + barSpace) + margin;
		})
		.attr("height", barWidth)
		.attr("width", function(d){
			if (percentage == true) {
				return barScale(parseFloat(d.M_DD) / parseFloat(d.M_SP))
			}
			else{
				return barScale(parseFloat(d.M_DD));
			}
		})
		.attr("fill", "#A59688");

	// create all other bars
	var placeholder = [];
	for (i = 0; i < countryData.length; i++){
		placeholder[i] = 0;
	}
	var category = ["M_LC", "M_NT", "M_VU", "M_EN", "M_CR", "M_EW", "M_EX"];
	var color = ["#4682b4", "#a3c2db", "#f3bfbf", "#de5454", "#b22222", "#666666", "#262626"];
	for (j = 0; j < category.length; j++){
		svg.selectAll("."+category[i]).data(countryData)
			.enter()
			.append("rect").attr("class", function(d,i){
				return "index" + i;
			})
			.classed(category[j], true)
			//.attr("class", category[j])
			.attr("x", function(d, i){
				if (percentage == true) {
					return barScale(1) + margin - placeholder[i] - barScale(parseFloat(d[category[j]]) / parseFloat(d.M_SP));
				}
				else{
					return barScale(SPmax) + margin - placeholder[i] - barScale(parseFloat(d[category[j]]));
				}
			})
			.attr("y", function(d, i){
				return i*(barWidth + barSpace) + margin;
			})
			.attr("height", barWidth)
			.attr("width", function(d, i){
				if (percentage == true) {
					placeholder[i] = placeholder[i] + barScale(parseFloat(d[category[j]]) / parseFloat(d.M_SP));
					return barScale(parseFloat(d[category[j]]) / parseFloat(d.M_SP));
				}
				else{
					placeholder[i] = placeholder[i] + barScale(parseFloat(d[category[j]]));
					return barScale(parseFloat(d[category[j]]));
				}
			})
			.attr("fill", color[j]);
	};



	// create axis

	var key = d3.select("#key");

	key.selectAll(".axis").remove();

	key.append("line")
		.attr("class", "axis")
		.attr("x1", margin)
		.attr("x2", key.attr("width") - margin)
		.attr("y1", key.attr("height") - 1)
		.attr("y2", key.attr("height") - 1);

	if(percentage == true){
		for (j = 0; j <= 2; j = j + .5){
			key.append("line")
				.attr("class", "axis")
				.attr("x1", barScale(j) + margin)
				.attr("x2", barScale(j) + margin)
				.attr("y1", key.attr("height") - 7)
				.attr("y2", key.attr("height"));
			key.append("text")
				.attr("class", "axis")
				.attr("x", barScale(j) + margin)
				.attr("y", key.attr("height") - 13)
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
				.attr("style", function(){
					if (j == 0){
						return "text-anchor:beginning";
					}
					else if (j == 2){
						return "text-anchor:end";
					}
					else{
						return "text-anchor:middle";
					}
				});
		}
	}
	else{

		var increment = (Math.round(DDmax/Math.pow(10, DDmax.toString().length - 1)) * Math.pow(10, DDmax.toString().length - 1))/2;

		key.append("line")
			.attr("class", "axis")
			.attr("x1", barScale(SPmax) + margin)
			.attr("x2", barScale(SPmax) + margin)
			.attr("y1", key.attr("height") - 7)
			.attr("y2", key.attr("height"));
		key.append("text")
			.attr("class", "axis")
			.attr("x", barScale(SPmax) + margin)
			.attr("y", key.attr("height") - 13)
			.text("0")
			.attr("style", "text-anchor:middle");

		for(j = 1; j <= DDmax/increment; j++){
			key.append("line")
				.attr("class", "axis")
				.attr("x1", barScale(SPmax + increment*j) + margin)
				.attr("x2", barScale(SPmax + increment*j) + margin)
				.attr("y1", key.attr("height") - 7)
				.attr("y2", key.attr("height"));
			key.append("text")
				.attr("class", "axis")
				.attr("x", barScale(SPmax + increment*j) + margin)
				.attr("y", key.attr("height") - 13)
				.text(increment*j)
				.attr("style", function(){
					if (DDmax - increment*j < increment/5){
						return "text-anchor:end"
					}
					return "text-anchor:middle"
				});
		}

		for(j = 1; j <= SPmax/increment; j++){
			key.append("line")
				.attr("class", "axis")
				.attr("x1", barScale(SPmax - increment*j) + margin)
				.attr("x2", barScale(SPmax - increment*j) + margin)
				.attr("y1", key.attr("height") - 7)
				.attr("y2", key.attr("height"));
			key.append("text")
				.attr("class", "axis")
				.attr("x", barScale(SPmax - increment*j) + margin)
				.attr("y", key.attr("height") - 13)
				.text(increment*j)
				.attr("style", function(){
					if (SPmax - increment*j < increment/5){
						return "text-anchor:beginning"
					}
					return "text-anchor:middle"
				});

		}
	}


	// method for updating data to reflect sorting values
	key.append("rect").data([0])
		.attr("class", "sort")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", (key.attr("width")*2)/8)
		.attr("height", key.attr("height") - 25)
		.on("click", function(){
			changeData("extinct");
		});
	key.append("rect").data([0])
		.attr("class", "sort")
		.attr("x", (key.attr("width")*2)/8)
		.attr("y", 0)
		.attr("width", (key.attr("width")*5)/8)
		.attr("height", key.attr("height") - 25)
		.on("click", function(){
			changeData("redList");
		});
	key.append("rect").data([0])
		.attr("class", "sort")
		.attr("x", (key.attr("width")*5)/8)
		.attr("y", 0)
		.attr("width", (key.attr("width")*7)/8)
		.attr("height", key.attr("height") - 25)
		.on("click", function(){
			changeData("unthreatened");
		});
	key.append("rect").data([0])
		.attr("class", "sort")
		.attr("x", (key.attr("width")*7)/8)
		.attr("y", 0)
		.attr("width", key.attr("width"))
		.attr("height", key.attr("height") - 25)
		.on("click", function(){
			changeData("dataDeficient");
		});




};


// updates the chart based on data from countryList
Chart.prototype.update = function(index){
	var self = this;
	
	var cClass = ".index" + index; 
	d3.selectAll(cClass)
		.attr("height", "15"); //expands selection
	
	for(var i = parseInt(index)+1; i < self.data.length; i++){
		cClass = ".index" + i;
		//shifts rest of chart down
		d3.selectAll(cClass)
			.attr("y", function(){
				//console.log(this.getAttribute("y"));
				return parseInt(this.getAttribute("y")) + 15;
			});
	}
		
};


function drawKey() {
	// Make key
	var axisHeight = 15;

	var key = d3.select("#key");
	var c = ["#262626", "#666666", "#b22222", "#de5454", "#f3bfbf", "#a3c2db", "#4682b4", "#A59688"];

	key.append("line")
		.attr("x1", (key.attr("width") * 2) / 8)
		.attr("y1", 0)
		.attr("y2", key.attr("height") - 10 - axisHeight)
		.attr("x2", (key.attr("width") * 2) / 8);
	key.append("line")
		.attr("x1", key.attr("width") - (key.attr("width") * 3) / 8)
		.attr("y1", 0)
		.attr("y2", key.attr("height") - 10 - axisHeight)
		.attr("x2", key.attr("width") - (key.attr("width") * 3) / 8);
	key.append("line")
		.attr("x1", key.attr("width") - key.attr("width") / 8)
		.attr("y1", 0)
		.attr("y2", key.attr("height") - 10 - axisHeight)
		.attr("x2", key.attr("width") - key.attr("width") / 8);

	var t = key.append("text")
		.attr("class", "keyText")
		.attr("x", 18)
		.attr("y", key.attr("height") / 2 + 5 - axisHeight)
		.text("Extinct");
	t = key.append("text")
		.attr("class", "keyText")
		.attr("x", key.attr("width") / 8 + 18)
		.attr("y", (key.attr("height")) / 2 - 2 - axisHeight);
	t.append("tspan")
		.attr("dy", 0)
		.text("Extinct in");
	t.append("tspan")
		.attr("dy", "1em")
		.attr("x", key.attr("width") / 8 + 18)
		.text("the Wild");
	t = key.append("text")
		.attr("class", "keyText")
		.attr("x", (key.attr("width") * 2) / 8 + 18)
		.attr("y", (key.attr("height")) / 2 - 2 - axisHeight);
	t.append("tspan")
		.attr("dy", 0)
		.text("Critically");
	t.append("tspan")
		.attr("dy", "1em")
		.attr("x", (key.attr("width") * 2) / 8 + 18)
		.text("Endangered");
	t = key.append("text")
		.attr("class", "keyText")
		.attr("x", (key.attr("width") * 3) / 8 + 18)
		.attr("y", key.attr("height") / 2 + 5 - axisHeight)
		.text("Endangered");
	t = key.append("text")
		.attr("class", "keyText")
		.attr("x", (key.attr("width") * 4) / 8 + 18)
		.attr("y", key.attr("height") / 2 + 5 - axisHeight)
		.text("Threatened");
	t = key.append("text")
		.attr("class", "keyText")
		.attr("x", (key.attr("width") * 5) / 8 + 18)
		.attr("y", (key.attr("height")) / 2 - 2 - axisHeight);
	t.append("tspan")
		.attr("dy", 0)
		.text("Near");
	t.append("tspan")
		.attr("dy", "1em")
		.attr("x", (key.attr("width") * 5) / 8 + 18)
		.text("Threatened");
	t = key.append("text")
		.attr("class", "keyText")
		.attr("x", (key.attr("width") * 6) / 8 + 18)
		.attr("y", (key.attr("height")) / 2 - 2 - axisHeight);
	t.append("tspan")
		.attr("dy", 0)
		.text("Least");
	t.append("tspan")
		.attr("dy", "1em")
		.attr("x", (key.attr("width") * 6) / 8 + 18)
		.text("Concern");
	t = key.append("text")
		.attr("class", "keyText")
		.attr("x", (key.attr("width") * 7) / 8 + 18)
		.attr("y", (key.attr("height")) / 2 - 2 - axisHeight);
	t.append("tspan")
		.attr("dy", 0)
		.text("Data");
	t.append("tspan")
		.attr("dy", "1em")
		.attr("x", (key.attr("width") * 7) / 8 + 18)
		.text("Deficient");

	key.selectAll("rect")
		.data(["LC", "NT", "VU", "EN", "CR", "EW", "EX", "DD"])
		.enter()
		.append("rect")
		.attr("x", function (d, i) {
			return 4 + (key.attr("width") * i) / 8;
		})
		.attr("y", key.attr("height") / 2 - 5 - axisHeight)
		.attr("width", 10)
		.attr("height", 10)
		.attr("fill", function (d, i) {
			return c[i];
		});



}

drawKey();

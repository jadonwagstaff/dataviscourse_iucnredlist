
function Chart(data){
	self = this;
	self.data = data;

	self.init(data)
};


// initialises the chart
Chart.prototype.init = function(countryData){
	// percentage will be a future switch that will change the data view from percentages to actual numbers
	var percentage = false;

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
			.domain([0, 1 + DDmax - DDmin])
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
				return barScale(1 - DDmin) + margin;
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
					return barScale(1 - DDmin) + margin - placeholder[i] - barScale(parseFloat(d[category[j]]) / parseFloat(d.M_SP));
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

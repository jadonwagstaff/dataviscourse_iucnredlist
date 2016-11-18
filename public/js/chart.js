
function Chart(data, percentage){
	self = this;
	self.data = data;
	self.barWidth = 5;
	self.margin = 4;
	self.barSpace = 1;
	self.dataOrganization = null;


	self.drawKey();
	self.drawFilters();
	self.init(data, percentage)
};


// initialises the chart
Chart.prototype.init = function(countryData, percentage){
	// percentage will be a future switch that will change the data view from percentages to actual numbers

	var self = this;

	// find correct svg
	var svg = d3.select("#chart");

	svg.selectAll("g").remove();

	// create scale
	if (percentage == true){
		var DDmin = d3.min(countryData, function(d){
			return parseFloat(d.DD)/parseFloat(d.SP);
		});
		var DDmax = d3.max(countryData, function(d){
			return parseFloat(d.DD)/parseFloat(d.SP);
		});
		var barScale = d3.scaleLinear()
			.domain([0, 2])
			.range([0, svg.attr("height") - 2*self.margin]);
	}
	else{

		var DDmax = d3.max(countryData, function(d){
			return parseFloat(d.DD);
		});
		var SPmax = d3.max(countryData, function(d){
			return parseFloat(d.SP) - parseFloat(d.DD);
		});
		var barScale = d3.scaleLinear()
			.domain([0, DDmax + SPmax])
			.range([0, svg.attr("height") - 2*self.margin]);
	}


	var g = svg.selectAll(".bar")
		.data(countryData, function(d){
			return d.country;
		});

	var bars = g.enter().append("g")
		.attr("class", "bars");

	bars.attr("transform", function(d, i){
			return "translate(" + (i*(self.barWidth + self.barSpace) + self.margin) + ",0)";
		});

	// create data deficient bars
	bars.append("rect")
		/*.attr("class", function(d,i){
			return "index" + i;
		})*/
		.classed("DD", true)
		.attr("y", function(){
			if (percentage == true){
				return barScale(1) + self.margin;
			}
			else{
				return barScale(SPmax) + self.margin;
			}
		})
		.attr("x", self.barSpace)
		.attr("width", self.barWidth)
		.attr("height", function(d){
			if (percentage == true) {
				return barScale(parseFloat(d.DD) / parseFloat(d.SP))
			}
			else{
				return barScale(parseFloat(d.DD));
			}
		})
		.attr("fill", "#A59688");

	// create all other bars
	var placeholder = [];
	for (i = 0; i < countryData.length; i++){
		placeholder[i] = 0;
	}
	var category = ["LC", "NT", "VU", "EN", "CR", "EW", "EX"];
	var color = ["#5a91bf", "#a3c2db", "#f7d4d4", "#e77e7e", "#d62929", "#8c8c8c", "#666666"];
	for (j = 0; j < category.length; j++){
		bars.append("rect")
			/*.attr("class", function(d,i){
				return "index" + i;
			})
			.classed(category[j], true)*/
			.attr("class", category[j])
			.attr("y", function(d, i){
				if (percentage == true) {
					return barScale(1) + self.margin - placeholder[i] - barScale(parseFloat(d[category[j]]) / parseFloat(d.SP));
				}
				else{
					return barScale(SPmax) + self.margin - placeholder[i] - barScale(parseFloat(d[category[j]]));
				}
			})
			.attr("x", self.barSpace)
			.attr("width", self.barWidth)
			.attr("height", function(d, i){
				if (percentage == true) {
					placeholder[i] = placeholder[i] + barScale(parseFloat(d[category[j]]) / parseFloat(d.SP));
					return barScale(parseFloat(d[category[j]]) / parseFloat(d.SP));
				}
				else{
					placeholder[i] = placeholder[i] + barScale(parseFloat(d[category[j]]));
					return barScale(parseFloat(d[category[j]]));
				}
			})
			.attr("fill", color[j]);
	};



	// create axis

	var axis = d3.select("#axis");

	axis.selectAll(".axis").remove();

	axis.append("line")
		.attr("class", "axis")
		.attr("y1", self.margin)
		.attr("y2", axis.attr("height") - self.margin)
		.attr("x1", axis.attr("width") - 1)
		.attr("x2", axis.attr("width") - 1);

	if(percentage == true){
		for (j = 0; j <= 2; j = j + .5){
			axis.append("line")
				.attr("class", "axis")
				.attr("y1", barScale(j) + self.margin)
				.attr("y2", barScale(j) + self.margin)
				.attr("x1", axis.attr("width") - 7)
				.attr("x2", axis.attr("width"));
			axis.append("text")
				.attr("class", "axis")
				.attr("y", function(){
					if (j == 0 ){
						return barScale(j) + 10;
					}
					else if (j == 2){
						return barScale(j) + 2;
					}
					else{
						return barScale(j) + 8;
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

		var increment = Math.round(DDmax/(2*Math.pow(10, DDmax.toString().length - 1))) * Math.pow(10, DDmax.toString().length - 1);

		axis.append("line")
			.attr("class", "axis")
			.attr("y1", barScale(SPmax) + self.margin)
			.attr("y2", barScale(SPmax) + self.margin)
			.attr("x1", axis.attr("width") - 7)
			.attr("x2", axis.attr("width"));
		axis.append("text")
			.attr("class", "axis")
			.attr("y", barScale(SPmax) + 8)
			.attr("x", axis.attr("width") - 13)
			.text("0")

		for(j = 1; j <= DDmax/increment; j++){
			axis.append("line")
				.attr("class", "axis")
				.attr("y1", barScale(SPmax + increment*j) + self.margin)
				.attr("y2", barScale(SPmax + increment*j) + self.margin)
				.attr("x1", axis.attr("width") - 7)
				.attr("x2", axis.attr("width"));
			axis.append("text")
				.attr("class", "axis")
				.attr("y", barScale(SPmax + increment*j) + 8)
				.attr("x", axis.attr("width") - 13)
				.text(increment*j)
		}

		for(j = 1; j <= SPmax/increment; j++){
			axis.append("line")
				.attr("class", "axis")
				.attr("y1", barScale(SPmax - increment*j) + self.margin)
				.attr("y2", barScale(SPmax - increment*j) + self.margin)
				.attr("x1", axis.attr("width") - 7)
				.attr("x2", axis.attr("width"));
			axis.append("text")
				.attr("class", "axis")
				.attr("y", barScale(SPmax - increment*j) + 8)
				.attr("x", axis.attr("width") - 13)
				.text(increment*j)

		}
	}






};



Chart.prototype.update = function(countryCode) {
	var self = this;

	var svg = d3.select("#chart");
	var bars = svg.selectAll("g");

	bars = bars.filter(function (d){
		for (j = 0; j < countryCode.length; j++)
		{
			return d.CC == countryCode[j];
		}
	});

	var selected = bars.filter(function (){
			return d3.select(this).attr("class") == "bars";
		});

	var deselect = bars.filter(function (){
			return d3.select(this).attr("class") == "selectedBars";
		});


	selected.attr("class", "selectedBars")
		.append("rect")
		.attr("class", "highlight")
		.attr("y", 1)
		.attr("x", 0)
		.attr("height", svg.attr("height") - 1)
		.attr("width", self.barSpace*2 + self.barWidth);

	deselect.attr("class", "bars")
		.select(".highlight")
		.remove();


}


// updates the chart based on data from countryList
/*Chart.prototype.update = function(index){
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
	
	//needed for reuse in text
	cClass = ".index" + index; 
	//add country label
	d3.select("#chart")
		.append("text")
		.attr("x", function(){
			var x = d3.selectAll(cClass);
			x = x["_groups"][0][0].getAttribute("x");
			return x;
		})
		.attr("y", function(){
			var y = d3.selectAll(cClass);
			//console.log(y["_groups"]);
			y = y["_groups"][0][0].getAttribute("y");
			return parseInt(y) +15;
		})
		.attr("font-size", "10")
		.text(self.data[index].Country)
		.attr("class", ("index" + index))
		.classed(("textIndex" + index), true);
};

// deselects bars in chart
Chart.prototype.unselect = function(index){
	var self = this;
	
	var cClass = ".index" + index; 
	d3.selectAll(cClass)
		.attr("height", "3"); //selection returned to normal bar width
	
	for(var i = parseInt(index)+1; i < self.data.length; i++){
		cClass = ".index" + i;
		//shifts rest of chart down
		d3.selectAll(cClass)
			.attr("y", function(){
				//console.log(this.getAttribute("y"));
				return parseInt(this.getAttribute("y")) - 15;
			});
	}
	
	//needed for reuse in text
	cClass = ".textIndex" + index; 
	//removes text
	d3.select(cClass).remove();

};*/


Chart.prototype.sort = function(set) {

	var percentage = false;
	/*if (document.getElementById("viewSelect").value == "true") {
		percentage = true;
	}*/

	if (self.dataOrganization != set + percentage) {

		self.dataOrganization = set + percentage;

		var bars = d3.select("#chart").selectAll("g");
		console.log(bars)

		// organize based on selected set and percentage
		if (self.dataOrganization == "extincttrue") {
			bars.sort(function (a, b) {
				return d3.descending((parseFloat(a.EX) + parseFloat(a.EW)) / a.SP, (parseFloat(b.EX) + parseFloat(b.EW)) / b.SP)
			});
			bars.filter(function (d) {
				return parseFloat(d.EX) + parseFloat(d.EW) == 0;
			})
				.sort(function (a, b) {
					return d3.descending((parseFloat(a.CR) + parseFloat(a.EN) + parseFloat(a.VU)) / a.SP, (parseFloat(b.CR) + parseFloat(b.EN) + parseFloat(b.VU)) / b.SP)
				});
		}
		else if (self.dataOrganization == "redListtrue") {
			bars.sort(function (a, b) {
				return d3.descending((parseFloat(a.CR) + parseFloat(a.EN) + parseFloat(a.VU)) / a.SP, (parseFloat(b.CR) + parseFloat(b.EN) + parseFloat(b.VU)) / b.SP)
			});
		}
		else if (self.dataOrganization == "unthreatenedtrue") {
			bars.sort(function (a, b) {
				return d3.descending((parseFloat(a.LC) + parseFloat(a.NT)) / a.SP, (parseFloat(b.LC) + parseFloat(b.NT)) / b.SP)
			});
		}
		else if (self.dataOrganization == "dataDeficienttrue") {
			bars.sort(function (a, b) {
				return d3.descending(a.DD / a.SP, b.DD / b.SP)
			});
		}
		else if (self.dataOrganization == "extinctfalse") {
			bars.sort(function (a, b) {
				return d3.descending(parseInt(a.EX) + parseInt(a.EW), parseInt(b.EX) + parseInt(b.EW))
			});
		}
		else if (self.dataOrganization == "redListfalse") {
			bars.sort(function (a, b) {
				return d3.descending(parseInt(a.CR) + parseInt(a.EN) + parseInt(a.VU), parseInt(b.CR) + parseInt(b.EN) + parseInt(a.VU))
			});
		}
		else if (self.dataOrganization == "unthreatenedfalse") {
			bars.sort(function (a, b) {
				return d3.descending(parseInt(a.LC) + parseInt(a.NT), parseInt(b.LC) + parseInt(b.NT))
			});
		}
		else if (self.dataOrganization == "dataDeficientfalse") {
			bars.sort(function (a, b) {
				return d3.descending(parseInt(a.DD), parseInt(b.DD))
			});
		}

		// move the bars (will need to be changed to include proper movement of selections)
		d3.select("#chart").selectAll("g")
			.transition()
			.duration(3000)
			.attr("transform", function (d, i) {
				return "translate(" + (i * (self.barWidth + self.barSpace) + self.margin) + ",0)";
			});
	}


}




Chart.prototype.drawKey = function() {
	// Make key
	var axisHeight = 5;
	var textWidth = 18;

	var key = d3.select("#key");
	var c = ["#262626", "#666666", "#b22222", "#de5454", "#f3bfbf", "#a3c2db", "#4682b4", "#A59688"];

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
		.attr("class", "sort")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", (key.attr("width")*2)/c.length)
		.attr("height", key.attr("height") - axisHeight)
		.on("mouseover", function(){
			d3.select(this).style("cursor", "pointer");
			d3.select(this).attr("class", "sortSelect");
		})
		.on("mouseout", function(){
			d3.select(this).style("cursor", "default");
			d3.select(this).attr("class", "sort");
		})
		.on("click", function(){
			self.sort("extinct");
		});
	key.append("rect")
		.attr("class", "sort")
		.attr("x", (key.attr("width")*2)/c.length)
		.attr("y", 0)
		.attr("width", (key.attr("width")*3)/c.length)
		.attr("height", key.attr("height") - axisHeight)
		.on("mouseover", function(){
			d3.select(this).style("cursor", "pointer");
			d3.select(this).attr("class", "sortSelect");
		})
		.on("mouseout", function(){
			d3.select(this).style("cursor", "default");
			d3.select(this).attr("class", "sort");
		})
		.on("click", function(){
			self.sort("redList");
		});
	key.append("rect")
		.attr("class", "sort")
		.attr("x", (key.attr("width")*5)/c.length)
		.attr("y", 0)
		.attr("width", (key.attr("width")*2)/c.length)
		.attr("height", key.attr("height") - axisHeight)
		.on("mouseover", function(){
			d3.select(this).style("cursor", "pointer");
			d3.select(this).attr("class", "sortSelect");
		})
		.on("mouseout", function(){
			d3.select(this).style("cursor", "default")
			d3.select(this).attr("class", "sort");
		})
		.on("click", function(){
			self.sort("unthreatened");
		});
	key.append("rect")
		.attr("class", "sort")
		.attr("x", (key.attr("width")*7)/c.length)
		.attr("y", 0)
		.attr("width", (key.attr("width"))/c.length)
		.attr("height", key.attr("height") - axisHeight)
		.on("mouseover", function(){
			d3.select(this).style("cursor", "pointer");
			d3.select(this).attr("class", "sortSelect");
		})
		.on("mouseout", function(){
			d3.select(this).style("cursor", "default");
			d3.select(this).attr("class", "sort");
		})
		.on("click", function(){
			self.sort("dataDeficient");
		});



}

Chart.prototype.drawFilters = function(){
	var textHeight = 20;
	var textWidth = 25;
	var axisHeight = 5;
	var boxHeight = 20;
	var margin = 5;
	var filterLength = 6;
	var filterText = ["Summary", "Mammals", "Amphibians", "Percentage", "Compare", "Regions"]

	var filters = d3.select("#filters");

	filters.append("line")
		.attr("x1", (filters.attr("width") * 3) / filterLength + 9)
		.attr("y1", axisHeight)
		.attr("y2", filters.attr("height")  - axisHeight)
		.attr("x2", (filters.attr("width") * 3) / filterLength + 9)
	filters.append("line")
		.attr("x1", (filters.attr("width") * 4) / filterLength + 6)
		.attr("y1", axisHeight)
		.attr("y2", filters.attr("height")  - axisHeight)
		.attr("x2", (filters.attr("width") * 4) / filterLength + 6)
	filters.append("line")
		.attr("x1", (filters.attr("width") * 5) / filterLength + 1)
		.attr("y1", axisHeight)
		.attr("y2", filters.attr("height")  - axisHeight)
		.attr("x2", (filters.attr("width") * 5) / filterLength + 1)

	filters.append("line")
		.attr("x1", 0)
		.attr("y1", filters.attr("height"))
		.attr("y2", filters.attr("height"))
		.attr("x2", filters.attr("width"));


	var text = filters.selectAll("text").data(filterText);


	text.enter()
		.append("text")
		.attr("class", "buttonText")
		.attr("x", function(d, i){
			return (filters.attr("width")*i)/filterLength + textWidth;
		})
		.attr("y", textHeight)
		.text(function(d){
			return d;
		});

	filters.append("rect")
		.attr("id", "Summary")
		.attr("class", "selectedButton")
		.attr("x", textWidth - margin)
		.attr("y", textHeight - boxHeight/2 - axisHeight)
		.attr("width", 64)
		.attr("height", boxHeight);
	filters.append("rect")
		.attr("id", "Mammals")
		.attr("class", "unselectedButton")
		.attr("x", (filters.attr("width"))/filterLength + textWidth - margin)
		.attr("y", textHeight - boxHeight/2 - axisHeight)
		.attr("width", 66)
		.attr("height", boxHeight);
	filters.append("rect")
		.attr("id", "Amphibians")
		.attr("class", "unselectedButton")
		.attr("x", (filters.attr("width")*2)/filterLength + textWidth - margin)
		.attr("y", textHeight - boxHeight/2 - axisHeight)
		.attr("width", 78)
		.attr("height", boxHeight);
	filters.append("rect")
		.attr("id", "Percentage")
		.attr("class", "unselectedButton")
		.attr("x", (filters.attr("width")*3)/filterLength + textWidth - margin)
		.attr("y", textHeight - boxHeight/2 - axisHeight)
		.attr("width", 71)
		.attr("height", boxHeight);
	filters.append("rect")
		.attr("id", "Compare")
		.attr("class", "unselectedButton")
		.attr("x", (filters.attr("width")*4)/filterLength + textWidth - margin)
		.attr("y", textHeight - boxHeight/2 - axisHeight)
		.attr("width", 62)
		.attr("height", boxHeight);
	filters.append("rect")
		.attr("id", "Regions")
		.attr("class", "selectedButton")
		.attr("x", (filters.attr("width")*5)/filterLength + textWidth - margin)
		.attr("y", textHeight - boxHeight/2 - axisHeight)
		.attr("width", 58)
		.attr("height", boxHeight);


}


function Chart(data, percentage){
	self = this;
	self.data = data;
	self.barWidth = 3;
	self.margin = 2;
	self.barSpace = 1;
	self.dataOrganization = null;


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
			return parseFloat(d.M_DD)/parseFloat(d.M_SP);
		});
		var DDmax = d3.max(countryData, function(d){
			return parseFloat(d.M_DD)/parseFloat(d.M_SP);
		});
		var barScale = d3.scaleLinear()
			.domain([0, 2])
			.range([0, svg.attr("width") - 2*self.margin]);
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
			.range([0, svg.attr("width") - 2*self.margin]);
	}


	var g = svg.selectAll(".bar")
		.data(countryData, function(d){
			return d.country;
		});
	var bars = g.enter().append("g")
		.attr("class", function(d,i){
			return "bar index" + i;
		})

	bars.attr("transform", function(d, i){
			return "translate(0," + (i*(self.barWidth + self.barSpace) + self.margin) + ")";
		});

	// create data deficient bars
	bars.append("rect")
		.attr("class", function(d,i){
			return "index" + i;
		})
		.classed("M_DD", true)
		.attr("x", function(){
			if (percentage == true){
				return barScale(1) + self.margin;
			}
			else{
				return barScale(SPmax) + self.margin;
			}
		})
		.attr("y", 0)
		.attr("height", self.barWidth)
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
		bars.append("rect")
			.attr("class", function(d,i){
				return "index" + i;
			})
			.classed(category[j], true)
			//.attr("class", category[j])
			.attr("x", function(d, i){
				if (percentage == true) {
					return barScale(1) + self.margin - placeholder[i] - barScale(parseFloat(d[category[j]]) / parseFloat(d.M_SP));
				}
				else{
					return barScale(SPmax) + self.margin - placeholder[i] - barScale(parseFloat(d[category[j]]));
				}
			})
			.attr("y", 0)
			.attr("height", self.barWidth)
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
		.attr("x1", self.margin)
		.attr("x2", key.attr("width") - self.margin)
		.attr("y1", key.attr("height") - 1)
		.attr("y2", key.attr("height") - 1);

	if(percentage == true){
		for (j = 0; j <= 2; j = j + .5){
			key.append("line")
				.attr("class", "axis")
				.attr("x1", barScale(j) + self.margin)
				.attr("x2", barScale(j) + self.margin)
				.attr("y1", key.attr("height") - 7)
				.attr("y2", key.attr("height"));
			key.append("text")
				.attr("class", "axis")
				.attr("x", barScale(j) + self.margin)
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
			.attr("x1", barScale(SPmax) + self.margin)
			.attr("x2", barScale(SPmax) + self.margin)
			.attr("y1", key.attr("height") - 7)
			.attr("y2", key.attr("height"));
		key.append("text")
			.attr("class", "axis")
			.attr("x", barScale(SPmax) + self.margin)
			.attr("y", key.attr("height") - 13)
			.text("0")
			.attr("style", "text-anchor:middle");

		for(j = 1; j <= DDmax/increment; j++){
			key.append("line")
				.attr("class", "axis")
				.attr("x1", barScale(SPmax + increment*j) + self.margin)
				.attr("x2", barScale(SPmax + increment*j) + self.margin)
				.attr("y1", key.attr("height") - 7)
				.attr("y2", key.attr("height"));
			key.append("text")
				.attr("class", "axis")
				.attr("x", barScale(SPmax + increment*j) + self.margin)
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
				.attr("x1", barScale(SPmax - increment*j) + self.margin)
				.attr("x2", barScale(SPmax - increment*j) + self.margin)
				.attr("y1", key.attr("height") - 7)
				.attr("y2", key.attr("height"));
			key.append("text")
				.attr("class", "axis")
				.attr("x", barScale(SPmax - increment*j) + self.margin)
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
	key.append("rect").data([0])
		.attr("class", "sort")
		.attr("x", (key.attr("width")*2)/8)
		.attr("y", 0)
		.attr("width", (key.attr("width")*3)/8)
		.attr("height", key.attr("height") - 25)
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
	key.append("rect").data([0])
		.attr("class", "sort")
		.attr("x", (key.attr("width")*5)/8)
		.attr("y", 0)
		.attr("width", (key.attr("width")*2)/8)
		.attr("height", key.attr("height") - 25)
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
	key.append("rect").data([0])
		.attr("class", "sort")
		.attr("x", (key.attr("width")*7)/8)
		.attr("y", 0)
		.attr("width", (key.attr("width"))/8)
		.attr("height", key.attr("height") - 25)
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

};


Chart.prototype.sort = function(set) {

	var percentage = false;
	if (document.getElementById("viewSelect").value == "true") {
		percentage = true;
	}

	if (self.dataOrganization != set + percentage) {

		self.dataOrganization = set + percentage;

		var bars = d3.select("#chart").selectAll("g");

		// organize based on selected set and percentage
		if (self.dataOrganization == "extincttrue") {
			bars.sort(function (a, b) {
				return d3.descending((parseFloat(a.M_EX) + parseFloat(a.M_EW)) / a.M_SP, (parseFloat(b.M_EX) + parseFloat(b.M_EW)) / b.M_SP)
			});
		}
		else if (self.dataOrganization == "redListtrue") {
			bars.sort(function (a, b) {
				return d3.descending((parseFloat(a.M_CR) + parseFloat(a.M_EN) + parseFloat(a.M_VU)) / a.M_SP, (parseFloat(b.M_CR) + parseFloat(b.M_EN) + parseFloat(b.M_VU)) / b.M_SP)
			});
		}
		else if (self.dataOrganization == "unthreatenedtrue") {
			bars.sort(function (a, b) {
				return d3.descending((parseFloat(a.M_LC) + parseFloat(a.M_NT)) / a.M_SP, (parseFloat(b.M_LC) + parseFloat(b.M_NT)) / b.M_SP)
			});
		}
		else if (self.dataOrganization == "dataDeficienttrue") {
			bars.sort(function (a, b) {
				return d3.descending(a.M_DD / a.M_SP, b.M_DD / b.M_SP)
			});
		}
		else if (self.dataOrganization == "extinctfalse") {
			bars.sort(function (a, b) {
				return d3.descending(parseInt(a.M_EX) + parseInt(a.M_EW), parseInt(b.M_EX) + parseInt(b.M_EW))
			});
		}
		else if (self.dataOrganization == "redListfalse") {
			bars.sort(function (a, b) {
				return d3.descending(parseInt(a.M_CR) + parseInt(a.M_EN) + parseInt(a.M_VU), parseInt(b.M_CR) + parseInt(b.M_EN) + parseInt(a.M_VU))
			});
		}
		else if (self.dataOrganization == "unthreatenedfalse") {
			bars.sort(function (a, b) {
				return d3.descending(parseInt(a.M_LC) + parseInt(a.M_NT), parseInt(b.M_LC) + parseInt(b.M_NT))
			});
		}
		else if (self.dataOrganization == "dataDeficientfalse") {
			bars.sort(function (a, b) {
				return d3.descending(parseInt(a.M_DD), parseInt(b.M_DD))
			});
		}

		// move the bars (will need to be changed to include proper movement of selections)
		d3.select("#chart").selectAll("g")
			.transition()
			.duration(3000)
			.attr("transform", function (d, i) {
				return "translate(0," + (i * (self.barWidth + self.barSpace) + self.margin) + ")";
			});
	}


}




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

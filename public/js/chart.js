
function Chart(data, percentage){
	self = this;
	self.data = data;
	self.barWidth = 4;
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
			return parseFloat(d.DD)/parseFloat(d.SP);
		});
		var DDmax = d3.max(countryData, function(d){
			return parseFloat(d.DD)/parseFloat(d.SP);
		});
		var barScale = d3.scaleLinear()
			.domain([0, 2])
			.range([0, svg.attr("width") - 2*self.margin]);
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
			.range([0, svg.attr("width") - 2*self.margin]);
	}

	
	//creating tool tip functionality
	var tip = d3.select("body").append("div")	
		.attr("class", "tooltip")				
		.style("opacity", 0)
		.style("position", "absolute");
	
	
	//grouping bars
	var g = svg.selectAll(".bar")
		.data(countryData, function(d){
			return d.country;
		});

	svg.attr("height", function(){
		return countryData.length*(self.barWidth + self.barSpace) + 2*self.margin
	});

	var bars = g.enter().append("g")
		.attr("class", "bars");

	bars.attr("transform", function(d, i){
			return "translate(0," + (i*(self.barWidth + self.barSpace) + self.margin) + ")";
		});

	// create data deficient bars
	bars.append("rect")
		/*.attr("class", function(d,i){
			return "index" + i;
		})*/
		.classed("DD", true)
		.attr("x", function(){
			if (percentage == true){
				return barScale(1) + self.margin;
			}
			else{
				return barScale(SPmax) + self.margin;
			}
		})
		.attr("y", self.barSpace)
		.attr("height", self.barWidth)
		.attr("width", function(d){
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
			.attr("x", function(d, i){
				if (percentage == true) {
					return barScale(1) + self.margin - placeholder[i] - barScale(parseFloat(d[category[j]]) / parseFloat(d.SP));
				}
				else{
					return barScale(SPmax) + self.margin - placeholder[i] - barScale(parseFloat(d[category[j]]));
				}
			})
			.attr("y", self.barSpace)
			.attr("height", self.barWidth)
			.attr("width", function(d, i){
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
	
	//tool tip events
	bars
		.on("mouseover", function(d){
			//console.log(d);
			d3.select(this)
				.style("fill", "red");
			tip
				.style("opacity", .9)
				.html(d.Country)
				.style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");
		})
		.on("mouseout", function(){
			d3.select(this)
				.style("fill", "steelblue");
			tip.style("opacity", 0)
		})
		.on("click", function(d){
			//initiates bar transition
			console.log(d);
		});
	

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



Chart.prototype.update = function(countryCode) {
	var self = this;
	var category = [".DD", ".LC", ".NT", ".VU", ".EN", ".CR", ".EW", ".EX"];
	var color = ["#A59688", "#5a91bf", "#a3c2db", "#f7d4d4", "#e77e7e", "#d62929", "#8c8c8c", "#666666"];
	var selectedColor = ["#917f6e","#325d81", "#5a91bf", "#e26969", "#c12525", "#811818", "#666666", "#262626"];

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
		.attr("x", 1)
		.attr("y", 0)
		.attr("width", svg.attr("width") - 1)
		.attr("height", self.barSpace*2 + self.barWidth);

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
	if (document.getElementById("viewSelect").value == "true") {
		percentage = true;
	}

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

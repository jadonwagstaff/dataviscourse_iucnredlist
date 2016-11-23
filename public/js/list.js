

function List(map, chart, graphs, data) {
    var self = this;
	self.svg = d3.select("#countryList");

    self.map = map;
    self.chart = chart;
    self.data = data;
	self.graphs = graphs;

    self.init();
	self.change_OnChart_orMap();
}


// initialises the countryList
List.prototype.init = function(){
    var self = this;


    var list = d3.select("#countryList").selectAll("li");
    list.data(self.data)
        .enter()
        .append("li")
		.attr("class", function(d){
			if (d.Country == "N/A"){
				return "listTitle"}
			else {return "list"}
		});

	d3.select("#countryList").selectAll(".listTitle")
		.style("cursor", "pointer")
		.text(function(d) {return d.Region;})
		.on("click", function(d){
			var send = []
			for(var j = 0; j < self.data.length; j++){
				if (d.Region == self.data[j].Region && self.data[j].Country != "N/A"){
					send.push(self.data[j].CC)
				}
			}
			self.chart.update(send);
			self.map.update(send);
			self.graphs.update(send);
			self.update(send);
		});

	d3.select("#countryList").selectAll(".list")
		.style("cursor", "pointer")
		.text(function(d) {return d.Country;})
		.on("click", function(d){
			self.chart.update([d.CC]);
			self.map.update([d.CC]);
			self.graphs.update([d.CC]);
			self.update([d.CC]);
		})
}


List.prototype.update = function(countryCode){
	var self = this;

	var list = d3.select("#countryList").selectAll("li");

	list = list.filter(function (d){
		for (var j = 0; j < countryCode.length; j++)
		{
			if(d.CC == countryCode[j]) {return true;}
		}
		return false;
	});

	var selected = list.filter(function (){
		return d3.select(this).attr("class") == "list"
	});
	var deselect = list.filter(function (){
		return d3.select(this).attr("class") == "selectedListItem"
	});


	selected.attr("class", "selectedListItem");
	if (selected.data().length == 0){
		deselect.attr("class", "list");
	}

}

List.prototype.change_OnChart_orMap = function(){
	var self = this;

	// changing data
	d3.select("#summary")
		.on("click", function(){
			self.chart.dataChange("summary");
			self.dataChange("T_")
		});

	d3.select("#mammals")
		.on("click", function(){
			self.chart.dataChange("mammals");
			self.dataChange("M_")
		});

	d3.select("#amphibians")
		.on("click", function(){
			self.chart.dataChange("amphibians");
			self.dataChange("A_")
		});

	// clicking on chart
	d3.select("#chart").selectAll("g")
		.filter(function(d){
			return d.Country != "N/A"
		})
		.on("click", function(d){
			self.chart.update([d.CC])
			self.map.update([d.CC])
			self.graphs.update([d.CC])
			self.update([d.CC])
		})

}

List.prototype.dataChange = function(set){

	var list = d3.select("#countryList").selectAll("li");

	list.style("color", "black")


	var remove = list;

	remove = remove.filter(function(d){
		return d.CC != "N/A" && d[set+"SP"] == "?";
	});

	remove.style("color", "#999999")

}




function List(map, chart, graphs, stat, data) {
    var self = this;
	self.svg = d3.select("#countryList");
	self.dataSet = "T_"

    self.map = map;
    self.chart = chart;
    self.data = data;
	self.graphs = graphs;
	self.stat = stat;

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
			self.stat.update(send);
			self.update(send);
		});

	d3.select("#countryList").selectAll(".list")
		.style("cursor", "pointer")
		.text(function(d) {return d.Country;})
		.on("click", function(d){
			self.chart.update([d.CC]);
			self.map.update([d.CC]);
			self.graphs.update([d.CC]);
			self.stat.update(d.CC);
			self.update([d.CC]);
		})
		.on("mouseover", function(d){
			if (d.Country != "N/A" && d[self.dataSet + "SP"] != "?"){
				d3.select("#chart").selectAll("g").filter(function(b){
						return d.Country == b.Country;
					})
					.style("opacity", .9)
					.select(".tipBar")
					.style("opacity", 1)
			}
		})
		.on("mouseout", function(d){
			if (d.Country != "N/A" && d[self.dataSet + "SP"] != "?"){
				d3.select("#chart").selectAll("g").filter(function(b){
					return d.Country == b.Country;
				})
					.style("opacity", 1)
					.select(".tipBar")
					.style("opacity", 0)
			}
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



	// map properties
	//creating tool tip functionality
	self.tip = d3.tip().attr("class", "worldTip")
		.direction('s')
		.html(function(d){
			for (var j = 0; j < self.data.length; j++){
				if(d.id == self.data[j].CC){
					var country = self.data[j].Country;
				}
			}
			return "<span style = 'font-size:12px'>"+ country +"</span>"
		})

	d3.select("#map").call(self.tip);

	setTimeout(function(){
		d3.select("#map").selectAll("path")
			.filter(function(d){return d.id == "ATA";})
			.attr("id", "target")
		var target = document.getElementById("target")
		d3.select("#map").selectAll("path")
			.style("opacity", .8)
			.on("click", function(d){
				self.chart.update([d.id])
				self.map.update([d.id])
				self.graphs.update([d.id])
				self.stat.update(d.id);
				self.update([d.id])
			})
			.on("mouseover", function(d){
				d3.select(this).style("opacity", 1)
				d3.select(this).style("cursor", "pointer");
				self.tip.show(d, target);
				d3.select("#chart").selectAll("g").filter(function(b){
					return d.id == b.CC;
				})
					.style("opacity", .9)
					.select(".tipBar")
					.style("opacity", 1)
			})
			.on("mouseout", function(d){
				d3.select(this).style("opacity", .8)
				d3.select(this).style("cursor", "default");
				self.tip.hide();
				d3.select("#chart").selectAll("g").filter(function(b){
					return d.id == b.CC;
				})
					.style("opacity", 1)
					.select(".tipBar")
					.style("opacity", 0)
			});
	}, 2000)




	// Chart properties
	// changing details
	d3.select("#compare")
		.on("click", function(){
			if (d3.select("#compare").attr("class") == "selectedButton") {
				d3.select("#compare").attr("class", "unselectedButton");
				self.stat.category();
			}
			else{
				d3.select("#compare").attr("class", "selectedButton");
				self.stat.details();
			}
		});

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
			self.stat.update(d.CC);
			self.update([d.CC])
		})

	d3.select("#chart").selectAll("g")
		.filter(function(d){
			return d.Country == "N/A"
		})
		.style("cursor", "pointer")
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
			self.stat.update(send);
			self.update(send);
		});

	d3.select("#clear")
		.on("click", function(){
			d3.select(this).attr("class", "selectedButton")

			var send = [];

			self.svg.selectAll(".selectedListItem")
				.attr("class", function(d){
					send.push(d.CC)
					return "list"
				})

			self.chart.update(send);
			self.map.update(send);
			self.graphs.update(send);
			self.stat.update(send);

			setTimeout(function(){
				d3.select("#clear").attr("class", "unselectedButton")
			}, 200)
		})


}

List.prototype.dataChange = function(set){
	self.dataSet = set;

	var list = d3.select("#countryList").selectAll("li");

	list.style("color", "black")


	var remove = list;

	remove = remove.filter(function(d){
		return d.CC != "N/A" && d[set+"SP"] == "?";
	});

	remove.style("color", "#999999")

}


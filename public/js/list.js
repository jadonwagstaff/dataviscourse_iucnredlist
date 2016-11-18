

function List(map, chart, countryData) {
    var self = this;

    self.map = map;
    self.chart = chart;
    self.countryData = countryData;
    self.init();
}


// initialises the countryList
List.prototype.init = function(){
    var self = this;

    d3.select("#countryList").selectAll("li").remove();

    var list = d3.select("#countryList").selectAll("li");
    list.data(self.countryData)
        .enter()
        .append("li")
		.attr("class", function(d){
			if (d.Country == "N/A"){
				return "listTitle"}
			else {return "list"}
		});

	d3.select("#countryList").selectAll(".listTitle")
		.style("cursor", "default")
		.text(function(d) {return d.Region;});

	d3.select("#countryList").selectAll(".list")
		.style("cursor", "pointer")
		.text(function(d) {return d.Country;})
		.on("click", function(d){
			//console.log(this.innerHTML);
			if (this.getAttribute("class") == "list"){
				this.setAttribute("class", "selectedListItem");
				self.chart.update([d.CC]);
				self.map.update([d.CC]);
			}
			else {
				this.setAttribute("class", "list");
				self.chart.update([d.CC]);
				self.map.update([d.CC]);
			}
		})
}

/*List.prototype.update = function(){
	var self = this;
	
	//allows highlighted list items to move up to the top
	var items = d3.select("#countryList").selectAll("li");
	items
		.on("click", function(){
			//console.log(this.innerHTML);
			if (this.getAttribute("class") == ""){
                this.setAttribute("class", "selectedListItem");
				var temp = this.getAttribute("id");
				//console.log(temp);
				self.chart.update(temp.slice(3));
				self.map.update([temp.slice(0, 3)]);
				//move item to top
				d3.select("#countryList").insert("li", ":first-child")
					.text(this.innerHTML)
					.classed("selectedListItem", true)
					.attr("id", temp);
				d3.select(this).remove();
				self.update();	
            }
            else {
                this.setAttribute("class", "");
				//removes bar selection
				var temp = this.getAttribute("id");
				self.chart.unselect(temp.slice(3));
				
				//need to update map
				
				//updates list
				self.update();
            }
			
        })
	
}*/

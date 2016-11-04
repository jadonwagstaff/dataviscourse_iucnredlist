

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

    var list = d3.select("#countryList").selectAll("li");
    list.data(self.countryData)
        .enter()
        .append("li")
        .text(function (d){
            return d.Country
        })
		.attr("id", function(d,i){ 
			return d.CC + i; //this stores the cc and index for future use
		})
		.attr("class", ""); //allows update function to run smoother
		self.update();
}

List.prototype.update = function(){
	var self = this;
	
	//allows highlighted list items to move up to the top
	var items = d3.select("#countryList").selectAll("li");
	items
		.on("click", function(){
			console.log(this.innerHTML);
			if (this.getAttribute("class") == ""){
                this.setAttribute("class", "selectedListItem");
				var temp = this.getAttribute("id");
				console.log(temp);
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
				//to do - add unselected back to original place using index
				
				
				//update chart and map
				
				//updates list
				self.update();
            }
			
        })
	
}

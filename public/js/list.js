

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
        .on("click", function(d, i){
            self.chart.update(i);
            self.map.update([d.CC]);
            if (this.getAttribute("class") == null){
                this.setAttribute("class", "selectedListItem");
            }
            else {
                this.setAttribute("class", null);
            }
        })
}


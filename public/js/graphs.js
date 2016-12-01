
function Graphs(data){
    var self = this;
    self.data = data;
    self.buffer = 12;
    self.graphSize = 200;
    self.gHeight = 240;
    self.lineLength = 60;
    self.titleHeight = 60;

    self.maxWidth = 0;
    self.maxHeight = 0;

    self.rowSize = Math.ceil(1600/self.graphSize);

    self.svg = d3.select("#graphs");


    self.g = self.svg.selectAll("g").data(data).enter()

    self.lineScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, self.lineLength*2]);


    self.init();
}


Graphs.prototype.init = function(){
    var self = this

    //creating tool tip functionality
    self.tip = d3.tip().attr("class", "graphTip")
        .direction('s')
        .style("width", self.graphSize)
        .html(function(d){
            var categories = ["Mammals", "Birds", "Reptiles", "Amphibians", "Fish", "Molluscs", "Other_Inverts" ]
            var titles = ["Mammals", "Birds", "Reptiles", "Amphibians", "Fish", "Molluscs", "Other" ]

            var number = (d[categories[0]] / d["RL_Total"]) * 100;
            number = +number.toFixed(1);
            var text = "<table><span style = 'font:12pt; line-height:200%'><tr><td>" + titles[0] +"</td><td>= "+ d[categories[0]] +"</td><td>( "+ number +"% )</td></tr></span>"
            for (var j = 1; j < categories.length - 1; j++){
                number = (d[categories[j]] / d["RL_Total"]) * 100;
                number = +number.toFixed(1);
                text += "<tr><td>"+ titles[j] +"</td><td>= "+ d[categories[j]] +"</td><td>( "+ number +"% )</td></tr>"
            }
            text += "</span><tr><td><span style = 'font:12pt'>"+ titles[6] +"</td><td>= "+ d[categories[6]] +"</td><td>( "+ number +"% )</td></tr><tr><td>Invertabrates</span></td></tr></table>"
            return text;
        })

    self.svg.call(self.tip);

    self.svg.append("text")
        .attr("id", "graphsTitle")
        .attr("x", 60)
        .attr("y", 55)
        .style("font-weight", "bold")
        .text("Red List Composition:")
        .style("opacity", 0);




}


Graphs.prototype.update = function(countryCode){
    var self = this;
    self.rowSize = Math.min(Math.floor((window.innerWidth - 100)/self.graphSize), Math.ceil(1600/self.graphSize))

    self.svg.select("#graphsTitle")
        .style("opacity", 1);

    // find selected country code g elements
    var selected = self.g.filter(function(d){

        for (var j = 0; j < countryCode.length; j++)
        {
            if(d.CC == countryCode[j]) {return true;}
        }
        return false;
    })

    var currentGraphs = self.svg.selectAll("g");

    // find incoming graphs
    var enter = selected.filter(function (d){
        for(var j = 0; j < currentGraphs.data().length; j++){
            if(d.CC == currentGraphs.data()[j].CC) {return false}
        }
        return true;
    });

    // find outgoing graphs
    var exit = currentGraphs.filter(function (d){
        for(var j = 0; j < selected.data().length; j++){
            if(d.CC == selected.data()[j].CC) {return true}
        }
        return false;
    });

    // remove outgoing graphs
    if (enter.data().length == 0){
        exit.remove();
    }

    // create incoming groups
    enter.append("g")
        .on("click", function(d){
            d3.select(this).selectAll(".graphText").style("opacity", 1);
            d3.select(this).select(".border").style("opacity", 1);
            self.tip.show(d)
        })
        .on("mouseover", function(){
                d3.select(this).style("cursor", "pointer");
            })
        .on("hover", function(d){
            self.tip.show(d)
        })
        .on("mouseout", function(){
            d3.select(this).style("cursor", "default");
            d3.select(this).selectAll(".graphText").style("opacity", 0);
            d3.select(this).select(".border").style("opacity", 0);
            self.tip.hide()
        })

    enter = self.svg.selectAll("g").filter(function(d){
            for(var j = 0; j < currentGraphs.data().length; j++){
                if(d.CC == currentGraphs.data()[j].CC) {return false}
            }
            return true;
         })

    // highlights selected region
    enter.append("rect")
        .attr("class", "border")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", self.graphSize)
        .attr("height", self.gHeight)
        .attr("opacity", 0)

    // axes
    for(var j = 0; j < 7; j++){
        enter.append("line")
            .attr("class", "graphLine")
            .attr("x1", self.graphSize/2)
            .attr("y1", self.graphSize/2)
            .attr("y2", self.graphSize/2 + (self.lineLength * Math.cos((2*Math.PI*j)/7)) )
            .attr("x2", self.graphSize/2 + (self.lineLength * Math.sin((2*Math.PI*j)/7)) )

    }


    // main glyph
    enter.append("path")
        .attr("class", "graphPath")
        .attr("d", function(d){
            var categories = ["Other_Inverts", "Molluscs", "Reptiles", "Birds", "Mammals", "Amphibians", "Fish", "Other_Inverts" ]
            var text = "M" + (self.graphSize/2) + " " + (self.graphSize/2 + (self.lineScale(d[categories[0]]/d.RL_Total)))
            for (var j = 0; j < categories.length; j++){
                text += " L" + (self.graphSize/2 + (self.lineScale(d[categories[j]]/d.RL_Total) * Math.sin((2*Math.PI*j)/7))) + " " + (self.graphSize/2 + (self.lineScale(d[categories[j]]/d.RL_Total) * Math.cos((2*Math.PI*j)/7)))
            }
            return text
        })


    // category names
    var categories = ["Other Invertabrates", "Molluscs", "Reptiles", "Birds", "Mammals", "Amphibians", "Fish" ]

    for(var j = 0; j < 7; j++){
        enter.append("text")
            .attr("class", "graphText")
            .attr("y", self.graphSize/2 + ((self.lineLength + 5) * Math.cos((2*Math.PI*j)/7)) )
            .attr("x", self.graphSize/2 + ((self.lineLength + 5) * Math.sin((2*Math.PI*j)/7)) )
            .text(categories[j])
            .style("opacity", 0)
    }

    // country
    enter.append("foreignObject")
        .attr("y", self.graphSize + self.buffer)
        .attr("x", 0)
        .attr("width", self.graphSize)
        .attr("height", 30)
        .append("xhtml:div")
        .append("div")
        .attr("class", "graphTitle")
        .text(function(d){
            return d.Country;
        })
        .on("mouseout", function(){
            d3.select(this).style("cursor", "default");
        });


    // move graphs
    currentGraphs = self.svg.selectAll("g")
        .attr("transform", function(d, i){
            var column = Math.floor(i/self.rowSize);
            var row = i%self.rowSize;
            return "translate("+ (row * self.graphSize) +","+ (column * self.gHeight + self.titleHeight) + ")";
        });


    // make svg bigger
    self.maxHeight = Math.ceil(1 + currentGraphs.data().length/self.rowSize) * self.gHeight
    self.svg
        .attr("height", self.maxHeight)
    self.maxWidth = self.rowSize * self.graphSize;
    self.svg
        .attr("width", self.maxWidth)

    // delete title if none selected
    if (currentGraphs.data().length == 0) {
        self.svg.select("#graphsTitle")
            .style("opacity", 0)
    }

}

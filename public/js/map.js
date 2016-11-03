function Map(data){
    var self = this;
}

// updates the map using information from countryList
Map.prototype.update = function (index){
};



//map loaded here

// initial drawing of map
function drawMap(world) {

    var svg = d3.select("#map");
    var scale0 = (svg.attr("width") - 1) / 2 / Math.PI;

    var projection = d3.geoNaturalEarth().scale(scale0).translate([svg.attr("width")/2, svg.attr("height")/2]);


    var path = d3.geoPath()
        .projection(projection);


    d3.json("data/world.json", function(json) {

        console.log(json);
        svg.selectAll("path")
            .data(topojson.feature(json, json.objects.countries).features)
            .enter()
            .append("path")
            .classed("countries", true)
            .attr("d", path);

    });

}

// load map data and initialize drawing map
d3.json("data/world.json", function (error, world) {
    if (error) throw error;
    drawMap(world);
});
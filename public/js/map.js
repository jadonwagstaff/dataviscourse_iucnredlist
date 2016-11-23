function Map(data){
    var self = this;
}

// updates the map using information from countryList
Map.prototype.update = function (countryCode){
    var self = this;

    var paths = d3.select("#map").selectAll("path").on("click", function(d){console.log(d.id)});

    paths = paths.filter(function (d){
            for (var j = 0; j < countryCode.length; j++)
            {
                if(d.id == countryCode[j]) {return true;}
            }
            return false;
        });

    var selected = paths.filter(function (){
        return d3.select(this).attr("class") == "countries"
    });
    var deselect = paths.filter(function (){
        return d3.select(this).attr("class") == "selectedCountries"
    });


    selected.attr("class", "selectedCountries");
    if (selected.data().length == 0){
        deselect.attr("class", "countries");
    }
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
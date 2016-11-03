function Map(data){
    var self = this;
}

// updates the map using information from countryList
Map.prototype.update = function (countryCode){
    var select = d3.select("#map").selectAll(".countries");
    var deselect = d3.select("#map").selectAll(".selectedCountries");

    select.attr("class", function (d){
        for (j = 0; j < countryCode.length; j++)
        {
            if (d.id == countryCode[j]){
                return "selectedCountries";
            }
        }
        return "countries";
    });

    deselect.attr("class", function (d){
        for (j = 0; j < countryCode.length; j++)
        {
            if (d.id == countryCode[j]){
                return "countries";
            }
        }
        return "selectedCountries";
    });

    /*paths.filter(function (d){
            for (j = 0; j < countryCode.length; j++)
            {
                console.log(d.id == countryCode[j])
                return d.id == countryCode[j];
            }
        });
    var select = paths.selectAll(".countries");
    var deselect = paths.selectAll(".selectedCountries");
    select.classed("countries", false)
        .classed("selectedCountries", true);
    deselect.attr("class", "countries");*/
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
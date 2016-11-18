//loads and initializes data

loadData("summary");

function loadData(file) {
    
    //needed to clear chart for each selection
	d3.select("#chart").selectAll("*").remove();


    d3.csv("data/" + file + ".csv", function (error, data) {


        //create objects
        var map = new Map(data);
        var chart = new Chart(data, file);
        var list = new List(map, chart, data);
    });

}

function changeData(file) {

    // TODO need to figure out how to do this with transitions, perhaps load all data at once?

    var summary = d3.select("#summary");
    var mammals = d3.select("#mammals");
    var amphibians = d3.select("#amphibians");


    if (file == "summary" && summary.attr("class") == "unselectedButton"){
        summary.attr("class", "selectedButton");
        mammals.attr("class", "unselectedButton");
        amphibians.attr("class", "unselectedButton");

        loadData(file);
    }
    if (file == "mammals" && mammals.attr("class") == "unselectedButton"){
        summary.attr("class", "unselectedButton");
        mammals.attr("class", "selectedButton");
        amphibians.attr("class", "unselectedButton");

        loadData(file);
    }
    if (file == "amphibians" && amphibians.attr("class") == "unselectedButton"){
        summary.attr("class", "unselectedButton");
        mammals.attr("class", "unselectedButton");
        amphibians.attr("class", "selectedButton");

        loadData(file);
    }
}

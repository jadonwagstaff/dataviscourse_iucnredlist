//loads and initializes data

loadData("summary");

function loadData() {
    
    //needed to clear chart for each selection
	d3.select("#chart").selectAll("*").remove();


    d3.csv("data/data.csv", function (error, data) {


        //create objects
        var map = new Map(data);
        var chart = new Chart(data);
        var graphs = new Graphs(data);
        var list = new List(map, chart, graphs, data);
    });

}


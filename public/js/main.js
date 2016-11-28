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
	var stat = new Stat(data);
    });

}

//loads search function
//using modified code from http://www.w3schools.com/howto/howto_js_filter_lists.asp
function searchFunction() {
    // Declare variables
    var input, filter, ul, li, i;
    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    ul = document.getElementById("countryList");
	li = ul.getElementsByTagName('li');

	//console.log(li[0].className);
	
    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
		if(li[i].className == "list"){
			if (li[i].innerHTML.toUpperCase().indexOf(filter) > -1) {
				li[i].style.display = "";
			} else {
				li[i].style.display = "none";
			}
		}else {
			li[i].style.display = "none";
		}
        
    }
}


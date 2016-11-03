//loads and initializes data
d3.csv("data/summary.csv", function (error, data) {
	console.log(data);
	
	//create objects
	var visChart = new Chart(organizeData(data));
	visChart.update();
	//var visMap = new Map();
});

function organizeData(data){ //will arrange data to fit with desired chart display
  return data;
};


function Chart(data){
	self = this;
	self.data = data;
};


Chart.prototype.update = function(){
		
	//testing script
	d3.select("#chart").append("text")
		.text("This is a test.").attr("x", "100").attr("y", "100");
	console.log("test");
	console.log(self.data);
	
	var xScale = d3.scaleLinear()
		.domain([0, self.data.length])
		.range([0, 550]); //hardcoded svg width
	
	
	
	
};

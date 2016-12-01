
//script adds details section

function Stat(countryData) {
    var self = this;

    self.countryData = countryData;
	self.selected = [];
    self.category();
}

Stat.prototype.update = function(cc){
	var self = this;
	
	//checks if cc is an array
	if(cc instanceof Array){
		//check selection
		var temp = self.selected.length;
		
		for(var i = 0; i < cc.length; i++){
			if(self.selected.indexOf(cc[i]) == -1){
				self.selected.push(cc[i]);
			}
		}
		if(self.selected.length == temp){
			for(var i = 0; i < cc.length; i++){
				self.selected.splice(self.selected.indexOf(cc[i]), 1);
			}			
		}
	//for single selection
	} else {
		if(self.selected.indexOf(cc) == -1){
			self.selected.push(cc);
		} else {
			self.selected.splice(self.selected.indexOf(cc), 1);
		}
	}


	//check if compare is on
	self.compare();
	

}

Stat.prototype.compare = function(){
	var self = this;
	//console.log(self.countryData);

	if(d3.select("#compare").attr("class") == "selectedButton"){
		self.details();
	}

}

//adds details
Stat.prototype.details = function(){
	var self = this;
	var categories = ["EX", "EW", "CR", "EN", "VU", "NT", "LC"]
	var labels = ["Extinct", "Extinct in the Wild", "Critically Endangered", "Endangered", "Vulnerable", "Near Threatened", "Least Concern"]
	var color = ["#262626", "#666666", "#b22222", "#de5454", "#f3bfbf", "#a3c2db", "#4682b4", "#A59688"];
	var prefixes = ["T_", "M_", "A_"]
	//selecting container and adding inital data
	var details = d3.select("#details");
	
	//clears div
	details.selectAll("*").remove();
	
	//add countries
	var tables = details.selectAll("table")
		.data(self.countryData.filter(function(d){
			if(self.selected.indexOf(d.CC) != -1){
				return d;
			}
		}))
		.enter()
		.append("table")
		.attr("class", "viewsD")
	tables.append("caption")
		.text(function(d){
			return d.Country;
		})

	// add heads
	var row = tables.append("tr")
	row.append("td")
	row.append("td")
		.text("Summary")
		.style("font-weight", "bold")
		.style("text-decoration", "underline")
	row.append("td")
	row.append("td")
		.text(function(d){
			if (d.M_SP != "?") { return "Mammals"; }
			else { return ""}
		})
		.style("font-weight", "bold")
		.style("text-decoration", "underline")
	row.append("td")
	row.append("td")
		.text(function(d){
			if (d.A_SP != "?") { return "Amphibians"; }
			else { return "" }
		})
		.style("font-weight", "bold")
		.style("text-decoration", "underline")

	row.append("td")



	// add numbers for each category
	for(var j = 0; j < categories.length; j++){
		if(j == 0){
			row = tables.append("tr")
				.style("font-weight", "bold")
			row.append("td")
				.text("Extinct Total")
				.attr("width", 130)
			for(var k = 0; k < prefixes.length; k++){
				row.append("td")
					.style("color", color[0])
					.text(function(d){
						if (d[prefixes[k] + "SP"] != "?") {
							return parseInt(d[prefixes[k] + "EX"]) + parseInt(d[prefixes[k] + "EW"]);
						}
					})
				row.append("td")
					.style("color", color[0])
					.text(function(d){
						if (d[prefixes[k] + "SP"] != "?") {
							var percent = ((parseInt(d[prefixes[k] + "EX"]) + parseInt(d[prefixes[k] + "EW"])) / d[prefixes[k] + "SP"]) * 100;
							percent = +percent.toFixed(1);
							return "(" + percent + "%)"
						}
					})
					.attr("width", 110)
			}
		}
		else if(j == 2){
			row = tables.append("tr")
				.style("font-weight", "bold")
			row.append("td")
				.text("Red List")
			for(var k = 0; k < prefixes.length; k++){
				row.append("td")
					.style("color", color[2])
					.text(function(d){
						if (d[prefixes[k] + "SP"] != "?") {
							return parseInt(d[prefixes[k] + "CR"]) + parseInt(d[prefixes[k] + "EN"]) + parseInt(d[prefixes[k] + "VU"]);
						}
					})
				row.append("td")
					.style("color", color[2])
					.text(function(d){
						if (d[prefixes[k] + "SP"] != "?") {
							var percent = ((parseInt(d[prefixes[k] + "CR"]) + parseInt(d[prefixes[k] + "EN"]) + parseInt(d[prefixes[k] + "VU"])) / d[prefixes[k] + "SP"]) * 100;
							percent = +percent.toFixed(1);
							return "(" + percent + "%)"
						}
					})
			}
		}
		else if(j == 5){
			row = tables.append("tr")
				.style("font-weight", "bold")
			row.append("td")
				.text("Unthreatened")
			for(var k = 0; k < prefixes.length; k++){
				row.append("td")
					.style("color", color[6])
					.text(function(d){
						if (d[prefixes[k] + "SP"] != "?") {
							return parseInt(d[prefixes[k] + "NT"]) + parseInt(d[prefixes[k] + "LC"]);
						}
					})
				row.append("td")
					.style("color", color[6])
					.text(function(d){
						if (d[prefixes[k] + "SP"] != "?") {
							var percent = ((parseInt(d[prefixes[k] + "NT"]) + parseInt(d[prefixes[k] + "LC"])) / d[prefixes[k] + "SP"]) * 100;
							percent = +percent.toFixed(1);
							return "(" + percent + "%)"
						}
					})
			}
		}


		row = tables.append("tr")
		row.append("td")
			.text(labels[j])

		for(var k = 0; k < prefixes.length; k++){

			row.append("td")
				.style("color", color[j])
				.text(function(d){
					if (d[prefixes[k] + "SP"] != "?") {
						return d[prefixes[k] + categories[j]];
					}
				})
			row.append("td")
				.style("color", color[j])
				.text(function(d){
					if (d[prefixes[k] + "SP"] != "?") {
						var percent = (d[prefixes[k] + categories[j]] / d[prefixes[k] + "SP"]) * 100;
						percent = +percent.toFixed(1);
						return "(" + percent + "%)"
					}
				})

		}
	}

	row = tables.append("tr")
		.style("font-weight", "bold")
	row.append("td")
		.text("Data Deficient")
	for(var k = 0; k < prefixes.length; k++){
		row.append("td")
			.style("color", color[7])
			.text(function(d){
				if (d[prefixes[k] + "SP"] != "?") {
					return parseInt(d[prefixes[k] + "DD"]);
				}
			})
		row.append("td")
			.style("color", color[7])
			.text(function(d){
				if (d[prefixes[k] + "SP"] != "?") {
					var percent = (parseInt(d[prefixes[k] + "DD"]) / d[prefixes[k] + "SP"]) * 100;
					percent = +percent.toFixed(1);
					return "(" + percent + "%)"
				}
			})
	}

}


//default text, defining categories
Stat.prototype.category = function(){
	
	//selecting container and adding inital data
	var details = d3.select("#details");
	
	details.selectAll("*").remove();
	
	details
		.append("h3")
		.style("font-weight", "bold")
		.text("Category Definitions:");

	//collapse categories
	details
		.append("h5")
		.text("Extinct")
		.style("font-weight", "bold")
		.style("text-decoration", "underline");

	var head = details
		.append("h5")
		.append("a")
		.attr("data-toggle", "collapse")
		.attr("href", "#collapse1")
		.text("Extinct:");

	var callap = details
		.append("div")
		.attr("id", "collapse1")
		.attr("class", "panel-collapse collapse")
		.append("p")
		.text("A taxon is Extinct when there is no reasonable doubt that the last individual has died. A taxon is presumed Extinct when exhaustive surveys in known and/or expected habitat, at appropriate times (diurnal, seasonal, annual), throughout its historic range have failed to record an individual. Surveys should be over a time frame appropriate to the taxon’s life cycle and life form. (IUCN 2016)");

	head = details
		.append("h5")
		.append("a")
		.attr("data-toggle", "collapse")
		.attr("href", "#collapse2")
		.text("Extinct in the Wild:");

	callap = details
		.append("div")
		.attr("id", "collapse2")
		.attr("class", "panel-collapse collapse")
		.append("p")
		.text("A taxon is Extinct in the Wild when it is known only to survive in cultivation, in captivity or  as  a  naturalized  population  (or  populations)  well  outside  the  past  range.  A  taxon  is presumed Extinct in the Wild when exhaustive surveys in known and/or expected habitat, at appropriate times (diurnal, seasonal, annual), throughout its historic range have failed to record an individual. Surveys should be over a time frame appropriate to the taxon’s life cycle and life form. (IUCN 2016)")

	details
		.append("h5")
		.text("Red List")
		.style("font-weight", "bold")
		.style("text-decoration", "underline");

	head = details
		.append("h5")
		.append("a")
		.attr("data-toggle", "collapse")
		.attr("href", "#collapse3")
		.text("Critically Endangered:");

	callap = details
		.append("div")
		.attr("id", "collapse3")
		.attr("class", "panel-collapse collapse")
		.append("p")
		.text("A taxon is Critically Endangered when the best available evidence indicates that it meets any  of  the  criteria  A  to  E  for  Critically  Endangered  (see  Section  V),  and  it  is  therefore considered to be facing an extremely high risk of extinction in the wild. (IUCN 2016)");

	head = details
		.append("h5")
		.append("a")
		.attr("data-toggle", "collapse")
		.attr("href", "#collapse4")
		.text("Endangered:");

	callap = details
		.append("div")
		.attr("id", "collapse4")
		.attr("class", "panel-collapse collapse")
		.append("p")
		.text("A taxon is Endangered when the best available evidence indicates that it meets any of the criteria A to E for Endangered (see Section V), and it is therefore considered to be facing a very high risk of extinction in the wild. (IUCN 2016)");

	head = details
		.append("h5")
		.append("a")
		.attr("data-toggle", "collapse")
		.attr("href", "#collapse5")
		.text("Threatened:");

	callap = details
		.append("div")
		.attr("id", "collapse5")
		.attr("class", "panel-collapse collapse")
		.append("p")
		.text("A taxon is Vulnerable/threatened when the best available evidence indicates that it meets any of the criteria A to E for Vulnerable (see Section V), and it is therefore considered to be facing a high risk of extinction in the wild. (IUCN 2016)");

	details
		.append("h5")
		.text("Unthreatened")
		.style("font-weight", "bold")
		.style("text-decoration", "underline");

	head = details
		.append("h5")
		.append("a")
		.attr("data-toggle", "collapse")
		.attr("href", "#collapse6")
		.text("Near Threatened:");

	callap = details
		.append("div")
		.attr("id", "collapse6")
		.attr("class", "panel-collapse collapse")
		.append("p")
		.text("A taxon is Near Threatened when it has been evaluated against the criteria but does not qualify for Critically Endangered, Endangered or Vulnerable now, but is close to qualifying for or is likely to qualify for a threatened category in the near future. (IUCN 2016)");

	head = details
		.append("h5")
		.append("a")
		.attr("data-toggle", "collapse")
		.attr("href", "#collapse7")
		.text("Least Concern:");

	callap = details
		.append("div")
		.attr("id", "collapse7")
		.attr("class", "panel-collapse collapse")
		.append("p")
		.text("A taxon is Least Concern when it has been evaluated against the criteria and does not qualify for Critically Endangered, Endangered, Vulnerable or Near Threatened. Widespread and abundant taxa are included in this category. (IUCN 2016)");

	details
		.append("h5")
		.text("Data Deficient")
		.style("font-weight", "bold")
		.style("text-decoration", "underline");

	head = details
		.append("h5")
		.append("a")
		.attr("data-toggle", "collapse")
		.attr("href", "#collapse8")
		.text("Data Deficient:");

	callap = details
		.append("div")
		.attr("id", "collapse8")
		.attr("class", "panel-collapse collapse")
		.append("p")
		.text("A  taxon  is  Data  Deficient  when  there  is  inadequate  information  to  make  a  direct,  or indirect, assessment of its risk of extinction based on its distribution and/or population status.  A  taxon  in  this  category  may  be  well  studied,  and  its  biology  well  known,  but appropriate data on abundance and/or distribution are lacking. Data Deficient is therefore not a category of threat.  Listing of taxa in this category indicates that more information is required and acknowledges the possibility that future research will show that threatened classification is appropriate. It is important to make positive use of whatever data are available.  In many cases great care should be exercised in choosing between DD and a threatened status. If the range of a taxon is suspected to be relatively circumscribed, and a considerable period of time has elapsed since the last record of the taxon, threatened status may well be justified. (IUCN 2016)")

}

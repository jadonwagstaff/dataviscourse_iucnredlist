
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

	//console.log(self.selected);

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
	
	//selecting container and adding inital data
	var details = d3.select("#details");
	
	//clears div
	details.selectAll("*").remove();
	
	//add title
	details
		.append("h3")
		.text("Country Details:");
	
	//add countries
	details.selectAll("ul")
		.data(self.countryData.filter(function(d){
			if(self.selected.indexOf(d.CC) != -1){
				return d;
			}
		}))
		.enter()
		.append("ul")
		.attr("class", "viewsD")
		.append("li")
		.text(function(d){
			return d.Country;
		})
		.append("li")
		.text(function(d){
			return "Extinct: " + d.T_EX;
		})
		.append("li")
		.text(function(d){
			return "Extinct in Wild: " + d.T_EW;
		})
		.append("li")
		.text(function(d){
			return "Critically Endangered: " + d.T_CR;
		})
		.append("li")
		.text(function(d){
			return "Endangered: " + d.T_EN;
		})
		.append("li")
		.text(function(d){
			return "Threatened: " + d.T_VU;
		})
		.append("li")
		.text(function(d){
			return "Near Threatened: " + d.T_NT;
		})
		.append("li")
		.text(function(d){
			return "Least Concern: " + d.T_LC;
		})
		.append("li")
		.text(function(d){
			return "Data Deficient: " + d.T_DD;
		});

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

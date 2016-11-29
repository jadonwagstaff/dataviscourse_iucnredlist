
//script will build interactive 

function Stat(countryData) {
    var self = this;

    self.countryData = countryData;
	self.selected = [];
    self.init();
}


// initialises stat svg and aggreates countryData
Stat.prototype.init = function(){
    var self = this;
	
	//console.log(self.countryData);
	
	//creating ranking for each of the following categories
	/* 	EX		 		extinct
		EW				extinct in the wild
		CR				critically endangered 
		EN				endangered 
		VU				vulnerable 
		NT				near threatened
		DD				data deficient
	*/
	self.category();
	
}

Stat.prototype.category = function(){
	
	//selecting container and adding inital data
	var details = d3.select("#details");
	
	details.selectAll("*").remove();
	
	details
		.append("h3")
		.text("Category Definitions:");

	//collapse categories
	var head = details
		.append("h5")
		.append("a")
		.attr("data-toggle", "collapse")
		.attr("href", "#collapse1")
		.text("EXTINCT:");

	var callap = details
		.append("div")
		.attr("id", "collapse1")
		.attr("class", "panel-collapse collapse")
		.append("p")
		.text("A taxon is Extinct when there is no reasonable doubt that the last individual has died. A taxon is presumed Extinct when exhaustive surveys in known and/or expected habitat, at appropriate times (diurnal, seasonal, annual), throughout its historic range have failed to record an individual. Surveys should be over a time frame appropriate to the taxon’s life cycle and life form.");
	
	head = details
		.append("h5")
		.append("a")
		.attr("data-toggle", "collapse")
		.attr("href", "#collapse2")
		.text("EXTINCT IN THE WILD:");

	callap = details
		.append("div")
		.attr("id", "collapse2")
		.attr("class", "panel-collapse collapse")
		.append("p")
		.text("A taxon is Extinct in the Wild when it is known only to survive in cultivation, in captivity or  as  a  naturalized  population  (or  populations)  well  outside  the  past  range.  A  taxon  is presumed Extinct in the Wild when exhaustive surveys in known and/or expected habitat, at appropriate times (diurnal, seasonal, annual), throughout its historic range have failed to record an individual. Surveys should be over a time frame appropriate to the taxon’s life cycle and life form.")

	head = details
		.append("h5")
		.append("a")
		.attr("data-toggle", "collapse")
		.attr("href", "#collapse3")
		.text("CRITICALLY ENDANGERED:");

	callap = details
		.append("div")
		.attr("id", "collapse3")
		.attr("class", "panel-collapse collapse")
		.append("p")
		.text("A taxon is Critically Endangered when the best available evidence indicates that it meets any  of  the  criteria  A  to  E  for  Critically  Endangered  (see  Section  V),  and  it  is  therefore considered to be facing an extremely high risk of extinction in the wild.");

	head = details
		.append("h5")
		.append("a")
		.attr("data-toggle", "collapse")
		.attr("href", "#collapse4")
		.text("ENDANGERED:");

	callap = details
		.append("div")
		.attr("id", "collapse4")
		.attr("class", "panel-collapse collapse")
		.append("p")
		.text("A taxon is Endangered when the best available evidence indicates that it meets any of the criteria A to E for Endangered (see Section V), and it is therefore considered to be facing a very high risk of extinction in the wild.");

	head = details
		.append("h5")
		.append("a")
		.attr("data-toggle", "collapse")
		.attr("href", "#collapse5")
		.text("THREATENED:");

	callap = details
		.append("div")
		.attr("id", "collapse5")
		.attr("class", "panel-collapse collapse")
		.append("p")
		.text("A taxon is Vulnerable/threatened when the best available evidence indicates that it meets any of the criteria A to E for Vulnerable (see Section V), and it is therefore considered to be facing a high risk of extinction in the wild.");

	head = details
		.append("h5")
		.append("a")
		.attr("data-toggle", "collapse")
		.attr("href", "#collapse6")
		.text("NEAR THREATENED:");

	callap = details
		.append("div")
		.attr("id", "collapse6")
		.attr("class", "panel-collapse collapse")
		.append("p")
		.text("A taxon is Near Threatened when it has been evaluated against the criteria but does not qualify for Critically Endangered, Endangered or Vulnerable now, but is close to qualifying for or is likely to qualify for a threatened category in the near future.");

	head = details
		.append("h5")
		.append("a")
		.attr("data-toggle", "collapse")
		.attr("href", "#collapse7")
		.text("LEAST CONCERN:");

	callap = details
		.append("div")
		.attr("id", "collapse7")
		.attr("class", "panel-collapse collapse")
		.append("p")
		.text("A taxon is Least Concern when it has been evaluated against the criteria and does not qualify for Critically Endangered, Endangered, Vulnerable or Near Threatened. Widespread and abundant taxa are included in this category.");

	head = details
		.append("h5")
		.append("a")
		.attr("data-toggle", "collapse")
		.attr("href", "#collapse8")
		.text("DATA DEFICIENT:");

	callap = details
		.append("div")
		.attr("id", "collapse8")
		.attr("class", "panel-collapse collapse")
		.append("p")
		.text("A  taxon  is  Data  Deficient  when  there  is  inadequate  information  to  make  a  direct,  or indirect, assessment of its risk of extinction based on its distribution and/or population status.  A  taxon  in  this  category  may  be  well  studied,  and  its  biology  well  known,  but appropriate data on abundance and/or distribution are lacking. Data Deficient is therefore not a category of threat.  Listing of taxa in this category indicates that more information is required and acknowledges the possibility that future research will show that threatened classification is appropriate. It is important to make positive use of whatever data are available.  In many cases great care should be exercised in choosing between DD and a threatened status. If the range of a taxon is suspected to be relatively circumscribed, and a considerable period of time has elapsed since the last record of the taxon, threatened status may well be justified.")

}

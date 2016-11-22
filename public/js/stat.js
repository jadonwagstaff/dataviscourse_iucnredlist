
//script will build interactive 

function Stat(countryData) {
    var self = this;

    self.countryData = countryData;
    self.init();
}


// initialises stat svg and aggreates countryData
Stat.prototype.init = function(){
    var self = this;
	
	console.log(self.countryData);
	
	//creating ranking for each of the following categories
	/* 	EX		 		extinct
		EW				extinct in the wild
		CR				critically endangered 
		EN				endangered 
		VU				vulnerable 
		NT				near threatened
		DD				data deficient
	*/
	self.ex = [];
	self.ew = [];
	self.cr = [];
	self.en = [];
	self.vu = [];
	self.nt = [];
	self.dd = [];
	
	
	//ranks data input, using binary search
	function insertRank(category, value, index){
		//category.push({cc: self.countryData[index].Country, val: value, rank: value});
		//checks if the object is a country
		if(self.countryData[index].CC > ""){
			//mid point
			var mid = Math.floor(category.length / 2);
			
			
			
		}
		//returns updated array
		return category;
	}
	
	
	for(var i = 0; i < self.countryData.length; i++){
			self.ex = insertRank(self.ex, self.countryData[i].EX, i);
			//insertRank(self.ew, self.countryData[i].EW, i);
			//insertRank(self.cr, self.countryData[i].CR, i);
			//insertRank(self.en, self.countryData[i].EN, i);
			//insertRank(self.vu, self.countryData[i].VU, i);
			//insertRank(self.nt, self.countryData[i].NT, i);
			//insertRank(self.dd, self.countryData[i].DD, i);
	}
	console.log(self.ex);

}
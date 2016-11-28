
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
	
	//sorting versions
	var tempEX = self.countryData.sort(function (a, b) {
		return parseFloat(a.EX) - parseFloat(b.EX);
	});
	var tempEW = self.countryData.sort(function (a, b) {
		return parseFloat(a.EW) - parseFloat(b.EW);
	});
	var tempCR = self.countryData.sort(function (a, b) {
		return parseFloat(a.CR) - parseFloat(b.CR);
	});
	var tempEN = self.countryData.sort(function (a, b) {
		return parseFloat(a.EN) - parseFloat(b.EN);
	});
	var tempVU = self.countryData.sort(function (a, b) {
		return parseFloat(a.VU) - parseFloat(b.VU);
	});
	var tempNT = self.countryData.sort(function (a, b) {
		return parseFloat(a.NT) - parseFloat(b.NT);
	});
	var tempDD = self.countryData.sort(function (a, b) {
		return parseFloat(a.DD) - parseFloat(b.DD);
	});
	
	//rank holders
	var rankEX = 1;
	var rankEW = 1;
	var rankCR = 1;
	var rankEN = 1;
	var rankVU = 1;
	var rankNT = 1;
	var rankDD = 1;	
	
	//assigns rank
	for(var i = 0; i < self.countryData.length; i++){
			if(tempEX[i].CC > ""){
				self.ex.push({cc: tempEX[i].CC, rank: rankEX});
			}
			if(tempEW[i].CC > ""){
				self.ew.push({cc: tempEW[i].CC, rank: rankEW});
			}
			if(tempCR[i].CC > ""){
				self.cr.push({cc: tempCR[i].CC, rank: rankCR});
			}
			if(tempEN[i].CC > ""){
				self.en.push({cc: tempEN[i].CC, rank: rankEN});
			}
			if(tempVU[i].CC > ""){
				self.vu.push({cc: tempVU[i].CC, rank: rankVU});
			}
			if(tempNT[i].CC > ""){
				self.nt.push({cc: tempNT[i].CC, rank: rankNT});
			}
			if(tempDD[i].CC > ""){
				self.dd.push({cc: tempDD[i].CC, rank: rankDD});
			}
	}
	//console.log(self.ex);
	
}
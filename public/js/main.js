//loads and initializes data
var dataOrganization;

function changeData(organize) {


    var percentage = false;
    if (document.getElementById("viewSelect").value == "true"){
        percentage = true;
    }

    //dataOrganization is a variable that remembers how the data should be sorted until a change is made
    if (organize != undefined){
        dataOrganization = organize + percentage;
    }

    d3.csv("data/mammals.csv", function (error, data) {

        // sort the data based on dataOrganization
        if (dataOrganization == "extincttrue") {
            data.sort(function (a, b) {
                return d3.descending((parseFloat(a.M_EX) + parseFloat(a.M_EW))/a.M_SP, (parseFloat(b.M_EX) + parseFloat(b.M_EW))/b.M_SP)
            });
        }
        else if (dataOrganization == "redListtrue") {
            data.sort(function (a, b) {
                return d3.descending((parseFloat(a.M_CR) + parseFloat(a.M_EN) + parseFloat(a.M_VU))/a.M_SP, (parseFloat(b.M_CR) + parseFloat(b.M_EN) + parseFloat(b.M_VU))/b.M_SP)
            });
        }
        else if (dataOrganization == "unthreatenedtrue") {
            data.sort(function (a, b) {
                return d3.descending((parseFloat(a.M_LC) + parseFloat(a.M_NT))/a.M_SP, (parseFloat(b.M_LC) + parseFloat(b.M_NT))/b.M_SP)
            });
        }
        else if (dataOrganization == "dataDeficienttrue") {
            data.sort(function (a, b) {
                return d3.descending(a.M_DD/a.M_SP, b.M_DD/b.M_SP)
            });
        }
        else if (dataOrganization == "extinctfalse") {
            data.sort(function (a, b) {
                return d3.descending(parseInt(a.M_EX) + parseInt(a.M_EW), parseInt(b.M_EX) + parseInt(b.M_EW))
            });
        }
        else if (dataOrganization == "redListfalse") {
            data.sort(function (a, b) {
                return d3.descending(parseInt(a.M_CR) + parseInt(a.M_EN) + parseInt(a.M_VU), parseInt(b.M_CR) + parseInt(b.M_EN) + parseInt(a.M_VU))
            });
        }
        else if (dataOrganization == "unthreatenedfalse") {
            data.sort(function (a, b) {
                return d3.descending(parseInt(a.M_LC) + parseInt(a.M_NT), parseInt(b.M_LC) + parseInt(b.M_NT))
            });
        }
        else if (dataOrganization == "dataDeficientfalse") {
            data.sort(function (a, b) {
                return d3.descending(parseInt(a.M_DD), parseInt(b.M_DD))
            });
        }



        //create objects
        var map = new Map(data);
        var chart = new Chart(data, percentage);
        var list = new List(map, chart, data);
    });

}

function organizeData(data){ //will arrange data to fit with desired chart display
  return data;
};

changeData();
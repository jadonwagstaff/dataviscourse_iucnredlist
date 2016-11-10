//loads and initializes data
function changeData() {
    var percentage = false;
    if (document.getElementById("viewSelect").value == "true"){
        percentage = true;
    }

    d3.csv("data/mammals.csv", function (error, data) {

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
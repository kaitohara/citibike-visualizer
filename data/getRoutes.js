var fs = require("fs");
var csv = require("fast-csv");
var request = require("request");
var polyline = require("polyline");
var testData = require("./testData")

// var inputFile = process.argv[2];

var stream = fs.createReadStream("./testCsv.csv");
var outputArray = [];

var rawData = [];
// var tripCount = 0;

var apiCallArray = [];
csv
.fromStream(stream, { headers: true })
.on("data", function(data){
	rawData.push(data)
})
.on("end", function(){
	console.log("done", rawData.length);
	var apiBase = "https://maps.googleapis.com/maps/api/directions/json?",
	// apiKeyStr = "&key=AIzaSyDOUe_CpuWh0vjfx0vjE9AKTbCm9srgM00",
		// apiKeyStr = "&key=AIzaSyD-WDi9Cq8WQCFF6Aa1n1-BVgXxHtq6XfU",
		apiKeyStr = "&key=AIzaSyBosox5PzwQiE-MF4KBMI8dqCxdXTLcq5c",

		mode = "&mode=bicycling"

	// for (i in rawData){
	var i = 0;
	var loop = setInterval(function(){
		var origin = "origin=" + rawData[i]["start station latitude"] + "," + rawData[i]["start station longitude"];
		var destination = "&destination=" + rawData[i]["end station latitude"] + "," + rawData[i]["end station longitude"];
		var fullApiCall = apiBase + origin + destination + mode + apiKeyStr;
		apiCallArray.push(fullApiCall)
		// console.log(fullApiCall)
		callLoop(i)
		i++;
		if (i > rawData.length-1){
			clearInterval(loop)
			setTimeout(function(){
				writeToFile();
			}, 7500)
		}
	}, 600)


	// for (i = 0; i < 5; i++) {
	// 	//build full api call for each trip
	// 	var origin = "origin=" + rawData[i]["start station latitude"] + "," + rawData[i]["start station longitude"];
	// 	var destination = "&destination=" + rawData[i]["end station latitude"] + "," + rawData[i]["end station longitude"];
	// 	var fullApiCall = apiBase + origin + destination + mode + apiKeyStr;
	// 	apiCallArray.push(fullApiCall)

	// 	console.log(apiCallArray[i])
	// }
	// writeToFile();
});

var apiData = []

function callLoop(i) {
	var call = apiCallArray[i];

	request({
		url: call,
		json: true
	}, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log(body);
			apiData.push(body)
			console.log("Called " + call)
		} else {
			console.log(error)
		}
	})

};

function writeToFile(){

	var resultArray = [];
	// console.log(rawData)
	for (var j in apiData){
		var tripData = rawData[j];
		var polyline = apiData[j]["routes"][0]["overview_polyline"]["points"];
		polyline = polyline.replace(/\\/, "\\");
		tripData.polyline = polyline;
		resultArray.push(tripData);
	}
	console.log(resultArray)
	
	var ws = fs.createWriteStream("test.csv");
	csv
		.write(resultArray, {headers: true})
		.pipe(ws);

}


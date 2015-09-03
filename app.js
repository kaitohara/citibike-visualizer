var express = require("express");
var app = express();
var fs = require("fs");
var Converter = require("csvtojson").Converter;
var polyline = require("polyline");
var path = require("path");

app.use(express.static(__dirname +'/public'));

app.get('/', function(req, res, next){
	var index = path.join(__dirname, 'index.html');
	res.sendFile(index);
})




app.get('/trips', function(req, res, next){
	//OLD CODE FOR CREATING JSON WITH COORDINATES FOR POLYLINES - KEPT FOR FUTURE REFERENCE
	// var filestream = fs.createReadStream("./data/test.csv");
	// var converter = new Converter({ constructResult:true });
	// converter.on("end_parsed", function(jsonObj){
	// 	var geojson = {type:"FeatureCollection", features: []}
	// 	// jsonObj.forEach(function(trip){
	// 	// 	var feature = {};
	// 	// })
	// 	for (var i in jsonObj){
	// 		var feature = {};
	// 		feature.type = "Feature";
	// 		//decode polyline for overall trip to get micro coordinates for trip
	// 		//altered polyline.js to return [long x lat] instead of [lat x long] b/c geojson and googlemaps use different orders for coordinates
	// 		var routeCoordinates = polyline.decode(jsonObj[i].polyline)
	// 		console.log('routeCoordinates', routeCoordinates)
			
	// 		feature.geometry = {type:"LineString", coordinates: routeCoordinates}
	// 		feature.properties = {
	// 			key: i,
	// 			tripDuration : jsonObj[i]["tripduration"],
	// 			startTime : jsonObj[i]["starttime"],
	// 			FIELD3 : jsonObj[i]["stoptime"],
	// 			FIELD4 : jsonObj[i]["start station id"],
	// 			FIELD5 : jsonObj[i]["start station latitude"],
	// 			FIELD6 : jsonObj[i]["start station longitude"],
	// 			FIELD8 : jsonObj[i]["end station id"],
	// 			FIELD9 : jsonObj[i]["end station latitude"],
	// 			FIELD10 : jsonObj[i]["end station longitude"],
	// 			FIELD11 : jsonObj[i]["bikeid"]
	// 		}
	// 		geojson.features.push(feature)
	// 	}

	// 	res.status(200).send(geojson);
	// })
	// filestream.pipe(converter);
	// function readJSONFile(filename, callback){
	// 	fs.readFile(filename, function(err, data){
	// 		if (err) {
	// 			callback(err);
	// 			return;
	// 		}
	// 		try {
	// 			callback(null, JSON.parse(data));
	// 		} catch (exception){
	// 			callback(exception);
	// 		}
	// 	});
	// };
	var obj;
	fs.readFile('./data/collection.json', 'utf8', function(err, data){
		if(err) throw err;
		obj = JSON.parse(data);
		console.log(obj)
		res.status(200).send(obj)
	})
})

app.get('/17017trips', function(req, res, next){
	var filestream = fs.createReadStream("./data/17017directions.csv");
	var converter = new Converter({ constructResult:true });
	converter.on("end_parsed", function(jsonObj){
		var geojson = {type:"FeatureCollection", features: []}
		// jsonObj.forEach(function(trip){
		// 	var feature = {};
		// })
		for (var i in jsonObj){
			var feature = {};
			feature.type = "Feature";
			//decode polyline for overall trip to get micro coordinates for trip
			//altered polyline.js to return [long x lat] instead of [lat x long] b/c geojson and googlemaps use different orders for coordinates
			var routeCoordinates = polyline.decode(jsonObj[i].polyline)
			
			feature.geometry = {type:"LineString", coordinates: routeCoordinates}
			feature.properties = {
				key: i,
				tripDuration : jsonObj[i]["tripduration"],
				startTime : jsonObj[i]["starttime"],
				FIELD3 : jsonObj[i]["stoptime"],
				FIELD4 : jsonObj[i]["start station id"],
				startStationName : jsonObj[i]["start station name"],
				FIELD5 : jsonObj[i]["start station latitude"],
				FIELD6 : jsonObj[i]["start station longitude"],
				FIELD8 : jsonObj[i]["end station id"],
				endStationName : jsonObj[i]["end station name"],
				FIELD9 : jsonObj[i]["end station latitude"],
				FIELD10 : jsonObj[i]["end station longitude"],
				FIELD11 : jsonObj[i]["bikeid"]
			}
			geojson.features.push(feature)
		}

		res.status(200).send(geojson);
	})
	filestream.pipe(converter);
})
var port = process.env.PORT || 3000
app.listen(port, function() {
	console.log("The server is listening on port ", port);
})
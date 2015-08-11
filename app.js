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
	var filestream = fs.createReadStream("./data/test.csv");
	var converter = new Converter({ constructResult:true });
	converter.on("end_parsed", function(jsonObj){
		console.log(jsonObj)
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
				FIELD5 : jsonObj[i]["start station latitude"],
				FIELD6 : jsonObj[i]["start station longitude"],
				FIELD8 : jsonObj[i]["end station id"],
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

app.get('/17017trips', function(req, res, next){
	var filestream = fs.createReadStream("./data/17017directions.csv");
	var converter = new Converter({ constructResult:true });
	converter.on("end_parsed", function(jsonObj){
		console.log(jsonObj)
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

app.listen(process.env.PORT || 3000, function() {
	console.log("The server is listening on port ", process.env.PORT || 3000);
})
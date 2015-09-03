
var map = L.map('map').setView([40.725, -73.985], 13);

L.tileLayer('https://{s}.tiles.mapbox.com/v4/kaitoh.6d944249/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia2FpdG9oIiwiYSI6ImJjNzdlM2I5MDZhZGE4YjFhZTNiNDg0MjJhYzhlZGEyIn0.FtUz6dg8P9qESGJRbKyFLg', {
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
	maxZoom: 18,
	id: 'kaitoh.6d944249',
	accessToken: 'pk.eyJ1Ijoia2FpdG9oIiwiYSI6ImJjNzdlM2I5MDZhZGE4YjFhZTNiNDg0MjJhYzhlZGEyIn0.FtUz6dg8P9qESGJRbKyFLg'
}).addTo(map);

var svg = d3.select(map.getPanes().overlayPane).append("svg"),
g = svg.append("g").attr("class", "leaflet-zoom-hide"),
svg2 = d3.select(map.getPanes().overlayPane).append("svg"),
g2 = svg2.append("g").attr("class", "leaflet-zoom-hide");

var transform = d3.geo.transform({point: projectPoint}),
path = d3.geo.path().projection(transform);


d3.json('/trips', function(geojson){

	var feature = g.selectAll("path")
	.data(geojson.features)
	.enter()
	.append("path")
	.attr("class", function(d){
		return "trip" + d.properties.key
	})
	.attr("stroke", "#4ABFDE")
	.attr("stroke-width", 1)
	.attr("fill", "none")
	.attr("opacity", "0")


	//Adding a 'blip' to represent the bike
	
	// var points = g.selectAll("circle")
	// .data(geojson.features)
	// .enter()
	// .append("circle")
	// .attr("cx", function(d){
	// 		// console.log(d.properties.FIELD5);
	// 		return d.properties.FIELD5;
	// 	})
	// .attr("cy", function(d){
	// 		// console.log(d.properties.FIELD6);
	// 		return d.properties.FIELD6;
	// 	})
	// .attr("r", "8px")
	// .attr("fill", "green")
	// .attr("opacity", "100")


	map.on("viewreset", reset);
	reset();

	var intervalTime = 30; // ms, how fast a 'minute' of data appears 
	var animationSpeed = (intervalTime/105)*2; //multiplier for animation duration. dependent on intervalTime

	function animate(index){
		//select a path to animate
		var animatePath = svg.select('path.trip'+index)

		var totalLength = animatePath.node().getTotalLength();
		animatePath
		.attr("opacity", "90")
		.attr("stroke-dasharray", totalLength + " " + totalLength)
		.attr("stroke-dashoffset", totalLength)
		.transition()
		.duration(function(){
			return geojson.features[index].properties.tripDuration*animationSpeed;
		})
		.ease("linear")
		.attr("stroke-dashoffset", 0)
		.transition()
		.style('opacity', 0)
		.duration(100)
		.each("end", function(){activeRiders--});
	}


	function reset() {
		var bounds = path.bounds(geojson),
		topLeft = bounds[0],
		bottomRight = bounds[1];
		console.log('bounds', bounds)
		console.log('topLeft', topLeft)

		svg .attr("width", bottomRight[0] - topLeft[0])
		.attr("height", bottomRight[1] - topLeft[1])
		.style("left", topLeft[0] + "px")
		.style("top", topLeft[1] + "px");

		g   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

		feature.attr("d", path);
		// points.attr("d", path);
	}

	var time = new Date("6/1/2015  12:00:00 AM")*.0005
	var tripCount = 0;
	var activeRiders = 0;

	function render(){
		var timer = setInterval(function(){

			for (var i = 0; i < geojson.features.length ; i++){
				var tripStart = geojson.features[i].properties.startTime
				startTime = new Date(tripStart)*.0005
				
				if (startTime === time){
					tripCount++;
					activeRiders ++;
					animate(i);
				}
			}

			time+= 30;
			$(".time").text(moment(time/.0005).format('h:mm a'));
			$(".tripCount").text(tripCount);
			$(".activeRiders").text(activeRiders);
			if (time > 717580210){
				clearInterval(timer)
			}
		}, intervalTime)
		// if (time > )

		
	}
	$('#startAnimation').click(function(){
		render()
	});
	// render()

})

d3.json('/17017trips', function(geojson){

	var feature = g2.selectAll("path")
	.data(geojson.features)
	.enter()
	.append("path")
	.attr("class", function(d){
		return "trip" + d.properties.key
	})
	.attr("stroke", "#4ABFDE")
	.attr("stroke-width", 2)
	.attr("fill", "none")
	.attr("opacity", "0")

	console.log(geojson.features[0].geometry.coordinates[0])

	// var marker = g2.append("circle")
	// 	.attr("r", 7)
	// 	.attr("cx", 400)
	// 	.attr("cy", 200)
	// 	.attr("transform", "translate(" + geojson.features[0].geometry.coordinates[0] + ")")

	// 	.attr("fill", "yellow")
	// 	// .attr("id", "marker")
	// 	.attr("opacity", "100")
	// 	.attr("id", "marker");


	// var points = g2.selectAll("circle")
	// .data(geojson.features)
	// .enter()
	// .append("circle")
	// .attr("cx", function(d){
	// 		// console.log(d.properties.FIELD5);
	// 		return d.properties.FIELD5;
	// 	})
	// .attr("cy", function(d){
	// 		// console.log(d.properties.FIELD6);
	// 		return d.properties.FIELD6;
	// 	})
	// .attr("r", "8px")
	// .attr("fill", "green")
	// .attr("opacity", "100")


	map.on("viewreset", reset);
	reset();

	var animationSpeed = .4; 

	function animate(index){
		//select a path to animate
		var animatePath = svg2.select('path.trip'+index)

		var totalLength = animatePath.node().getTotalLength();
		var tripDistance = totalLength / 114
		totalDistance += tripDistance;
		

		animatePath
		.attr("opacity", "90")
		.attr("stroke-dasharray", totalLength + " " + totalLength)
		.attr("stroke-dashoffset", totalLength)
		.transition()
		.duration(function(){
			return geojson.features[index].properties.tripDuration*animationSpeed;
		})
		.ease("linear")
		.attr("stroke-dashoffset", 0)
		.transition()
		.style('opacity', .08)
		.duration(100)
		.each("end", function(){
			activeRiders--
			index++
			tripCount17017++
			$('.17017time').text(moment(geojson.features[index].properties.startTime).format('h:mm a'));
			$('.17017date').text(moment(geojson.features[index].properties.startTime).format('MMMM Do YYYY'));
			$('.startStation').text(geojson.features[index].properties.startStationName);
			$('.endStation').text(geojson.features[index].properties.endStationName);
			$('.17017numTrips').text(tripCount17017);
			$('.totalDistance').text(totalDistance.toFixed(2));
			animate(index)
		});

	}

	// function tweenDash(){
	// 	var l = animatePath.node().getTotalLength();
 //    	var i = d3.interpolateString("0," + l, l + "," + l);
 //    	return function(t) {
 //      		var marker = d3.select("#marker");
 //      		var p = animatePath.node().getPointAtLength(t * l);
 //      		marker.attr("transform", "translate(" + p.x + "," + p.y + ")");//move marker
 //      		return i(t);
 //    }
	// }


	function reset() {
		var bounds = path.bounds(geojson),
		topLeft = bounds[0],
		bottomRight = bounds[1];

		svg2 .attr("width", bottomRight[0] - topLeft[0])
		.attr("height", bottomRight[1] - topLeft[1])
		.style("left", topLeft[0] + "px")
		.style("top", topLeft[1] + "px");

		g2   .attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

		feature.attr("d", path);
	}

	var time = new Date("6/1/2015  12:00:00 AM")*.0005
	var time17017 = new Date("6/1/2015  12:00:00 AM")*.0005
	var tripCount = 0;
	var tripCount17017 = 0;
	var activeRiders = 0;
	var dailyAverage = 0;
	var totalDistance = 0;


	$('#startUniqueAnimation').click(function(){
		$('.17017time').text(moment(geojson.features[0].properties.startTime).format('h:mm a'));
		$('.17017date').text(moment(geojson.features[0].properties.startTime).format('MMMM Do YYYY'));
		$('.startStation').text(geojson.features[0].properties.startStationName)
		$('.endStation').text(geojson.features[0].properties.endStationName)
		tripCount17017++
		$('.17017numTrips').text(tripCount17017)
		animate(0)
	});

})


function projectPoint(x,y) {
	var point = map.latLngToLayerPoint(new L.LatLng(y,x));
	// console.log('point', point)
	this.stream.point(point.x, point.y);
}
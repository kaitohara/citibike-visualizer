# Citibike Visualizer

This is a visualization project powered by D3, LeafletJS and the Google Directions API to draw Citibike trips on a map. 

![screenshot](https://github.com/kaitohara/citibike-visualizer/blob/master/Screenshot.png)

# Demo
You can check out the application at https://salty-eyrie-4950.herokuapp.com/

# Features
* View all trips taken on June 1st, 2015
* Follow a single Citibike's (#17017) journey through NYC during June, 2015
* Keep track of stats such as the # of total trips taken, active trips, and start+end stations
* Each completed trip doesn't completely dissappear from the map, allowing the user to see frequently travelled paths over time

Unfortunately, due to the size of the dataset, the visualizer is currently limited to a narrow timeframe (June 2015)

#Some Challenges
1. Managaging Trip Data
  * Obtaining the coordinates necessary for animating each path, then appending the information to the original JSON from Citibike proved to be challenging, especially because the Google Directions API limits the number of queries per second and day. I made requests to the API for each row in Citibike's original CSV file, extracted the polyline data from the response GEOJSON, then compiled it all back into a CSV file for D3 to use.
2. Animating Paths
  * Getting D3 to animate each trip's path between its start/end points were tricky, as well as setting each animation speed to reflect the trip duration. I eventually managed to properly map the polylines from the Google Directions API to D3's transition method to animate the path on the map. I also defined a constant animation speed and multiplied it by each trip's duration.
  
#Takeaways
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; This was my first time using D3, LeafletJS and the Google Directions API, but thanks to some helpful resources online I was able to combine them to draw Citibike data onto a map. Moving on, I'd like to be able to add a 'blip' that represents the single bike
( in the 2nd viewing option) and have the map move to follow the bike. Now that I understand some of the basics of these libraries, I'm keen to continue creating alternative ways to see and interpret data.

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; I find data visualization to be fascinating because it can often make large sets of data more accesible and interesting for others to view. It can simplify complex patterns and ideas into a single visual subject, making it a great starting point for further exploration. Finally, despite its data-driven nature, the visual aspect leaves plenty of room for creativity and design, which I enjoy. 


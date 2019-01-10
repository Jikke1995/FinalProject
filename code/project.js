/**
Name: Jikke van den Ende
Student number: 10787593
This file contains the script for the linked views HTML. It creates a datamap
of the world, which shows (for countries with available data) the alcohol
consumption per country for the year 2015. When clicked on a country, a barchart
is shown which shows the alcohol consumption over multiple years for that
country.
*/

window.onload = function() {

  var place = document.getElementById('container');
  console.log(place);

  var map = new Datamap({element: document.getElementById('container'), height: 400 , width: 900});
  console.log(document.getElementById('container').offsetWidth)

};

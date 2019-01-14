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

  d3v5.json("plastic-waste-generation-total.json").then(function(data){
      createMap(data);
  });

};

function createMap(data) {

  dataset = data;

  Object.keys(dataset).forEach(function(country) {
    dataset[country]["fillKey"] = "DATA AVAILABLE";
  });

    var map = new Datamap({
      element: document.getElementById('container'),
      responsive: true,
      // height: 400,
      // width: 900,
      fills: {
          "DATA AVAILABLE": "#ABDDA4",
          defaultFill: "#556e52"
      },
      data: dataset,
      geographyConfig: {
          popupTemplate: function(geo, data) {
            if(dataset[geo.id] !== undefined) {
                return ['<div class="hoverinfo"><strong>',
                      geo.properties.name,
                      '</strong>',
                       ': ' + dataset[geo.id]['plastic-waste'],
                      '</div>'].join('');
            }
                return ['<div class="hoverinfo"><strong>',
                      geo.properties.name,
                      '</strong>',
                      ': no data available',
                      '</div>'].join('');
          },
          highlightFillColor: function(data) {
            if(data.fillKey) {
              return '#FC8D59';
            }
            return "#556e52"
          },
          highlightBorderColor: function(data) {
            if(data.fillKey) {
              'rgba(250, 15, 160, 0.2)'
            }
          }
      },
      done: function(datamap) {
          datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
              if(data[geography.id] !== undefined){
                  updateBarchart(data, geography.id);
              }
          });
      }
    });

    // map.legend({
    //   defaultFillName: 'NO DATA AVAILABLE:',
    //   responsive: true,
    //   legendTitle: 'MAP LEGEND'});

}

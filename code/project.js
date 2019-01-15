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
      donutChart(data);
  });

};

// function createDonut(data) {
//     var path = svg.datum(data).selectAll("path")
//           .data(pie)
//         .enter().append("path")
//           .attr("fill", "red")
//           .attr("d", arc)
//           .each(function(d) {this._current = d; });
// }

function createMap(data) {

  dataset = data;

  Object.keys(dataset).forEach(function(country) {
    datapoint = roundToTwo(dataset[country]['plastic-waste']) / 1000000
    if(datapoint < 1) {
        dataset[country]["fillKey"] = "LOW";
    }
    else if(datapoint > 1 && datapoint < 3 ) {
        dataset[country]["fillKey"] = "LOW+";
    }
    else if(datapoint > 3 && datapoint < 5 ) {
        dataset[country]["fillKey"] = "LOW++";
    }
    else if(datapoint > 5 && datapoint < 10) {
        dataset[country]["fillKey"] = "LOW+++";
    }
    else if(datapoint > 10 && datapoint < 30) {
      dataset[country]["fillKey"] = "LOW++++";
    }
    else {
        dataset[country]["fillKey"] = "HIGH";
    }
  });

    var map = new Datamap({
      element: document.getElementById('container'),
      responsive: true,
      // height: 400,
      // width: 900,
      fills: {
          defaultFill: "#d9f2e4",
          "LOW": "#9fdfbc",
          "LOW+": "66cc94",
          "LOW++": "3cb371",
          "LOW+++": "267349",
          "LOW++++": "#267349",
          "HIGH": "194d30",
      },
      data: dataset,
      geographyConfig: {
          popupTemplate: function(geo, data) {
            if(dataset[geo.id] !== undefined) {
                return ['<div class="hoverinfo"><strong>',
                      geo.properties.name,
                      '</strong>',
                       ': ' + (roundToTwo(dataset[geo.id]['plastic-waste'] / 1000000)),
                       ' million tonnes',
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

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function donutChart(data) {

    var width = 960,
        height = 500
        radius = Math.min(width, height) / 2;

    var color = d3.scale.category20();

    var pie = d3.layout.pie()
                .value(function(d) {
                  return d['plastic-waste'];
                })
                .sort(null);

    var arc = d3.svg.arc()
                .innerRadius(radius - 100)
                .outerRadius(radius- 20);

    var svg = d3.select("#donut").append('svg')
                .attr("width", width)
                .attr("height", height)
              .append("g")
              .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    // var path = svg.datum(data).selectAll("path")
    //       .data(pie)
    //     .enter().append("path")
    //       .attr("fill", "red")
    //       .attr("d", arc)
    //       .each(function(d) {this._current = d; });

    // var arc = d3v5.arc()
    //             .outerRadius(200 - 10)
    //             .innerRadius(100);
    //
    // var pie = d3v5.pie()
    //             .sort(null)
    //             .value(function(d) {
    //               return d["plastic-waste"];
    //             });
    //
    // var svg = d3v5.select('#donut')
    //             .append("svg")
    //             .attr("width", 540)
    //             .attr("height", 540)
    //             .append("g")
    //             .attr("transform", "translate(270, 270)");
    //
    // var g = svg.selectAll(".arc")
    //             .data(pie(data))
    //             .enter().append("g");
    //
    // g.append("path")
    //   .attr("d", arc)
    //   .style("fill", "red");
}

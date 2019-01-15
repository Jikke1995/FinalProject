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

  var requests = [d3v5.json("plastic-waste-generation-total.json"), d3v5.json("inadequately-managed-plastic.json")];

  Promise.all(requests).then(function(response) {
      data_waste = response[0];
      data_miswaste = response[1];
      dataset = combineData(data_waste, data_miswaste);
      console.log(dataset);
      createMap(dataset);
      donutChart(dataset);

  }).catch(function(e){
       throw(e);
  });

};

function combineData(data1, data2) {
  Object.keys(data1).forEach(function(d) {
      Object.keys(data2).forEach(function(s) {
        if(s === d) {
          data1[d]['mismanaged'] = data2[s];
        };
      });
  });

  return data1;
}

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
                  updatePieChart(data, 'oranges');
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

    console.log(data);
    // HIER MOET IK DATA BRUIKBAAR MAKEN VOOR PIE CHART

    var width = 960,
        height = 500
        radius = Math.min(width, height) / 2;

    const svg = d3v5.select("#donut")
        .append('svg')
            .attr("width", width)
            .attr("height", height)
        .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    const color = d3v5.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb",
         "#e78ac3","#a6d854","#ffd92f"]);

    const pie = d3v5.pie()
                .value(function(d) {
                  return d['mismanaged'];
                })
                .sort(null);

    const arc = d3v5.arc()
                .innerRadius(radius - 100)
                .outerRadius(radius- 20)

    console.log(data['ALB']);

    const path = svg.selectAll("path")
            .data(pie(data['ALB']));

    path.enter().append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", arc)
        .attr("stroke", "white")
        .attr("stroke-width", "6px")
        .each(function(d) { return data[d];  });

}

function arcTween(a) {
    const i = d3.interpolate(this._current, a);
    this._current = i(1);
    return (t) => arc(i(t));
}

function updatePieChart(data, country) {

    const path = svg.selectAll("path")
            .data(data[country]);

    path.transition().duration(200).attrTween("d", arcTween);

    path.enter().append("path")
        .attr("fill", function(d, i) {
            return color(i)
        })
        .attr("d", arc)
        .attr("stroke", "white")
        .attr("stroke-width", "6px")
        .each(function(d) { this._current = d;  });
}

}

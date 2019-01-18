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

  var requests = [d3v5.json("plastic-waste-generation-total.json"), d3v5.json("inadequately-managed-plastic.json"), d3v5.json("mismanaged-waste-global-total.json")];

  Promise.all(requests).then(function(response) {
      data_waste = response[0];
      data_miswaste = response[1];
      data_global_miswaste = response[2];
      dataset = combineData(data_waste, data_miswaste, data_global_miswaste);
      createMap(dataset);
      donutChart(dataset);
      createBarchart();

  }).catch(function(e){
       throw(e);
  });

};

function combineData(data1, data2, data3) {

  Object.keys(data1).forEach(function(d) {
      Object.keys(data2).forEach(function(s) {
        Object.keys(data3).forEach(function(t) {
          if(s === d && s === t) {
            data1[d]['Percentage Mismanaged Waste'] = data2[s];
            data1[d]['Percentage Global Mismanaged Waste'] = data3[t];
          };
        })
      });
  });

  return data1;
}

function createMap(data) {

  dataset = data;

  Object.keys(dataset).forEach(function(country) {
    datapoint = roundToTwo(dataset[country]['Plastic Waste']) / 1000000
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

  console.log(dataset);
  console.log(dataset['ABW']);
  console.log(roundToTwo(dataset['ABW']['Plastic Waste']) / 1000000);

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
                       ': ' + (roundToTwo(data['Plastic Waste'] / 1000000)),
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
                console.log(data[geography.id]['Plastic Waste'])
                  console.log('hoi');
              }
          });
      }
    });
    //
    // map.legend({
    //   defaultFillName: 'NO DATA AVAILABLE:',
    //   legendTitle: 'MAP LEGEND'});

}

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function donutChart(data) {

    dataset_DC = []
    datapoint = {}
    Object.keys(data).forEach(function(d) {
        datapoint['Land'] = data[d]['Landname'];
        datapoint['Percentage'] = data[d]['Percentage Global Mismanaged Waste']
        datapoint['Own Percentage'] = data[d]['Percentage Mismanaged Waste']
        dataset_DC.push(datapoint);
        datapoint = {};
    });

    console.log(dataset_DC);

    svg_width = 800;
    svg_height = 600;

    var width = 600,
        height = 400,
        radius = Math.min(width, height) / 2;


    const svg = d3v5.select("#donut")
        .append('svg')
            .attr("id", 'donutchart')
            .attr("width", svg_width)
            .attr("height", svg_height)
        .append("g")
            .attr("transform", "translate(" + svg_width / 2 + "," + svg_height / 2 + ")");

    var color = d3v5.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb",
         "#e78ac3","#a6d854","#ffd92f"]);

    var pie = d3v5.pie()
                .value(function(d) {
                    return d.Percentage;
                })
                .sort(null);

    var arc = d3v5.arc()
                .innerRadius(radius - 20)
                .outerRadius(radius - 100);

    var path = svg.selectAll('path')
          .data(pie(dataset_DC));

    path.enter().append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", arc)
        .attr("stroke", "white")
        .attr("stroke-width", "0.5px");

    d3v5.select('#donut').selectAll('path').call(toolTipDonut);

    function toolTipDonut(selection) {

        selection.on('mouseenter', function(data) {

        svg.append('text')
            .attr('class', 'toolCircle')
            .attr('dy', 0)
            .html(toolTipTEXT(data))
            .style('font-size', '.9em')
            .style('text-anchor', 'middle');

        svg.append('circle')
            .attr('class', 'toolCircle')
            .attr('r', (radius * 0.45))// radius of tooltip circle
            .style('fill', 'red') // colour based on category mouse is over
            .style('fill-opacity', 0.35);

        });

        selection.on('mouseout', function() {
            d3v5.selectAll('.toolCircle').remove();
        });

        selection.on('mousedown', function(data) {
            secondLayerDonutChart(data.data, svg);
        });
    }

}

function prepareDataDonut(data) {
  data['Rest Percentage'] = 100 - data['Own Percentage']
  dataset = []
  datapoint = {}
  datapoint['Land'] = data['Land']
  datapoint['Waste'] = 'Mismanaged Plastic Waste'
  datapoint['%'] = data['Own Percentage'];
  dataset.push(datapoint);
  datapoint = {};
  datapoint['Land'] = data['Land']
  datapoint['Waste'] = 'Managed Plastic Waste'
  datapoint['%'] = data['Rest Percentage']
  dataset.push(datapoint);

  return dataset;
}

function secondLayerDonutChart(data, svg) {

    dataset_DC = prepareDataDonut(data);

    var width = 600,
        height = 400,
        radius = Math.min(width, height) / 2;

    var color = d3v5.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb",
             "#e78ac3","#a6d854","#ffd92f"]);

    var pie = d3v5.pie()
                  .value(function(d) {
                      return d['%']
                  })
                  .sort(null);

    var arc = d3v5.arc()
                .innerRadius(radius - 10)
                .outerRadius(radius + 70);

    if(d3v5.select('#outerCircle').empty()) {

        svg.append('g')
            .attr("id", "outerCircle");

        var path = svg.select('#outerCircle').selectAll('path')
              .data(pie(dataset_DC));

        path.enter().append("path")
            .attr("fill", function(d, i) {
                return color(i)
            })
            .attr("d", arc)
            .attr("stroke", "white")
            .attr("stroke-width", "0.5px");
    } else {

        var path = svg.select('#outerCircle').selectAll('path')
              .data(pie(dataset_DC));

        path.transition().duration(1000).attrTween("d", arcTween);

    };


    d3v5.select('#donut').selectAll('path').call(toolTipDonut);

    function toolTipDonut(selection) {

        selection.on('mouseenter', function(data) {

        svg.append('text')
            .attr('class', 'toolCircle')
            .attr('dy', 0)
            .html(toolTipTEXT(data))
            .style('font-size', '.9em')
            .style('text-anchor', 'middle');

        svg.append('circle')
            .attr('class', 'toolCircle')
            .attr('r', (radius * 0.45))// radius of tooltip circle
            .style('fill', 'red') // colour based on category mouse is over
            .style('fill-opacity', 0.35);

        });

        selection.on('mouseout', function() {
            d3v5.selectAll('.toolCircle').remove();
        });
    }

}

function toolTipTEXT(data) {

    var tip = '',
    i   = 0;

    for (var key in data.data) {
      if (key == 'Land') {
        tip += '<tspan x="0">' + data.data[key] + '</tspan>';
      }
      if (key == 'Waste') {
        tip += '<tspan x="0" dy="1.2em">' + data.data[key] + '</tspan>';
      }
      if (key == 'Percentage') {
        tip += '<tspan x="0" dy="1.2em">' + Math.round(data.data[key]) + '% of global total' + '</tspan>';
      }
      if (key == '%') {
        tip += '<tspan x="0" dy="1.2em">' + Math.round(data.data[key]) + '% of total plastic waste' + '</tspan>';
      }
      i++;
    }

    return tip;
};

function arcTween(a) {

  var width = 600,
      height = 400,
      radius = Math.min(width, height) / 2;

  var arc = d3v5.arc()
              .innerRadius(radius - 10)
              .outerRadius(radius + 70);

    const i = d3v5.interpolate(this._current, a);
    this._current = i(1);
    return (t) => arc(i(t));
}

function createBarchart() {

  d3v5.json("surface-plastic-particles-by-ocean.json").then(function(data) {

    var svg_width = 800;
    var svg_height = 600;
    var chart_width = 400;
    var chart_height = 200;

    var oceans = [];
    Object.keys(data).forEach(function(d) {
        console.log(d);
    });

    var svg = d3v5.select("#barchart")
              .append("svg")
              .attr("id", "SVG-barchart")
              .attr("width", svg_width)
              .attr("height", svg_height)
              .attr("transform", 'translate(' + svg_width / 2 + ',' + svg_height / 2 + ')');

    var xScale = d3v5.scaleOrdinal()
                      .domain([])
                      .range([0, chart_width]);

    console.log(data);

  })
}

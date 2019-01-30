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

  var requests = [d3v5.json('plastic-waste-generation-total.json'), d3v5.json('inadequately-managed-plastic.json'), d3v5.json('mismanaged-waste-global-total.json')];

  Promise.all(requests).then(function(response) {
      dataset = combineData(response[0], response[1], response[2]);
      createMap(dataset);
      donutChart(dataset);
      createBarchart();
      var lines = timelineChart();

        function resize() {
            if (d3v5.select("#linechart svg").empty()) {
                return;
            }
            lines.width(+d3v5.select("#linechart").style("width").replace(/(px)/g, ""))
                .height(+d3v5.select("#linechart").style("height").replace(/(px)/g, ""));
            d3v5.select("#linechart").call(lines);
        }

        d3v5.json("global-plastic-production.json").then(function(data) {
            d3v5.select("#linechart").datum(data).call(lines);
            d3v5.select(window).on('resize', resize);
            resize();
        });

  }).catch(function(e){
       throw(e);
  });

};

function combineData(data1, data2, data3) {
  /**
  This function combines the datapoint of the three different datafiles in
  an understandable and clear 'main' datafile.
  */

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

  var dataset = data;

  Object.keys(dataset).forEach(function(country) {
    datapoint = roundToTwo(dataset[country]['Plastic Waste']) / 1000000
    if(datapoint < 1) {
        dataset[country]["fillKey"] = 'LOW';
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
            return "#d9f2e4"
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

                var prep_data = prepareDataDonutInside(dataset);

                for(i = 0; i < prep_data.length; i ++) {
                  if(prep_data[i]['Land'] == geography.properties.name) {
                      set_data = prep_data[i]
                  }
                  if(geography.properties.name == 'United States of America' &&
                      prep_data[i]['Land'] == 'United States') {
                        set_data = prep_data[i]
                  }
                }
                secondLayerDonutChart(set_data);
              }
          });
      }
    });
    //
    // map.legend({
    //   defaultFillName: 'NO DATA AVAILABLE:'
    //   legendTitle: 'MAP LEGEND'});

}

function roundToTwo(num) {
    return +(Math.round(num + "e+2")  + "e-2");
}

function prepareDataDonutInside(data) {

  dataset_DC = []
  datapoint = {}
  Object.keys(data).forEach(function(d) {
      datapoint['Land'] = data[d]['Landname'];
      datapoint['Percentage'] = data[d]['Percentage Global Mismanaged Waste']
      datapoint['Own Percentage'] = data[d]['Percentage Mismanaged Waste']
      dataset_DC.push(datapoint);
      datapoint = {};
  });

  return dataset_DC;
}

function donutChart(data) {

    dataset_DC = prepareDataDonutInside(data);

    svg_width = document.getElementById('donut').offsetWidth;
    svg_height = 400;
    radius = Math.min(svg_width, svg_height) / 2;
    padding = 40;

    const svg = d3v5.select("#donut")
        .append('svg')
        .attr("id", 'donutchart')
        .attr('width', svg_width)
        .attr('height', svg_height)
      .append("g")
        .attr("transform", "translate(" + svg_width / 2 + "," + svg_height / 2 + ")");

    var color = d3v5.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb","#e78ac3",
                      "#a6d854","#ffd92f"]);

    var pie = d3v5.pie()
                .value(function(d) {
                    return d.Percentage;
                })
                .sort(null);

    var arc = d3v5.arc()
                .innerRadius(radius * 0.70)
                .outerRadius(radius * 0.47);

    var path = svg.selectAll('path')
          .data(pie(dataset_DC));

    path.enter().append("path")
        .attr("fill", function(d, i) {
            return color(i);
        })
        .attr("d", arc)
        .attr("stroke", "white")
        .attr("stroke-width", "0.5px");

    d3v5.select('#donutchart').selectAll('path').call(toolTipDonut);

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
            secondLayerDonutChart(data.data);
        });
    }

}

function prepareDataDonutOutside(data) {
  data['Rest Percentage'] = 100 - data['Own Percentage']
  dataset_donut = []
  datapoint = {}
  datapoint['Land'] = data['Land']
  datapoint['Waste'] = 'Mismanaged Plastic Waste'
  datapoint['%'] = data['Own Percentage'];
  dataset_donut.push(datapoint);
  datapoint = {};
  datapoint['Land'] = data['Land']
  datapoint['Waste'] = 'Managed Plastic Waste'
  datapoint['%'] = data['Rest Percentage']
  dataset_donut.push(datapoint);

  return dataset_donut;
}

function secondLayerDonutChart(data) {

    var svg = d3v5.select('#donutchart');

    dataset_DC = prepareDataDonutOutside(data);

    width = document.getElementById('donut').offsetWidth;
    height = 400;
    radius = Math.min(width, height) / 2;

    var color = d3v5.scaleOrdinal(['#66c2a5','#fc8d62'])

    var pie = d3v5.pie()
                  .value(function(d) {
                      return d['%']
                  })
                  .sort(null);

    var arc = d3v5.arc()
                .innerRadius(radius * 0.72)
                .outerRadius(radius * 0.92);

    svg.append('g')
        .attr('id', 'outerCircle')
        .attr('transform', 'translate(' + svg_width / 2 + ',' + svg_height / 2 + ')');

    var path = svg.select('#outerCircle').selectAll('path')
          .data(pie(dataset_DC));

    path.enter().append('path')
        .merge(path)
        .attr('fill', function(d, i) {
            return color(i)
        })
        .attr('d', arc)
        .attr('stroke', 'white')
        .attr('stroke-width', '0.5px')
        .transition().duration(1000).attrTween('d', arcTween);

    d3v5.select('#donutchart').selectAll('path').call(toolTipDonut);

    function toolTipDonut(selection) {

        selection.on('mouseenter', function(data) {

        svg.append('text')
            .attr("transform", "translate(" + svg_width / 2 + "," + svg_height / 2 + ")")
            .attr('class', 'toolCircle')
            .attr('dy', 0)
            .html(toolTipTEXT(data))
            .style('font-size', '.9em')
            .style('text-anchor', 'middle');

        svg.append('circle')
            .attr("transform", "translate(" + svg_width / 2 + "," + svg_height / 2 + ")")
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
      // if (key == 'Waste') {
      //   tip += '<tspan x="0" dy="1.2em">' + data.data[key] + '</tspan>';
      // }
      if (key == 'Percentage') {
        tip += '<tspan x="0" dy="1.2em">' + Math.round(data.data[key]) + '% of global total' + '</tspan>';
      }
      // if (key == '%') {
      //   tip += '<tspan x="0" dy="1.2em">' + Math.round(data.data[key]) + '% of total plastic waste' + '</tspan>';
      // }
      i++;
    }

    return tip;
};

function arcTween(a) {

  var width = document.getElementById('donut').offsetWidth,
      height = 400,
      radius = Math.min(width, height) / 2;

  var arc = d3v5.arc()
              .innerRadius(radius * 0.72)
              .outerRadius(radius * 0.92);

    const i = d3v5.interpolate(this._current, a);
    this._current = i(1);
    return (t) => arc(i(t));
}

function createBarchart() {

  d3v5.json("surface-plastic-particles-by-ocean.json").then(function(data) {

    console.log(data);

    var svg_width = document.getElementById('barchart').offsetWidth;
    var svg_height = 400;
    var svg_padding = 60;

    var chart_width = svg_width - (2 * svg_padding);
    var chart_height = svg_height - (2 * svg_padding);
    var padding = 5;

    var colors = d3v5.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb","#e78ac3",
                      "#a6d854","#ffd92f"]);

    var oceans = [];
    var values = [];
    Object.keys(data).forEach(function(d) {
        oceans.push(d);
        values.push(data[d]['Plastic Particles'] / 1000000000);
    });

    var svg = d3v5.select("#barchart")
              .append("svg")
              .attr("id", 'SVG-barchart')
              .attr("width", svg_width)
              .attr("height", svg_height)
              .append('g')
              .attr("transform", 'translate(' + (svg_width / 2 - (chart_width / 2)) + ',' + (svg_height / 2 - (chart_height / 2)) + ')');

    var xScale = d3v5.scaleOrdinal()
                      .domain(oceans)
                      .range([0, chart_width], );

    var xScale = d3v5.scaleBand()
                      .range([0, chart_width])
                      // .padding(padding)
                      .domain(oceans);

    var yScale = d3v5.scaleLinear()
                      .domain([0, 6000])
                      .range([0, chart_height]);

    var yScaleAxis = d3v5.scaleLinear()
                          .domain([0, 6000])
                          .range([chart_height, 0]);

    var rectangles = svg.selectAll("rect")
                        .data(values)
                        .enter()
                        .append("rect");

    // var hahatip = createToolTip(svg);

    rectangles.attr("x", function(d, i) { return padding + i * (chart_width / values.length); })
                .attr("y", function(d) { return chart_height - yScale(d); })
                .attr("fill", function(d, i) { return colors(i) })
                .attr("width", chart_width / values.length - padding)
                .attr("height", function(d) { return yScale(d); })
                .on('mouseover', function(d,i) {
                    d3v5.select(this).attr("fill", "rgb(252,223,89)")
                    // hahatip.style("display", null);
                    // hahatip.select("text").text("hoi");
                    // hahatip.attr("transform", "translate(100,10)");
                })
                .on('mouseout', function(d, i) {
                    // hahatip.style("display", "none")
                    d3v5.select(this).attr("fill", function(d, i) {
                      return colors(i);
                    });
                    console.log('hoi');
                })
                // .on('mousemove', function(d, i) {
                //   tip.style("display", null);
                //   var xPosition = d3v5.mouse(this)[0] - 100;
                //
                //   // Makes sure that the tooltip doesn't partly disappear
                //   if (xPosition < 2) {
                //       xPosition = 2;
                //   }
                //   if (xPosition + 260 > 500) {
                //       xPosition = 500 - 262
                //   }
                //
                //   var yPosition = d3v5.mouse(this)[1] - 70;
                //   tip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
                //   tip.select("text").text("Number of particles: " + d );
                // });
    // Add x-axis
    var x_axis = svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", "translate(0, " + chart_height + ")")
                    .call(d3v5.axisBottom(xScale))
                    .selectAll("text")
                    .attr("x", 4)
                    .style("text-anchor", "middle");

    // //Add y-axis
    var y_axis = svg.append("g")
                    .attr("class", "y axis")
                    .call(d3v5.axisLeft(yScaleAxis))

    // Add x-axis label
    svg.append("text")
        .attr("class", "x-label")
        .attr("transform","translate(" + chart_width / 2  + "," + (chart_height + 30) + ")")
        .style("text-achor", "middle")
        .text("Oceans");

    // Add y-axis label
    // svg.append("text")
    //     .attr("class", "y-label")
    //     .attr("transform","rotate(-90)")
    //     .attr("y", padding / 2)
    //     .attr("x", 0 - (chart_height / 2) - padding - 70)
    //     .style("text-achor", "middle")
    //     .text("Litres per capita");


  });
}

function createToolTip(svg) {
  /**
  This function creates a Tooltip (default display: not shown) that can contain text.
  */
  var tip = svg.append("g")
                .attr("class", "tooltip")
                .style("display", "none");

  // Append a rect to the tooltip
  tip.append("rect")
      .attr("width", 100)
      .attr("position", "absolute")
      .attr("height", 20)
      .attr("fill", "white")
      .style("opacity", 0.5);

  // Append the possibility for a piece of text for the tooltip
  tip.append("text")
      .attr("x", 20)
      .attr("dy", "1.2em")
      .attr("position", "absolute")
      .style("text-achor", "middle")
      .attr("font-size", "12px")
      .attr("font-weight", "bold")

  return tip;

}

function timelineChart() {
    var margin = { top: 20, right: 20, bottom: 50, left: 50 },
        width = 350,
        height = 350,
        parseTime = d3v5.timeParse("%Y"),
        timeValue = function(d) { return parseTime(d['Year']); },
        dataValue = function (d) { return +d['Plastic Production'] / 1000000; },
        color = "steelblue";

    // From https://bl.ocks.org/mbostock/5649592
    function transition(path) {
        path.transition()
            .duration(2000)
            .attrTween("stroke-dasharray", tweenDash);
    }
    function tweenDash() {
        var l = this.getTotalLength(),
            i = d3v5.interpolateString("0," + l, l + "," + l);
        return function (t) { return i(t); };
    }

    function chart(selection) {
        selection.each(function (data) {
            data = data.map(function (d, i) {
                return { time: timeValue(d), value: dataValue(d) };
            });

            var x = d3v5.scaleTime()
                .rangeRound([0, width - margin.left - margin.right])
                .domain(d3v5.extent(data, function(d) { return d.time; }));
            var y = d3v5.scaleLinear()
                .rangeRound([height - margin.top - margin.bottom, 0])
                .domain(d3v5.extent(data, function(d) { return d.value; }));

            var line = d3v5.line()
                .x(function(d) { return x(d.time); })
                .y(function(d) { return y(d.value); });

            var svg = d3v5.select(this).selectAll("svg").data([data]);
            var gEnter = svg.enter().append("svg").append("g");

            gEnter.append("path")
                .datum(data)
                .attr("class", "data")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 4);

            gEnter.append("g").attr("class", "axis x");
            gEnter.append("g").attr("class", "axis y")
                .append("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("Data");
            gEnter.append("path")
                .attr("class", "data");

            var svg = selection.select("svg");
            svg.attr('width', width).attr('height', height);
            var g = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            g.select("g.axis.x")
                .attr("transform", "translate(0," + (height - margin.bottom) + ")")
                .call(d3v5.axisBottom(x).ticks(5))
                .select(".domain")
                .remove();

            g.select("g.axis.y")
                .attr("class", "axis y")
                .call(d3v5.axisLeft(y));

            g.select("path.data")
                .datum(data)
                .attr("d", line)
                .call(transition);
        });
    }

    chart.margin = function (_) {
        if (!arguments.length) return margin;
        margin = _;
        return chart;
    };

    chart.width = function (_) {
        if (!arguments.length) return width;
        width = _;
        return chart;
    };

    chart.height = function (_) {
        if (!arguments.length) return height;
        height = _;
        return chart;
    };

    chart.parseTime = function (_) {
        if (!arguments.length) return parseTime;
        parseTime = _;
        return chart;
    };

    chart.timeValue = function (_) {
        if (!arguments.length) return timeValue;
        timeValue = _;
        return chart;
    };

    chart.dataValue = function (_) {
        if (!arguments.length) return dataValue;
        dataValue = _;
        return chart;
    };

    return chart;
}

function createLineChart() {

        // var svg_width = document.getElementById('linechart').offsetWidth,
        //     svg_height = 400,
        //     svg_padding = 60,
        //     parseTime = d3v5.timeParse('%Y'),
        //     chart_width = svg_width - (2 * svg_padding),
        //     chart_height = svg_height - (2 * svg_padding),
        //     timeValue = function(d) { return parseTime(d.Year) },
        //     dataValue = function(d) { return +d['Plastic Production'] / 1000000 }
        //     color = 'steelblue';
        //
        // function transition(path) {
        //     path.transition()
        //         .duration(2000)
        //         .attrTween('stroke-dasharray', tweenDash);
        // }
        // function tweenDash() {
        //     var l = this.getTotalLength(),
        //         i = d3v5.interpolateString('0,' + 1, 1 + "," + 1);
        //     return function(t) { return i(t); };
        // }
        //
        // function chart(selection) {
        //   selection.each(function (data) {
        //       data = data.map(function (d, i) {
        //           return { time: timeValue(d), value: dataValue(d) };
        //       });
        //       var x = d3v5.scaleTime()
        //           .rangeRound([0, chart_width])
        //           .domain(d3v5.extent(data, function(d) { return d.time; }));
        //       var y = d3v5.scaleLinear()
        //           .rangeRound([chart_height, 0])
        //           .domain(d3v5.extent(data, function(d) { return d.value; }));
        //
        //       var line = d3v5.line()
        //           .x(function(d) { return x(d.time); })
        //           .y(function(d) { return y(d.value); });
        //
        //       var svg = d3v5.select(this).selectAll("svg").data([data]);
        //       var gEnter = svg.enter().append("svg").append("g");
        //
        //       gEnter.append("path")
        //           .datum(data)
        //           .attr("class", "data")
        //           .attr("fill", "none")
        //           .attr("stroke", "steelblue")
        //           .attr("stroke-linejoin", "round")
        //           .attr("stroke-linecap", "round")
        //           .attr("stroke-width", 4);
        //
        //       gEnter.append("g").attr("class", "axis x");
        //       gEnter.append("g").attr("class", "axis y")
        //           .append("text")
        //           .attr("fill", "#000")
        //           .attr("transform", "rotate(-90)")
        //           .attr("y", 6)
        //           .attr("dy", "0.71em")
        //           .attr("text-anchor", "end")
        //           .text("Data");
        //       gEnter.append("path")
        //           .attr("class", "data");
        //
        //       var svg = selection.select("svg");
        //       svg.attr('width', svg_width).attr('height', svg_height);
        //       var g = svg.select("g")
        //           .attr("transform", 'translate(' + (svg_width / 2 - (chart_width / 2)) + ',' + (svg_height / 2 - (chart_height / 2)) + ')');
        //
        //       g.select("g.axis.x")
        //           .attr("transform", "translate(0," + chart_height + ")")
        //           .call(d3v5.axisBottom(x))
        //           .select(".domain")
        //           .remove();
        //
        //       g.select("g.axis.y")
        //           .attr("class", "axis y")
        //           .call(d3v5.axisLeft(y));
        //
        //       g.select("path.data")
        //           .datum(data)
        //           .attr("d", line)
        //           .call(transition);
        //     });
        //   }
        //
        //   // chart.margin = function (_) {
        //   //     if (!arguments.length) return margin;
        //   //     margin = _;
        //   //     return chart;
        //   // };
        //
        //   chart.width = function (_) {
        //       if (!arguments.length) return width;
        //       width = _;
        //       return chart;
        //   };
        //
        //   chart.height = function (_) {
        //       if (!arguments.length) return height;
        //       height = _;
        //       return chart;
        //   };
        //
        //   chart.parseTime = function (_) {
        //       if (!arguments.length) return parseTime;
        //       parseTime = _;
        //       return chart;
        //   };
        //
        //   chart.timeValue = function (_) {
        //       if (!arguments.length) return timeValue;
        //       timeValue = _;
        //       return chart;
        //   };
        //
        //   chart.dataValue = function (_) {
        //       if (!arguments.length) return dataValue;
        //       dataValue = _;
        //       return chart;
        //   };
        //
        //   return chart;
}

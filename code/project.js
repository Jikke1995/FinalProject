/**
Name: Jikke van den Ende
Student number: 10787593
This file contains the functions used for the datamap and the piechart.
*/

function combineData(data1, data2, data3, data4) {
  /**
  This function combines the datapoints of the four different
  datafiles into an understandable and clear 'main' datafile
  with data for most of the countries in the world.
  */

  Object.keys(data1).forEach(function(d) {
    Object.keys(data2).forEach(function(s) {
      Object.keys(data3).forEach(function(t) {
        if(s === d && s === t) {
          data1[d]['Percentage Mismanaged Waste'] = data2[s];
          data1[d]['Percentage Global Mismanaged Waste'] = data3[t];
        };
      })
    })
  });

  Object.keys(data1).forEach(function(d) {
    Object.keys(data4).forEach(function(s) {
      if (d === s) {
        data1[d]['Plastic waste per capita'] = data4[s];
      }
    })
  })

  return data1;
}

function createMap(data) {
  /**
  Function for creating the datamap.
  */

  var dataset = data;

  // Creates place for information of the donutchart
  var info = d3v5.select('#donutinfo')
              .style('display', 'none');

  info.append('h2');
  info.append('p');
  info.append('legend')

  // Create piece of text with what's measuered
  var mapinfo = d3v5.select("#mapinfo");
  mapinfo.append('p');
  mapinfo.select('p').text('Total plastic waste generation by country, measured in tonnes per year.');

  // Store used colors for choropleth.
  var colors1 = ["#d9f2e4", "#9fdfbc", "#66cc94", "#3cb371", "#339961", "#267349", "#194d30"]
  var colors2 = ["#d9f2e4", "#9fdfbc", "#66cc94", "#3cb371", "#339961", "#267349"]

  // Create map
  var map = countryMap();

    var legend = d3v5.select('#datamapLegend')
           .append('ul')
           .attr('class', 'list-inline');

    var keys = legend.selectAll('li.key')
           .data(colors1);

    var legend_items = ["No data", "< 1", "1 - 3", "3 - 5", "5 - 10", "10 - 30", "> 30"];

    keys.enter().append('li')
           .attr('class', 'key')
           .style('border-top-color', String)
           .text(function (d, i) {
               return legend_items[i];
           })
           .style('text-anchor', 'middle');

  // Create dropdownmenu
  var menu = d3v5.select('#dropdownmenu')
  var selections = ['Plastic waste whole country', 'Plastic waste per capita'];
  var select = d3v5.select('#dropdownmenu')
    .append('select')
        .attr('class', 'select')
        .on('change', onchange);
  var option = select
        .selectAll('option')
        .data(selections).enter()
        .append('option')
        .text(function(d) {
          return d;
        });

  function onchange() {
    /**
    Function for when the selected option in the dropdownmenu changes:
    it changes the choropleth for the datamap, it changes the piece of text
    what is measured in the datamap and the legend.
    */
    var selectValue = d3v5.select('select').property('value')

    if (selectValue === 'Plastic waste whole country') {
      for (key in map.options.data) {
          var colors = {};
          if (map.options.data[key]['fillKey'] == '< 1 million tonnes') {
            colors[key] = "#9fdfbc";
          }
          if (map.options.data[key]['fillKey'] == '1 - 3 million tonnes') {
            colors[key] = "#66cc94";
          }
          if (map.options.data[key]['fillKey'] == '3 - 5 million tonnes') {
            colors[key] = "#3cb371";
          }
          if (map.options.data[key]['fillKey'] == '5 - 10 million tonnes') {
            colors[key] = "#339161";
          }
          if (map.options.data[key]['fillKey'] == '10 - 30 million tonnes') {
            colors[key] = "267349";
          }
          if (map.options.data[key]['fillKey'] == '> 30 million tonnes') {
            colors[key] = "#194d30";
          }
          map.updateChoropleth(colors);
      }

      // Change underline datamap
      mapinfo.select('p').text('Total plastic waste generation by country, measured in tonnes per year.');

      // Delete old legend and create legend for this datamap.
      d3v5.select('#datamapLegend > *').remove();
      var legend = d3v5.select('#datamapLegend')
             .append('ul')
             .attr('class', 'list-inline');

      var keys = legend.selectAll('li.key')
             .data(colors1);

      var legend_items = ["No data", "< 1", "1 - 3", "3 - 5", "5 - 10", "10 - 30", "> 30"];

      keys.enter().append('li')
             .attr('class', 'key')
             .style('border-top-color', String)
             .text(function (d, i) {
                 return legend_items[i];
             })
             .style('text-anchor', 'middle');

    }
    if (selectValue === 'Plastic waste per capita') {

      for (key in map.options.data) {
          var colors = {};
          if (map.options.data[key]['fillKeyCapita'] == '< 0.1 kg') {
            colors[key] = "#9fdfbc";
          }
          if (map.options.data[key]['fillKeyCapita'] == '0.1 - 0.2 kg') {
            colors[key] = "#66cc94";
          }
          if (map.options.data[key]['fillKeyCapita'] == '0.2 - 0.3 kg') {
            colors[key] = "#3cb371";
          }
          if (map.options.data[key]['fillKeyCapita'] == '0.3 - 0.4 kg') {
            colors[key] = "#339161";
          }
          if (map.options.data[key]['fillKeyCapita'] == '> 0.4 kg') {
            colors[key] = "#267349";
          }
          map.updateChoropleth(colors);
      }

      // Change underline datamap.
      mapinfo.select('p').text('Daily plastic waste generation per person, measured in kilograms per person per day.');

      // Delete old legend, and create new one for this new dataset.
      d3v5.select('#datamapLegend > *').remove();

      var legend = d3v5.select('#datamapLegend')
             .append('ul')
             .attr('class', 'list-inline');

      var keys = legend.selectAll('li.key')
             .data(colors2);

      var legend_items = ["No data", "< 0.1", "0.1 - 0.2", "0.2 - 0.3", "0.3 - 0.4", "> 0.4"];

      keys.enter().append('li')
             .attr('class', 'key')
             .style('border-top-color', String)
             .text(function (d, i) {
                 return legend_items[i];
             })
             .style('text-anchor', 'middle');
    }

  }

  function countryMap() {
    /**
    This function creates the first shown datamap for the plastic waste per
    whole country.
    */

    Object.keys(dataset).forEach(function(country) {
        datapoint = roundToTwo(dataset[country]['Plastic Waste']) / 1000000
        if(datapoint < 1) {
            dataset[country]["fillKey"] = '< 1 million tonnes';
        }
        else if(datapoint > 1 && datapoint < 3 ) {
            dataset[country]["fillKey"] = "1 - 3 million tonnes";
        }
        else if(datapoint > 3 && datapoint < 5 ) {
            dataset[country]["fillKey"] = "3 - 5 million tonnes";
        }
        else if(datapoint > 5 && datapoint < 10) {
            dataset[country]["fillKey"] = "5 - 10 million tonnes";
        }
        else if(datapoint > 10 && datapoint < 30) {
          dataset[country]["fillKey"] = "10 - 30 million tonnes";
        }
        else {
            dataset[country]["fillKey"] = "> 30 million tonnes";
        }
        datapoint = roundToTwo(dataset[country]['Plastic waste per capita'])
        if(datapoint < 0.1) {
            dataset[country]["fillKeyCapita"] = '< 0.1 kg';
        }
        else if(datapoint >= 0.1 && datapoint < 0.2 ) {
            dataset[country]["fillKeyCapita"] = "0.1 - 0.2 kg";
        }
        else if(datapoint >= 0.2 && datapoint < 0.3 ) {
            dataset[country]["fillKeyCapita"] = "0.2 - 0.3 kg";
        }
        else if(datapoint >= 0.3 && datapoint < 0.4) {
            dataset[country]["fillKeyCapita"] = "0.3 - 0.4 kg";
        } else {
          dataset[country]["fillKeyCapita"] = "> 0.4 kg";
        }
    });

      var map = new Datamap({
        element: document.getElementById('datamap'),
        responsive: true,
        fills: {
            defaultFill: "#d9f2e4",
            "< 1 million tonnes": "#9fdfbc",
            "1 - 3 million tonnes": "#66cc94",
            "3 - 5 million tonnes": "#3cb371",
            "5 - 10 million tonnes": "#339961",
            "10 - 30 million tonnes": "#267349",
            "> 30 million tonnes": "#194d30",
        },
        data: dataset,
        geographyConfig: {
            popupTemplate: function(geo, data) {
              selectValue = d3v5.select('select').property('value');
                if (selectValue === 'Plastic waste whole country') {
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
              } else {
                if(dataset[geo.id] !== undefined) {
                    return ['<div class="hoverinfo"><strong>',
                          geo.properties.name,
                          '</strong>',
                           ': ' + (roundToTwo(data['Plastic waste per capita'])),
                           ' kg per person',
                          '</div>'].join('');
                }
                    return ['<div class="hoverinfo"><strong>',
                          geo.properties.name,
                          '</strong>',
                          ': no data available',
                          '</div>'].join('');

              }
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

                  info.style('display', null);
                  secondLayerDonutChart(set_data);
                  info.select('h2').text(function(data) {
                    return 'Plastic waste of ' + dataset_DC[0]['Land'];
                  })
                  info.select("p").text(function() {
                    return 'In 2010, ' + Math.round(set_data['Percentage'])
                      + '% of the global plastic waste generation was produced by '
                      + set_data['Land'] + '. From this amount of plastic waste '
                      + dataset_DC[0]['%'] + '% was mismanaged. This means that it is '
                      + "nor recycled, nor incinerated. It could have been dumped in "
                      + 'rivers, oceans or non-registred dumpsites.'
                  });
                }
            });
        }
      });

      return map

    }
}

function roundToTwo(num) {
    /**
    Function to round a number to two decimals.
    */
    return +(Math.round(num + "e+2")  + "e-2");
}

function prepareDataDonutInside(data) {
  /**
  Function to prepare the data into a usable format for the donutchart.
  */

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
  /**
  This functions makes the inside layer of the donutchart.
  */

    dataset_DC = prepareDataDonutInside(data);

    var svg_width = document.getElementById('donut').offsetWidth,
        svg_height = 400,
        radius = Math.min(svg_width, svg_height) / 2,
        padding = 40,
        color = d3v5.scaleOrdinal(["#66c2a5","#fc8d62","#8da0cb","#e78ac3",
                          "#a6d854","#ffd92f"]);

    const svg = d3v5.select("#donut")
          .append('svg')
            .attr("id", 'donutchart')
            .attr('width', svg_width)
            .attr('height', svg_height)
          .append("g")
            .attr("transform", "translate(" + svg_width / 2 + "," + svg_height / 2 + ")");

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
      /**
      This function creates the tooltip and the information box for
      the selected data (when a user clicks on a selection).
      */

      var info = d3v5.select('#donutinfo')
            .style('display', 'none');

      info.append('h2');
      info.append('p');
      info.append('legend')

      // Display a circle in the middle with some info when the mouse
      // enters the selection (a pieslice).
      selection.on('mouseenter', function(data) {

        info.style('display', null);

        svg.append('text')
            .attr('class', 'toolCircle')
            .attr('dy', 0)
            .html(toolTipTEXT(data))
            .style('font-size', '.9em')
            .style('text-anchor', 'middle');

        svg.append('circle')
            .attr('class', 'toolCircle')
            .attr('r', (radius * 0.45))
            .style('fill', 'red')
            .style('fill-opacity', 0.35);

      });

      selection.on('mouseout', function() {
            d3v5.selectAll('.toolCircle').remove();
      });

      selection.on('mousedown', function(data) {
            secondLayerDonutChart(data.data);
            info.select('h2').text(function(data) {
              return 'Plastic waste of ' + dataset_DC[0]['Land'];
            })
            info.select("p").text(function() {
              return 'In 2010, ' + Math.round(data.data['Percentage'])
                + '% of the global plastic waste generation was produced by '
                + data.data['Land'] + '. From this amount of plastic waste '
                + dataset_DC[0]['%'] + '% was mismanaged. This means that it is '
                + "nor recycled, nor incinerated. It could have been dumped in "
                + 'rivers, oceans or non-registred dumpsites.'
            });
        });
    }

}

function prepareDataDonutOutside(data) {
  /**
  This function prepares the data into a usable format for the outer circle of
  the piechart. 
  */
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

    var width = document.getElementById('donut').offsetWidth,
        height = 400,
        radius = Math.min(width, height) / 2,
        color = d3v5.scaleOrdinal(['#66c2a5','#fc8d62']);

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
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

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
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
            .attr('class', 'toolCircle')
            .attr('dy', 0)
            .html(toolTipTEXT(data))
            .style('font-size', '.9em')
            .style('text-anchor', 'middle');

        svg.append('circle')
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
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
  /**
  This function creates the string that's being showed inside the tooltip.
  */

    var tip = '',
    i   = 0;

    for (var key in data.data) {
      if (key == 'Land') {
        tip += '<tspan x="0">' + data.data[key] + '</tspan>';
      }
      if (key == 'Percentage') {
        tip += '<tspan x="0" dy="1.2em">' + Math.round(data.data[key]) + '% of global total' + '</tspan>';
      }
      i++;
    }

    return tip;
};

function arcTween(a) {
  /**
  This function returns the arc that's needed to create the piechart.
  */

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

/**
Name: Jikke van den Ende
Student number: 10787593
This file contains the function used for the linechart that shows the
worldwide plastics production.
*/

function oceanChart() {
  /**
  This function creates the last barchart that shows the total mass of plastic
  particles in different oceans.
  */

  d3v5.json('surface-plastic-particles-by-ocean.json').then(function(data) {

    var svg_width = document.getElementById('barchart').offsetWidth,
        svg_height = 400,
        svg_padding = 40;

    var chart_width = svg_width - (2 * svg_padding);
    var chart_height = svg_height - (2 * svg_padding);
    var padding = 5;

    var tooltip = d3v5.select('#oceansinfo').attr('class', 'toolTip');

    var colors = d3v5.scaleOrdinal(d3v5.schemePaired);

    var oceans = [];
    var values = [];
    Object.keys(data).forEach(function(d) {
        oceans.push(d);
        values.push(roundToTwo(data[d]['Plastic Particles'] / 1000000000000));
    });

    var svg = d3v5.select('#barchart')
              .append('svg')
              .attr('id', 'SVG-barchart')
              .attr('width', svg_width)
              .attr('height', svg_height)
              .append('g')
              .attr('transform', 'translate(' + (svg_width / 2 - (chart_width / 2)) + ',' + (svg_height / 2 - (chart_height / 2)) + ')');

    var xScale = d3v5.scaleOrdinal()
                      .domain(oceans)
                      .range([0, chart_width], );

    var xScale = d3v5.scaleBand()
                      .range([0, chart_width])
                      .domain(oceans);

    var yScale = d3v5.scaleLinear()
                      .domain([0, 6])
                      .range([0, chart_height]);

    var yScaleAxis = d3v5.scaleLinear()
                          .domain([0, 6])
                          .range([chart_height, 0]);

    var rectangles = svg.selectAll("rect")
                        .data(values)
                        .enter()
                        .append("rect");

    // Add the bars, sensible for mouse events.
    rectangles.attr("x", function(d, i) { return padding + i * (chart_width / values.length); })
                .attr("y", function(d) { return chart_height - yScale(d); })
                .attr("fill", function(d) { return colors(d) })
                .attr("width", chart_width / values.length - padding)
                .attr("height", function(d) { return yScale(d); })
                .on('mouseover', function(d,i) {
                    d3v5.select(this).attr("fill", "rgb(252,223,89)")
                    tooltip.attr("display", null);
                })
                .on('mouseout', function(d) {
                    tooltip.style("display", "none")
                    d3v5.select(this).attr("fill", function() {
                      return colors(d);
                    });
                })
                .on('mousemove', function(d) {
                  tooltip.style("display", null)
                          .html('Number of particles floating in this ocean: '
                                  + d + ' billion.');

                });
    // Add x-axis
    var x_axis = svg.append("g")
                    .attr("class", "x-axis")
                    .attr("transform", "translate(0, " + chart_height + ")")
                    .call(d3v5.axisBottom(xScale))
                    .selectAll("text")
                    .attr("x", 4)
                    .style("text-anchor", "middle");

    //Add y-axis
    var y_axis = svg.append("g")
                    .attr("class", "y axis")
                    .call(d3v5.axisLeft(yScaleAxis))

    // Add x-axis label
    svg.append("text")
        .attr("class", "x-label")
        .attr("transform","translate(" + chart_width / 2  + "," + (chart_height + 40) + ")")
        .style("text-achor", "middle")
        .text("Oceans");

  });
}

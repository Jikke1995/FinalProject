/**
Name: Jikke van den Ende
Student number: 10787593
This file contains the function used for the linechart that shows the
worldwide plastics production.
*/

function timelineChart() {
  /**
  This main functions contains all the different function that are used for
  creating the linechart. When the window is loaded, the linechart will move
  gradually over the graph.
  */

    var margin = { top: 20, right: 20, bottom: 50, left: 20 },
        width = 350,
        height = 350,
        parseTime = d3v5.timeParse("%Y"),
        getDate = d3v5.bisector(function(d) { return d.time; }).left;
        timeValue = function(d) { return parseTime(d['Year']); },
        dataValue = function (d) { return +d['Plastic Production'] / 1000000; },
        colorLine = '#66cc94';
        colorPointer = "#267349";

    // These pieces of code comes from https://bl.ocks.org/mbostock/5649592.
    // They are used for the transition of the line when the page is loaded.
    function transition(path) {
        path.transition()
            .duration(4000)
            .attrTween("stroke-dasharray", tweenDash);
    }

    function tweenDash() {
        var l = this.getTotalLength(),
            i = d3v5.interpolateString("0," + l, l + "," + l);
        return function (t) { return i(t); };
    }

    function chart(selection) {
      /**
      This function creates the linechart. Most of the function is based
      on what M Bostock did on https://bl.ocks.org/mbostock/5649592.
      */
        selection.each(function (data) {

            data = data.map(function (d, i) {
                return { time: timeValue(d), value: dataValue(d) };
            });

            var xScale = d3v5.scaleTime()
                .rangeRound([0, width - margin.left - margin.right])
                .domain(d3v5.extent(data, function(d) { return d.time; }));

            var yScale = d3v5.scaleLinear()
                .rangeRound([height - margin.top - margin.bottom, 0])
                .domain(d3v5.extent(data, function(d) { return d.value; }));

            var line = d3v5.line()
                .x(function(d) { return xScale(d.time); })
                .y(function(d) { return yScale(d.value); });

            var svg = d3v5.select(this).selectAll("svg").data([data]);
            var gNext = svg.enter().append("svg").append("g");

            gNext.append("path")
                .datum(data)
                .attr("class", "data")
                .attr("fill", "none")
                .attr("stroke", colorLine)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("stroke-width", 4);

            gNext.append("g").attr("class", "axis x")
                .append('text')
                .attr("fill", "#000")
                .attr("transform", "translate(" + margin.left + ",15)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text('Year');

            gNext.append("g").attr("class", "axis y")
                .append("text")
                .attr("fill", "#000")
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text("million tonnes");

            gNext.append("path")
                .attr("class", "data");

            var svg = selection.select("svg");
            svg.attr('width', width).attr('height', height);

            var g = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // create x-axis
            g.select("g.axis.x")
                .attr("transform", "translate(0," + (height - margin.bottom) + ")")
                .call(d3v5.axisBottom(xScale).ticks(10))
                .select(".domain")
                .remove();

            // create y-axis
            g.select("g.axis.y")
                .attr("class", "axis y")
                .call(d3v5.axisLeft(yScale));

            // create line and use transition
            g.select("path.data")
                .datum(data)
                .attr("d", line)
                .call(transition);

            // Creating the circle on the line when hovering the path.
            var pointer = g.append('g')
                  .attr('class', 'focus')
                  .style('display', 'none');

            pointer.append("circle")
                  .attr("r", 5)
                  .attr('fill', colorPointer);

            // Creating the information box when hovering the path.
            var info = d3v5.select('#line-info')
                  .style('display', 'none');

            info.append("text")
                  .attr("x", 10)
                  .attr('font-size', '10px')
                  .attr("dy", ".31em");

            // Create invisible rect over the whole path which picks up
            // mousemovements all over the path (not just on the line).
            svg.append("rect")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .attr("class", "overlay")
                .attr("width", width)
                .attr("height", height)
                .on("mouseover", function() {
                  pointer.style("display", null);
                  info.style('display', null);
                })
                .on("mouseout", function() {
                  pointer.style("display", "none");
                  info.style('display', 'none');
                })
                .on("mousemove", mousemove);

            function mousemove() {
              /**
              This function calculates the correct x and y coordinates of the
              pointer circle on the line while hovering, and adds the
              data information to the information box next to the graph.
              */
                var x0 = xScale.invert(d3v5.mouse(this)[0]),
                    i = getDate(data, x0, 1),
                    d0 = data[i - 1],
                    d1 = data[i];
                if (d1 != undefined) {
                  var  d = x0 - d0.time > d1.time - x0 ? d1 : d0;
                  pointer.attr("transform", "translate(" + xScale(d.time) + "," + yScale(d.value) + ")");
                  info.select("text").text(function() {
                          return  'More or less ' + d.value +
                          ' million tonnes of plastic was globally ' +
                          'produced in the year ' + d.time.getFullYear() +
                          '.';
                  });
                }
            }

        });
    }

    // Piece of code from https://bl.ocks.org/mbostock/5649592.
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

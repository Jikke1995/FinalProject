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
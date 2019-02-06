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

      makeBarchart();

  var requests = [d3v5.json('plastic-waste-generation-total.json'), d3v5.json('inadequately-managed-plastic.json'), d3v5.json('mismanaged-waste-global-total.json'), d3v5.json('plastic-waste-per-capita.json')];

  Promise.all(requests).then(function(response) {
      dataset = combineData(response[0], response[1], response[2], response[3]);
      createMap(dataset);
      donutChart(dataset);
      createBarchart();

  }).catch(function(e){
       throw(e);
  });
};

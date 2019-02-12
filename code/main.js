/**
Name: Jikke van den Ende
Student number: 10787593
This is the main file that only has the function for when the window
*/

window.onload = function() {
  /**
  This function is the main for when the page is loaded. It calls all the functions
  from other scripts to make it more clear where every visualisation part comes from.
  */

    // This part is for making the linechart.
    var lines = timelineChart();

    function resize() {
      /**
      This function makes sure the linechart resizes together with the window.
      */
        if (d3v5.select("#linechart svg").empty()) {
              return;
        }
        lines.width(+d3v5.select("#linechart").style("width").replace(/(px)/g, ""))
            .height(+d3v5.select("#linechart").style("height").replace(/(px)/g, ""));
        d3v5.select("#linechart").call(lines);
    }

    // Creating the linegraph. 
    d3v5.json("global-plastic-production.json").then(function(data) {
        d3v5.select("#linechart").datum(data).call(lines);
          d3v5.select(window).on('resize', resize);
          resize();
      });

    // Making the barchart about the USA.
    makeBarchart();

    // This part below is for making the datamap, the donutchart and the last barchart.
    var requests = [d3v5.json('plastic-waste-generation-total.json'), d3v5.json('inadequately-managed-plastic.json'), d3v5.json('mismanaged-waste-global-total.json'), d3v5.json('plastic-waste-per-capita.json')];

    Promise.all(requests).then(function(response) {
        dataset = combineData(response[0], response[1], response[2], response[3]);
        createMap(dataset);
        donutChart(dataset);

    }).catch(function(e){
         throw(e);
    });

    // Making the barchart about the oceans.
    oceanChart();

};

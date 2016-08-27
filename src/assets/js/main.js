/* globals XMLHttpRequest, d3 */

(function() {
  var dataURL = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';

  var getData = function(url, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        var data = JSON.parse(request.responseText);
        callback(data);
      } else {
        // We reached our target server, but it returned an error
        console.log('The Server Returned an Error');
      }
    };
    request.onerror = function() {
      // There was a connection error of some sort
      console.log('There was a connection error');
    };
    request.send();
  };

  var handleData = function(data) {
    var margin = {top: 100, right: 100, bottom: 50, left: 100},
      width = 850 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;

    var nodes = data.nodes;
    var links = data.links;
    var chart = d3.select('.chart');

    var svg = chart.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    var tooltip = d3.select('.chart')
                .append('div')
                .attr('class', 'tooltip')
                .style('opacity', 0);

    var force = d3.layout.force()
    .charge(-50)
    .linkDistance(30)
    .size([width, height])
    .nodes(nodes)
    .links(links);

    var link = svg.append("g")
        .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke-width", 1);


    var node = chart.select('.flagWrapper').selectAll('.node')
      .data(nodes)
      .enter().append('img')
      .attr('class', function(d) { return 'flag flag-' + d.code; })
      .attr('height', 11)
      .attr('width', 16)
      .call(force.drag)
      .on('mouseover', function(d) {
           tooltip.transition()
                  .duration(100)
                  .style('opacity', 0.9);
           tooltip.html(
             '<strong>' + d.country + '</strong>'
            )
            .style('left', (d3.event.pageX - 375) + 'px')
            .style('top', (d3.event.pageY - 30) + 'px');
        })
        .on('mouseout', function() {
          tooltip.transition()
                 .duration(200)
                 .style('opacity', 0);
        });

    force.on('tick', function() {
      node
      .style('left', function(d) { return (d.x + 8) + 'px'; })
      .style('top', function(d) { return (d.y + 10) + 'px'; });
      link
      .attr('x1', function(d) { return d.source.x; })
      .attr('y1', function(d) { return d.source.y; })
      .attr('x2', function(d) { return d.target.x; })
      .attr('y2', function(d) { return d.target.y; });
    });
    force.start();
  };

  // setup
  getData(dataURL, handleData);
})();

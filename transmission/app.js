function performHighlight() {
  var highlights = d3.selectAll('circle.signal-circle');

  highlights.each(function (d,i) {
    d3.select(this)
      .interrupt()
      .transition()
      .duration(500)
      .style('fill', '#FF0000')
      .style('stroke', '#0000FF')
      .style('stroke-width', 4)
      .transition()
      .duration(500)
      .style('stroke', '#000000')
      .style('stroke-width', 0)
      .style('fill', d.color)
      ;
  });
}

var transmission = mkTransmission(3);
var signals = mkRandSignals(transmission);

var svg = d3.select('#transmission')
  .append('svg')
    .attr('width', transmission.width)
    .attr('height', transmission.height);
d3.select('body').on('keydown', function () {
  performHighlight();
});
var defs = svg.append('defs');

defs.append('filter')
      .attr('id', 'blur')
    .append('feGaussianBlur')
      .attr('stdDeviation', 1);

var g = svg.selectAll('g.signal')
  .data(signals)
  .enter().append('g')
          .classed('signal', true);

g.insert('circle')
  .classed('signal-circle', true)
  .style('fill', function (sig) { return sig.color; })
  .attr('r', function (sig) { return sig.r; })
  .attr('cx', function (sig) { return sig.cx; })
  .attr('cy', function (sig) { return sig.cy; })
  .attr('filter', 'url(#blur)')
  ;

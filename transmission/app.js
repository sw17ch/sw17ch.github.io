Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

function randColor() {
  var c = Math.round(0xFFFFFF * Math.random()).toString(16);
  var missing = 6 - c.length;
  
  return ("#" + Array(missing + 1).join("0") + c);
}

function randGrey() {
  var c = Math.round(0xFF * Math.random()).toString(16);
  var missing = 2 - c.length;
  console.log(missing);
  var single = Array(missing + 1).join("0") + c;

  return ("#" + Array(4).join(single));
}

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

function mkTransmission() {
  var width = $(window).width(),
      height = $(window).height(),
      maxRadius = 100,
      drawMargin = maxRadius + 5,
      rootId = 'transmission',
      signalCount = 5
  ;

  return {
    rootId: rootId,
    signalCount: signalCount,
    width: width,
    height: height,
    maxRadius: maxRadius,
    derived: {
      minX: drawMargin,
      maxX: width - drawMargin,
      minY: drawMargin,
      maxY: height - drawMargin,
    }
  }
}

function mkSignals(t) {
  return d3.range(transmission.signalCount).map(function (e) {
    var x = (Math.random() * t.width).clamp(
            t.derived.minX,
            t.derived.maxX);
    var y = (Math.random() * t.height).clamp(
            t.derived.minY,
            t.derived.maxY);
    var strength = Math.random() * t.maxRadius;

    return {
      color: randGrey(),
      cx: x,
      cy: y,
      r: strength,
    }
  }).sort(function (a,b) { return (b.cx - a.cx); });
}

var transmission = mkTransmission();
var signals = mkSignals(transmission);

var svg = d3.select('#transmission')
  .append('svg')
    .attr('width', transmission.width)
    .attr('height', transmission.height)
  .on('click', function () {
    performHighlight();
  });
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

console.log(g);

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
  var single = Array(missing + 1).join("0") + c;

  return ("#" + Array(4).join(single));
}

function mkTransmission(count) {
  var width = $(window).width(),
      height = $(window).height(),
      maxRadius = 100,
      drawMargin = maxRadius + 5,
      rootId = 'transmission',
      signalCount = count
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

function mkRandSignals(t) {
  return mkSignals(t,
      function (tr, e) {
        var x = (Math.random() * t.width).clamp(
          t.derived.minX,
          t.derived.maxX);
        var y = (Math.random() * t.height).clamp(
          t.derived.minY,
          t.derived.maxY);
        return {x: x, y: y};
      },
      function (tr, e) {
        return Math.random() * t.maxRadius;
      }
  );
}

function mkSignals(t, posFn, strengthFn, colorFn) {
  return d3.range(t.signalCount).map(function (e) {
    var pos = posFn(t, e);
    var strength = strengthFn(t, e);

    return {
      color: colorFn(t, e),
      cx: pos.x,
      cy: pos.y,
      r: strength,
    }
  }).sort(function (a,b) { return (b.r - a.r); });
}

function pulseSignals(sigs) {
  var d = svg.selectAll('g.signal').data(sigs);
  d.each(function (d, i) {
    d3.select(this).selectAll('.signal-circle')
      // fade off
      .transition()
      .duration(500)
      .attr('opacity', 0)
      // wait
      .delay(1000 * Math.random())
      .transition()
      .duration(500)
      .attr('opacity', 1)
      ;
  });
}

function drawSignals(sigs) {
  var d = svg.selectAll('g.signal').data(sigs);
  d.each(function (d, i) {
    var dur = 300;
    d3.select(this).selectAll('.signal-circle')
      .transition()
      .duration(dur)
      .attr('r', d.r + 30)
      .transition()
      .duration(dur)
      .attr('r', d.r);
  });
  g = d.enter()
    .append('g')
    .classed('signal', true);

  g.insert('circle')
    .classed('signal-circle', true)
    .style('fill', function (sig) { return sig.color; })
    .attr('opacity', 1)
    .attr('r', function (sig) { return sig.r; })
    .attr('cx', function (sig) { return sig.cx; })
    .attr('cy', function (sig) { return sig.cy; })
    .attr('filter', 'url(#blur)')
    ;
}

// Stuff that always needs to be here.
var svg = d3.select('#transmission')
  .append('svg')
    .attr('width', transmission.width)
    .attr('height', transmission.height);
var defs = svg.append('defs');

defs.append('filter')
      .attr('id', 'blur')
    .append('feGaussianBlur')
      .attr('stdDeviation', 1);

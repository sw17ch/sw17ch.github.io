var StopPulse = false;

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

function mkSignals(t, posFn, strengthFn, colorFn, opacityFn) {
  return d3.range(t.signalCount).map(function (e) {
    var p = posFn ? posFn(t, e) : {x: 0, y: 0};
    var s = strengthFn ? strengthFn(t, e) : 50;
    var c = colorFn ? colorFn(t, e) : "#FFF";
    var o = opacityFn ? opacityFn(t, e) : 1;

    return {
      color: c,
      opacity: o,
      cx: p.x,
      cy: p.y,
      r: s,
    }
  }).sort(function (a,b) { return (b.r - a.r); });
}

function pulseSignal(sig, dat, ix) {
  d3.select(sig)
    // fade
    .interrupt()
    .transition()
    .duration(200)
    .attr('opacity', 1)
    // wait
    .transition()
    .duration(500 * Math.random())
    // fade
    .transition()
    .duration(200)
    .attr('opacity', 0)
    // wait
    .transition()
    .duration(500 * Math.random())
    .each("end", function () {
      if (false == StopPulse) {
        // Keep going
        pulseSignal(sig, dat, ix);
      } else {
        // Stop the pulsing, setup to go again.
        StopPulse = false;
      }
    })
    ;
}

function pulseSignals(sigs) {
  var d = svg.selectAll('.signal-circle').data(sigs);
  d.each(function (d, i) {
    pulseSignal(this, d, i);
  });
}

function drawSignals(sigs) {
  var d = svg.selectAll('g.signal').data(sigs);
  d.each(function (d, i) {
    var dur = 300;
    d3.select(this).selectAll('.signal-circle')
      // bump existing signals
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
    .attr('opacity', function (sig) { return sig.opacity; })
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

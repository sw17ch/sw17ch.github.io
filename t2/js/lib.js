function Color() { }

Color.rand = function () {
  var c = Math.round(0xFFFFFF * Math.random()).toString(16);
  var missing = 6 - c.length;
  
  return ("#" + Array(missing + 1).join("0") + c);
}

Color.randGrey = function () {
  var c = Math.round(0xFF * Math.random()).toString(16);
  var missing = 2 - c.length;
  var single = Array(missing + 1).join("0") + c;

  return ("#" + Array(4).join(single));
}

function Transmission(signal_count, radius, root) {
  self = this;
  self.root = d3.select('#transmission');

  self.width = $(window).width();
  self.height = $(window).height();
  self.radius = radius || 50;

  self.signals = d3.range(signal_count || 1).map(function (i) {
    return new Signal({
      index: i,
      radius: self.radius,
      color: "#CCC",
      opacity: 0,
    });
  });

  self.svg = self.root
    .append('svg')
      .attr('width', self.width)
      .attr('height', self.height);
  self.svg
    .append('defs')
      .append('filter')
        .attr('id', 'blur')
        .append('feGaussianBlur')
          .attr('stdDeviation', 1);

  // Layout the signals horizontally and vertically.
  self.layout = Transmission.defaultLayout;
  self.layoutX = function (sig) {
    return self.layout(self, sig).x;
  };
  self.layoutY = function (sig) {
    return self.height / 2;
  };


  self.draw = function (andThen) {
    var circles = self.svg.selectAll('g.signal')
      .data(self.signals)
      .enter()
        .append('g')
          .classed('signal', true)
          .append('circle')
            .classed('signal-circle', true)
            .style('fill', function (sig) { return sig.cfg.color; })
            .attr('opacity', function (sig) { return sig.cfg.opacity; })
            .attr('r', function (sig) { return sig.cfg.radius; })
            .attr('cx', self.layoutX)
            .attr('cy', self.layoutY)
            .attr('filter', 'url(#blur)')
            ;
    if(andThen) {
      andThen(circles);
    }
  };

  self.select = function (andThen) {
    andThen(
        self.svg
          .selectAll('.signal-circle')
          .data(self.signals)
        );
  };
}

Transmission.defaultLayout = function (t, sig) {
  var count = t.signals.length;
  var pad = t.radius * 2;
  var ix = sig.cfg.index;

  var drawWidth = (pad * (count - 1)) + (t.radius * 2 * count);
  var margin = (t.width - drawWidth) / 2;
  var offset = (pad * ix) + (count == 1 ? t.radius : (t.radius * 2 * ix)) + (count == 1 ? 0 : pad / 2);

  var x = margin + offset;

  return {x: x, y: t.height / 2};
};

function Signal(cfg) {
  this.cfg = cfg;
}

Signal.defaultSignal = new Signal({
  index: undefined,
  radius: 0,
  color: "#000",
  opacity: 0
});

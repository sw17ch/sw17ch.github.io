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

function Transmission(signal_count, radius) {
  var self = this;
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
  self.signalSvg  = self.svg.append('g').classed('signals', true);
  self.historySvg = self.svg.append('g').classed('history', true);

  // Layout the signals horizontally and vertically.
  // self.layout = Transmission.defaultLayout;
  self.layout = Transmission.verticalLayout;
  self.layoutX = function (sig) {
    return self.layout(self, sig).x;
  };
  self.layoutY = function (sig) {
    return self.layout(self, sig).y;
  };

  self.update = function (updateFn) {
    updateFn(self.signals);
    self.addHistory(self.signals.map(function (s) {
      return s.cfg.opacity;
    }));
  };


  self.history = [];
  self.historyIx = 0;
  self.addHistory = function (e) {
    var el = function () {
      return {
        ev: e,
        ix: (self.historyIx += 1),
      };
    }
    if (self.history.length > 0) {
      var l = self.history.slice(-1)[0];
  
      _.map(_.zip(e,l.ev), function (a) {
        return a[0] === a[1];
      });
  
      var identical = _.reduce(_.zip(e,l.ev), function (memo, a) {
        return memo && (a[0] === a[1]);
      }, true);
  
      if (!identical) {
        self.history.push(el());
      }
    } else {
      self.history.push(el());
    }

    var maxHist = 10;
    if (self.history.length > maxHist) {
      self.history = _.last(self.history, maxHist);
    }

    return self.history;
  };

  self.drawHistory = function () {
    var hist = self.historySvg.selectAll('.hist')
      .data(self.history, function (o) {
        return o.ix;
      })

    hist.exit()
      .transition()
      .duration(500)
      .attr('opacity', 0)
      .remove();
    hist.transition()
      .duration(500)
      .call(self.paintHistory)
      ;
    hist
      .enter()
        .append('ellipse')
          .classed('hist',true)
          .attr('opacity', 0)
          .call(self.paintHistory, '#0c0')
          ;
  };

  self.paintHistory = function (obj, initColor) {
    // iniOpac = initOpac ? initOpac : 1;
    initColor = initColor ? initColor : '#f00';
    obj
      .style('fill', initColor)
      .attr('rx', function (d) { return 15 + (15 * d.ev[0]); })
      .attr('ry', function (d) { return 15 + (15 * d.ev[1]); })
      .attr('cx',
          function (d, i) {
            var order = self.historyIx - d.ix;
            var offset = 65 + (order * 65);
            var buffer = self.width / 2;

            return buffer + offset;
          })
      .attr('cy', self.height / 2)
      .attr('filter', 'url(#blur)')
      .transition().duration(1000)
        .attr('opacity', 1)
      ;
  };

  self.draw = function (andThen) {
    var circles = self.signalSvg.selectAll('g.signal')
      .data(self.signals)
        .enter()
          .append('g')
            .classed('signal', true)
            .append('circle')
              .classed('signal-circle', true)
              .call(self.paint);
    if(andThen) {
      andThen(circles);
    }
  };

  self.paint = function (obj) {
    obj
      .style('fill', function (sig) { return sig.cfg.color; })
      .attr('opacity', function (sig) { return sig.cfg.opacity; })
      .attr('r', function (sig) { return sig.cfg.radius; })
      .attr('cx', self.layoutX)
      .attr('cy', self.layoutY)
      .attr('filter', 'url(#blur)')
      ;
  }

  self.erase = function () {
    self.svg.selectAll('g.signal').remove();
  }

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

Transmission.verticalLayout = function (t, sig) {
  var count = t.signals.length;
  var pad = t.radius * 2;
  var ix = sig.cfg.index;

  var drawHeight = (pad * (count - 1)) + (t.radius * 2 * count);
  var margin = (t.height - drawHeight) / 2;
  var offset = (pad * ix) + (count == 1 ? t.radius : (t.radius * 2 * ix)) + (count == 1 ? 0 : pad / 2);

  var y = margin + offset;

  return { x: t.width / 2, y: y };
};

function Signal(cfg) {
  this.cfg = cfg;
}

// This should always be on.
KeyboardJS.on('0 1 2 3 4 5 6 7 8 9', function (k) {
  var c = String.fromCharCode(k.keyCode);

  var url = "index.html";

  if (0 < c) {
    url = ("s" + c + ".html");
  }

  window.location.href = url;
});

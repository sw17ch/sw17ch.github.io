var __t = new Transmission(2, 20);

function updateToRandom() {
  __t.update(function (sigs) {
    var same = true;

    var oldOps = [];
    var newOps = [];

    while(same) {
      oldOps = sigs.map(function (s) { return s.cfg.opacity; });
      newOps = sigs.map(function (s) { return (Math.random() > 0.5 ? 1 : 0); });

      _.range(oldOps.length).map(function (i) {
        if (oldOps[i] !== newOps[i]) {
          same = false;
        }
      });
    }

    var newSigs = _.each(sigs, function (s,i) {
      s.cfg.opacity = newOps[i];
    });
  });
}

function pulse(circles) {
  circles.transition().duration(750)
    .call(updateToRandom)
    .call(__t.paint)
    .transition().duration(750)
      .each('end', function (e) {
        if (e.cfg.index == 0) {
          pulse(circles);
          __t.drawHistory();
        }
      });
}

KeyboardJS.on('a', function () {
  __t.draw();
  __t.select(function (circles) {
    pulse(circles);
  });
});

KeyboardJS.on('h', function () {
  __t.drawHistory();
});

var __t = new Transmission(2, 20);

function updateToRandom() {
  __t.update(function (sigs) {
    return sigs.map(function (s) {
      s.cfg.opacity = (Math.random() > 0.5 ? 1 : 0);
      return s;
    });
  });
}

function pulse(circles) {
  circles.transition().duration(50)
    .call(updateToRandom)
    .call(__t.paint)
    .transition().duration(100)
      .each('end', function () { pulse(circles); });
}

KeyboardJS.on('a', function () {
  __t.draw();
  __t.select(function (circles) {
    pulse(circles);
  });
});

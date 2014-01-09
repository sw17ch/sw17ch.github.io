var __t = new Transmission(2, 20);

function updateToOpaque() {
  __t.update(function (sigs) {
    return sigs.map(function (s) {
      s.cfg.opacity = 1;
      return s;
    });
  });
}

function updateToTransparent() {
  __t.update(function (sigs) {
    return sigs.map(function (s) {
      s.cfg.opacity = 0;
      return s;
    });
  });
}

function pulse(circles) {
  circles.each(function (d,i) {
    var circle = d3.select(this);
    circle.transition().duration(500 * Math.random())
      .transition().duration(50)
        .call(updateToOpaque)
        .call(__t.paint)
        .transition().duration(20)
          .transition().duration(50)
            .call(updateToTransparent)
            .call(__t.paint)
            .each('end', function () { pulse(circle); })
            ;
  });
}

KeyboardJS.on('a', function () {
  __t.draw();
  __t.select(function (circles) {
    pulse(circles);
  });
});

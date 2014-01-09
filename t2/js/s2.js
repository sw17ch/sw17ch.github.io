var __t = new Transmission(1);
__t.draw();

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
  circles.transition().duration(1500)
    .call(updateToOpaque)
    .call(__t.paint)
    .transition().duration(200)
      .transition().duration(1500)
        .call(updateToTransparent)
        .call(__t.paint)
          .transition().duration(3000)
          .each('end', function () { pulse(circles); })
          ;
}


KeyboardJS.on('a', function () {
  __t.select(function (circles) {
    pulse(circles);
  });
});

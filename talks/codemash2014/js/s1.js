var __t = new Transmission(1);

KeyboardJS.on('a', function () {
  __t.draw();
  __t.update(function (sigs) {
    return sigs.map(function (s) {
      s.cfg.opacity = 1;
      return s;
    });
  });
  __t.select(function (circles) {
    circles.transition()
      .duration(1500)
      .call(__t.paint)
      ;
  });
});

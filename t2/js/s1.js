var __t = new Transmission(1);
__t.draw();

KeyboardJS.on('a', function () {
  __t.select(function (circles) {
    circles.transition()
      .duration(1500)
      .attr('opacity', 1)
      ;
  });
});

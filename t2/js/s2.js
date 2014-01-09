function pulse(circles) {
  circles.transition()
    .duration(1500)
    .attr('opacity', 1)
    .transition()
      .duration(200)
      .transition()
        .duration(1500)
        .attr('opacity', 0)
          .transition()
          .duration(3000)
          .each('end', function () { pulse(circles); })
          ;
}

var __t = new Transmission(1);
__t.draw();

KeyboardJS.on('a', function () {
  __t.select(function (circles) {
    pulse(circles);
  });
});

function pulse(circles) {
  circles.each(function (d,i) {
    var circle = d3.select(this);
    circle.transition()
      .duration(5000 * Math.random())
      .transition()
        .duration(500)
        .attr('opacity', 1)
        .transition()
          .duration(200)
          .transition()
            .duration(500)
            .attr('opacity', 0)
            .each('end', function () { pulse(circle); })
            ;
  });
}

var __t = new Transmission(2);
__t.draw();

KeyboardJS.on('a', function () {
  __t.select(function (circles) {
    pulse(circles);
  });
});

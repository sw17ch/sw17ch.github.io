function pulse(circles) {
  circles.each(function (d,i) {
    var circle = d3.select(this);
    circle.transition()
      .duration(500 * Math.random())
      .transition()
        .duration(50)
        .attr('opacity', 1)
        .transition()
          .duration(20)
          .transition()
            .duration(50)
            .attr('opacity', 0)
            .each('end', function () { pulse(circle); })
            ;
  });
}

var __t = new Transmission(2, 20);

KeyboardJS.on('a', function () {
  __t.draw();
  __t.select(function (circles) {
    pulse(circles);
  });
});

KeyboardJS.on('e', function () {
  __t.erase();
});

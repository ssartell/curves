var hilbert = require('./hilbert');
var d3 = require('d3');
var R = require('ramda');

var i = 1;
var timer = d3.interval(() => {
    var lines = hilbertLines(i++);
    update(lines);
    if (i === 7) timer.stop();
}, 1000);

function hilbertLines(i) {
    var n = Math.pow(2, i);
    var count = n * n;

    var points = R.range(0, count).map(x => hilbert.d2xy(n, x));

    var normalize = d3.scaleLinear()
        .domain(d3.extent(R.flatten(points)))
        .range([0, 1]);

    points = points.map(x => x.map(normalize));

    var toLines = R.converge(R.zip, [R.init, R.tail]);
    return toLines(points);
}

function update(lines) {
    var svg = d3.select('svg');
    var width = +svg.attr('width');
    var height = +svg.attr('height');
    var strokeWidth = 5;
    var margin = strokeWidth / 2;

    var scale = d3.scaleLinear()
        .domain([0, 1])
        .range([margin, width - margin]);

    var line = d3.line()
        .x(d => scale(d[0]))
        .y(d => scale(d[1]));

    var rainbow = d3.scaleSequential()
        .domain([0, lines.length])
        .interpolator(d3.interpolateRainbow);

    var path = svg
        .selectAll('path')
        .data(lines)
        .attr('d', d => line(d))
        .attr('fill', 'transparent')
        .attr('stroke', (d, i) => rainbow(i))
        .attr('stroke-width', strokeWidth)
        .attr('stroke-linecap', 'square');

    path.enter().append('path')
        .attr('d', d => line(d))
        .attr('fill', 'transparent')
        .attr('stroke', (d, i) => rainbow(i))
        .attr('stroke-width', strokeWidth)
        .attr('stroke-linecap', 'square');

    path.exit().remove();
}

function interpolate(p1, p2, n) {
    if (n <= 0) return [p1, p2];

    var points = [];
    for(var i = 0; i < n; i++) {
        var di = i / (n - 1);
        points.push([
            p1[0] * (1 - di) + p2[0] * di,
            p1[1] * (1 - di) + p2[1] * di,
        ])
    }

    return points;
}
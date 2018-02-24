var hilbert = require('./hilbert');
var zOrder = require('./zOrder');
var d3 = require('d3');
var R = require('ramda');

var min = 1;
var max = 6;
var i = 0;
var timer = d3.interval(() => {
    var depth = triangleWave(i, [min, max]);
    var n = Math.pow(2, depth);
    update(applyCurve(hilbert.d2xy(n), depth, max));
    //update(applyCurve(zOrder.d2xy, depth, max));
    i++;
}, 1000);

function applyCurve(d2xy, i, maxI) {
    // create points
    var n = Math.pow(2, i + i);
    var points = R.range(0, n).map(d2xy);
    
    // add hidden points
    var maxN = Math.pow(2, maxI + maxI);
    points = R.chain(x => R.repeat(x, maxN / n), points);

    return pointsToLines(points);
}

function update(lines) {
    var svg = d3.select('svg');
    var width = +svg.attr('width');
    var height = +svg.attr('height');
    var strokeWidth = 8;
    var margin = strokeWidth / 2;

    var scale = d3.scaleLinear()
        .domain(d3.extent(R.flatten(lines)))
        .range([margin, width - margin]);

    var line = d3.line()
        .x(d => scale(d[0]))
        .y(d => scale(d[1]));

    var rainbow = d3.scaleSequential()
        .domain([0, lines.length])
        .interpolator(d3.interpolateRainbow);

    var path = svg
        .selectAll('path')
        .data(lines);

    path.exit().remove();

    var allPaths = path.enter()
        .append('path')
        .attr('d', d => line(d))
        .merge(path);

    allPaths.attr('stroke', (d, i) => rainbow(i))
        .attr('fill', 'transparent')
        .attr('stroke-width', strokeWidth)
        .attr('stroke-linecap', 'square')
        .transition()
            .duration(500)
            .attr('d', d => line(d));
}

var pointsToLines = R.converge(R.zip, [R.init, R.tail]);

function triangleWave(i, extent) {
    var min = extent[0];
    var max = extent[1];
    var range = max - min;
    return min + Math.abs((i + range) % (range * 2) - range);
}
var hilbert = require('./hilbert');
var zOrder = require('./zOrder');
var d3 = require('d3');
var R = require('ramda');

var i = 0;
var min = 1;
var max = 6;
var useHilbert = true;
var timer = d3.interval(() => {
    var depth = saw(i, [min, max]);
    var n = Math.pow(2, depth);
    if (useHilbert) {
        update(applyCurve(hilbert.d2xy(n), depth, max));
        useHilbert = false;
    } else {
        update(applyCurve(zOrder.d2xy, depth, max));
        useHilbert = true;
        i++;
    }
    // update(applyCurve(zOrder.d2xy, depth, max));
    // i++;
}, 1000);

function applyCurve(d2xy, i, max) {
    // create points
    var n = Math.pow(2, i);
    var count = n * n;
    var points = R.range(0, count).map(d2xy);

    // normalize them
    var normalize = d3.scaleLinear()
        .domain(d3.extent(R.flatten(points)))
        .range([0, 1]);
    points = points.map(x => x.map(normalize));
    
    // add hidden points
    var maxN = Math.pow(2, max);
    var maxCount = maxN * maxN;
    points = R.chain(x => R.repeat(x, maxCount / count), points);

    return pointsToLines(points);
}

function update(lines) {
    var svg = d3.select('svg');
    var width = +svg.attr('width');
    var height = +svg.attr('height');
    var strokeWidth = 8;
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
            .duration(1000)
            .attr('d', d => line(d));
}

var pointsToLines = R.converge(R.zip, [R.init, R.tail]);

function saw(i, extent) {
    var min = extent[0];
    var max = extent[1];
    var range = max - min;
    return Math.abs(range - ((i + range) % (range * 2))) + min;
}
var hilbert = require('./hilbert');
var d3 = require('d3');
var R = require('ramda');

var n = Math.pow(2, 5);

var width = 500;
var height = 500;
var margin = 10;
var strokeWidth = 10;

var points = R.range(0, n * n).map(x => hilbert.d2xy(n, x));
var lines = R.zip(R.init(points), R.tail(points));

var scale = d3.scaleLinear()
    .domain([0, n - 1])
    .range([margin, width - margin]);

var color = d3.scaleSequential()
    .domain([0, n * n])
    .interpolator(d3.interpolateRainbow);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = svg
    .selectAll('path')
    .data(lines);

var line = d3.line()
    .x(d => scale(d[0]))
    .y(d => scale(d[1]));

path.enter().append('path')
    .attr('d', d => line(d))
    .attr('fill', 'transparent')
    .attr('stroke', (d, i) => color(i))
    .attr('stroke-width', strokeWidth)
    .attr('stroke-linecap', 'square');

path.exit().remove();
var d3 = require('d3');
var R = require('ramda');
var day14 = require('./day14/part3');

var input = 'amgozmfv';
var blocks = day14.getBlocks(input);

var grid = blocks.map((col, x) => col.map((val, y) => ({ x, y, val })));

var n = 128;
var m = 128;

var element = document.getElementsByTagName("svg")[0];
var svg = d3.select('svg');
var width = +element.clientWidth;
var height = +element.clientHeight;

var scale = d3.scaleLinear()
    .domain([0, n])
    .range([0, width]);

var rainbowColors = d3.scaleSequential()
    .domain([2, 1087])
    .interpolator(d3.interpolateRainbow);

var randomScale = d3.scaleOrdinal()
    .domain([2, 1087])
    .range(d3.shuffle(R.range(2, 1088)));

var randomColors = R.pipe(randomScale, rainbowColors);

var blackAndWhite = d3.scaleLinear()
    .domain([0, 1])
    .range(["black", "white"]);

var stop = false;
var currentColors = rainbowColors;
init(grid);

function updateCell(x, y, i) {
    svg.select(`g:nth-child(${x + 1})`).select(`rect:nth-child(${y + 1})`)
        .attr('fill', currentColors(i));
    if (stop) {
        stop = false;
        return true;
    }
    return false;
}

function init(grid) {
    var groups = svg
        .selectAll('g')
        .data(grid)
        .enter().append('g');

    var rect = groups.selectAll('rect')
        .data(d => d);

    rect.enter().append('rect')
        .attr('fill', (d, i) => blackAndWhite(d.val))
        .attr('x', d => scale(d.x))
        .attr('y', d => scale(d.y))
        .attr('width', d => 5)
        .attr('height', d => 5)
        .attr('height', d => 5);
};


document.getElementById('reset').onclick = function () {
    svg.selectAll('g').remove();
    init(grid);
};

document.getElementById('stop').onclick = function () {
    stop = true;
};

document.getElementsByName("color").forEach(x => x.onchange = function (e) {
    switch (e.target.value) {
        case "rainbow":
            currentColors = rainbowColors;
            break;
        case "random":
            currentColors = randomColors;
            break;
    }
});

document.getElementById('last').onclick = function () {
    day14.getUpdates(blocks, day14.last, updateCell);
};

document.getElementById('first').onclick = function () {
    day14.getUpdates(blocks, day14.first, updateCell);
};

document.getElementById('top').onclick = function () {
    day14.getUpdates(blocks, day14.top, updateCell);
};

document.getElementById('circle').onclick = function () {
    day14.getUpdates(blocks, day14.circle, updateCell);
};

document.getElementById('diamond').onclick = function () {
    day14.getUpdates(blocks, day14.diamond, updateCell);
};

document.getElementById('weird').onclick = function () {
    day14.getUpdates(blocks, day14.weird, updateCell);
};
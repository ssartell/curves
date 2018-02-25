var d3 = require('d3');
var R = require('ramda');
var day14 = require('./day14/part3');

var input = 'amgozmfv';
var grid = day14.getGrid(input);

var cells = grid.map((col, x) => col.map((val, y) => ({ x, y, val })));

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

function init(cells) {
    var groups = svg
        .selectAll('g')
        .data(cells)
        .enter().append('g');

    var rect = groups.selectAll('rect')
        .data(d => d);

    rect.enter().append('rect')
        .attr('fill', (d, i) => d.x === start.x && d.y === start.y ? "red" : blackAndWhite(d.val))
        .attr('x', d => `${d.x / n * 100}%`)
        .attr('y', d => `${d.y / n * 100}%`)
        .attr('width', d => `${1 / n * 100}%`)
        .attr('height', d => `${1 / m * 100}%`)
        .on('click', d => {
            getCell(start.x, start.y).attr('fill', null);
            start = d
            getCell(start.x, start.y).attr('fill', 'red');
        });
}

function getCell(x, y) {
    return svg.select(`g:nth-child(${x + 1})`).select(`rect:nth-child(${y + 1})`);
}

// state ************************************************************
var strategy = day14.stratgies.top;
var currentColors = rainbowColors;
var start = { x: 0, y: 0 };

init(cells);

// handlers *********************************************************
var startButton = document.getElementById('start');
var stopButton = document.getElementById('stop');
var resetButton = document.getElementById('reset');

day14.onDraw(function (x, y, i) {
    getCell(x, y).attr('fill', currentColors(i));
});

day14.onStop(function () {
    startButton.removeAttribute('disabled');
    stopButton.setAttribute('disabled', 'disabled');
    resetButton.removeAttribute('disabled');
});

startButton.onclick = function () {
    day14.start(grid, strategy, start);
    startButton.setAttribute('disabled', 'disabled');
    stopButton.removeAttribute('disabled');
    resetButton.setAttribute('disabled', 'disabled');
};

stopButton.onclick = function () {
    day14.stop();
};

resetButton.onclick = function () {
    svg.selectAll('g').remove();
    init(cells);
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

document.getElementsByName("strategy").forEach(x => x.onchange = function (e) {
    switch (e.target.value) {
        case "top":
            strategy = day14.stratgies.top;
            break;
        case "last":
            strategy = day14.stratgies.last;
            break;
        case "first":
            strategy = day14.stratgies.first;
            break;
        case "circle":
            strategy = day14.stratgies.circle;
            break;
        case "diamond":
            strategy = day14.stratgies.diamond;
            break;
        case "weird":
            strategy = day14.stratgies.weird;
            break;
        case "random":
            strategy = day14.stratgies.random;
            break;
        case "hilbert":
            strategy = day14.stratgies.hilbert;
            break;
        case "zorder":
            strategy = day14.stratgies.zOrder;
            break;
    }
});
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
            if (d.x === undefined && d.y === undefined) return;
            getCell(start.x, start.y).attr('fill', null);
            start = d
            getCell(start.x, start.y).attr('fill', 'red');
        });
}

function getCell(x, y) {
    return svg.select(`g:nth-child(${x + 1})`).select(`rect:nth-child(${y + 1})`);
}

var shouldStop;
function draw(regions) {
    var rainbowColors = d3.scaleSequential()
            .domain([1, regions.length])
            .interpolator(d3.interpolateRainbow);

    var randomScale = d3.scaleOrdinal()
        .domain([1, regions.length])
        .range(d3.shuffle(R.range(0, regions.length)));

    var colors = {
        'rainbow': rainbowColors,
        'random': R.pipe(randomScale, rainbowColors)
    };

    shouldStop = false;
    var i = 0;
    var intervalId = setInterval(function () {
        if (i >= regions.length || shouldStop) {
            clearInterval(intervalId);
            stop();
        }
        for (var cell of regions[i]) {
            getCell(cell.x, cell.y).attr('fill', colors[currentColors](cell.i));
        }
        i++;
    }, 0);
}

function stop() {
    shouldStop = true;
    startButton.removeAttribute('disabled');
    stopButton.setAttribute('disabled', 'disabled');
    resetButton.removeAttribute('disabled');
}

// state ************************************************************
var strategy = 'top';
var currentColors = 'rainbow';
var start = { x: 0, y: 0 };

init(cells);

// handlers *********************************************************
var startButton = document.getElementById('start');
var stopButton = document.getElementById('stop');
var resetButton = document.getElementById('reset');

startButton.onclick = function () {
    var regions = day14.start(grid, day14.stratgies[strategy], start);
    draw(regions);
    startButton.setAttribute('disabled', 'disabled');
    stopButton.removeAttribute('disabled');
    resetButton.setAttribute('disabled', 'disabled');
};

stopButton.onclick = function () {
    stop();
};

resetButton.onclick = function () {
    svg.selectAll('g').remove();
    init(cells);
};

document.getElementsByName("color").forEach(x => x.onchange = function (e) {
    currentColors = e.target.value;
});

document.getElementsByName("strategy").forEach(x => x.onchange = function (e) {
    strategy = e.target.value;
});
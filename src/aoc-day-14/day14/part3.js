var R = require('ramda');
var knot = require('../day10/part2');
var M = require('mnemonist');
var EventEmitter = require('events');
var hilbert = require('../../curves/hilbert');
var zOrder = require('../../curves/zOrder');

var toHashes = x => R.map(y => knot(`${x}-${y}`), R.range(0, 128));
var parseInput = R.pipe(R.trim, toHashes);

var pad = n => ("000" + n).substr(-4);
var hexToBinary = x => pad(parseInt(x, 16).toString(2));

var getGrid = R.pipe(parseInput, R.map(R.map(hexToBinary)), R.map(R.chain(R.map(parseInt))));

var add = (a, b) => R.map(R.sum, R.zip(a, b));
var inBounds = pos => 0 <= pos.x && pos.x <= 127 && 0 <= pos.y && pos.y <= 127;

var events = new EventEmitter();

var start = (blocks, strategy, startCell) => {
    origin = startCell;
    var regions = 0;
    var visited = {};

    var queue = new M.MinHeap(R.comparator((a, b) => {
        if (a.fromRegion && blocks[a.x][a.y] === 1) return true;
        if (b.fromRegion && blocks[b.x][b.y] === 1) return false;
        return strategy(a, b);
    }));

    startCell.fromRegion = false;
    queue.push(startCell);
    var i = 0;

    var mainLoop = function () {
        var currentRegion = regions;

        while (currentRegion === regions) {
            if (queue.size == 0) {
                return true; // done
            }
            
            var pos = queue.pop();
            var key = `${pos.x},${pos.y}`;
            if (visited[key]) continue;
            visited[key] = true;

            var currentValue = blocks[pos.x][pos.y];
            if (currentValue === 1 && !pos.fromRegion) {
                regions++;
            }
            if (currentValue === 1) {
                events.emit('draw', pos.x, pos.y, regions);
            }

            i++;

            //var neighbors = [[0, 1], [1, 0], [-1, 0], [0, -1]];
            var neighbors = R.sortBy(Math.random, [[1, 0], [-1, 0], [0, 1], [0, -1]]);

            for (var neighbor of neighbors) {
                var newPos = { x: pos.x + neighbor[0], y: pos.y + neighbor[1], fromRegion: currentValue === 1, i: i };
                if (inBounds(newPos)) queue.push(newPos);
            }
        }

        return false; // not done
    }

    var stopping = false;
    events.on('stopping', () => {
        stopping = true;
    });

    var intervalId = setInterval(function() {
        if (mainLoop() || stopping) {
            clearInterval(intervalId);
            events.emit('stop', regions);
            stopping = false;
        }
    }, 0);
};

function onDraw(f) {
    events.on('draw', f);
}

function onStop(f) {
    events.on('stop', f);
}

function stop() {
    events.emit('stopping');
}

var origin = {x: 0, y: 0};
var stratgies = {
    first: (a, b) => a.i < b.i,
    last: (a, b) => a.i > b.i,
    top: (a, b) => (a.y === b.y && a.x < b.x) || (a.y < b.y),
    circle: (a, b) => Math.hypot(a.x - origin.x, a.y - origin.y) < Math.hypot(b.x - origin.x, b.y - origin.y),
    diamond: (a, b) => Math.abs(a.x - origin.x) + Math.abs(a.y - origin.y) < Math.abs(b.x - origin.x) + Math.abs(b.y - origin.y),
    random: (a, b) => Math.round(Math.random()),
    weird: (a, b) => a.x + a.y > b.x + b.y,
    hilbert: (a, b) => hilbert.xy2d(128, a.x, a.y) < hilbert.xy2d(128, b.x, b.y),
    zOrder: (a, b) => zOrder.xy2d(a.x, a.y) < zOrder.xy2d(b.x, b.y)
};

module.exports = {
    onDraw,
    onStop,
    stop,
    getGrid,
    start,
    stratgies
};
var R = require('ramda');
var knot = require('../day10/part2');
var M = require('mnemonist');

var toHashes = x => R.map(y => knot(`${x}-${y}`), R.range(0, 128));
var parseInput = R.pipe(R.trim, toHashes);

var pad = n => ("000" + n).substr(-4);
var hexToBinary = x => pad(parseInt(x, 16).toString(2));

var getBlocks = R.pipe(parseInput, R.map(R.map(hexToBinary)), R.map(R.chain(R.map(parseInt))));

var neighbors = R.sortBy(Math.random, [[1, 0], [-1, 0], [0, 1], [0, -1]]);
var add = (a, b) => R.map(R.sum, R.zip(a, b));
var inBounds = pos => 0 <= pos.x && pos.x <= 127 && 0 <= pos.y && pos.y <= 127;

var getUpdates = (blocks, type, draw) => {
    var regions = 0;
    var visited = {};

    var queue = new M.MinHeap(R.comparator((a, b) => {
        if (a.fromRegion && blocks[a.x][a.y] === 1) return true;
        if (b.fromRegion && blocks[b.x][b.y] === 1) return false;
        if (blocks[a.x][a.y] > blocks[b.x][b.y]) return true;
        if (blocks[a.x][a.y] < blocks[b.x][b.y]) return false;
        return type.f(a, b);
    }));
    type.start.fromRegion = false;
    queue.push(type.start);
    var size = 0;
    var i = 0;

    var mainLoop = function () {
        var currentRegion = regions;

        while (currentRegion === regions) {
            if (queue.size == 0) {
                return true;
            }
            
            var pos = queue.pop();
            var key = `${pos.x},${pos.y}`;
            if (visited[key]) continue;
            visited[key] = true;

            var val = blocks[pos.x][pos.y];
            if (val === 1 && !pos.fromRegion) {
                regions++;
                size = 1;
            }
            if (val === 1) {
                var stop = draw(pos.x, pos.y, regions);
                if (stop) return true;
            }

            i++;
            size++;

            for (var neighbor of neighbors) {
                var newPos = { x: pos.x + neighbor[0], y: pos.y + neighbor[1], fromRegion: val === 1, i: i };
                if (inBounds(newPos)) queue.push(newPos);
            }
        }

        return false;
    }

    var intervalId = setInterval(function() {
        var done = mainLoop();
        if (done)
            clearInterval(intervalId);
    }, 0);

    return regions;
};

module.exports = {
    getBlocks,
    getUpdates,
    first: {
        start: { x: 63, y: 63 },
        f: (a, b) => a.i < b.i
    },
    last: {
        start: { x: 63, y: 63 },
        f: (a, b) => a.i > b.i
    },
    top: {
        start: { x: 0, y: 0 },
        f: (a, b) => (a.y === b.y && a.x < b.x) || (a.y < b.y)
    },
    circle: {
        start: { x: 63, y: 63 },
        f: function(a, b) { 
            return Math.hypot(a.x - this.start.x, a.y - this.start.y) < Math.hypot(b.x - this.start.x, b.y - this.start.y); 
        }
    },
    diamond: {
        start: { x: 63, y: 63 },
        f: function(a, b) { 
            return Math.abs(a.x - this.start.x) + Math.abs(a.y - this.start.y) < Math.abs(b.x - this.start.x) + Math.abs(b.y - this.start.y) 
        }
    },
    random: {
        start: { x: 63, y: 63 },
        f: (a, b) => false
    },
    weird: {
        start: { x: 0, y: 0 },
        f: (a, b) => a.x + a.y > b.x + b.y
    }
};
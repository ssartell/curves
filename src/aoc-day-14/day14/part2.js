var R = require('ramda');
var knot = require('../day10/part2');
var M = require('mnemonist');

var toHashes = x => R.map(y => knot(`${x}-${y}`), R.range(0, 128));
var parseInput = R.pipe(R.trim, toHashes);

var pad = n => ("000" + n).substr(-4);
var hexToBinary = x => pad(parseInt(x, 16).toString(2));

var neighbors = [[1, 0], [-1, 0], [0, 1], [0, -1]];
var add = (a, b) => R.map(R.sum, R.zip(a, b));
var inBounds = pos => 0 <= pos.x && pos.x <= 127 && 0 <= pos.y && pos.y <= 127; 

var run = blocks => {
    var regions = 0;
    var visited = {};
    var queue = new M.MinHeap(R.comparator((a, b) => 
        ((a.fromRegion && blocks[a.x][a.y] === 1) || !(b.fromRegion && blocks[b.x][b.y] === 1)) 
        && (blocks[a.x][a.y] >= blocks[b.x][b.y])
    ));
    queue.push({x: 0, y: 0, fromRegion: false});
    while(queue.size) {
        var pos = queue.pop();
        
        var key = `${pos.x},${pos.y}`;
        if (visited[key]) continue;
        visited[key] = true;

        var val = blocks[pos.x][pos.y];
        if (val === 1 && !pos.fromRegion) regions++;
        
        for(var neighbor of neighbors) {
            var newPos = {x: pos.x + neighbor[0], y: pos.y + neighbor[1], fromRegion: val === 1 };
            if (inBounds(newPos)) queue.push(newPos);
        }
    }

    return regions;
};

var solution = R.pipe(parseInput, R.map(R.map(hexToBinary)), R.map(R.chain(R.map(parseInt))), run);

module.exports = solution;
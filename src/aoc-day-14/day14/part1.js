var R = require('ramda');
var knot = require('../day10/part2');

var toHashes = x => R.map(y => knot(`${x}-${y}`), R.range(0, 128));
var parseInput = R.pipe(R.trim, toHashes);

var hexToBinary = x => parseInt(x, 16).toString(2);

var solution = R.pipe(parseInput, R.map(R.map(hexToBinary)), R.map(R.pipe(R.map(R.pipe(R.map(parseInt), R.sum)), R.sum)), R.sum);

module.exports = solution;
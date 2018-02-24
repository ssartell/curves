var R = require('ramda');

var debug = x => {debugger; return x;};

var parseInput = R.pipe(R.split(''), R.map(x => x.charCodeAt(0)));

var reverse = (list, pos, length) => {
    var a = pos;
    var b = R.mathMod(a + length - 1, list.length);

    while (a != b && a != R.mathMod(b + 1, list.length)) {
        var temp = list[a];
        list[a] = list[b];
        list[b] = temp;
        a = R.mathMod(a + 1, list.length);
        b = R.mathMod(b - 1, list.length);
    }
};

var run = (a, length) => {
    reverse(a.list, a.pos, length);
    a.pos = R.mathMod(a.pos + length + a.skip, a.list.length);
    a.skip++;
    return a;
};

var run64 = seq => {
    var a =  { list: R.range(0, 256), pos: 0, skip: 0 };
    for(var i = 0; i < 64; i++) {
        a = R.reduce(run, a, seq);
    }
    return a.list;
};

var denseHash = R.pipe(R.splitEvery(16), R.map(x => x.reduce((a, b) => a ^ b)));
var pad = n => ("0" + n).substr(-2);
var toHex = R.pipe(R.map(x => pad(x.toString(16), 2)), x => x.join(''));

var solution = R.pipe(parseInput, R.concat(R.__, [17, 31, 73, 47, 23]), run64, denseHash, toHex);

module.exports = solution;
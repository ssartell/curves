var R = require('ramda');

var parseInput = R.pipe(R.split(','), R.map(parseInt));

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

var solution = R.pipe(parseInput, R.reduce(run, { list: R.range(0, 256), pos: 0, skip: 0 }), x => x.list[0] * x.list[1]);

module.exports = solution;
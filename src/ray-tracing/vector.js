var R = require('ramda');

var xi = 0;
var yi = 1;
var zi = 2;

var zipWith = function(f) {
    return function(a, b) {
        var result = [];
        for(var i = 0; i < a.length; i++) {
            result.push(f(a[i], b[i]));
        }
        return result;
    }
};

var add = zipWith(R.add);
var subtract = zipWith(R.subtract);
var multiply = zipWith(R.multiply);
var dotProduct = R.pipe(multiply, R.sum);
var crossProduct = (a, b) => [
    a[yi] * b[zi] - a[zi] * b[yi],
    a[zi] * b[xi] - a[xi] * b[zi],
    a[xi] * b[yi] - a[yi] * b[xi],
];
var magnitude = a => Math.hypot.apply(null, a);
var scale = (a, mag) => a.map(x => x * mag);
var normalize = a => scale(a, 1 / magnitude(a));
var clamp = (a, range) => R.map(x => Math.max(range[0], Math.min(range[1], x)), a);
var up = [0, 1, 0];

var reflect = (a, b) => subtract(a, scale(b, 2 * dotProduct(a, b)));

module.exports = {
    add,
    subtract,
    multiply,
    dotProduct,
    crossProduct,
    magnitude,
    scale,
    normalize,
    clamp,
    reflect,
    up
};
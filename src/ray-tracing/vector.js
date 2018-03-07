function add(a, b) {
    return [
        a[0] + b[0],
        a[1] + b[1],
        a[2] + b[2],
    ];
}

function subtract(a, b) {
    return [
        a[0] - b[0],
        a[1] - b[1],
        a[2] - b[2],
    ];
}

function multiply(a, b) {
    return [
        a[0] * b[0],
        a[1] * b[1],
        a[2] * b[2],
    ]
}

function dotProduct(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function crossProduct(a, b) {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    ];
}

function magnitude(a) {
    var x = a[0], y = a[1], z = a[2]
    return Math.sqrt(x * x + y * y + z * z);
}

function scale(a, s) {
    return [
        a[0] * s,
        a[1] * s,
        a[2] * s
    ];
}

function normalize(a) {
    var s = 1 / magnitude(a);
    return [
        a[0] * s,
        a[1] * s,
        a[2] * s,
    ];
}

function clamp(a, range) {
    var low = range[0], high = range[1];
    return [
        Math.max(low, Math.min(high, a[0])),
        Math.max(low, Math.min(high, a[1])),
        Math.max(low, Math.min(high, a[2]))
    ];
}

function reflect(a, b) {
    return subtract(a, scale(b, 2 * dotProduct(a, b)));
}

var up = [0, 1, 0];

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
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
    return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
}

function scale(a, mag) {
    return [
        a[0] * mag,
        a[1] * mag,
        a[2] * mag
    ];
}

function normalize(a) {
    var inverse = 1 / magnitude(a);
    return [
        a[0] * inverse,
        a[1] * inverse,
        a[2] * inverse,
    ];
}

function clamp(a, range) {
    return [
        Math.max(range[0], Math.min(range[1], a[0])),
        Math.max(range[0], Math.min(range[1], a[1])),
        Math.max(range[0], Math.min(range[1], a[2]))
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
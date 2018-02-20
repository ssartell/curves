function d2xy(n, d) {
    var [x, y] = [0, 0];
    var t = d;

    for(var s = 1; s < n; s *= 2) {
        var rx = (t >> 1) & 1; // second bit is set
        var ry = (t ^ rx) & 1; // first bit XOR second bit
        [x, y] = rotate(s, x, y, rx, ry);
        [x, y] = [x + s * rx, y + s * ry];
        t = t >>> 2;
    }

    return [x, y];
}

function xy2d (n, x, y) {
    var d = 0;
    for (var s = n / 2; s >= 1; s /= 2) {
        var rx = (x & s) ? 1 : 0;
        var ry = (y & s) ? 1 : 0;
        d += s * s * ((3 * rx) ^ ry);
        [x, y] = rotate(s, x, y, rx, ry);
    }
    return d;
}

function rotate(n, x, y, regionX, regionY) {
    if (regionY === 1) 
        return [x, y]; // top regions don't change

    return regionX === 0 
        ? [y, x] // rotate bottom left
        : [n - 1 - y, n - 1 - x]; // flip and rotate bottom right
}

module.exports = {
    d2xy,
    xy2d
};

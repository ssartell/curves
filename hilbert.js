function d2xy(d, n) {
    var [x, y] = [0, 0];
    var t = d;

    for(var s = 1; s < n; s *= 2) {
        var regionX = (t >> 1) & 1; // second bit is set
        var regionY = (t ^ regionX) & 1; // first bit XOR second bit
        [x, y] = rotate(s, x, y, regionX, regionY);
        [x, y] = [x + s * regionX, y + s * regionY];
        t = t >>> 2;
    }
    
    return [x, y];
};

function rotate(n, x, y, regionX, regionY) {
    if (regionY === 1) 
        return [x, y]; // leave top regions

    return regionX === 0 
        ? [y, x] // rotate bottom left
        : [n - 1 - y, n - 1 - x]; // flip and rotate bottom right
};

module.exports = {
    d2xy
};

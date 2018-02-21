function interpolate(p1, p2, n) {
    if (n <= 1) return [p1, p2];

    var points = [];
    for(var i = 0; i <= n; i++) {
        var di = i / n;
        points.push([
            p1[0] * (1 - di) + p2[0] * di,
            p1[1] * (1 - di) + p2[1] * di,
        ])
    }

    return points;
}

function dist(a, b) {
    return R.sum(R.map(x => x[0] - x[1], R.zip(a, b)));
}
var d2xy = function(d, N) {
    var [x, y] = [0, 0];
    var index = d;
    var pos = [[0,0],[0,1],[1,1],[1,0]];

    for(var n = 1; n < N; n *= 2) {
        var twoBits = index & 3;
        var index = index >>> 2;
               
         if (n === 1) {
            [x,y] = pos[twoBits];
         } else {
            switch(twoBits) {
                case 0:
                    [x, y] = [y, x];
                    break;
                case 1:
                    [x, y] = [x, y + n];
                    break;
                case 2:
                    [x, y] = [x + n, y + n];
                    break;
                case 3:
                    [x, y] = [2 * n - 1 - y, n - 1 - x];
                    break;
            }             
        }
    }
    return [x, y];
}

module.exports = {
    d2xy
};
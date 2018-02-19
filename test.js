var assert = require('assert');
var hilbert = require('./hilbert');

describe('hilbert d2xy', function() {    
    describe('N = 2', function() {
        var N = 2;
        it('i = 0', function() {
            var [x, y] = hilbert.d2xy(0, N);
            assert.equal(x, 0);
            assert.equal(y, 0);
        });
        it('i = 1', function() {
            var [x, y] = hilbert.d2xy(1, N);
            assert.equal(x, 0);
            assert.equal(y, 1);
        });
        it('i = 2', function() {
            var [x, y] = hilbert.d2xy(2, N);
            assert.equal(x, 1);
            assert.equal(y, 1);
        });
        it('i = 3', function() {
            var [x, y] = hilbert.d2xy(3, N);
            assert.equal(x, 1);
            assert.equal(y, 0);
        });
    });
    describe('N = 4', function() {
        var N = 4;
        it('i = 0', function() {
            var [x, y] = hilbert.d2xy(0, N);
            assert.equal(x, 0);
            assert.equal(y, 0);
        });
        it('i = 1', function() {
            var [x, y] = hilbert.d2xy(1, N);
            assert.equal(x, 1);
            assert.equal(y, 0);
        });
        it('i = 2', function() {
            var [x, y] = hilbert.d2xy(2, N);
            assert.equal(x, 1);
            assert.equal(y, 1);
        });
        it('i = 3', function() {
            var [x, y] = hilbert.d2xy(3, N);
            assert.equal(x, 0);
            assert.equal(y, 1);
        });
        it('i = 6', function() {
            var [x, y] = hilbert.d2xy(6, N);
            assert.equal(x, 1);
            assert.equal(y, 3);
        });
        it('i = 7', function() {
            var [x, y] = hilbert.d2xy(7, N);
            assert.equal(x, 1);
            assert.equal(y, 2);
        });
        it('i = 10', function() {
            var [x, y] = hilbert.d2xy(10, N);
            assert.equal(x, 3);
            assert.equal(y, 3);
        });
        it('i = 11', function() {
            var [x, y] = hilbert.d2xy(11, N);
            assert.equal(x, 3);
            assert.equal(y, 2);
        });
        it('i = 13', function() {
            var [x, y] = hilbert.d2xy(13, N);
            assert.equal(x, 2);
            assert.equal(y, 1);
        });
        it('i = 14', function() {
            var [x, y] = hilbert.d2xy(14, N);
            assert.equal(x, 2);
            assert.equal(y, 0);
        });
        it('i = 15', function() {
            var [x, y] = hilbert.d2xy(15, N);
            assert.equal(x, 3);
            assert.equal(y, 0);
        });
    });
    describe('N = 8', function() {
        var N = 8;
        it('i = 7', function() {
            var [x, y] = hilbert.d2xy(7, N);
            assert.equal(x, 2);
            assert.equal(y, 1);
        });
        it('i = 18', function() {
            var [x, y] = hilbert.d2xy(18, N);
            assert.equal(x, 1);
            assert.equal(y, 5);
        });
        it('i = 41', function() {
            var [x, y] = hilbert.d2xy(41, N);
            assert.equal(x, 6);
            assert.equal(y, 7);
        });
        it('i = 62', function() {
            var [x, y] = hilbert.d2xy(62, N);
            assert.equal(x, 7);
            assert.equal(y, 1);
        });
    });
});

describe('hilbert xy2d', function() {    
    describe('N = 2', function() {
        var N = 2;
        it('x = 0, y = 0', function() {
            var d = hilbert.xy2d(N, 0, 0);
            assert.equal(d, 0);
        });
        it('x = 0, y = 1', function() {
            var d = hilbert.xy2d(N, 0, 1);
            assert.equal(d, 1);
        });
        it('x = 1, y = 1', function() {
            var d = hilbert.xy2d(N, 1, 1);
            assert.equal(d, 2);
        });
        it('x = 1, y = 0', function() {
            var d = hilbert.xy2d(N, 1, 0);
            assert.equal(d, 3);
        });
    });
    describe('N = 4', function() {
        var N = 4;
        it('x = 2, y = 1', function() {
            var d = hilbert.xy2d(N, 1, 2);
            assert.equal(d, 7);
        });
        it('x = 2, y = 0', function() {
            var d = hilbert.xy2d(N, 2, 0);
            assert.equal(d, 14);
        });
    });
    describe('N = 8', function() {
        var N = 8;
        it('x = 1, y = 5', function() {
            var d = hilbert.xy2d(N, 1, 5);
            assert.equal(d, 18);
        });
        it('x = 7, y = 1', function() {
            var d = hilbert.xy2d(N, 7, 1);
            assert.equal(d, 62);
        });
    });
});
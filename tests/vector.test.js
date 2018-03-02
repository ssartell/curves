var assert = require('assert');
var vector = require('../src/ray-tracing/vector');

describe('vector', function() {    
    describe('add', function() {
        it('[1, 0] + [0, 1] = [1, 1]', function() {
            var [x, y] = vector.add([1, 0], [0, 1]);
            assert.equal(x, 1);
            assert.equal(y, 1);
        });
    });

    describe('cross product', function() {
        it('[1, 0, 0] x [0, 1, 0] = [0, 0, 1]', function() {
            var [x, y, z] = vector.crossProduct([1, 0, 0], [0, 1, 0]);
            assert.equal(x, 0);
            assert.equal(y, 0);
            assert.equal(z, 1);
        });
    });
});
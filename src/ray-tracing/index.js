var d3 = require('d3');
var d3c = require('d3-contour');
var R = require('ramda');
var vec = require('./vector');

var width = 200;
var height = 200;

var waves = xy => Math.sin(xy[0] / 4) + Math.cos(xy[1] / 4);
var random = xy => Math.random() * 10;

var min = R.reduce(R.min, Infinity);
var max = R.reduce(R.max, -Infinity);

var scene = {
    camera: {
        position: [0, 0, 0],
        lookAt: [0, 0, 1],
        fov: 90
    },
    shapes: [
        {
            type: 'sphere',
            center: [0, 0, 4],
            radius: 1.5
        },
        {
            type: 'sphere',
            center: [.5, .5, 2],
            radius: .5
        }
    ]
};

var raytrace = (function () {
    var fovRadians = (scene.camera.fov / 2) * Math.PI / 180;
    var aspectRatio = height / width;
    var halfWidth = Math.tan(fovRadians);
    var halfHeight = aspectRatio * halfWidth;
    var camerawidth = halfWidth * 2;
    var cameraheight = halfHeight * 2;
    var pixelWidth = camerawidth / (width - 1);
    var pixelHeight = cameraheight / (height - 1);

    function renderPixel(scene, screenCoords) {
        var eyeVector = vec.normalize(vec.subtract(scene.camera.lookAt, scene.camera.position));
        vRight = vec.crossProduct(vec.up, eyeVector);
        vUp = vec.crossProduct(eyeVector, vRight);

        var xComponent = vec.scale(vRight, (screenCoords[0] * pixelWidth) - halfWidth);
        var yComponent = vec.scale(vUp, halfHeight - (screenCoords[1] * pixelHeight));

        var ray = {
            point: scene.camera.position,
            vector: vec.normalize(vec.add(eyeVector, vec.add(xComponent, yComponent)))
        };

        var intersections = scene.shapes
            .map(shape => intersectShape(ray, shape))
            .filter(x => Number.isFinite(x.t))
            .sort((a, b) => a.t - b.t);

        return intersections.length > 0 ? intersections[0].t : NaN;
    }

    function intersectShape(ray, shape) {
        var L = vec.subtract(ray.point, shape.center);
        var a = vec.dotProduct(ray.vector, ray.vector);
        var b = 2 * vec.dotProduct(ray.vector, L);
        var c = vec.dotProduct(L, L) - shape.radius * shape.radius;
        var t = solveQuadratic(a, b, c);
        return { t, shape };
    }

    function solveQuadratic(a, b, c) {
        var discr = b * b - 4 * a * c;
        if (discr > 0) {
            var q = (b > 0)
                ? -0.5 * (b + Math.sqrt(discr))
                : -0.5 * (b - Math.sqrt(discr))
            var x0 = q / a;
            var x1 = c / q;
            return Math.min(x0, x1);
        } else if (discr === 0) {
            return -0.5 * b / a;
        } else {
            return NaN;
        }
    }

    return R.curry(renderPixel);
}());

// renderContour(createGrid(width, height, raytrace(scene)), 20);
renderGrid(createGrid(width, height, raytrace(scene)));

function renderGrid(grid) {
    debugger
    var color = d3.scaleSequential()
        .domain([1, 5])
        .interpolator(d3.interpolateRainbow);
    
    var svg = d3.select('svg');
    var groups = svg
        .selectAll('svg')
        .data(grid)
        .enter().append('svg')
        .attr('y', (d, i) => `${i / height * 100}%`);

    var rect = groups.selectAll('rect')
        .data(d => d);

    rect.enter().append('rect')
        .attr('fill', (d, i) => color(d))
        .attr('x', (d, i) => `${i / width * 100}%`)
        .attr('width', d => `${1 / width * 100}%`)
        .attr('height', d => `${1 / height * 100}%`);
}

function createGrid(n, m, f) {
    var arr = R.range(0, n).map(x => R.range(0, m));
    return arr.map((_, y) => arr.map((_, x) => f([x, y])));
}

function renderContour(grid, thresholds) {
    var arr = R.flatten(grid).map(x => Number.isNaN(x) ? null : x);
    var n = grid.length;
    var m = grid[0].length;

    var element = document.getElementsByTagName("svg")[0];
    var svg = d3.select('svg')
        .attr('fill', 'black');
    var width = +element.clientWidth;
    var height = +element.clientHeight;

    var rainbow = d3.scaleSequential()
        .domain(d3.extent(arr))
        .interpolator(d3.interpolateRainbow);

    var contours = d3c.contours()
        .smooth(true)
        .size([n, m])
        .thresholds(thresholds);

    svg.selectAll("path")
        .data(contours(arr))
        .enter().append("path")
        .attr("d", d3.geoPath(d3.geoIdentity().scale(height / m)))
        .attr("fill", function (d) { return rainbow(d.value); });
}
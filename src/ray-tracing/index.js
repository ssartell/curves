var d3 = require('d3');
var d3c = require('d3-contour');
var R = require('ramda');
var vec = require('./vector');
var surfaces = require('./surfaces');

var width = 1000;
var height = 800;

var waves = xy => Math.sin(xy[0] / 4) + Math.cos(xy[1] / 4);
var random = xy => Math.random() * 10;

var min = R.reduce(R.min, Infinity);
var max = R.reduce(R.max, -Infinity);

var scene = {
    camera: {
        position: [0, .5, 0],
        lookAt: [0, 0, 1],
        fov: 90
    },
    shapes: [
        {
            type: 'plane',
            point: [0, -1.5, 10],
            normal: vec.normalize([0, 1, 0]),
            // brass
            // ambient: [.33, .22, .03],
            // diffuse: [.78, .57, .11],
            // specular: [.99, .94, .81],
            // exponent: 27.8

            // black plastic
            ambient: [.0, .0, .0],
            diffuse: [.01, .01, .01],
            specular: [.5, .5, .5],
            exponent: 32,
            surface: surfaces.slightlyRough
        },
        {
            type: 'sphere',
            center: [-1, 0, 4],
            radius: 1.5,
            // brass
            // ambient: [.33, .22, .03],
            // diffuse: [.78, .57, .11],
            // specular: [.99, .94, .81],
            // exponent: 27.8

            // gold
            ambient: [.25, .20, .07],
            diffuse: [.75, .61, .23],
            specular: [.62, .55, .63],
            exponent: 27.8,
            surface: surfaces.smooth
        },
        {
            type: 'sphere',
            center: [1, .5, 3],
            radius: .5,
            // exponent: 51.2
            ambient: [.19, .07, .02],
            diffuse: [.7, .27, .08],
            specular: [.25, .13, .08],
            exponent: 12.8,
            surface: surfaces.veryRough
        },
        {
            type: 'sphere',
            center: [.5, -.35, 1.5],
            radius: .5,
            // silver
            ambient: [.19, .19, .19],
            diffuse: [.51, .51, .51],
            specular: [.51, .51, .51],
            exponent: 51.2,
            surface: surfaces.slightlyRough
        }
    ],
    lights: [
        {
            position: [-5, 10, 0],
            intensity: [1, 1, 1]
        },
        {
            position: [8, -1.25, 4],
            intensity: [0, 0, .7]
        },
        {
            position: [-2, -1.25, 2],
            intensity: [.25, 0, 0]
        },
    ],
    ambient: [.1, .1, .5]
};

var raytrace = (function () {
    var atInfinity = { t: Infinity };

    var intersect = {
        sphere: intersectSphere,
        plane: intersectPlane
    };

    function renderScene(scene, width, height) {
        var fovRadians = (scene.camera.fov / 2) * Math.PI / 180;
        var aspectRatio = height / width;
        var halfWidth = Math.tan(fovRadians);
        var halfHeight = aspectRatio * halfWidth;
        var camerawidth = halfWidth * 2;
        var cameraheight = halfHeight * 2;
        var pixelWidth = camerawidth / (width - 1);
        var pixelHeight = cameraheight / (height - 1);

        var eyeVector = vec.normalize(vec.subtract(scene.camera.lookAt, scene.camera.position));
        var vRight = vec.crossProduct(vec.up, eyeVector);
        var vUp = vec.crossProduct(eyeVector, vRight);

        var traceScreenCoords = function (x, y) {
            var xComponent = vec.scale(vRight, (x * pixelWidth) - halfWidth);
            var yComponent = vec.scale(vUp, halfHeight - (y * pixelHeight));

            var ray = {
                point: scene.camera.position,
                vector: vec.normalize(vec.add(eyeVector, vec.add(xComponent, yComponent)))
            };

            var color = traceRay(scene, ray);
            var scaledColor = vec.scale(vec.clamp(color, [0, 1]), 255);
            return scaledColor;
        };

        function antialias(x, y) {
            var c1 = traceScreenCoords(x + .25, y + .25);
            var c2 = traceScreenCoords(x + .75, y + .25);
            var c3 = traceScreenCoords(x + .25, y + .75);
            var c4 = traceScreenCoords(x + .75, y + .75);

            return vec.scale(vec.add(vec.add(c1, c2), vec.add(c3, c4)), .25);
        }

        var result = [];
        for (var y = 0; y < height; y++) {
            result[y] = [];
            for (var x = 0; x < width; x++) {
                // result[y][x] = traceScreenCoords(x, y);
                result[y][x] = antialias(x, y);
            }
        }

        return result;
    }

    function traceRay(scene, ray, depth, excludedShape) {
        if (depth > 3) return scene.ambient;

        var intersection = atInfinity;
        for(var shape of scene.shapes) {
            if (shape === excludedShape) continue;
            var newIntersection = intersect[shape.type](ray, shape);
            if (newIntersection.t > 0 && newIntersection.t < intersection.t)
                intersection = newIntersection;
        }

        if (!Number.isFinite(intersection.t)) return scene.ambient;

        var lighting = colorAtIntersection(scene, intersection);

        var reflectedRay = {
            point: intersection.pointAtTime,
            vector: vec.reflect(ray.vector, intersection.normal)
        };

        var reflection = traceRay(scene, reflectedRay, ++depth, [intersection.shape]);

        return vec.add(lighting, vec.multiply(intersection.shape.specular, reflection));
    }

    function intersectPlane(ray, shape) {
        var rayToPlane = vec.subtract(shape.point, ray.point);
        var dot = vec.dotProduct(ray.vector, shape.normal);
        var t = vec.dotProduct(rayToPlane, shape.normal) / dot;
        if (t < 0) return atInfinity;

        var pointAtTime = vec.add(ray.point, vec.scale(ray.vector, t));
        var normal = (dot > 0) ? vec.scale(shape.normal, -1) : shape.normal;
        normal = shape.surface(normal, pointAtTime);

        return { shape, t, normal, pointAtTime };
    }

    function intersectSphere(ray, shape) {
        var L = vec.subtract(ray.point, shape.center);
        var a = vec.dotProduct(ray.vector, ray.vector);
        var b = 2 * vec.dotProduct(ray.vector, L);
        var c = vec.dotProduct(L, L) - shape.radius * shape.radius;

        var t = solveQuadratic(a, b, c);
        if (!Number.isFinite(t))
            return atInfinity;

        var pointAtTime = vec.add(ray.point, vec.scale(ray.vector, t));

        var normal = vec.normalize(vec.subtract(pointAtTime, shape.center));
        normal = shape.surface(normal, pointAtTime);

        return { shape, t, pointAtTime, normal };
    }

    function colorAtIntersection(scene, intersection) {
        var shape = intersection.shape;
        var normal = intersection.normal;

        // ambient
        var color = vec.multiply(scene.ambient, shape.ambient);

        for (var light of scene.lights) {
            var pointToLight = vec.normalize(vec.subtract(light.position, intersection.pointAtTime));

            // diffuse
            var cos = Math.max(0, vec.dotProduct(normal, pointToLight));
            var diffuse = vec.scale(vec.multiply(light.intensity, shape.diffuse), cos);
            color = vec.add(color, diffuse);

            // specular
            if (cos > 0) {
                var pointToCamera = vec.normalize(vec.subtract(scene.camera.position, intersection.pointAtTime));
                var reflection = vec.normalize(vec.add(pointToLight, pointToCamera));
                var reflectionCos = Math.max(0, vec.dotProduct(normal, reflection));
                var specular = vec.scale(vec.multiply(light.intensity, shape.specular), Math.pow(reflectionCos, shape.exponent));
                color = vec.add(color, specular);
            }
        }

        return color;
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

    return renderScene;
}());

// renderContour(createGrid(width, height, raytrace(scene)), 20);
//renderGrid(createGrid(width, height, raytrace(scene)));
renderCanvas(width, height, raytrace(scene))

function renderCanvas(width, height, f) {
    var c = document.getElementById('c');
    c.width = width;
    c.height = height;
    //c.style.cssText = `width: ${width * 2}px; height: ${height * 2}px`;

    var ctx = c.getContext('2d');
    var data = ctx.getImageData(0, 0, width, height);
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    var img = raytrace(scene, width, height);

    var i = 0;

    for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
            var color = img[y][x];
            i = (x * 4) + (y * width * 4);
            data.data[i + 0] = color[0];
            data.data[i + 1] = color[1];
            data.data[i + 2] = color[2];
            data.data[i + 3] = 255;
        }
    }

    ctx.putImageData(data, 0, 0);
}

function createGrid(n, m, f) {
    var arr = R.range(0, n).map(x => R.range(0, m));
    return arr.map((_, y) => arr.map((_, x) => f([x, y])));
}

function renderGrid(grid) {
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
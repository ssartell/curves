var vec = require('./vector');
var surfaces = require('./surfaces');

var atInfinity = { t: Infinity };

var intersectFunctions = {
    sphere: intersectSphere,
    plane: intersectPlane,
    polygon: intersectPolygon
};

function* renderScene(scene, width, height) {
    prepareScene(scene);

    var fovRadians = (scene.camera.fov / 2) * Math.PI / 180;
    var aspectRatio = height / width;
    var halfWidth = Math.tan(fovRadians);
    var halfHeight = aspectRatio * halfWidth;
    var camerawidth = halfWidth * 2;
    var cameraheight = halfHeight * 2;
    var pixelWidth = camerawidth / (width - 1);
    var pixelHeight = cameraheight / (height - 1);

    var traceFrom2d = function (position, lookAt, x, y) {
        var eyeVector = vec.normalize(vec.subtract(lookAt, position));
        var vRight = vec.normalize(vec.crossProduct(vec.up, eyeVector));
        var vUp = vec.normalize(vec.crossProduct(eyeVector, vRight));

        var xComponent = vec.scale(vRight, (x * pixelWidth) - halfWidth);
        var yComponent = vec.scale(vUp, halfHeight - (y * pixelHeight));

        var ray = {
            point: position,
            vector: vec.normalize(vec.add(eyeVector, vec.add(xComponent, yComponent)))
        };

        var color = traceRay(scene, ray, 0);
        var scaledColor = vec.scale(vec.clamp(color, [0, 1]), 255);
        return scaledColor;
    };

    function antiAlias(f) {
        return function (position, lookAt, x, y) {
            var c1 = f(position, lookAt, x + .25, y + .25);
            var c2 = f(position, lookAt, x + .75, y + .25);
            var c3 = f(position, lookAt, x + .25, y + .75);
            var c4 = f(position, lookAt, x + .75, y + .75);

            return vec.scale(vec.add(vec.add(c1, c2), vec.add(c3, c4)), .25);
        }
    }

    function drunkMode(f, r, samples) {
        return function (position, lookAt, x, y) {
            color = [0, 0, 0];
            for (var t = 0; t <= 2 * Math.PI; t += Math.PI / samples) {
                var contribution = f(position, lookAt, x + r * Math.cos(t), y + r * Math.sin(t));
                color = vec.add(color, contribution);
            }

            return vec.scale(color, 1 / samples);
        }
    }

    function depthOfField(f, r, samples) {
        return function(position, lookAt, x, y) {
            var color = [0, 0, 0];

            var eyeVector = vec.normalize(vec.subtract(lookAt, position));
            var vRight = vec.normalize(vec.crossProduct(vec.up, eyeVector));
            var vUp = vec.normalize(vec.crossProduct(eyeVector, vRight));

            for(var t = 0; t <= 2 * Math.PI; t += 2 * Math.PI / samples) {
                var leftRight = vec.scale(vRight, r * Math.cos(t));
                var upDown = vec.scale(vUp, r * Math.sin(t));
                var newPosition = vec.add(position, vec.add(leftRight, upDown));
                var contribution = f(newPosition, lookAt, x, y);
                color = vec.add(color, contribution);
            }

            return vec.scale(color, 1 / samples);
        }
    }

    var trace = traceFrom2d;

    if (scene.settings.depthOfField.enabled) {
        trace = depthOfField(trace, scene.settings.depthOfField.radius, scene.settings.depthOfField.samples);
    }

    if (scene.settings.antiAlias) {
        trace = antiAlias(trace);
    }

    var result = [];
    for (var y = 0; y < height; y++) {
        result[y] = [];
        for (var x = 0; x < width; x++) {
            yield trace(scene.camera.position, scene.camera.lookAt, x, y);
        }
    }
}

function prepareScene(scene) {
    for (var shape of scene.shapes) {
        if (shape.type === 'polygon') {
            shape.edges = [];
            for (var i = 0; i < shape.vertices.length; i++) {
                shape.edges.push(vec.subtract(shape.vertices[(i + 1) % shape.vertices.length], shape.vertices[i]));
            }
            shape.point = shape.vertices[0];
            shape.normal = vec.normalize(vec.crossProduct(shape.edges[0], shape.edges[1]));
        }
    }
}

function traceRay(scene, ray, depth, excludedShape) {
    if (depth > scene.settings.reflectionDepth)
        return scene.ambient;

    var intersection = intersectAllShapes(scene, ray, excludedShape);

    if (!Number.isFinite(intersection.t)) return scene.ambient;

    var lighting = colorAtIntersection(scene, intersection, ray);

    var reflectedRay = {
        point: intersection.pointAtTime,
        vector: vec.reflect(ray.vector, intersection.normal)
    };

    var reflection = traceRay(scene, reflectedRay, ++depth, intersection.shape);

    return vec.add(lighting, vec.multiply(intersection.shape.specular, reflection));
}

function intersectAllShapes(scene, ray, excludedShape) {
    var intersection = atInfinity;
    for (var shape of scene.shapes) {
        if (shape === excludedShape) continue;
        var newIntersection = intersectFunctions[shape.type](ray, shape);
        if (newIntersection.t > 0 && newIntersection.t < intersection.t)
            intersection = newIntersection;
    }
    return intersection;
}

function intersectPlane(ray, shape) {
    var rayToPlane = vec.subtract(shape.point, ray.point);
    var dot = vec.dotProduct(ray.vector, shape.normal);
    var t = vec.dotProduct(rayToPlane, shape.normal) / dot;
    if (t < 0) return atInfinity;

    var pointAtTime = vec.add(ray.point, vec.scale(ray.vector, t));
    var normal = (dot > 0) ? vec.scale(shape.normal, -1) : shape.normal;
    normal = surfaces[shape.surface](normal, pointAtTime);

    return { shape, t, normal, pointAtTime };
}

function intersectPolygon(ray, shape) {
    var intersection = intersectPlane(ray, shape);
    if (!Number.isFinite(intersection.t)) return atInfinity;

    for (var i = 0; i < shape.vertices.length; i++) {
        var c0 = vec.subtract(intersection.pointAtTime, shape.vertices[i]);
        if (vec.dotProduct(shape.normal, vec.crossProduct(shape.edges[i], c0)) < 0) return atInfinity;
    }

    return intersection;
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
    normal = surfaces[shape.surface](normal, pointAtTime);

    return { shape, t, pointAtTime, normal };
}

function colorAtIntersection(scene, intersection, ray) {
    var shape = intersection.shape;
    var normal = intersection.normal;

    // ambient
    var color = vec.multiply(scene.ambient, shape.ambient);

    for (var light of scene.lights) {
        var pointToLight = vec.subtract(light.position, intersection.pointAtTime);

        // shadows
        if (scene.settings.shadows) {
            var length = vec.magnitude(pointToLight);
            pointToLight = vec.normalize(pointToLight);

            var lightIntersection = intersectAllShapes(scene, { point: intersection.pointAtTime, vector: pointToLight }, intersection.shape);
            if (lightIntersection.t < length) continue;
        } else {
            pointToLight = vec.normalize(pointToLight);
        }

        // diffuse
        var cos = Math.max(0, vec.dotProduct(normal, pointToLight));
        var diffuse = vec.scale(vec.multiply(light.intensity, shape.diffuse), cos);
        color = vec.add(color, diffuse);

        // specular
        if (cos > 0) {
            var pointToCamera = vec.scale(ray.vector, -1);
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

module.exports = {
    renderScene
};
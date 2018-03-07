var vec = require('./vector');
var surfaces = require('./surfaces');

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
    var vRight = vec.normalize(vec.crossProduct(vec.up, eyeVector));
    var vUp = vec.normalize(vec.crossProduct(eyeVector, vRight));

    var traceScreenCoords = function (x, y) {
        var xComponent = vec.scale(vRight, (x * pixelWidth) - halfWidth);
        var yComponent = vec.scale(vUp, halfHeight - (y * pixelHeight));

        var ray = {
            point: scene.camera.position,
            vector: vec.normalize(vec.add(eyeVector, vec.add(xComponent, yComponent)))
        };

        var color = traceRay(scene, ray, 0);
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
            result[y][x] = scene.settings.antiAlias ? antialias(x, y) : traceScreenCoords(x, y);
        }
    }

    return result;
}

function traceRay(scene, ray, depth, excludedShape) {
    if (depth > scene.settings.reflectionDepth) 
        return scene.ambient;

    var intersection = atInfinity;
    for (var shape of scene.shapes) {
        if (shape === excludedShape) continue;
        var newIntersection = intersect[shape.type](ray, shape);
        if (newIntersection.t > 0 && newIntersection.t < intersection.t)
            intersection = newIntersection;
    }

    if (!Number.isFinite(intersection.t)) return scene.ambient;

    var lighting = colorAtIntersection(scene, intersection, ray);

    var reflectedRay = {
        point: intersection.pointAtTime,
        vector: vec.reflect(ray.vector, intersection.normal)
    };

    var reflection = traceRay(scene, reflectedRay, ++depth, intersection.shape);

    return vec.add(lighting, vec.multiply(intersection.shape.specular, reflection));
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
        var pointToLight = vec.normalize(vec.subtract(light.position, intersection.pointAtTime));

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
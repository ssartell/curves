var vec = require('./vector');

function slightlyRough(normal, point) {
    return vec.normalize([
        normal[0] + (Math.random() - .5) * .05,
        normal[1] + (Math.random() - .5) * .05,
        normal[2] + (Math.random() - .5) * .05,
    ]);
}

function veryRough(normal, point) {
    return vec.normalize([
        normal[0] + (Math.random() - .5) * .2,
        normal[1] + (Math.random() - .5) * .2,
        normal[2] + (Math.random() - .5) * .2,
    ]);
}

function smooth(normal, point) {
    return normal;
}

module.exports = {
    slightlyRough,
    veryRough,
    smooth
};
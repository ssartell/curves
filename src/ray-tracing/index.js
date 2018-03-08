var raytracer = require('./raytracer');
var scene = require('./scene');

var canvas = document.getElementById('c');
var width = canvas.clientWidth;
var height = canvas.clientHeight;
canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext('2d');
ctx.webkitImageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

render(scene);

var textarea = document.getElementById('json');
textarea.value = JSON.stringify(scene, null, 3);

var renderButton = document.getElementById('render');
renderButton.onclick = function () {
    var scene = JSON.parse(textarea.value);
    render(scene);
};

function render(scene) {
    var img = raytracer.renderScene(scene, width, height);
    for (var y = 0; y < height; y++) {
        setTimeout(function (y) {
            var imageData = ctx.createImageData(width, 1);
            for (var x = 0; x < width; x++) {
                var color = img.next().value;
                i = x * 4;
                imageData.data[i + 0] = color[0];
                imageData.data[i + 1] = color[1];
                imageData.data[i + 2] = color[2];
                imageData.data[i + 3] = 255;
            }
            ctx.putImageData(imageData, 0, y);
        }.bind(null, y), 0);
    }
}
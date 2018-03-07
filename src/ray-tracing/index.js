var raytracer = require('./raytracer');
var scene = require('./scene');

render(scene);

var textarea = document.getElementById('json');
textarea.value = JSON.stringify(scene, null, 3);

var renderButton = document.getElementById('render');
renderButton.onclick = function() {
    var scene = JSON.parse(textarea.value);
    render(scene);
};

function render(scene) {
    var canvas = document.getElementById('c');
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext('2d');
    var data = ctx.getImageData(0, 0, width, height);
    ctx.webkitImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    var img = raytracer.renderScene(scene, width, height);

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
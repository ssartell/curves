var d3 = require('d3');
var d3c = require('d3-contour');
var R = require('ramda');

var waves = xy => Math.sin(xy[0] / 4) + Math.cos(xy[1] / 4);
var random = xy => Math.random() * 10;
render(createGrid(10, 10, random), 10); // art

function render(grid, thresholds) {
    var arr = R.flatten(grid);
    var n = grid.length;
    var m = grid[0].length;
    
    var element = document.getElementsByTagName("svg")[0];
    var svg = d3.select('svg');
    var width = +element.clientWidth;
    var height = +element.clientHeight;

    var rainbow = d3.scaleSequential()
        .domain(d3.extent(arr))
        .interpolator(d3.interpolateRainbow);

    var contours = d3c.contours()
        .smooth(false)
        .size([n, m])
        .thresholds(thresholds);

    svg.selectAll("path")
        .data(contours(arr))
        .enter().append("path")
        .attr("d", d3.geoPath(d3.geoIdentity().scale(height / m)))
        .attr("fill", function (d) { return rainbow(d.value); });
}

function createGrid(n, m, f) {
    var arr = R.range(0, n).map(x => R.range(0, m));
    console.log(arr);
    return arr.map((_, x) => arr.map((_, y) => f([x, y])));
}
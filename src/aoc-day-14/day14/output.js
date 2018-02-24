var R = require('ramda');
var ansi = require('ansi'),
    cursor = ansi(process.stdout);

var printBlocks = blocks => {
    cursor.flush();

    for(var y = 0; y < blocks[0].length; y++) {
        var row = '';
        for(var x = 0; x < blocks.length; x++) {
            row += blocks[x][y] === 1 ? '\u2592\u2592' : '  ';
        }
        cursor.brightWhite().goto(1, y + 1).write(row);
    }
    cursor.reset();
}

var colors = [
   'blue',
   'cyan',
   'green',
   'magenta',
   'red',
   'yellow',
   'grey',
   'brightBlack',
   'brightRed',
   'brightGreen',
   'brightYellow',
   'brightBlue',
   'brightMagenta',
   'brightCyan'
];
var printPos = (pos, region) => {
    var color = colors[region % colors.length];
    if (region === 0) {
        color = 'black';
    }
    cursor[color]().goto(pos.x * 2 + 1, pos.y + 1).write('\u2592\u2592');
    cursor.reset();
}

var sleep = function(time) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
};

var gotoEnd = blocks => {
    colors.push('end');
    cursor.brightWhite().goto(1, blocks[0].length + 1);
}

module.exports = {
    printBlocks,
    printPos,
    sleep,
    gotoEnd
};
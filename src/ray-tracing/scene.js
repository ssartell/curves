module.exports = {
    settings: {
        reflectionDepth: 3,
        antiAlias: true,
        shadows: true,
    },
    camera: {
        position: [0, .5, 0],
        lookAt: [0, 0, 1],
        fov: 90,
    },
    shapes: [
        {
            type: 'plane',
            point: [0, -1.5, 10],
            normal: [0, 1, 0],
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
            surface: 'slightlyRough'
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
            surface: 'smooth'
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
            surface: 'veryRough'
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
            surface: 'slightlyRough'
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
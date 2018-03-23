module.exports = {
    settings: {
        reflectionDepth: 3,
        antiAlias: true,
        shadows: true,
        depthOfField: {
            enabled: false,
            radius: .15,
            samples: 4
        },
        stereoscopic: {
            enabled: false,
            radius: .5,
            vr: true
        },
    },
    camera: {
        position: [-0.5, 1.5, 0],
        lookAt: [1, .5, 3],
        fov: 90,
    },
    shapes: [
        // top
        {
            type: 'polygon',
            vertices: [
                [.5, 1, 2],
                [.5, 1, 1],
                [1.5, 1, 1],
                [1.5, 1, 2],
            ],
            // brass
            ambient: [.33, .22, .03],
            diffuse: [.78, .57, .11],
            specular: [.99, .94, .81],
            exponent: 27.8,
            surface: 'slightlyRough'
        },
        // bottom
        {
            type: 'polygon',
            vertices: [
                [.5, 0, 1],
                [.5, 0, 2],
                [1.5, 0, 2],
                [1.5, 0, 1],
            ],
            // brass
            ambient: [.33, .22, .03],
            diffuse: [.78, .57, .11],
            specular: [.99, .94, .81],
            exponent: 27.8,
            surface: 'slightlyRough'
        },
        // left
        {
            type: 'polygon',
            vertices: [
                [.5, 1, 2],
                [.5, 0, 2],
                [.5, 0, 1],
                [.5, 1, 1]
            ],
            // brass
            ambient: [.33, .22, .03],
            diffuse: [.78, .57, .11],
            specular: [.99, .94, .81],
            exponent: 27.8,
            surface: 'slightlyRough'
        },
        // right
        {
            type: 'polygon',
            vertices: [
                [1.5, 1, 2],
                [1.5, 0, 2],
                [1.5, 0, 1],
                [1.5, 1, 1]
            ],
            // brass
            ambient: [.33, .22, .03],
            diffuse: [.78, .57, .11],
            specular: [.99, .94, .81],
            exponent: 27.8,
            surface: 'slightlyRough'
        },
        // front
        {
            type: 'polygon',
            vertices: [
                [.5, 1, 1],
                [.5, 0, 1],
                [1.5, 0, 1],
                [1.5, 1, 1]
            ],
            // brass
            ambient: [.33, .22, .03],
            diffuse: [.78, .57, .11],
            specular: [.99, .94, .81],
            exponent: 27.8,
            surface: 'slightlyRough'
        },
        // back
        {
            type: 'polygon',
            vertices: [
                [.5, 1, 2],
                [.5, 0, 2],
                [1.5, 0, 2],
                [1.5, 1, 2]
            ],
            // brass
            ambient: [.33, .22, .03],
            diffuse: [.78, .57, .11],
            specular: [.99, .94, .81],
            exponent: 27.8,
            surface: 'slightlyRough'
        },

        {
            type: 'plane',
            point: [0, -1.5, 10],
            normal: [0, 1, 0],
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
            // copper
            ambient: [.19, .07, .02],
            diffuse: [.7, .27, .08],
            specular: [.25, .13, .08],
            exponent: 12.8,
            surface: 'veryRough'
        },
        // {
        //     type: 'sphere',
        //     center: [.5, -.35, 1.5],
        //     radius: .5,
        //     // silver
        //     ambient: [.19, .19, .19],
        //     diffuse: [.51, .51, .51],
        //     specular: [.51, .51, .51],
        //     exponent: 51.2,
        //     surface: 'slightlyRough'
        // }
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
const path = require('path');
module.exports = {
    mode: 'production',
    entry: ['./src/encrypt.js'],
    output: {
        filename: 'encrypt.js',
        path: path.resolve(__dirname, 'lib')
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        "presets": [
                            [
                                "@babel/preset-env",
                                {
                                    "useBuiltIns": "entry",
                                    "targets": {
                                        "ie": "9"
                                    }
                                }
                            ]
                        ],
                        "plugins": [
                            ["@babel/plugin-transform-runtime", {
                                "corejs": 2,
                                "helpers": true,
                                "regenerator": true,
                                "useESModules": false
                            }]
                        ]
                    }
                }
            }
        ]
    }
};
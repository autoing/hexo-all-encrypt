const path = require('path');
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = {
    mode: 'development',
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
        }]
    },
    plugins: [
        new FileManagerPlugin({
            onEnd: {
                copy: [{
                        source: path.resolve(__dirname, 'lib/encrypt.js'),
                        destination: path.resolve(__dirname, 'test/node_modules/hexo-all-encrypt/lib')
                    },
                    {
                        source: path.resolve(__dirname, 'index.js'),
                        destination: path.resolve(__dirname, 'test/node_modules/hexo-all-encrypt/')
                    },
                ],
            }
        })
    ]

};
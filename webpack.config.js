/**
 * Created by ТерземанЕА on 27.04.2017.
 */
var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: ['./client/app.js'],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    plugins: [new CopyWebpackPlugin([
        { from: 'client/index.html' }])
    ]
};

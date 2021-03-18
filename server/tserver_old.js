const express = require('express');
const webpack = require('webpack');

const config = require('../webpack.config');
const open = require('open');

let history = require('connect-history-api-fallback');


/* eslint-disable no-console */
const port = 4000;
const app = express();
const compiler = webpack(config);

app.use(history());

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));



app.listen(port, function (err) {
    if (err) {
        console.log(err);
    } else {
        open(`http://localhost:${port}/dashboard`);
    }
});
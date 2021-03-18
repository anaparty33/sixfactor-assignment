const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const CONSTANTS = {
    SRC: path.join(__dirname, 'src'),
    APP_ENTRY: path.join(__dirname, 'src/index'),
    STYLES: path.join(__dirname, 'src/styles'),
    OUTPUT_PATH: path.join(__dirname, '../src/main/resources/static/build'),
    MOCK_SRC: path.join(__dirname, 'src/mock'),
    MOCK_PATH: path.join(__dirname, 'resources/static/mock'),
    INDEX_TPL: path.join(__dirname, 'src/index.tpl.html'),
    ASSETS: path.join(__dirname, 'src/assets'),
    FAVICON: path.join(__dirname, 'favicon.ico'),
    ENV_PRODUCTION: 'production'
};

let mode,
    publicPath,
    devtool,
    baseUrl = '',
    entry = {
        app: [CONSTANTS.APP_ENTRY]

    },
    plugins = [
        new CleanWebpackPlugin({
            dry: false,
            verbose: true,
            // cleanStaleWebpackAssets: true, // this can be removed as it is the default
            protectWebpackAssets: false, // I do not see you removing non-webpack assets, not sure why this is set to false.
            // cleanOnceBeforeBuildPatterns: ['**/*'], // this can be removed as it is the default
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({
            filename: 'styles.[hash].css',
            allchunks: true
        }),
        new HtmlWebpackPlugin({
            template: CONSTANTS.INDEX_TPL,
            inject: 'body'
        }),
        new CopyWebpackPlugin([
            { from: CONSTANTS.ASSETS, to: CONSTANTS.OUTPUT_PATH },
            { from: CONSTANTS.FAVICON, to: CONSTANTS.OUTPUT_PATH }
        ]),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ];

if (process.env.NODE_ENV === 'production') {
    mode = 'production';
    publicPath = '/build/';
} else {
    mode = 'development';
    publicPath = '/';
    devtool = 'inline-source-map';
    // baseUrl = 'http://localhost:3000';
    //note that it reloads the page if hot module reloading fails
    entry.app.push('webpack-hot-middleware/client?reload=true');
    plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new BundleAnalyzerPlugin({
            openAnalyzer: false,
            analyzerMode: 'static',
            reportFilename: 'bundleReport.html'
        }),
        new CopyWebpackPlugin([
            { from: CONSTANTS.MOCK_SRC, to: CONSTANTS.MOCK_PATH }
        ])
    );
}

plugins.push(
    new webpack.DefinePlugin({
        'BASE_URL': JSON.stringify(baseUrl)
    })
);

module.exports = {
    mode,
    devtool,
    entry,
    target: 'web',
    output: {
        path: CONSTANTS.OUTPUT_PATH,
        publicPath,
        filename: '[name].[hash].bundle.js',
    },
    devServer: {
        contentBase: CONSTANTS.OUTPUT_PATH,
        historyApiFallback: true
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                chunks: "all",
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all",
                    filename: '[name].[hash].bundle.js',
                }
            }
        }
    },
    plugins,
    module: {
        rules: [
            { test: /\.js$/, include: CONSTANTS.SRC, use: ['babel-loader'] },
            { test: /\.css$/, use: ['style-loader', 'css-loader'] },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]'
                            },
                            // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                            // To fix the relative path issue when using css class from different scss files in compose
                            importLoaders: 2
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'fonts/'
                        }
                    }
                ]
            },
            {
                test: /\.(svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'images/'
                        }
                    }
                ]
            },
            
            { //This rule is used to import images and fonts in files
                test: /\.(png)$/, loader: 'url-loader?limit=9000'
            }
        ]
    },
    resolve: {
        alias: {
            assets: path.resolve(__dirname, 'src/assets'),
            components: path.resolve(__dirname, 'src/components'),
            contexts: path.resolve(__dirname, 'src/contexts'),
            base: path.resolve(__dirname, 'src/components/base'),
            header: path.resolve(__dirname, 'src/components/header'),
            views: path.resolve(__dirname, 'src/components/views'),
            constants: path.resolve(__dirname, 'src/constants'),
            mock: path.resolve(__dirname, 'src/mock'),
            services: path.resolve(__dirname, 'src/services'),
            utils: path.resolve(__dirname, 'src/utils'),
            styles: path.resolve(__dirname, 'src/styles'),
            
        },
        extensions: ['.js', '.jsx']
    }
};
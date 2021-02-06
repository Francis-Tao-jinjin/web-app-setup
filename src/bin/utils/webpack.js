const path = require('path');
const ROOT = path.join(__dirname, '../../..');
const SRC = path.join(ROOT, 'src');
const ASSETS = path.join(ROOT, 'assets');
const STATICS = path.join(ASSETS, 'build');
const BUILD = path.join(ROOT, 'build');
const websiteTsConfig = path.join(ROOT, 'client.tsconfig.json');

const tailwindcss = require('tailwindcss');
const webpack = require('webpack');
const autoPrefixerPlugin = require('autoprefixer');
const cssValues = require('postcss-modules-values');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const NormalModuleWebpackReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const logger = require('./js-logger');

// Clean up huge amount of log information from mini-css-extract-plugin
// adapted from this issue: https://github.com/webpack-contrib/mini-css-extract-plugin/issues/168
const CleanUpStatsPlugin = {
    shouldPickStatChild: function (child) {
        return child.name.indexOf('mini-css-extract-plugin') !== 0;
    },
    apply: function (compiler) {
        compiler.hooks.done.tap('CleanUpStatsPlugin', (stats) => {
            const children = stats.compilation.children;
            if (Array.isArray(children)) {
                stats.compilation.children = children
                .filter((child) => this.shouldPickStatChild(child));
            }
        });
    }
}

function getWebpackConfig(spec) {
    const { env } = spec;

    const isProd = env === 'production';
    const isDev = !isProd;
    const shortEnv = isProd ? 'prod' : 'dev';

    const envOptions = isProd ? {
        mode: 'production',
    } : {
        mode: 'development',
        devtool: 'inline-source-map',
    };

    const plugins = [
        new MiniCssExtractPlugin({
            filename: `bundle.[name].${shortEnv}.css`,
        }),
        CleanUpStatsPlugin,
        new webpack.IgnorePlugin({ resourceRegExp: /^sharp/ }),
        new webpack.IgnorePlugin({ resourceRegExp: /^child_process/}),
    ];

    const config = {
        ...envOptions,
         // The base directory, an absolute path, for resolving entry points and loaders from configuration.
        context: ROOT,
        entry: spec.entryPoints,
        plugins,
        performance: { hints: false },
        // node: {
        //     fs: false,
        // },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: websiteTsConfig,
                            },
                        },
                    ],
                    include: SRC,
                },
                {
                    test: /\.css$/,
                    include: SRC,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: '../',
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: isDev
                                        ? '[path][name]__[local]--[hash:base64:5]'
                                        : '[hash:base64]',
                                },
                                importLoaders: 1,
                                url: false,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                ident: 'postcss',
                                plugins: [
                                    tailwindcss('./tailwind.config.js'),
                                    cssValues,
                                    autoPrefixerPlugin,
                                ],
                            },
                        },
                    ],
                    exclude: /(node_modules\/react-responsive-carousel)/,
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                    include: /(node_modules\/react-responsive-carousel)/
                },
            ],
        },
        resolve: {
            extensions: [
                '.tsx',
                '.ts',
                '.js',
            ],
        },
        output: {
            filename: `bundle.[name].${shortEnv}.js`,
            path: isDev ? BUILD : STATICS,
        },
        stats: {
            excludeModules: 'mini-css-extract-plugin',
        }
    };

    return config;
}

function logWebpackStats(stats) {
    const hasErr = stats.hasErrors();
    const hasWarn = stats.hasWarnings();
    logger.log(stats.toString({
        assets: false,
        children: hasErr || hasWarn, // must be true to show error/warn locations
        // children: false,
        chunks: false,
        colors: true,
        entrypoints: false,
        errors: true,
        errorDetails: true,
        modules: true,
        performance: false,
        warnings: true,
        excludeModules: 'mini-css-extract-plugin',
    }));
    if (hasWarn) {
        logger.error('Compilation warnings in webpack build');
    }
    if (hasErr) {
        logger.error('COMPILATION ERRORS IN WEBPACK BUILD');
    } else {
        logger.log(`webpack bundled!`);
    }
}

async function buildWebpack(specs) {
    return new Promise((resolve, reject) => {
        const compiler = webpack(specs.map(getWebpackConfig));
        compiler.run((err, stats) => {
            if (err) {
                logger.error(`web pack error: ${err.message} ${err.stack}`);
                logger.error(err);
                reject(err);
                return;
            }
            if (stats.hasErrors()) {
                reject();
                return;
            }
            resolve();
        });
    });
}

async function watchWebpack(specs) {
    return new Promise((resolve, reject) => {
        const compiler = webpack(specs.map(getWebpackConfig));
        compiler.hooks.watchRun.tap('WatchReportChangePlugin', () => {
            logger.log(`webpack detected change...`);
        });
        compiler.hooks.invalid.tap('WatchReportChangePlugin', (fileName) => {
            logger.log(`webpack change detected to ${fileName}`);
        });
        const opts = {
            aggregateTimeout: 1000,
            poll: undefined,
            ignored: [],
        };
        let hasCompleted = false;
        compiler.watch(opts, (err, stats) => {
            logger.log('>>>> compiler.watch', err);
            if (err) {
                logger.error(`web pack error: ${err.message} ${err.stack}`);
                if (!hasCompleted) {
                    reject(err);
                    hasCompleted = true;
                }
                return;
            }
            logWebpackStats(stats);
            if (!hasCompleted) {
                resolve();  
                hasCompleted = true;
            }
        });
    });
}

function analyzeWebpack (specs) {
    return new Promise((resolve, reject) => {
        const configs = specs.map(getWebpackConfig);
        configs.forEach((config) => {
            config.plugins.push(
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    openAnalyzer: true,
                }),
            );
        })
        webpack(configs, (err, stats) => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

module.exports = {
    buildWebpack,
    watchWebpack,
    analyzeWebpack,
};
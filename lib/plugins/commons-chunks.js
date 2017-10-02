/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const webpack = require('webpack');

/**
 * @param {Array} plugins
 * @param {WebpackConfig} webpackConfig
 * @return {void}
 */
module.exports = function(plugins, webpackConfig) {
    if (!webpackConfig.commonsChunks.length) {
        return;
    }

    for (const chunk of webpackConfig.commonsChunks) {
        const pluginOptions = {
            name: chunk.name,
            chunks: [chunk.name],
            minChunks: Infinity,
        };

        chunk.callback.apply(
            pluginOptions,
            [pluginOptions]
        );

        plugins.push(new webpack.optimize.CommonsChunkPlugin(pluginOptions));
    }

    /*
     * Always dump another file - manifest.json that
     * will contain the webpack manifest information.
     * This changes frequently, and without this line,
     * it would be packaged inside the "shared commons entry"
     * file - e.g. vendor.js, which would prevent long-term caching.
     */
    plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity,
    }));
};

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
const PluginPriorities = require('./plugin-priorities');

/** @typedef {import("../WebpackConfig")} WebpackConfig */

/**
 * @param {Array} plugins
 * @param {WebpackConfig} webpackConfig
 * @return {void}
 */
module.exports = function(plugins, webpackConfig) {
    if (Object.keys(webpackConfig.providedVariables).length > 0) {
        plugins.push({
            plugin: new webpack.ProvidePlugin(webpackConfig.providedVariables),
            priority: PluginPriorities.ProvidePlugin
        });
    }
};

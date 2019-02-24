/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

/** @typedef {import("../WebpackConfig")} WebpackConfig */
/** @typedef {import("webpack").RuleSetUseItem} RuleSetUseItem */

module.exports = {
    /**
     * Prepends loaders with MiniCssExtractPlugin.loader
     *
     * @param {WebpackConfig} webpackConfig
     * @param {Array} loaders An array of some style loaders
     * @return {RuleSetUseItem[]}
     */
    prependLoaders(webpackConfig, loaders) {
        return [MiniCssExtractPlugin.loader, ...loaders];
    }
};

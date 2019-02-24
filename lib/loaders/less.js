/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const loaderFeatures = require('../features');
const cssLoader = require('./css');
const applyOptionsCallback = require('../utils/apply-options-callback');

/** @typedef {import("../WebpackConfig")} WebpackConfig */
/** @typedef {import("webpack").RuleSetUseItem} RuleSetUseItem */

module.exports = {
    /**
     * @param {WebpackConfig} webpackConfig
     * @param {boolean} ignorePostCssLoader If true, postcss-loader will never be added
     * @return {RuleSetUseItem[]}
     */
    getLoaders(webpackConfig, ignorePostCssLoader = false) {
        loaderFeatures.ensurePackagesExistAndAreCorrectVersion('less');

        const config = {
            sourceMap: webpackConfig.useSourceMaps
        };

        return [
            ...cssLoader.getLoaders(webpackConfig, ignorePostCssLoader),
            {
                loader: 'less-loader',
                options: applyOptionsCallback(webpackConfig.lessLoaderOptionsCallback, config)
            },
        ];
    }
};

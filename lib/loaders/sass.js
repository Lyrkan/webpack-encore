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
     * @param {Object} sassOptions Options to pass to the loader
     * @return {RuleSetUseItem[]}
     */
    getLoaders(webpackConfig, sassOptions = {}) {
        loaderFeatures.ensurePackagesExistAndAreCorrectVersion('sass');

        const sassLoaders = [...cssLoader.getLoaders(webpackConfig)];
        if (true === webpackConfig.sassOptions.resolveUrlLoader) {
            // responsible for resolving Sass url() paths
            // without this, all url() paths must be relative to the
            // entry file, not the file that contains the url()
            sassLoaders.push({
                loader: 'resolve-url-loader',
                options: {
                    sourceMap: webpackConfig.useSourceMaps
                }
            });
        }

        const config = Object.assign({}, sassOptions, {
            // needed by the resolve-url-loader
            sourceMap: (true === webpackConfig.sassOptions.resolveUrlLoader) || webpackConfig.useSourceMaps
        });

        sassLoaders.push({
            loader: 'sass-loader',
            options: applyOptionsCallback(webpackConfig.sassLoaderOptionsCallback, config)
        });

        return sassLoaders;
    }
};

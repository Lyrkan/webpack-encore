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
const applyOptionsCallback = require('../utils/apply-options-callback');

/** @typedef {import("../WebpackConfig")} WebpackConfig */
/** @typedef {import("webpack").RuleSetUseItem} RuleSetUseItem */

module.exports = {
    /**
     * @param {WebpackConfig} webpackConfig
     * @return {RuleSetUseItem[]} of loaders to use for Vue files
     */
    getLoaders(webpackConfig) {
        loaderFeatures.ensurePackagesExistAndAreCorrectVersion('vue');

        const options = {};

        return [
            {
                loader: 'vue-loader',
                options: applyOptionsCallback(webpackConfig.vueLoaderOptionsCallback, options)
            }
        ];
    }
};

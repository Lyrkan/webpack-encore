/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

class RuntimeConfig {
    constructor() {
        /** @type {null|string} */
        this.command = null;

        /** @type {null|string} */
        this.context = null;

        /** @type {boolean} */
        this.isValidCommand = false;

        /** @type {string} */
        this.environment = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';

        /** @type {boolean} */
        this.useDevServer = false;

        /** @type {null|string} */
        this.devServerUrl = null;

        /** @type {boolean} */
        this.devServerHttps = false;

        /** @type {boolean} */
        this.devServerKeepPublicPath = false;

        /** @type {boolean} */
        this.useHotModuleReplacement = false;

        /** @type {boolean} */
        this.babelRcFileExists = false;

        /** @type {boolean} */
        this.helpRequested = false;

        /** @type {boolean} */
        this.verbose = false;

        /** @type {boolean} */
        this.outputJson = false;

        /** @type {boolean} */
        this.profile = false;
    }
}

module.exports = RuntimeConfig;

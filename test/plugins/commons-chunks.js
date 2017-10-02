/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const expect = require('chai').expect;
const webpack = require('webpack');
const WebpackConfig = require('../../lib/WebpackConfig');
const RuntimeConfig = require('../../lib/config/RuntimeConfig');
const commonsChunksPluginUtil = require('../../lib/plugins/commons-chunks');

function createConfig() {
    const runtimeConfig = new RuntimeConfig();
    runtimeConfig.context = __dirname;
    runtimeConfig.babelRcFileExists = false;

    return new WebpackConfig(runtimeConfig);
}

describe('plugins/commons-chunks', () => {
    it('without any shared entry', () => {
        const config = createConfig();
        const plugins = [];

        commonsChunksPluginUtil(plugins, config);

        expect(plugins.length).to.equal(0);
    });

    it('with a single shared entry', () => {
        const config = createConfig();
        const plugins = [];

        config.createSharedEntry('foo', 'foo.js');

        commonsChunksPluginUtil(plugins, config);

        expect(plugins.length).to.equal(2);

        expect(plugins[0]).to.be.instanceof(webpack.optimize.CommonsChunkPlugin);
        expect(plugins[0].chunkNames).to.deep.equal(['foo']);
        expect(plugins[0].minChunks).to.equal(Infinity);

        expect(plugins[1]).to.be.instanceof(webpack.optimize.CommonsChunkPlugin);
        expect(plugins[1].chunkNames).to.deep.equal(['manifest']);
    });

    it('with a multiple shared entries', () => {
        const config = createConfig();
        const plugins = [];

        config.createSharedEntry('foo', 'foo.js');
        config.createSharedEntry('bar', ['bar.js', 'baz.js']);

        commonsChunksPluginUtil(plugins, config);

        expect(plugins.length).to.equal(3);

        expect(plugins[0]).to.be.instanceof(webpack.optimize.CommonsChunkPlugin);
        expect(plugins[0].chunkNames).to.deep.equal(['foo']);
        expect(plugins[0].minChunks).to.equal(Infinity);

        expect(plugins[1]).to.be.instanceof(webpack.optimize.CommonsChunkPlugin);
        expect(plugins[1].chunkNames).to.deep.equal(['bar']);
        expect(plugins[1].minChunks).to.equal(Infinity);

        expect(plugins[2]).to.be.instanceof(webpack.optimize.CommonsChunkPlugin);
        expect(plugins[2].chunkNames).to.deep.equal(['manifest']);
    });

    it('with options callback', () => {
        const config = createConfig();
        const plugins = [];

        config.createSharedEntry('foo', 'foo.js', (options) => {
            options.minChunks = 1;
        });

        config.createSharedEntry('bar', [], (options) => {
            options.chunks = ['bar', 'baz'];
            options.minChunks = 2;
        });

        commonsChunksPluginUtil(plugins, config);

        expect(plugins.length).to.equal(3);

        expect(plugins[0]).to.be.instanceof(webpack.optimize.CommonsChunkPlugin);
        expect(plugins[0].chunkNames).to.deep.equal(['foo']);
        expect(plugins[0].minChunks).to.equal(1);

        expect(plugins[1]).to.be.instanceof(webpack.optimize.CommonsChunkPlugin);
        expect(plugins[1].chunkNames).to.deep.equal(['bar']);
        expect(plugins[1].selectedChunks).to.deep.equal(['bar', 'baz']);
        expect(plugins[1].minChunks).to.equal(2);

        expect(plugins[2]).to.be.instanceof(webpack.optimize.CommonsChunkPlugin);
        expect(plugins[2].chunkNames).to.deep.equal(['manifest']);
    });
});

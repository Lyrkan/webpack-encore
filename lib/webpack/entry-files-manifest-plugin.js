/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');
const camelcase = require('camelcase');
const sharedEntryTmpName = require('../utils/sharedEntryTmpName');
const copyEntryTmpName = require('../utils/copyEntryTmpName');
const logger = require('../logger');

function getFileExtension(filepath) {
    const parsedPath = new url.URL(filepath, 'http://foo');
    const extension = path.extname(parsedPath.pathname);
    return extension ? extension.slice(1) : '';
}

function getOtherNamedChunkGroups(stats, entrypoints) {
    const publicPath = stats.publicPath || '';
    const temporaryChunks = [sharedEntryTmpName, copyEntryTmpName];

    const otherNamedChunkGroups = Object.keys(stats.namedChunkGroups)
        .filter(groupName => !(groupName in entrypoints) && !temporaryChunks.includes(groupName))
        .reduce((groupMap, groupName) => {
            let assets = stats.namedChunkGroups[groupName].assets;
            if (!Array.isArray(assets)) {
                assets = [assets];
            }

            const groupedAssets = assets
                .map(asset => publicPath && !publicPath.endsWith('/') ? `${publicPath}/${asset}` : publicPath + asset)
                .reduce((assetGroups, asset) => {
                    const assetExtension = camelcase(getFileExtension(asset));
                    const assetGroup = [
                        ...(assetGroups[assetExtension] || []),
                        asset,
                    ];

                    return Object.assign({}, assetGroups, { [assetExtension]: assetGroup });
                }, {});

            return Object.assign({}, groupMap, { [groupName]: groupedAssets });
        }, {});

    return otherNamedChunkGroups;
}


class EntryFilesManifestPlugin {
    apply(compiler) {
        const afterEmit = (compilation, callback) => {
            const stats = compilation.getStats().toJson({
                all: false,
                assets: true,
                outputPath: true,
                publicPath: true,
                chunkGroups: true,
            });

            const entrypointsFilePath = path.join(stats.outputPath, 'entrypoints.json');

            fs.readFile(
                entrypointsFilePath,
                { encoding: 'utf8' },
                (err, data) => {
                    if (err) {
                        logger.warning(`An error occured when reading the entrypoints.json file: ${err}`);
                        callback();
                        return;
                    }

                    let entrypointsFileContent = null;
                    try {
                        entrypointsFileContent = JSON.parse(data);
                    } catch (e) {
                        logger.warning('The entrypoints.json file does not contain valid JSON data');
                        callback();
                        return;
                    }

                    // Add other named chunk groups to the entrypoints
                    const entrypoints = entrypointsFileContent.entrypoints || {};
                    entrypointsFileContent.entrypoints = Object.assign(
                        {},
                        entrypoints,
                        getOtherNamedChunkGroups(stats, entrypoints)
                    );

                    fs.writeFile(
                        entrypointsFilePath,
                        JSON.stringify(entrypointsFileContent, null, 2),
                        (err) => {
                            if (err) {
                                logger.warning(`An error occured while saving the entrypoints.json file: ${err}`);
                            }

                            callback();
                        }
                    );
                }
            );
        };

        compiler.hooks.afterEmit.tapAsync(
            { name: 'EntryFilesManifestPlugin' },
            afterEmit
        );
    }
}

module.exports = EntryFilesManifestPlugin;

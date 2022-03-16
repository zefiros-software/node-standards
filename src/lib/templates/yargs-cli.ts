import type { ProjectTemplate } from './types'

import { devDependencies, repositoryUrl, rootDirectory } from '../constants'
import { PackageType } from '../types'

export const YargsCliTemplate: ProjectTemplate = {
    type: PackageType.YargsCli,
    repositoryUrl,
    scripts: undefined,
    files: ['bin', '.dist', 'package.json'],
    dependencies: {
        tslib: undefined,
    },
    devDependencies: {
        '@types/source-map-support': devDependencies['@types/source-map-support'],
        'source-map-support': devDependencies['source-map-support'],
        tslib: devDependencies['tslib'],
        yargs: devDependencies['yargs'],
    },
    definition: {
        main: '.dist/main.js',
        types: '.dist/index.d.ts',
    },
    links: [PackageType.CommonTypescript],
    roots: [rootDirectory],
}

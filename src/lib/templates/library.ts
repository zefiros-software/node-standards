import type { ProjectTemplate } from './types'

import { repositoryUrl, rootDirectory } from '../constants'
import { PackageType } from '../types'

export const LibraryTemplate: ProjectTemplate = {
    type: PackageType.Library,
    repositoryUrl,
    scripts: undefined,
    files: ['.dist', 'package.json'],
    dependencies: undefined,
    devDependencies: undefined,
    definition: {
        main: '.dist/main.js',
        types: '.dist/index.d.ts',
    },
    links: [PackageType.CommonTypescript],
    roots: [rootDirectory],
}

import { rootDirectory } from './config'
import { PackageType } from './types'

import { peerDependencies, devDependencies, dependencies, version, repository } from '../../package.json'

export { peerDependencies, devDependencies, dependencies, version, repository }

export const scripts: Record<string, Record<string, string | undefined> | undefined> = {
    [PackageType.Common]: {
        ['build']: 'npx webpack --version && npx webpack',
        ['check:cost']: 'npx cost-of-modules --no-install --include-dev',
        ['check:coverage']: 'npx jest --collectCoverage=true',
        ['check:full']: 'npm run lint && npm run check:types && npm run check:coverage && npm run build && npm run check:project',
        ['check:project']: 'npx node-standards lint',
        ['check:types']: 'npx tsc -p tsconfig.json',
        ['fix']: 'npm run lint -- --fix',
        ['format']: 'npx prettier "**/*.{ts,js,json,yml,yaml}" --ignore-path .gitignore --write',
        ['lint:full']: 'bash -c "FULL_LINT=true npm run lint"',
        ['lint']: 'npx eslint "{src,test,typing}/**/*.{ts,js}" --no-eslintrc --cache -c .eslintrc.js --ignore-path .gitignore',
        ['package']: 'rm -rf .dist && npm run build',
        ['release:dry']: undefined,
        ['release']: undefined,
        ['coverage']: undefined,
        ['test']: 'npx jest',
    },
    [PackageType.Library]: {},
    [PackageType.YargsCli]: {},
}

export const files: Record<string, string[] | undefined> = {
    [PackageType.Library]: ['.dist', 'package.json'],
    [PackageType.YargsCli]: ['bin', '.dist', 'package.json'],
}

export const packageDependencies: Record<string, Record<string, string | undefined> | undefined> = {
    [PackageType.Common]: {
        tslib: devDependencies['tslib'],
    },
    [PackageType.Library]: {},
    [PackageType.YargsCli]: {
        tslib: undefined,
    },
}

export const packageDevDependencies: Record<string, Record<string, string | undefined> | undefined> = {
    [PackageType.Common]: {
        ...peerDependencies,
    },
    [PackageType.Library]: {},
    [PackageType.YargsCli]: {
        '@types/source-map-support': devDependencies['@types/source-map-support'],
        'source-map-support': devDependencies['source-map-support'],
        tslib: devDependencies['tslib'],
        yargs: devDependencies['yargs'],
    },
}

export const packageDefinition: Record<string, Record<string, string | undefined> | undefined> = {
    [PackageType.Common]: {
        node: '>=14',
    },
    [PackageType.Library]: {
        main: '.dist/main.js',
        types: '.dist/index.d.ts',
    },
    [PackageType.YargsCli]: {
        main: '.dist/main.js',
        types: '.dist/index.d.ts',
    },
}

export const links: Record<string, string[] | undefined> = {
    [PackageType.Library]: [PackageType.Common],
    [PackageType.YargsCli]: [PackageType.Common],
}

export const roots: Record<string, string[] | undefined> = {
    [PackageType.Common]: [rootDirectory],
    [PackageType.Library]: [rootDirectory],
    [PackageType.YargsCli]: [rootDirectory],
}

import type { PackageType } from './types'

import findRoot from 'find-root'

import fs from 'fs'

export let configurationKey = 'node-standards'

export interface NpmDefaultsConfiguration {
    type: PackageType
    template?: {
        exclude?: string[]
        ignore?: {
            files?: boolean
            dependencies?: boolean
            devDependencies?: boolean
            script?: boolean
            packageDefinition?: boolean
        }
    }
}

export const packagejson = {
    ...(fs.existsSync(`${process.cwd()}/package.json`)
        ? JSON.parse(fs.readFileSync(`${process.cwd()}/package.json`).toString())
        : {}),
} as Record<string, unknown> & {
    version: string
    scripts: Record<string, string | undefined> | undefined
    dependencies: Record<string, string | undefined> | undefined
    devDependencies: Record<string, string | undefined> | undefined
    files: string[] | undefined
    ['node-standards']: NpmDefaultsConfiguration | undefined
}

export let config: typeof packagejson['node-standards'] | undefined = packagejson[
    configurationKey
] as typeof packagejson['node-standards']

export function reloadConfiguration(): void {
    config = packagejson[configurationKey] as typeof config
}

export function setConfigurationKey(key: string): void {
    configurationKey = key
}

export const rootDirectory = findRoot(__dirname)

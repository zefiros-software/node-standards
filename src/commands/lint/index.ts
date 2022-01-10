import { getAllFiles } from '../../common'
import { config, packagejson, reloadConfiguration, rootDirectory, configurationKey } from '../../lib/config'
import {
    dependencies,
    files,
    links,
    packageDefinition,
    packageDependencies,
    packageDevDependencies,
    roots,
    scripts,
} from '../../lib/constants'
import { PackageType } from '../../lib/types'

import LineDiff from 'line-diff'
import vdiff from 'variable-diff'
import type { Argv } from 'yargs'

import fs from 'fs'
import path from 'path'

export interface LintOptions {
    dependencies: typeof packageDependencies
    devDependencies: typeof packageDevDependencies
    scripts: typeof scripts
    files: typeof files
    packageDefinition: typeof packageDefinition
    links: typeof links
    roots: typeof roots
    fix: boolean
}

interface LintState {
    options: LintOptions
    shouldFail: boolean
}

export function lintTemplate(state: LintState): void {
    if (!config) {
        return
    }
    const targets: Record<string, () => undefined | void> = {}

    if (config.type !== PackageType.Common) {
        for (const root of getRoot(state.options, config.type)) {
            const templateRoot = `${root}/templates/${config.type}/`
            if (!fs.existsSync(templateRoot)) {
                continue
            }
            for (const file of getAllFiles(templateRoot)) {
                const relFile = path.relative(templateRoot, file).replace(/\\/g, '/')
                if (targets[relFile] === undefined && !config.template?.exclude?.includes(relFile)) {
                    targets[relFile] = () => lintFile(state, `${templateRoot}${relFile}`, relFile)
                }
            }
        }
    }

    for (const other of getLinks(state.options)) {
        for (const root of getRoot(state.options, other)) {
            const otherRoot = `${root}/templates/${other}/`
            if (!fs.existsSync(otherRoot)) {
                continue
            }
            for (const file of getAllFiles(otherRoot)) {
                const relFile = path.relative(otherRoot, file).replace(/\\/g, '/')
                if (targets[relFile] === undefined && !config.template?.exclude?.includes(relFile)) {
                    targets[relFile] = () => lintFile(state, `${otherRoot}${relFile}`, relFile)
                }
            }
        }
    }

    for (const target of Object.values(targets)) {
        target()
    }
}

export function lintFile(state: LintState, from: string, target: string): void {
    const oldContent = fs.existsSync(target) ? fs.readFileSync(target, 'utf-8') : undefined
    const newContent = fs.readFileSync(from, 'utf-8')
    const isDifferent = oldContent !== newContent
    if (isDifferent) {
        if (oldContent !== undefined) {
            console.warn(`[${target}]:\n${new LineDiff(oldContent, newContent).toString()}`)
        } else {
            console.warn(`[${target}]: file not found`)
        }
        fail(state)

        if (state.options.fix) {
            console.log(`Writing ${target}`)
            const dir = path.dirname(target)
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir)
            }
            fs.writeFileSync(target, newContent)
        }
    }
}

export function lintPackage(state: LintState): void {
    const json = JSON.stringify(packagejson, null, 2)
    lintConfiguration(state)
    linDefinition(state)
    lintScripts(state)
    lintPackageFiles(state)
    lintDependencies(state)
    lintDevDependencies(state)

    const fixed = JSON.stringify(packagejson, null, 2)
    if (state.options.fix && json !== fixed) {
        fs.writeFileSync(`${process.cwd()}/package.json`, fixed)
        console.log('fixed entries')
    }
}

export function lintConfiguration(state: LintState): void {
    const json = JSON.stringify(packagejson[configurationKey] ?? {})
    if (packagejson[configurationKey] === undefined) {
        packagejson[configurationKey] = {
            type: PackageType.Library,
        }
    }
    if (JSON.stringify(packagejson[configurationKey]) !== json) {
        console.warn(
            `[package.json>${configurationKey}] missing or outdated configuration:\n${
                vdiff(JSON.parse(json), packagejson[configurationKey]).text
            }`
        )

        fail(state)
    }
    reloadConfiguration()
}

export function lintScripts(state: LintState): void {
    if (config?.template?.ignore?.script) {
        return
    }
    if (!packagejson.scripts) {
        packagejson.scripts = {}
    }
    const json = JSON.stringify(packagejson.scripts)
    for (const other of config?.type !== undefined ? state.options.links[config.type] ?? [] : []) {
        const stateScripts = state.options.scripts[other]
        if (stateScripts) {
            for (const [entry, value] of Object.entries(stateScripts)) {
                packagejson.scripts[entry] = value
            }
        }
    }
    for (const [entry, value] of Object.entries(config ? state.options.scripts[config.type] ?? {} : {})) {
        packagejson.scripts[entry] = value
    }
    packagejson.scripts = Object.fromEntries(Object.entries(packagejson.scripts).sort(([a], [z]) => a.localeCompare(z)))
    if (JSON.stringify(packagejson.scripts) !== json) {
        console.warn(
            `[package.json>scripts] missing or outdated script entries found:\n${
                vdiff(JSON.parse(json), packagejson.scripts).text
            }`
        )

        fail(state)
    }
}
export function lintPackageFiles(state: LintState): void {
    if (config?.template?.ignore?.files) {
        return
    }

    if (!packagejson.files) {
        packagejson.files = []
    }

    const json = JSON.stringify(packagejson.files)

    packagejson.files = config?.type !== undefined ? state.options.files[config.type] ?? [] : []
    if (JSON.stringify(packagejson.files) !== json) {
        console.warn(
            `[package.json>files] missing or outdated files entries found:\n${vdiff(JSON.parse(json), packagejson.files).text}`
        )

        fail(state)
    }
}

export function lintDependencies(state: LintState): void {
    if (config?.template?.ignore?.dependencies) {
        return
    }
    if (!packagejson.dependencies) {
        packagejson.dependencies = {}
    }
    const json = JSON.stringify(packagejson.dependencies)
    for (const other of config?.type !== undefined ? state.options.links[config.type] ?? [] : []) {
        const stateDependencies = state.options.dependencies[other]
        if (stateDependencies) {
            for (const [entry, value] of Object.entries(stateDependencies)) {
                packagejson.dependencies[entry] = value
            }
        }
    }
    for (const [entry, value] of Object.entries(config ? state.options.dependencies[config.type] ?? {} : {})) {
        packagejson.dependencies[entry] = value
    }
    if (JSON.stringify(packagejson.dependencies) !== json) {
        console.warn(
            `[package.json>dependencies] missing or outdated script entries found:\n${
                vdiff(JSON.parse(json), packagejson.dependencies).text
            }`
        )

        fail(state)
    }
}

export function lintDevDependencies(state: LintState): void {
    if (config?.template?.ignore?.devDependencies) {
        return
    }
    if (!packagejson.devDependencies) {
        packagejson.devDependencies = {}
    }
    const json = JSON.stringify(packagejson.devDependencies)
    for (const other of config?.type !== undefined ? state.options.links[config.type] ?? [] : []) {
        const devDependencies = state.options.devDependencies[other]
        if (devDependencies) {
            for (const [entry, value] of Object.entries(devDependencies)) {
                packagejson.devDependencies[entry] = value
            }
        }
    }
    for (const [entry, value] of Object.entries(config ? state.options.devDependencies[config.type] ?? {} : {})) {
        packagejson.devDependencies[entry] = value
    }
    for (const entry in dependencies ?? {}) {
        delete packagejson.devDependencies[entry]
    }
    if (JSON.stringify(packagejson.devDependencies) !== json) {
        console.warn(
            `[package.json>devDependencies] missing or outdated script entries found:\n${
                vdiff(JSON.parse(json), packagejson.devDependencies).text
            }`
        )

        fail(state)
    }
}

export function linDefinition(state: LintState): void {
    if (config?.template?.ignore?.packageDefinition) {
        return
    }

    const json = JSON.stringify(packagejson)
    for (const [entry, value] of Object.entries(config ? state.options.packageDefinition[config.type] ?? {} : {})) {
        packagejson[entry] = value
    }
    if (JSON.stringify(packagejson) !== json) {
        console.warn(
            `[package.json>${configurationKey}] missing or outdated script entries found:\n${
                vdiff(JSON.parse(json), packagejson).text
            }`
        )

        fail(state)
    }
}

export function fail(state: LintState): void {
    if (!state.options.fix) {
        state.shouldFail = true
    }
}

export function getRoot(options: LintOptions, type: string): readonly string[] {
    return options.roots[type] ?? [rootDirectory]
}

export function getLinks(options: LintOptions): readonly string[] {
    return config?.type !== undefined ? options.links[config.type] ?? [] : []
}

export function lintDirectory(options: Partial<LintOptions> = {}): void {
    const state: LintState = {
        options: {
            packageDefinition,
            devDependencies: packageDevDependencies,
            dependencies: packageDependencies,
            scripts,
            links,
            roots,
            files,
            fix: false,
            ...options,
        },
        shouldFail: false,
    }

    lintPackage(state)
    lintTemplate(state)

    if (state.shouldFail) {
        throw new Error('Found errors in the project')
    }
}

export function builder(yargs: Argv): Argv<{ fix: boolean }> {
    return yargs.option('fix', {
        describe: 'try to fix the errors',
        type: 'boolean',
        default: false,
    })
}

export async function handler(argv: ReturnType<typeof builder>['argv']): Promise<void> {
    const { fix } = await argv
    lintDirectory({ fix })
}

export default {
    command: 'lint',
    describe: 'lint the project configuration',
    builder,
    handler,
}

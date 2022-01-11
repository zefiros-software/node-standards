import { gitignore, spawn } from '../../common'
import { rootDirectory } from '../../lib/config'
import { repository, version } from '../../lib/constants'
import { PackageType } from '../../lib/types'

import AdmZip from 'adm-zip'
import glob from 'picomatch'
import type { Argv } from 'yargs'

import fs, { readFileSync, rmSync } from 'fs'
import type { IncomingHttpHeaders } from 'http'
import https from 'https'
import { tmpdir } from 'os'
import path from 'path'
import { promisify } from 'util'

export const projectRoots: Record<string, string> = {
    [PackageType.Library]: rootDirectory,
    [PackageType.YargsCli]: rootDirectory,
}

function httpsGet(url: string): Promise<{ content: Buffer; headers: IncomingHttpHeaders }> {
    return new Promise<{ content: Buffer; headers: IncomingHttpHeaders }>((resolve, reject) => {
        const req = https.get(url, (response): void => {
            void (async () => {
                const chunks: Buffer[] = []
                try {
                    for await (const chunk of response[Symbol.asyncIterator]()) {
                        chunks.push(Buffer.from(chunk as WithImplicitCoercion<ArrayBuffer>))
                    }
                } catch (err: unknown) {
                    reject(err)
                }
                if (response.headers.location !== undefined) {
                    return httpsGet(response.headers.location).then(resolve).catch(reject)
                }
                return resolve({ content: Buffer.concat(chunks), headers: response.headers })
            })()
        })
        req.on('error', reject)
    })
}

function createLocalZip(dir: string, type: string) {
    const zip = new AdmZip()
    const ignorePatterns = glob(gitignore(readFileSync(path.join(dir, '.gitignore')).toString() ?? ''))
    zip.addLocalFolder(path.join(dir, `examples/${type}`), '', (name) => !ignorePatterns(name))
    return { zip, cleanup: () => true }
}

async function createRemoteZip(url: string, type: string) {
    const tmpDir = fs.mkdtempSync(tmpdir())
    const { content, headers } = await httpsGet(url)
    const rootFolder = `${headers['content-disposition']?.match(/filename=(.+)\..+$/)?.[1] ?? ''}/`
    const remoteZip = new AdmZip(content)

    const entry = remoteZip.getEntry(rootFolder)
    if (entry !== null) {
        console.log(entry)
        remoteZip.extractEntryTo(entry, tmpDir, true, true)
    }
    const { zip } = createLocalZip(`${tmpDir}/${rootFolder}`, type)
    return { zip, cleanup: () => rmSync(tmpDir, { recursive: true, force: true }) }
}

const [, repositoryUrl] = /(https:\/\/.*?)(?:\.git)?$/.exec(repository.url) ?? []
export async function createProject(type: string, name: string, local: boolean): Promise<void> {
    const targetDir = path.resolve(process.cwd(), name)

    await spawn('git', ['init', targetDir])

    const url = `${repositoryUrl}/archive/v${version}.zip`
    const { zip, cleanup } = local ? createLocalZip(rootDirectory, type) : await createRemoteZip(url, type)

    await promisify(zip.extractAllToAsync.bind(zip))(targetDir, true)

    cleanup()
}

export function builder(yargs: Argv): Argv<{ local: boolean; name: string | undefined; type: PackageType }> {
    return yargs
        .option('type', {
            describe: 'package type',
            type: 'string',
            default: PackageType.Library,
            choices: [PackageType.Library, PackageType.YargsCli],
            demand: true,
        })
        .positional('name', {
            describe: 'the new package name',
            type: 'string',
            required: true,
        })
        .option('local', {
            describe: 'create from local examples instead of Github artifact',
            type: 'boolean',
            default: fs.existsSync(path.join(rootDirectory, 'examples')),
        })
}

export async function handler(argv: ReturnType<typeof builder>['argv']): Promise<void> {
    const { type, name, local } = await argv
    await createProject(type, name!, local)
}

export default {
    command: 'create <name>',
    describe: 'create a new project',
    builder,
    handler,
}

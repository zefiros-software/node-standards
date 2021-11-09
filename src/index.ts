import ci from '~/commands/ci'
import create from '~/commands/create'
import lint from '~/commands/lint'
import makeRelease from '~/commands/make-release'
import { setConfigurationKey } from '~/common/config'
import { PackageType } from '~/common/type'

import { install } from 'source-map-support'
import yargs from 'yargs'

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const { bin }: { bin: string } = require('../package.json')

export async function run(): Promise<void> {
    install()

    await yargs
        .scriptName(Object.keys(bin)[0])
        .command(ci)
        .command(create)
        .command(lint)
        .command(makeRelease)
        .demandCommand()
        .strict()
        .help().argv
}

export { ci, create, lint, makeRelease, PackageType, setConfigurationKey }

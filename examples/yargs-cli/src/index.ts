import goodbye from '~/commands/goodbye'
import hello from '~/commands/hello'

import { install } from 'source-map-support'

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const { bin }: { bin: string } = require('../package.json')

// This workaround is required to make yargs <-> esbuild work together
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/consistent-type-imports, @typescript-eslint/no-var-requires
const yargs: typeof import('yargs') = require('yargs')

// eslint-disable-next-line @typescript-eslint/require-await
export async function run(): Promise<void> {
    install()

    yargs.scriptName(Object.keys(bin)[0]).command(goodbye).command(hello).demandCommand().strict().help().argv
}

export default {
    goodbye,
    hello,
}

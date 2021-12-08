import { exec } from 'child_process'
import { build } from 'esbuild'
import { promisify } from 'util'
import path from 'path'
import packageJson from './package.json'
import fs from 'fs'

async function main() {
    await promisify(exec)('npx tsc -p tsconfig.dist.json --emitDeclarationOnly')

    await build({
        bundle: true,
        sourcemap: true,
        platform: 'node',
        outfile: path.join(__dirname, 'dist', 'main.js'),
        entryPoints: [path.join(__dirname, 'src', 'index.ts')],
        treeShaking: true,
        external: Object.keys(packageJson.dependencies),
        plugins: [
            {
                name: 'json-loader',
                setup: (build) => {
                    build.onLoad({ filter: /.json$/ }, async (args) => {
                        const content = await fs.promises.readFile(args.path, 'utf-8')
                        return {
                            contents: `module.exports = JSON.parse(${JSON.stringify(JSON.stringify(JSON.parse(content)))})`,
                        }
                    })
                },
            },
        ],
    })
}
main().catch((err) => {
    console.error(err)
    process.exit(1)
})

const nodeExternals = require('webpack-node-externals')

const path = require('path')

module.exports = function ({ root }) {
    return {
        mode: 'production',
        target: 'node',
        node: false,
        entry: './index.ts',
        devtool: 'source-map',
        resolve: {
            extensions: ['.js', '.json', '.ts', '.d.ts'],
        },
        output: {
            libraryTarget: 'commonjs2',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            path: path.join(root, '.dist'),
            filename: '[name].js',
        },
        ignoreWarnings: [
            {
                module: /node_modules\/yargs/,
            },
            {
                message: /original-fs/,
            },
        ],
        externals: [
            nodeExternals({
                modulesFromFile: {
                    exclude: ['devDependencies'],
                    include: ['dependencies'],
                },
            }),
        ],
        optimization: {
            minimize: false,
        },
        module: {
            rules: [
                {
                    test: /(?<!\.d)\.(t|j)sx?$/,
                    exclude: /node_modules|test/,
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig.dist.json',
                        projectReferences: true,
                    },
                },
                {
                    test: /\.(d|spec)\.ts$/,
                    loader: 'ignore-loader',
                },
            ],
        },
    }
}

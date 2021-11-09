const nodeExternals = require('webpack-node-externals')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const path = require('path')

module.exports = function ({ root }) {
    return {
        mode: 'production',
        target: 'node',
        node: false,
        entry: './src/index.ts',
        devtool: 'source-map',
        resolve: {
            extensions: ['.js', '.json', '.ts', '.d.ts'],
            plugins: [new TsconfigPathsPlugin({ configFile: 'tsconfig.dist.json' })],
        },
        output: {
            libraryTarget: 'commonjs2',
            path: path.join(root, 'dist'),
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

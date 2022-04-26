module.exports = {
    '*.{ts,tsx}': (filenames) =>
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        filenames.length > 10 ? 'npm run fix' : `npm run fix -- ${filenames.join(' ')}`,
    '*.{json,js,jsx,yml,yaml}': 'prettier --write',
}

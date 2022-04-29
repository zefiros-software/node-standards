module.exports = {
    '*.{ts,tsx}': (filenames) =>
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        filenames.length > 10 ? 'npm run fix' : `npm run fix -- ${filenames.join(' ')}`,
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/strict-boolean-expressions
    '*.{json,yml,yaml}': (filenames) => `prettier --write ${filenames.filter((f) => !f.endsWith('package-lock.json').join(' '))}`,
}

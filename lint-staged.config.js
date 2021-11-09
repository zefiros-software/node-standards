module.exports = {
    '*.{js,jsx,ts,tsx}': (filenames) =>
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/strict-boolean-expressions
        filenames.length > 10 ? 'npm run fix' : `npm run fix -- ${filenames.filter((f) => !f.includes('.config.')).join(' ')}`,
    '*.{json,yml,yaml}': 'prettier --write',
}

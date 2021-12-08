module.exports = {
    '*.{js,jsx,ts,tsx}': (filenames) =>
        filenames.length > 10
            ? 'npm run fix'
            : `npm run fix -- ${filenames
                  .filter((f) => !f.includes('.config.') && !/.*examples\/[\w_-]+\/src.*/g.test(f))
                  .join(' ')}`,
    '*.{json,yml,yaml}': 'prettier --write',
}

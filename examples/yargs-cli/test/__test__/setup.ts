beforeAll(() => {
    jest.useFakeTimers('modern')
    jest.setSystemTime(new Date(2022, 1, 10))
})

afterAll(() => jest.useRealTimers())

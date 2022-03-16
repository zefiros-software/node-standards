beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date(2022, 1, 10))
})

afterEach(() => jest.useRealTimers())

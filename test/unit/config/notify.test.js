describe('Notify config', () => {
  // Credit where credit is due: https://stackoverflow.com/questions/48033841/test-process-env-with-jest
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = { ...OLD_ENV }
  })

  afterAll(() => {
    process.env = OLD_ENV
  })

  test('Valid env var pass validation', () => {
    const mockKey = 'mock-key'
    process.env.NOTIFY_API_KEY = mockKey
    const NotifyConfig = require('../../../app/config/notify')
    expect(NotifyConfig.notifyApiKey).toBe(mockKey)
  })

  test('Invalid env var throws error', () => {
    process.env.NOTIFY_API_KEY = null
    expect(() => require('../../../app/config/notify')).toThrow()
  })
})

describe('General config', () => {
  test('Config is defined', () => {
    const generalConfig = require('../../../app/config/general')
    expect(generalConfig.appInsights).toBeDefined()
  })
})

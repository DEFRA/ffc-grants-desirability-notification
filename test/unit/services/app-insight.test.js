
const appInsight = require('../../../app/services/app-insights')
const config = require('../../../app/config/general')
const appInsights = require('applicationinsights')
const mockTrackException = jest.fn().mockImplementation((a,b) => {
  console.debug('mockTrackException called', a, b)
})
jest.mock('applicationinsights', () => {
  return {
    setup: jest.fn().mockReturnValue({
      start: jest.fn(),
    }),
    defaultClient: {
      context: {
        keys: {
          cloudRole: 'cloudRole'
        },
        tags: {
          cloudRole: 'cloudRole'
        }
      },
      trackException: (a,b) => mockTrackException(a, b)
    }
  }
})

jest.mock('../../../app/config/general')
describe('setup()', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('Should not setup appInsight without config key', () => {
    config.appInsights.key = null
    const setupSpy = jest.spyOn(appInsights, 'setup')

    appInsight.setup()
    expect(setupSpy).toHaveBeenCalledTimes(0)
  })
  test('Should setup appInsight with config key', () => {
    config.appInsights.key = '0000'
    const mockStartSpy = jest.fn()
    const logASpy = jest.spyOn(console, 'log')
    const setupSpy = jest.spyOn(appInsights, 'setup').mockImplementation(() => {
      return {
        start: mockStartSpy,
        defaultClient: {
          context: {
            keys: {
              cloudRole: 'cloudRole'
            }
          }
        }
      }
    })


    appInsight.setup()
    expect(setupSpy).toHaveBeenCalledTimes(1)
    expect(mockStartSpy).toHaveBeenCalledTimes(1)
    expect(logASpy).toHaveBeenCalledTimes(1)
    expect(logASpy).toHaveBeenCalledWith('[AppInsights] setup complete')
  })
})

describe('logException()', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('Should log Error to app insights', () => {
    const logSpy = jest.spyOn(console, 'log')

    appInsight.logException('error', 'sessionId')

    expect(logSpy).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledWith('[AppInsights] Error: %s', 'error')
    expect(mockTrackException).toHaveBeenCalledTimes(1)
  })
})

// Mocks
jest.mock('../../app/server')
jest.mock('../../app/messaging/receivers')
jest.mock('../../app/messaging/send-email', () => "test")
jest.mock('../../app/services/app-insights')

const receivers = require('../../app/messaging/receivers')
const mockStartSubmissionReceiver = jest.fn((d) => null)
receivers.startSubmissionReceiver = mockStartSubmissionReceiver

// Spies
const server = require('../../app/server')
const mockStartSpy = jest.spyOn(server, 'start').mockImplementation(async () => {
  console.log('Mock: Server running on %s', server.info.uri)
})

const mockAppInsightsSpy = jest.spyOn(require('../../app/services/app-insights'), 'setup').mockImplementation(() => { return null })
const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { return null })
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => { return null })

describe('Index', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('Should call server.start', async () => {
    expect.assertions(6)

    require('../../app/index')
    expect(mockStartSubmissionReceiver).toHaveBeenCalledTimes(1)
    expect(mockStartSubmissionReceiver).toHaveBeenCalledWith('test')
    expect(mockAppInsightsSpy).toHaveBeenCalledTimes(1)
    expect(mockAppInsightsSpy).toHaveBeenCalledWith()
    expect(mockStartSpy).toHaveBeenCalledTimes(1)
    expect(logSpy).toHaveBeenCalledWith('Mock: Server running on %s', server.info.uri)
  })

  it('Should exit on unhandledRejection', async () => {
    expect.assertions(1)
    process.emit('unhandledRejection')
    expect(mockExit).toHaveBeenCalledWith(1)
  })
})

jest.mock('ffc-messaging')
jest.mock('../../../app/services/protective-monitoring-service')
const ffcMessaging = require('ffc-messaging')

const mockSubscribe = jest.fn().mockImplementation(() => { return null })
// const mockSendMsg = jest.fn().mockImplementation(() => { return null })
const mockCloseConnection = jest.fn().mockImplementation(() => { return null })

ffcMessaging.MessageReceiver = jest.fn().mockImplementation((queue, updateAction) => {
  return {
    closeConnection: mockCloseConnection,
    subscribe: mockSubscribe
  }
})


describe('messaging tests: Recievers', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('Receiver Should be defined', () => {
    const receivers = require('../../../app/messaging/receivers')
    expect(receivers).toBeDefined()
  })

  test('Receiver startSubmissionReceiver - Should call subscribe', async () => {
    const receivers = require('../../../app/messaging/receivers')
    await expect(receivers.startSubmissionReceiver('')).resolves.not.toThrow()
    expect(mockSubscribe).toHaveBeenCalledTimes(1)
    expect(mockCloseConnection).toHaveBeenCalledTimes(0)
  })

  test('Receiver startSubmissionReceiver - Should close connection on Should call SIGINT', async () => {
    jest.spyOn(process, 'exit').mockImplementation()

    require('../../../app/messaging/receivers')

    process.emit('SIGINT');
    expect(mockSubscribe).toHaveBeenCalledTimes(0)
    expect(mockCloseConnection).toHaveBeenCalledTimes(1)
  });

  test('Receiver startSubmissionReceiver - Should close connection on Should call SIGTERM', async () => {
    jest.spyOn(process, 'exit').mockImplementation()

    require('../../../app/messaging/receivers')

    process.emit('SIGTERM');
    expect(mockSubscribe).toHaveBeenCalledTimes(0)
    expect(mockCloseConnection).toHaveBeenCalledTimes(1)
  });
})


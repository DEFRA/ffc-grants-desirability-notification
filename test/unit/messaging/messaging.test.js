jest.mock('ffc-messaging')
jest.mock('../../../app/services/protective-monitoring-service')
const ffcMessaging = require('ffc-messaging')
ffcMessaging.MessageReceiver = jest.fn().mockImplementation((queue, updateAction) => {
  return {
    closeConnection: jest.fn(),
    subscribe: jest.fn()
  }
})
describe('messaging tests', () => {
  test('Receiver Should be defined', () => {
    const receivers = require('../../../app/messaging/receivers')
    expect(receivers).toBeDefined()
  })
  test('Receiver startSubmissionReceiver Should not throw error', async () => {
    const receivers = require('../../../app/messaging/receivers')
    await expect(receivers.startSubmissionReceiver('')).resolves.not.toThrow()
  })
})

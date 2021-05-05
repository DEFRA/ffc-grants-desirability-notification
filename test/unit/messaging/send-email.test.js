jest.mock('../../../app/services/app-insights')
const sendEmail = require('../../../app/messaging/send-email')
const appInsights = require('../../../app/services/app-insights')
appInsights.logException = jest.fn((_err, _sessionId) => {})
jest.mock('../../../app/services/protective-monitoring-service')
const submissionReceiver = {
  completeMessage: jest.fn(async (_message) => { return null }),
  abandonMessage: jest.fn(async (_message) => { return null })
}
jest.mock('../../../app/config/notify')
jest.mock('notifications-node-client')
const notifyConfig = require('../../../app/config/notify')
notifyConfig.notifyApiKey = ''
const NotifyClient = require('notifications-node-client').NotifyClient
NotifyClient.mockImplementation(() => {
  return {
    sendEmail: jest.fn((templateId, emailAddress, xyz) => { return true })
  }
})
afterEach(() => {
  jest.clearAllMocks()
})
describe('get send Email setup defined', () => {
  test('Should be defined', () => {
    expect(sendEmail).toBeDefined()
  })
  test('Should be called', () => {
    expect(sendEmail('', submissionReceiver)).toBeDefined()
  })
  test('Should be called with error', async () => {
    await expect(sendEmail(null, submissionReceiver)).rejected
    expect(appInsights.logException).toHaveBeenCalledTimes(1)
    expect(submissionReceiver.abandonMessage).toHaveBeenCalledTimes(1)
  })
  test('Should be called with no error', async () => {
    const msg = {
      correlationId: '',
      body: {
        applicantEmail: {
          notifyTemplate: '',
          emailAddress: '',
          details: ''
        }
      }
    }
    await expect(sendEmail(msg, submissionReceiver)).resolved
    expect(submissionReceiver.completeMessage).toHaveBeenCalledTimes(1)
  })
})

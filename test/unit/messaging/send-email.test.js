require('dotenv').config()
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
const NotifyClient = require('notifications-node-client')
NotifyClient.NotifyClient = jest.fn().mockImplementation((key) => {
  return {
    sendEmail: jest.fn(async (templateId, emailAddress, xyz) => { console.log('yes called'); return true })
  }
})
afterEach(() => {
  jest.clearAllMocks()
})
describe('get send Email setup defined', () => {
  const errorSpy = jest.spyOn(console, 'error')
  test('Should be defined', () => {
    expect(sendEmail).toBeDefined()
  })
  test('Should be called', () => {
    expect(sendEmail('', submissionReceiver)).toBeDefined()
  })
  test('Should be called with error', async () => {
    expect.assertions(6)
    await expect(sendEmail(null, submissionReceiver)).rejected
    expect(appInsights.logException).toHaveBeenCalledTimes(1)
    expect(submissionReceiver.abandonMessage).toHaveBeenCalledTimes(1)
    expect(submissionReceiver.abandonMessage).toHaveBeenCalledWith(null)
    expect(submissionReceiver.completeMessage).toHaveBeenCalledTimes(0)
    expect(errorSpy).toHaveBeenCalledTimes(1)
    expect(errorSpy).toHaveBeenCalledWith('Abandoning message')
  })
  test('Should be called with no error - rpaEmail', async () => {
    expect.assertions(6)
    const msg = {
      correlationId: '',
      body: {
        applicantEmail: {
          notifyTemplate: '',
          emailAddress: '',
          details: ''
        },
        rpaEmail: {
          notifyTemplate: '',
          emailAddress: '',
          details: ''
        }
      }
    }
    await expect(sendEmail(msg, submissionReceiver)).resolves.not.toThrow()
    expect(submissionReceiver.completeMessage).toHaveBeenCalledTimes(1)
    expect(submissionReceiver.completeMessage).toHaveBeenCalledWith(msg)
    expect(submissionReceiver.abandonMessage).toHaveBeenCalledTimes(0)
    expect(appInsights.logException).toHaveBeenCalledTimes(0)
    expect(errorSpy).toHaveBeenCalledTimes(0)
  })

  test('Should be called with no error - agentEmail', async () => {
    expect.assertions(6)
    const msg = {
      correlationId: '',
      body: {
        applicantEmail: {
          notifyTemplate: '',
          emailAddress: '',
          details: ''
        },
        agentEmail: {
          notifyTemplate: '',
          emailAddress: '',
          details: ''
        }
      }
    }
    await expect(sendEmail(msg, submissionReceiver)).resolves.not.toThrow()
    expect(submissionReceiver.completeMessage).toHaveBeenCalledTimes(1)
    expect(submissionReceiver.completeMessage).toHaveBeenCalledWith(msg)
    expect(submissionReceiver.abandonMessage).toHaveBeenCalledTimes(0)
    expect(appInsights.logException).toHaveBeenCalledTimes(0)
    expect(errorSpy).toHaveBeenCalledTimes(0)
  })
})

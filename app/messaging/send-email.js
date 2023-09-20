const protectiveMonitoringServiceSendEvent = require('../services/protective-monitoring-service')
const appInsights = require('../services/app-insights')
const notifyConfig = require('../config/notify')
const NotifyClient = require('notifications-node-client').NotifyClient
const notifyClient = new NotifyClient(notifyConfig.notifyApiKey)
async function callNotify (emailConfig) {
  const templateId = emailConfig.notifyTemplate
  const emailAddress = emailConfig.emailAddress
  const personalisation = emailConfig.details

  await notifyClient.sendEmail(templateId, emailAddress, {
    personalisation,
    reference: personalisation.referenceNumber
  })
}

module.exports = async function (msg, submissionReceiver) {
  try {
    const { body } = msg

    console.log('VARIABLES FOR EMAIL TEMPLATE: ', body)

    await callNotify(body.applicantEmail)
    console.log('SUCCESS SENDING EMAIL TO APPLICANT')

    if (body.rpaEmail) {
      await callNotify(body.rpaEmail)
      console.log('SUCCESS SENDING EMAIL TO RPA')
    }

    if (body.agentEmail) {
      await callNotify(body.agentEmail)
      console.log('SUCCESS SENDING EMAIL TO AGENT')
    }

    await submissionReceiver.completeMessage(msg)
    await protectiveMonitoringServiceSendEvent(msg.correlationId, 'FTF-EMAIL-SENT', '0706')
  } catch (err) {
    console.log('FAILED SENDING EMAILS')
    console.log(JSON.stringify(err, null, 2))
    appInsights.logException(err, msg?.correlationId)
    console.error('Abandoning message')
    await submissionReceiver.abandonMessage(msg)
  }
}

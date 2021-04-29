const notifyConfig = require('../config/notify')
const NotifyClient = require('notifications-node-client').NotifyClient

const notifyClient = new NotifyClient(notifyConfig.notifyApiKey)

module.exports = async function (msg, submissionReceiver) {
  try {
    const { body } = msg
    const templateId = body.applicantEmail.notifyTemplate
    const emailAddress = body.applicantEmail.emailAddress
    const personalisation = body.applicantEmail.details

    await notifyClient.sendEmail(templateId, emailAddress, {
      personalisation,
      reference: personalisation.referenceNumber
    })

    console.log('SUCCESS SENDING EMAIL')
    await submissionReceiver.completeMessage(msg)
  } catch (err) {
    console.log('FAILED SENDING EMAIL')
    console.log(JSON.stringify(err, null, 2))
    console.error('Abandoning message')
    await submissionReceiver.abandonMessage(msg)
  }
}

const notifyConfig = require('../config/notify')
const NotifyClient = require('notifications-node-client').NotifyClient

const notifyClient = new NotifyClient(notifyConfig.notifyApiKey)

module.exports = async function (msg, submissionReceiver) {
  try {
    const { body, correlationId } = msg

    console.log('Received message:')
    console.log(body.applicantEmail)
    console.log(`CorrelationId: ${correlationId}`)

    const templateId = body.applicantEmail.notifyTemplate
    const emailAddress = body.applicantEmail.emailAddress
    const personalisation = body.applicantEmail.details

    try {
      await notifyClient.sendEmail(templateId, emailAddress, {
        personalisation,
        reference: personalisation.referenceNumber
      })
      console.log('SUCCESS SENDING EMAIL')
    } catch (err) {
      console.log('FAILED SENDING EMAIL')
      console.log(JSON.stringify(err, null, 2))
    }

    await submissionReceiver.completeMessage(msg)
  } catch (err) {
    console.error('Unable to process message')
    console.error(err)
    await submissionReceiver.abandonMessage(msg)
  }
}

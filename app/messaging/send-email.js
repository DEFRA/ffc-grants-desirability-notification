const notifyConfig = require('../config/notify')
const NotifyClient = require('notifications-node-client').NotifyClient

const notifyClient = new NotifyClient(notifyConfig.notifyApiKey)

module.exports = async function (msg, submissionReceiver) {
  try {
    const { body, correlationId } = msg

    console.log('Received message:')
    console.log(body)
    console.log(`CorrelationId: ${correlationId}`)

    const templateId = body.applicantEmail.notifyTemplate
    const emailAddress = body.applicantEmail.emailAddress
    const personalisation = body.applicantEmail.details

    notifyClient
      .sendEmail(templateId, emailAddress, {
        personalisation,
        reference: personalisation.referenceNumber
      })
      .then(response => console.log('SUCCESS SENDING EMAIL'))
      .catch(err => console.error('FAILED SENDING EMAIL'))

    await submissionReceiver.completeMessage(msg)
  } catch (err) {
    console.error('Unable to process message')
    console.error(err)
    await submissionReceiver.abandonMessage(msg)
  }
}

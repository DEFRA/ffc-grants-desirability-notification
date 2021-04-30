const protectiveMonitoringServiceSendEvent = require('../services/protective-monitoring-service')
module.exports = async function (msg, submissionReceiver) {
  try {
    const { body } = msg
    console.log('Received message:')
    console.log(body)
    await submissionReceiver.completeMessage(msg)
    await protectiveMonitoringServiceSendEvent(msg.correlationId, 'FTF-EMAIL-SENT', '0706')
  } catch (err) {
    console.error('Unable to process message')
    console.error(err)
    await submissionReceiver.abandonMessage(msg)
  }
}

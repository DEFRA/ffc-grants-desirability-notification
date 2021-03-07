const msgCfg = require('../config/messaging')
const { MessageReceiver } = require('ffc-messaging')

let submissionReceiver

async function stop () {
  await submissionReceiver.closeConnection()
}

process.on('SIGTERM', async () => {
  await stop()
  process.exit(0)
})

process.on('SIGINT', async () => {
  await stop()
  process.exit(0)
})

module.exports = {
  startSubmissionReceiver: async function (submissionReceived) {
    const updateAction = msg => submissionReceived(msg, submissionReceived)
    submissionReceiver = new MessageReceiver(msgCfg.submissionSubscription, updateAction)
    await submissionReceiver.subscribe()
  }
}

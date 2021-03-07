const msgCfg = require('../config/messaging')
const { MessageReceiver } = require('ffc-messaging')

let notificationReceiver

async function stop () {
  await notificationReceiver.closeConnection()
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
  startNotificationReceiver: async function (notificationReceived) {
    const updateAction = msg => notificationReceived(msg, notificationReceiver)
    notificationReceiver = new MessageReceiver(msgCfg.notificationSubscription, updateAction)
    await notificationReceiver.subscribe()
  }
}

const { MessageReceiver } = require('ffc-messaging')
const config = require('../../config')
const processMessage = require('./process-message')

const mqConfig = config.messageQueues.notificationTopic
let receiver

async function start () {
  const action = message => processMessage(message, receiver)
  receiver = new MessageReceiver(mqConfig, action)
  await receiver.subscribe()
  console.info('Inbox service running, ready to receive messages')
}

async function stop () {
  await receiver.closeConnection()
}

module.exports = { start, stop }

module.exports = async function (msg, notificationReceiver) {
  try {
    const { body } = msg
    console.log('Received message:')
    console.log(body)
    await notificationReceiver.completeMessage(msg)
  } catch (err) {
    console.error('Unable to process message')
    console.error(err)
    await notificationReceiver.abandonMessage(msg)
  }
}

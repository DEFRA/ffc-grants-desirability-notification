const server = require('./server')
require('dotenv-extended').load({ errorOnMissing: true })

const init = async () => {
  const { notifyApiKey } = require('./config')
  console.log(`Using Notify API key: ${notifyApiKey}`)

  const sendEmailAction = require('./messaging/send-email')
  require('./messaging/receivers').startSubmissionReceiver(sendEmailAction)

  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()

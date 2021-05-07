const server = require('./server')

const init = async () => {
  const sendEmailAction = require('./messaging/send-email')
  require('./messaging/receivers').startSubmissionReceiver(sendEmailAction)
  require('./services/app-insights').setup()
  await server.start()
  console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()

const server = require('./server')
const inbox = require('./messaging/inbox')

const init = async () => {
  // await inbox.start()
  await server.start()
  console.log('Server running on %s', server.info.uri)

  const { notifyApiKey } = require('./config/general')
  console.log(`Using Notify API key: ${notifyApiKey}`)
}

process.on('unhandledRejection', (err) => {
  console.log(err)
  process.exit(1)
})

init()

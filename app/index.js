const server = require('./server')

const init = async () => {
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

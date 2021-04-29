const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  notifyApiKey: Joi.string().required()
})

// Build config
const config = {
  notifyApiKey: process.env.NOTIFY_API_KEY
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The notify config is invalid. ${result.error.message}`)
}

module.exports = result.value

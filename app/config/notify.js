const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  notifyApiKey: Joi.string().required(),
  appInsights: Joi.object({
    key: Joi.string(),
    role: Joi.string()
  })
})

// Build config
const config = {
  notifyApiKey: process.env.NOTIFY_API_KEY,
  appInsights: {
    key: process.env.APPINSIGHTS_INSTRUMENTATIONKEY,
    role: process.env.APPINSIGHTS_CLOUDROLE
  }
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The sharepoint config is invalid. ${result.error.message}`)
}

module.exports = result.value

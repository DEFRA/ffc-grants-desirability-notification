const Joi = require('joi')

// Define config schema
const schema = Joi.object({
  appInsights: Joi.object({
    key: Joi.string(),
    role: Joi.string()
  })
})

// Build config
const config = {
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
  throw new Error(`The general config is invalid. ${result.error.message}`)
}

module.exports = result.value

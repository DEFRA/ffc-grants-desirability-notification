const joi = require('joi')

const queueSchema = joi.object({
  name: joi.string(),
  address: joi.string().required(),
  username: joi.string().optional(),
  password: joi.string().optional(),
  type: joi.string().optional()
})

const mqSchema = joi.object({
  messageQueue: {
    host: joi.string().default('localhost'),
    useCredentialChain: joi.bool().default(false),
    type: joi.string(),
    appInsights: joi.object()
  },
  calculationQueue: queueSchema,
  claimQueue: queueSchema,
  scheduleTopic: queueSchema
})

const mqConfig = {
  messageQueue: {
    host: process.env.MESSAGE_QUEUE_HOST,
    useCredentialChain: process.env.NODE_ENV === 'production',
    type: 'queue',
    appInsights: process.env.NODE_ENV === 'production' ? require('applicationinsights') : undefined
  }
}

const mqResult = mqSchema.validate(mqConfig, {
  abortEarly: false
})

// Throw if config is invalid
if (mqResult.error) {
  throw new Error(`The message queue config is invalid. ${mqResult.error.message}`)
}

const scheduleTopic = {
  ...mqResult.value.messageQueue,
  ...mqResult.value.scheduleTopic
}

module.exports = {
  scheduleTopic
}

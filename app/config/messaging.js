const sharedConfig = {
  appInsights: require('applicationinsights'),
  host: process.env.SERVICE_BUS_HOST,
  password: process.env.SERVICE_BUS_PASSWORD,
  username: process.env.SERVICE_BUS_USER,
  useCredentialChain: process.env.NODE_ENV === 'production'
}

module.exports = {
  notificationSubscription: {
    address: process.env.DESIRABILITY_NOTIFICATION_SUBSCRIPTION_ADDRESS,
    topic: process.env.DESIRABILITY_SUBMITTED_TOPIC_ADDRESS,
    type: 'subscription',
    ...sharedConfig
  },
  notificationMsgType: 'uk.gov.ffc.grants.submission.received',
  msgSrc: 'ffc-grants-desirability-notification'
}

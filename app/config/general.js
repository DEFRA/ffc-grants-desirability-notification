require('dotenv-extended').load({ errorOnMissing: true })

module.exports = {
  notifyApiKey: process.env.NOTIFY_API_KEY,
  notifyEmailTemplateKey: process.env.NOTIFY_EMAIL_TEMPLATE_KEY
}

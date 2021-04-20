module.exports = {
  notifyApiKey: process.env.NOTIFY_API_KEY,  
  appInsights: {
    key: process.env.APPINSIGHTS_INSTRUMENTATIONKEY,
    role: process.env.APPINSIGHTS_CLOUDROLE
  }
}

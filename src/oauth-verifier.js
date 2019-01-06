require('dotenv').config()
require('isomorphic-fetch')

module.exports.handler = handle

async function handle(
  event,
  clientId = process.env.CLIENT_ID,
  clientSecret = process.env.CLIENT_SECRET,
  fetch = fetch
) {
  const { code } = event.queryStringParameters

  const url = 'https://slack.com/api/oauth.access'
  const args = { client_id: clientId, client_secret: clientSecret, code }
  const body = Object.entries(args)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  })

  return {
    statusCode: 200,
    body: '👍'
  }
}

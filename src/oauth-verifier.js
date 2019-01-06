require('dotenv').config()
require('isomorphic-fetch')

module.exports.handler = async function handle(event) {
  const { code } = event.queryStringParameters

  const url = 'https://slack.com/api/oauth.access'
  const arguments = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    code
  }
  const body = Object.entries(arguments)
    .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
    .join('&')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  })
  const json = await response.json()
  console.log(json)

  return {
    statusCode: 200,
    body: '👍'
  }
}

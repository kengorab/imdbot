const { handler: oauthVerifier } = require('../oauth-verifier')

const clientId = 'iugfhdjkv'
const clientSecret = 'isdufhvgoie0-vkjdbvkjb/xkjvc'
const fetch = jest.fn()

describe('oauth-verifier', () => {
  it('should make the oauth request to slack with the client id, secret, and code', async () => {
    const code = '93eiuwrghfvkljxjhbcihuyeoirwljrkhgioeufdsbjlkv'
    const event = {
      queryStringParameters: { code }
    }
    await oauthVerifier(event, clientId, clientSecret, fetch)

    const expectedRequest = {
      body: `client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&code=${code}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST'
    }
    expect(fetch).toHaveBeenCalledWith('https://slack.com/api/oauth.access', expectedRequest)
  })
})

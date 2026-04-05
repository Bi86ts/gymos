// Netlify serverless function — generates Twilio Access Token for chat
// Endpoint: /.netlify/functions/twilio-token

const twilio = require('twilio')

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const { identity, friendlyName } = JSON.parse(event.body || '{}')

    if (!identity) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'identity is required' }) }
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const apiKeySid = process.env.TWILIO_API_KEY_SID
    const apiKeySecret = process.env.TWILIO_API_KEY_SECRET
    const serviceSid = process.env.TWILIO_CONVERSATIONS_SERVICE_SID

    if (!accountSid || !apiKeySid || !apiKeySecret || !serviceSid) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Twilio configuration missing' }) }
    }

    // Create access token
    const AccessToken = twilio.jwt.AccessToken
    const ChatGrant = AccessToken.ChatGrant

    const token = new AccessToken(accountSid, apiKeySid, apiKeySecret, {
      identity: identity,
      ttl: 3600, // 1 hour
    })

    // Grant access to Conversations
    const chatGrant = new ChatGrant({
      serviceSid: serviceSid,
    })
    token.addGrant(chatGrant)

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        token: token.toJwt(),
        identity: identity,
      }),
    }
  } catch (error) {
    console.error('Token generation error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to generate token' }),
    }
  }
}

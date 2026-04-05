/**
 * GymOS Chat Service — Twilio Conversations client wrapper
 * Handles token fetching, client initialization, conversation management.
 */
import { Client } from '@twilio/conversations'

let twilioClient = null
let currentIdentity = null

// Token endpoint — works in both dev and production
const TOKEN_URL = import.meta.env.DEV
  ? 'http://localhost:8888/.netlify/functions/twilio-token'
  : '/.netlify/functions/twilio-token'

/**
 * Get a Twilio access token from our serverless function
 */
async function getToken(identity) {
  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Token fetch failed' }))
    throw new Error(err.error || 'Failed to get chat token')
  }
  return res.json()
}

/**
 * Initialize the Twilio Conversations client
 */
export async function initChatClient(userId, displayName) {
  // Reuse existing client if same user
  if (twilioClient && currentIdentity === userId) {
    return twilioClient
  }

  // Cleanup old client
  if (twilioClient) {
    await twilioClient.shutdown()
    twilioClient = null
    currentIdentity = null
  }

  const { token } = await getToken(userId)
  twilioClient = new Client(token)

  // Wait for initialization
  await new Promise((resolve, reject) => {
    twilioClient.on('stateChanged', (state) => {
      if (state === 'initialized') resolve()
      if (state === 'failed') reject(new Error('Twilio client failed to initialize'))
    })
  })

  // Handle token refresh
  twilioClient.on('tokenAboutToExpire', async () => {
    try {
      const { token: newToken } = await getToken(userId)
      await twilioClient.updateToken(newToken)
    } catch (e) {
      console.error('Token refresh failed:', e)
    }
  })

  twilioClient.on('tokenExpired', async () => {
    try {
      const { token: newToken } = await getToken(userId)
      await twilioClient.updateToken(newToken)
    } catch (e) {
      console.error('Token refresh failed:', e)
    }
  })

  currentIdentity = userId
  return twilioClient
}

/**
 * Get or create a 1-on-1 conversation between two users
 */
export async function getOrCreateConversation(client, myId, otherId, otherName) {
  // Use a deterministic unique name for the 1:1 pair
  const ids = [myId, otherId].sort()
  const uniqueName = `dm_${ids[0]}_${ids[1]}`

  try {
    // Try to get existing conversation
    const conversation = await client.getConversationByUniqueName(uniqueName)
    return conversation
  } catch (e) {
    // Doesn't exist — create it
    const conversation = await client.createConversation({
      uniqueName,
      friendlyName: `Chat: ${otherName}`,
    })

    // Add the other participant
    try {
      await conversation.add(otherId)
    } catch (addErr) {
      // Participant might already be added
      console.warn('Could not add participant:', addErr.message)
    }

    // Join the conversation ourselves
    await conversation.join()
    return conversation
  }
}

/**
 * Send a message in a conversation
 */
export async function sendMessage(conversation, body) {
  if (!body?.trim()) return null
  return conversation.sendMessage(body.trim())
}

/**
 * Get all conversations for the current user
 */
export async function getMyConversations(client) {
  const paginator = await client.getSubscribedConversations()
  return paginator.items
}

/**
 * Shutdown the chat client
 */
export async function shutdownChat() {
  if (twilioClient) {
    await twilioClient.shutdown()
    twilioClient = null
    currentIdentity = null
  }
}

/**
 * Get the current client instance (if initialized)
 */
export function getChatClient() {
  return twilioClient
}

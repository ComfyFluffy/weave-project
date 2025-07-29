import express from 'express'
import { generateNarratorSuggestions, generatePlayerSuggestions, generateNPCDialogue } from '../services/aiService'
import { worlds, messages } from '../mock'

const router = express.Router()

// Generate AI suggestions for narrator
router.post('/narrator-suggestions', async (req, res) => {
  try {
    const { worldId, channelId, customInstruction } = req.body

    if (!worldId || !channelId) {
      return res.status(400).json({ error: 'worldId and channelId are required' })
    }

    // Find the world
    const world = worlds.find(w => w.id === worldId)
    if (!world) {
      return res.status(404).json({ error: 'World not found' })
    }

    // Find the channel
    const channel = world.channels.find(c => c.id === channelId)
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' })
    }

    // Get recent messages for context
    const channelMessages = messages[channelId] || []
    const recentMessages = channelMessages.slice(-10) // Last 10 messages

    // Prepare AI context
    const context = {
      worldState: world.state,
      recentMessages,
      channelName: channel.name,
      customInstruction
    }

    // Generate suggestions
    const aiResponse = await generateNarratorSuggestions(context)

    res.json({
      success: true,
      suggestions: aiResponse.suggestions,
      reasoning: aiResponse.reasoning,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generating narrator suggestions:', error)
    res.status(500).json({ 
      error: 'Failed to generate suggestions',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Generate AI suggestions for player actions
router.post('/player-suggestions', async (req, res) => {
  try {
    const { worldId, channelId, characterName, customInstruction } = req.body

    if (!worldId || !channelId) {
      return res.status(400).json({ error: 'worldId and channelId are required' })
    }

    // Find the world
    const world = worlds.find(w => w.id === worldId)
    if (!world) {
      return res.status(404).json({ error: 'World not found' })
    }

    // Find the channel
    const channel = world.channels.find(c => c.id === channelId)
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' })
    }

    // Get recent messages for context
    const channelMessages = messages[channelId] || []
    const recentMessages = channelMessages.slice(-10) // Last 10 messages

    // Prepare AI context
    const context = {
      worldState: world.state,
      recentMessages,
      channelName: channel.name,
      customInstruction
    }

    // Generate player action suggestions
    const aiResponse = await generatePlayerSuggestions(context, characterName)

    res.json({
      success: true,
      suggestions: aiResponse.suggestions,
      reasoning: aiResponse.reasoning,
      characterName: characterName || null,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generating player suggestions:', error)
    res.status(500).json({ 
      error: 'Failed to generate player suggestions',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

// Generate NPC dialogue
router.post('/npc-dialogue', async (req, res) => {
  try {
    const { worldId, channelId, npcName, playerMessage } = req.body

    if (!worldId || !channelId || !npcName || !playerMessage) {
      return res.status(400).json({ 
        error: 'worldId, channelId, npcName, and playerMessage are required' 
      })
    }

    // Find the world
    const world = worlds.find(w => w.id === worldId)
    if (!world) {
      return res.status(404).json({ error: 'World not found' })
    }

    // Find the channel
    const channel = world.channels.find(c => c.id === channelId)
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found' })
    }

    // Get recent messages for context
    const channelMessages = messages[channelId] || []
    const recentMessages = channelMessages.slice(-10)

    // Prepare AI context
    const context = {
      worldState: world.state,
      recentMessages,
      channelName: channel.name
    }

    // Generate NPC dialogue
    const dialogue = await generateNPCDialogue(npcName, context, playerMessage)

    res.json({
      success: true,
      dialogue,
      npcName,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generating NPC dialogue:', error)
    res.status(500).json({ 
      error: 'Failed to generate dialogue',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
})

export default router

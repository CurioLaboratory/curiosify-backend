// controllers/ChatHistoryController.js
const mongoose = require('mongoose'); 
const ChatHistory = require('../../models/userChathistory/UserChatHistory');

// Add a new chat message for the user
exports.addChatMessage = async (req, res) => {
  const { userId, email, chatId, messages } = req.body;

  try {
    let chatHistory = await ChatHistory.findOne({ userId });

    if (!chatHistory) {
      // Create new chat history for the user if none exists
      chatHistory = new ChatHistory({ userId, email, chats: [] });
    }

    let chatSession;

    if (chatId) {
      // Find the chat session with the provided chatId
      chatSession = chatHistory.chats.find(chat => chat.chatId.toString() === chatId);
    }

    if (chatSession) {
      // Append messages to the existing chat session
      messages.forEach(message => {
        chatSession.messages.push({
          content: message.content,
          role: message.role,
        });
      });
    } else {
      // Create a new chat session
      chatSession = {
        chatId:chatId, // Generate a new chatId
        messages: messages.map(message => ({
          content: message.content,
          role: message.role,
        })),
      };

      // Add the new chat session to the user's chat history
      chatHistory.chats.push(chatSession);
    }

    await chatHistory.save();

    res.status(200).json({ message: 'Chat message added successfully', chatId: chatSession.chatId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Fetch user's chat history
exports.getChatHistory = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const chatHistory = await ChatHistory.findOne({ userId });
  
      if (!chatHistory) {
        return res.status(200).json([]); // Return an empty array if no chat history is found
      }
  
      res.status(200).json(chatHistory.chats); // Return the array of chat sessions
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  
  // Fetch messages of a specific chat session by chatId
exports.getChatById = async (req, res) => {
    const { userId, chatId } = req.params;
  
    try {
      const chatHistory = await ChatHistory.findOne({ userId });
  
      if (!chatHistory) {
        return res.status(404).json({ message: 'Chat history not found' });
      }
  
      const chatSession = chatHistory.chats.find(chat => chat.chatId.toString() === chatId);
  
      if (!chatSession) {
        return res.status(404).json({ message: 'Chat session not found' });
      }
  
      res.status(200).json(chatSession.messages); // Return the messages in the chat session
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
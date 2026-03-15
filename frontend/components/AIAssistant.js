'use client'

import { useState, useEffect } from 'react'
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid } from '@heroicons/react/24/solid'

export default function AIAssistant({ video }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Hi! I'm Jigri AI, your learning companion! 💙 I'm here to help you understand "${video?.title || 'this lesson'}". What would you like to know?`,
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const generateAIResponse = async (userMessage) => {
    // Simulated AI responses based on keywords - Jigri AI style
    const lowercaseMsg = userMessage.toLowerCase()
    
    let response = ''
    
    if (lowercaseMsg.includes('what') && (lowercaseMsg.includes('learn') || lowercaseMsg.includes('study'))) {
      response = `In this lesson, you'll master the key concepts related to "${video?.title}". Focus on understanding the fundamentals first, then we can dive deeper into specific areas. Ready to begin?`
    } else if (lowercaseMsg.includes('how')) {
      response = `Great question! Here's how to approach this: Break it down into smaller parts, watch the video carefully, and I'll help clarify any specific points. What part would you like me to explain first?`
    } else if (lowercaseMsg.includes('explain') || lowercaseMsg.includes('definition') || lowercaseMsg.includes('mean')) {
      response = `I'd love to explain this for you! Based on "${video?.title}", this concept builds on fundamental principles. Could you tell me which specific aspect you'd like me to break down?`
    } else if (lowercaseMsg.includes('example')) {
      response = `Here's a real-world example: Think of this concept in action when you're building actual applications. For instance, in programming, this applies directly to features you use every day. Want me to give you a more specific example?`
    } else if (lowercaseMsg.includes('why')) {
      response = `Excellent "why" question! Understanding the reasoning behind concepts helps with long-term retention. This concept is crucial because it forms the foundation for more advanced topics you'll encounter.`
    } else if (lowercaseMsg.includes('summary') || lowercaseMsg.includes('summarize')) {
      response = `Here's your quick summary: The key points from "${video?.title}" focus on understanding core principles, seeing practical applications, and building confidence through practice. You've got this!`
    } else if (lowercaseMsg.includes('test') || lowercaseMsg.includes('quiz') || lowercaseMsg.includes('practice')) {
      response = `Want to test your understanding? Try explaining the main concept in your own words, or think about how you'd apply this in a real scenario. I'm here to check your understanding and provide feedback!`
    } else if (lowercaseMsg.includes('difficult') || lowercaseMsg.includes('hard') || lowercaseMsg.includes("don't understand")) {
      response = `It's completely normal to find some concepts challenging! That's how learning works. Let's break it down together - what specific part is confusing? Sometimes a different perspective makes all the difference.`
    } else if (lowercaseMsg.includes('tip') || lowercaseMsg.includes('trick') || lowercaseMsg.includes('advice')) {
      response = `Pro tip from Jigri AI: Take active notes while watching, pause frequently to reflect, and connect new information to what you already know. Practice consistently, and don't hesitate to ask me questions anytime!`
    } else if (lowercaseMsg.includes('thank')) {
      response = `You're welcome! I'm always here to support your learning journey. Keep up the excellent work - you're making great progress! 💙`
    } else if (lowercaseMsg.includes('hello') || lowercaseMsg.includes('hi') || lowercaseMsg.includes('hey')) {
      response = `Hey there! 👋 I'm Jigri AI, excited to help you learn about "${video?.title}". What shall we explore together today?`
    } else if (lowercaseMsg.includes('your name') || lowercaseMsg.includes('who are you')) {
      response = `I'm Jigri AI, your personal learning companion! 💙 My purpose is to help you understand concepts, answer questions, and support you throughout your learning journey. Think of me as your study buddy!`
    } else {
      // Default response
      response = `That's an interesting question about "${video?.title}". To give you the best answer, could you provide a bit more context? Meanwhile, pay close attention to the video - it covers many common questions. I'm here if you need clarification!`
    }

    return response
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = {
      id: messages.length + 1,
      text: input,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking delay
    setTimeout(async () => {
      const aiResponse = await generateAIResponse(input)
      
      const botMessage = {
        id: messages.length + 2,
        text: aiResponse,
        isBot: true,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 1000)
  }

  return (
    <>
      {/* Floating Button - Smaller size */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white p-3 rounded-full shadow-lg shadow-red-500/50 transition-all transform hover:scale-110 z-50"
        >
          <ChatBubbleLeftRightIconSolid className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-80 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/50 z-50 overflow-hidden flex flex-col" style={{ height: '500px' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-pink-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-white bg-opacity-20 p-1.5 rounded-full">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Jigri AI</h3>
                <p className="text-red-100 text-xs">Your learning companion</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-black/20">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                    message.isUser
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-br-md'
                      : 'bg-white/10 backdrop-blur-sm text-white border border-white/10 rounded-bl-md'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${message.isUser ? 'text-red-100' : 'text-white/50'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl rounded-bl-md px-3 py-2 border border-white/10">
                  <div className="flex space-x-2">
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="border-t border-white/10 p-3 bg-black/20">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 border border-white/20 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm bg-white/5 text-white placeholder-white/50"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 disabled:bg-gray-500 text-white p-2 rounded-full transition-colors"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

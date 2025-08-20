import React, { useState, useRef, useEffect } from 'react';
import { 
  IoSendOutline,
  IoSettingsOutline,
  IoAttachOutline,
  IoEllipsisVerticalOutline
} from 'react-icons/io5';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { chatAPI, preferencesAPI, recommendationsAPI, handleAPIError } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ChatInterface = ({ isCompact = false, onPreferenceChange }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      message: 'Hello! 👋 I\'m your AI educational counselor. I\'m here to help you with any questions about universities, career paths, or academic planning. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!currentMessage.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: currentMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = currentMessage.trim();
    setCurrentMessage('');
    setIsTyping(true);
    setError('');

    try {
      // Get user preferences to send with the message
      let preferencesId = null;
      try {
        const prefsResponse = await preferencesAPI.get();
        if (prefsResponse.data.preferences && prefsResponse.data.preferences._id) {
          preferencesId = prefsResponse.data.preferences._id;
          console.log('Sending chat message with preferences ID:', preferencesId);
        }
      } catch {
        console.log('No preferences found, sending message without preferences');
      }

      // Call the real API with preferences
      const response = await chatAPI.sendMessage(messageToSend, preferencesId);
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: response.data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Check if this conversation might have changed user preferences
      const preferenceKeywords = [
        'prefer', 'change', 'different', 'budget', 'country', 'major', 
        'study', 'university', 'location', 'cost', 'program', 'degree'
      ];
      
      const conversationText = messageToSend.toLowerCase() + ' ' + response.data.response.toLowerCase();
      const hasPreferenceChanges = preferenceKeywords.some(keyword => 
        conversationText.includes(keyword)
      );
      
      if (hasPreferenceChanges) {
        // Regenerate recommendations in the background
        try {
          const prefsResponse = await preferencesAPI.get();
          if (prefsResponse.data.preferences) {
            await recommendationsAPI.generate(prefsResponse.data.preferences._id);
            // Notify parent component about preference changes if callback is provided
            if (onPreferenceChange) {
              onPreferenceChange();
            }
          }
        } catch (recError) {
          console.log('Background recommendation update failed:', recError);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setError(handleAPIError(error));
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickQuestions = [
    "What are the best universities for computer science?",
    "How can I improve my chances of admission?",
    "What scholarships are available?",
    "Tell me about study abroad programs",
    "What career paths can I explore?"
  ];

  const handleQuickQuestion = (question) => {
    setCurrentMessage(question);
    inputRef.current?.focus();
  };

  return (
    <div className={`flex flex-col h-full ${isCompact ? 'bg-gray-50' : 'bg-white'}`}>
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <IoSettingsOutline className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="font-medium text-gray-900">NextStep AI</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-green-600">Online</span>
              </div>
            </div>
          </div>
          {!isCompact && (
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <IoEllipsisVerticalOutline className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-start space-x-3 ${message.type === 'user' ? 'justify-end' : ''}`}>
            {message.type === 'ai' && (
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">AI</span>
              </div>
            )}
            
            <div className={`rounded-2xl px-4 py-3 max-w-md ${
              message.type === 'user' 
                ? 'bg-gray-800 text-white' 
                : message.isError 
                  ? 'bg-red-50 text-red-800 border border-red-200' 
                  : 'bg-gray-100 text-gray-800'
            }`}>
              {message.type === 'ai' && !message.isError ? (
                <div className="text-sm prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-800 prose-strong:text-gray-900 prose-code:bg-gray-200 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-200 prose-pre:text-gray-800">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {message.message}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
              )}
              <p className={`text-xs mt-1 ${
                message.type === 'user' 
                  ? 'text-gray-300' 
                  : message.isError 
                    ? 'text-red-500' 
                    : 'text-gray-500'
              }`}>
                {formatTime(message.timestamp)}
              </p>
            </div>

            {message.type === 'user' && (
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs">AI</span>
            </div>
            <div className="bg-gray-100 rounded-2xl px-4 py-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Questions */}
      {messages.length === 1 && !isCompact && (
        <div className="px-4 py-2 border-t border-gray-100">
          <p className="text-sm text-gray-600 mb-3">Quick questions to get started:</p>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          {!isCompact && (
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <IoAttachOutline className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              placeholder="Type your message here"
              className="w-full px-4 py-3 bg-gray-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              disabled={isTyping}
            />
          </div>
          <button 
            type="submit"
            disabled={!currentMessage.trim() || isTyping}
            className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <IoSendOutline className="w-5 h-5 text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;

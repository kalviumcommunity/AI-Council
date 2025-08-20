import React from 'react';
import Sidebar from '../components/Sidebar';
import ChatInterface from '../components/ChatInterface';

const Chat = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Component */}
      <Sidebar backTo='/dashboard' />

      {/* Main Chat Area */}
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Chat;

// components/ChatInterface.tsx

import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatInterface.module.css';

interface Message {
  text: string;
  isUser: boolean;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    // Start a new session when the component mounts
    const startNewSession = async () => {
      try {
        const response = await fetch('/api/startSession', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: 'test-user' }), // Replace 'test-user' with actual user ID if available
        });

        const data = await response.json();

        if (response.ok) {
          setSessionId(data.sessionId);
          // Add the initial greeting message from the bot
          const initialBotMessage = 'Hello! I can help you get a quote for your used iPhone. Could you please tell me the model of your iPhone?';
          addMessage(initialBotMessage, false);
          // Update conversation history
          setConversationHistory([
            { role: 'assistant', content: initialBotMessage },
          ]);
        } else {
          console.error('Failed to start session:', data.message);
        }
      } catch (error) {
        console.error('Error starting session:', error);
      }
    };

    startNewSession();
  }, []);

  const addMessage = (text: string, isUser: boolean) => {
    if (text) {
      setMessages((prev) => [...prev, { text, isUser }]);
    }
  };

  const sendMessage = async (overrideMessage?: string) => {
    const userMessage = overrideMessage !== undefined ? overrideMessage : input.trim();
    if (!userMessage) return;

    if (overrideMessage === undefined && userMessage) {
      setInput('');
      addMessage(userMessage, true);
    }

    setIsProcessing(true);

    try {
      // Send the message to the chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId, // Include the sessionId
          message: userMessage,
          conversationHistory,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        addMessage(data.response, false);
        // Update conversation history
        setConversationHistory(data.conversationHistory);
      } else {
        addMessage('Sorry, there was an error processing your request.', false);
        console.error('API error:', data.message);
      }
    } catch (error) {
      addMessage('Sorry, there was an error connecting to the server.', false);
      console.error('Network error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`${styles.chatWidgetContainer} ${isMinimized ? styles.minimized : ''}`}>
      <div className={styles.chatHeader}>
        <button
          onClick={toggleMinimize}
          className={styles.minimizeButton}
          aria-label={isMinimized ? 'Expand chat' : 'Minimize chat'}
        >
          {isMinimized ? '+' : '–'}
        </button>
      </div>
      {!isMinimized && (
        <div className={styles.chatContainer}>
          <div className={styles.messageList}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${msg.isUser ? styles.userMessage : styles.botMessage}`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className={styles.inputContainer}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className={styles.chatInput}
              disabled={isProcessing}
            />
            <button
              onClick={() => sendMessage()}
              className={styles.sendButton}
              disabled={isProcessing}
            >
              {isProcessing ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;



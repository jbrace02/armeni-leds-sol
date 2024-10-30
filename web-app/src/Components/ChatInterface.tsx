import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatInterface.module.css';
import { getQuote } from '../helpers/pricingHelper';

interface AddressInfo {
  name: string;
  street1: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
}

interface QuoteDetails {
  model: string;
  storage: string;
  carrier: string;
  condition: string;
  price?: number;
}

interface Message {
  text: string;
  isUser: boolean;
  error?: boolean;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [quoteDetails, setQuoteDetails] = useState<QuoteDetails>({
    model: '',
    storage: '',
    carrier: '',
    condition: '',
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [collectingAddress, setCollectingAddress] = useState(false);
  const [addressStep, setAddressStep] = useState(0);
  const [addressInfo, setAddressInfo] = useState<AddressInfo>({
    name: '',
    street1: '',
    city: '',
    state: '',
    zip: '',
    email: '',
    phone: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const validModels = [
    'iphone 15 pro max',
    'iphone 15 pro',
    'iphone 15',
    'iphone 14 pro max',
    'iphone 14 pro',
    'iphone 14',
    'iphone 13 pro max',
    'iphone 13 pro',
    'iphone 13',
    'iphone 12 pro max',
    'iphone 12 pro',
    'iphone 12',
  ].sort((a, b) => b.length - a.length);

  const validCarriers = ['unlocked', 'at&t', 'verizon', 't-mobile', 'sprint'];
  const storageOptions = ['64gb', '128gb', '256gb', '512gb', '1tb'];

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateZipCode = (zip: string): boolean => {
    return /^\d{5}(-\d{4})?$/.test(zip);
  };

  const validatePhone = (phone: string): boolean => {
    return /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(phone);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMinimize = () => {
    setIsMinimized(prev => !prev);
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    setMessages([{
      text: 'Hello! I can help you get a quote for your used iPhone. Could you please tell me the model of your iPhone?',
      isUser: false,
    }]);
  }, []);

  const addMessage = (text: string, isUser: boolean, error: boolean = false) => {
    setMessages(prev => [...prev, { text, isUser, error }]);
  };

  const generateShippingLabel = async (addressInfo: AddressInfo): Promise<string | null> => {
    try {
      // Normalize the data for Shippo
      const deviceData = {
        model: quoteDetails.model,
        storage: quoteDetails.storage,
        carrier: quoteDetails.carrier,
        condition: quoteDetails.condition,
        price: quoteDetails.price?.toString() // Convert price to string
      };
  
      const response = await fetch('/api/generateShippingLabel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          addressInfo,
          deviceInfo: deviceData
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || data.detail || 'Failed to generate shipping label');
      }
  
      return data.labelUrl;
    } catch (error) {
      console.error('Error calling API:', error);
      throw error;
    }
  };

  const handleAddressCollection = async (userMessage: string): Promise<string> => {
    const currentAddressInfo = { ...addressInfo };

    switch (addressStep) {
      case 0:
        if (!userMessage.trim()) {
          return 'Please provide a valid name.';
        }
        currentAddressInfo.name = userMessage.trim();
        setAddressInfo(currentAddressInfo);
        setAddressStep(1);
        return 'Thank you. What is your street address?';

      case 1:
        if (!userMessage.trim()) {
          return 'Please provide a valid street address.';
        }
        currentAddressInfo.street1 = userMessage.trim();
        setAddressInfo(currentAddressInfo);
        setAddressStep(2);
        return 'Great. What city are you in?';

      case 2:
        if (!userMessage.trim()) {
          return 'Please provide a valid city.';
        }
        currentAddressInfo.city = userMessage.trim();
        setAddressInfo(currentAddressInfo);
        setAddressStep(3);
        return 'Got it. Which state?';

      case 3:
        if (!userMessage.trim()) {
          return 'Please provide a valid state.';
        }
        currentAddressInfo.state = userMessage.trim();
        setAddressInfo(currentAddressInfo);
        setAddressStep(4);
        return 'And your ZIP code?';

      case 4:
        if (!validateZipCode(userMessage)) {
          return 'Please provide a valid ZIP code (e.g., 12345 or 12345-6789).';
        }
        currentAddressInfo.zip = userMessage.trim();
        setAddressInfo(currentAddressInfo);
        setAddressStep(5);
        return 'What is your phone number? (e.g., 123-456-7890)';

      case 5:
        if (!validatePhone(userMessage)) {
          return 'Please provide a valid phone number (e.g., 123-456-7890).';
        }
        currentAddressInfo.phone = userMessage.trim();
        setAddressInfo(currentAddressInfo);
        setAddressStep(6);
        return 'Finally, could you provide your email address for shipping updates?';

      case 6:
        if (!validateEmail(userMessage)) {
          return 'Please provide a valid email address.';
        }
        currentAddressInfo.email = userMessage.trim();
        setAddressInfo(currentAddressInfo);

        try {
          setIsProcessing(true);
          const labelUrl = await generateShippingLabel(currentAddressInfo);
          setCollectingAddress(false);
          setAddressStep(0);
          
          if (labelUrl) {
            return `Thank you! Here's your shipping label: ${labelUrl}\n
              Please print it out and attach it to a USPS Small Flat Rate Box.\n
              You can pick up a free Small Flat Rate Box at your local post office or order them online at https://store.usps.com/.\n
              Once you've shipped your device, please let us know so we can expect it.\n
              A confirmation email has been sent to ${userMessage}.`;
          } else {
            throw new Error('Failed to generate shipping label');
          }
        } catch (error: any) {
          setAddressStep(0);
          return `Error generating shipping label: ${error.message}. Please try again or contact support.`;
        } finally {
          setIsProcessing(false);
        }

      default:
        setCollectingAddress(false);
        setAddressStep(0);
        return 'Unexpected error. Please try again.';
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    addMessage(userMessage, true);

    let responseMessage = '';
    setIsProcessing(true);

    try {
      if (collectingAddress) {
        responseMessage = await handleAddressCollection(userMessage);
      } else {
        // Handle greetings
        if (messages.length === 1 && ['hello', 'hi', 'hey', 'greetings'].includes(userMessage.toLowerCase())) {
          responseMessage = 'Hello! Could you please tell me the model of your iPhone?';
        } 
        // Handle conversation flow
        else if (!quoteDetails.model) {
          const matchedModel = validModels.find(model => 
            userMessage.toLowerCase().includes(model));
          if (matchedModel) {
            setQuoteDetails(prev => ({ ...prev, model: matchedModel }));
            responseMessage = `Great, you have an ${matchedModel}. Which carrier is your iPhone with? (e.g., Unlocked, AT&T, Verizon)`;
          } else {
            responseMessage = 'Sorry, I did not recognize that model. Please specify the exact model of your iPhone (e.g., iPhone 15 Pro Max).';
          }
        } else if (!quoteDetails.carrier) {
          const matchedCarrier = validCarriers.find(carrier => 
            userMessage.toLowerCase().includes(carrier));
          if (matchedCarrier) {
            setQuoteDetails(prev => ({ ...prev, carrier: matchedCarrier }));
            responseMessage = `Perfect, your ${quoteDetails.model} is with ${matchedCarrier}. What's the storage capacity? (e.g., 64GB, 128GB, 256GB)`;
          } else {
            responseMessage = 'Please specify your iPhone carrier (e.g., Unlocked, AT&T, Verizon).';
          }
        } else if (!quoteDetails.storage) {
          const userStorage = userMessage.toLowerCase().replace(/\s+/g, '');
          const matchedStorage = storageOptions.find(storage => 
            userStorage.includes(storage));
          if (matchedStorage) {
            setQuoteDetails(prev => ({ ...prev, storage: matchedStorage }));
            responseMessage = `Thanks! Your ${quoteDetails.model} has ${matchedStorage} of storage. Lastly, could you please tell me the condition of your iPhone? (A/B, C, D)`;
          } else {
            responseMessage = 'Please specify a valid storage capacity (e.g., 64GB, 128GB, 256GB, 512GB, 1TB).';
          }
        } else if (!quoteDetails.condition) {
          const userCondition = userMessage.toUpperCase().trim();
          if (['A/B', 'A', 'B', 'C', 'D'].includes(userCondition)) {
            const conditionCode = ['A', 'B'].includes(userCondition) ? 'A/B' : userCondition;
            setQuoteDetails(prev => ({ ...prev, condition: conditionCode }));
          } else {
            responseMessage = 'Please specify a valid condition: A/B, C, or D.';
          }
        } else {
          if (/yes|proceed/i.test(userMessage) && !collectingAddress) {
            responseMessage = 'Great! To generate your shipping label, I\'ll need your shipping information.\nWhat is your full name?';
            setCollectingAddress(true);
            setAddressStep(0);
          } else if (/no|not now/i.test(userMessage)) {
            responseMessage = 'No problem! Let me know if you have any other questions.';
          } else {
            responseMessage = 'How else can I assist you today?';
          }
        }
      }
    } catch (error) {
      responseMessage = 'Sorry, there was an error processing your request. Please try again.';
      console.error('Error in sendMessage:', error);
    } finally {
      setIsProcessing(false);
    }

    if (responseMessage) {
      addMessage(responseMessage, false);
    }
  };

  useEffect(() => {
    if (quoteDetails.model && quoteDetails.storage && 
        quoteDetails.carrier && quoteDetails.condition && 
        !messages.some(msg => msg.text.includes('The estimated value of your'))) {
      
      const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '').trim();
      const price = getQuote(
        normalize(quoteDetails.model),
        normalize(quoteDetails.storage),
        normalize(quoteDetails.carrier),
        quoteDetails.condition
      );

      if (price !== null) {
        setQuoteDetails(prev => ({ ...prev, price }));
        addMessage(`The estimated value of your ${quoteDetails.model} is $${price}. Would you like to proceed?`, false);
      } else {
        addMessage('Sorry, I could not find a quote for your device based on the information provided. Could we try again?', false, true);
        setQuoteDetails({
          model: '',
          storage: '',
          carrier: '',
          condition: '',
        });
      }
    }
  }, [quoteDetails.model, quoteDetails.storage, quoteDetails.carrier, quoteDetails.condition]);

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
                className={`${msg.isUser ? styles.userMessage : styles.botMessage} 
                           ${msg.error ? styles.errorMessage : ''}`}
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
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className={styles.chatInput}
              disabled={isProcessing}
            />
            <button 
              onClick={sendMessage} 
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
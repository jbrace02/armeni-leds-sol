import OpenAI from 'openai';
import { NextApiRequest, NextApiResponse } from 'next';
import { getPrice } from '../../src/utils/pricing';

// Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define the steps in the conversation process
const steps = ['greeting', 'model', 'carrier', 'storage', 'condition', 'quote'];

// Define the API handler function
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is POST, if not, return a 405 Method Not Allowed response
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    // Extract message, threadId, and conversationHistory from the request body
    const { message, threadId, conversationHistory } = req.body;

    // Determine the current step and the next step in the conversation
    const currentStep = getCurrentStep(conversationHistory);
    const nextStep = getNextStep(currentStep);

    // Debugging: Log the current and next steps
    console.log('Current Step:', currentStep);
    console.log('Next Step:', nextStep);

    // Get the prompt for the next step
    let prompt = getPromptForStep(nextStep, conversationHistory);

    let responseMessage = '';

    if (nextStep === 'quote') {
      const deviceInfo = extractDeviceInfo([
        ...(conversationHistory || []),
        { role: 'user', content: message },
      ]);

      // Debugging: Log the extracted device information
      console.log('Extracted Device Info:', deviceInfo);

      if (
        deviceInfo.model &&
        deviceInfo.storage &&
        deviceInfo.carrier &&
        deviceInfo.condition
      ) {
        const price = getPrice(
          deviceInfo.model,
          deviceInfo.storage,
          deviceInfo.carrier,
          deviceInfo.condition
        );

        // Debugging: Log the price retrieved from getPrice
        console.log('Price from getPrice:', price);

        if (price !== null) {
          responseMessage = `Great! Based on the information you've provided, we can offer you $${price} for your ${deviceInfo.model} with ${deviceInfo.storage} storage, ${deviceInfo.carrier} carrier, in ${deviceInfo.condition} condition. Would you like to proceed with this offer?`;
        } else {
          console.error('Price not found for the given device info.');
          responseMessage = `I'm sorry, but I couldn't find a price for the device you described. Could you please double-check the information you provided?`;
        }
      } else {
        console.error('Incomplete device information:', deviceInfo);
        responseMessage = prompt; // Ask for any missing information
      }
    } else {
      // Construct the messages array for the OpenAI API call
      const messages = [
        {
          role: 'system',
          content: `
You are a helpful assistant that collects details about an iPhone to provide a quote.

- Follow the conversation steps strictly: model, carrier, storage, condition.
- Do not ask about accessories, original box, or any other information.
- Do not provide or mention the quote yourself; the system will handle it.
- After collecting all details, simply acknowledge and end your response with "calculate a quote."
- Do not add any extra phrases.
- Ask one question at a time and wait for the user's response before proceeding.
- Use the following definitions for conditions:

  - **A/B**: Used condition, fully functional, no aftermarket parts (replaced by Apple is okay).
  - **C**: Cracked screen, but good LCD. No aftermarket parts. A bad button is okay.
  - **D**: Bad LCD (spots, bad touch), aftermarket LCDs, etc.

- Be friendly and concise in your responses.
`,
        },
        ...(conversationHistory || []),
        { role: 'user', content: message },
      ];

      // Debugging: Log the messages sent to the OpenAI API
      console.log('Messages sent to OpenAI API:', messages);

      // Call the OpenAI API to get a response based on the messages
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        temperature: 0,
      });

      // Extract the response message from the OpenAI API response
      responseMessage = completion.choices[0].message?.content;

      // Debugging: Log the assistant's response
      console.log('Assistant Response:', responseMessage);
    }

    // Update the conversation history with the new messages
    const updatedConversationHistory = [
      ...(conversationHistory || []),
      { role: 'user', content: message },
      { role: 'assistant', content: responseMessage },
    ];

    // Return the response message, threadId, and updated conversation history in the response
    return res.status(200).json({
      response: responseMessage,
      threadId: threadId || null,
      conversationHistory: updatedConversationHistory,
    });
  } catch (error: any) {
    // Log any errors and return a 500 Internal Server Error response
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Error processing your request' });
  }
}

// Function to determine the current step in the conversation based on the conversation history
function getCurrentStep(conversationHistory: any[]) {
  const assistantMessages = conversationHistory.filter(
    (msg) => msg.role === 'assistant'
  );
  if (assistantMessages.length === 0) return 'greeting';

  for (let i = steps.length - 1; i >= 0; i--) {
    const stepKeyword = getStepKeyword(steps[i]).toLowerCase();
    const lastAssistantMessage =
      assistantMessages[assistantMessages.length - 1].content.toLowerCase();

    // Debugging: Log the step being checked and the keyword
    console.log(`Checking for step: ${steps[i]}, Keyword: ${stepKeyword}`);

    if (lastAssistantMessage.includes(stepKeyword)) {
      console.log(`Current step identified as: ${steps[i]}`);
      return steps[i];
    }
  }
  return 'greeting';
}

// Function to map steps to keywords for step detection
function getStepKeyword(step: string) {
  const keywords: { [key: string]: string } = {
    greeting: 'which iphone model',
    model: 'unlocked or locked',
    carrier: 'storage capacity',
    storage: 'describe the condition',
    condition: 'calculate a quote',
    quote: 'we can offer you',
  };
  return keywords[step] || step;
}

// Function to determine the next step in the conversation based on the current step
function getNextStep(currentStep: string) {
  const currentIndex = steps.indexOf(currentStep);
  return steps[currentIndex + 1] || 'quote';
}

// Function to get the prompt for the next step in the conversation
function getPromptForStep(step: string, conversationHistory: any[]) {
  const deviceInfo = extractDeviceInfo(conversationHistory);

  switch (step) {
    case 'greeting':
      return 'Hi there! I can help you get an instant quote for your iPhone. Could you please tell me which iPhone model you have? For example, iPhone 14 Pro Max.';
    case 'model':
      return `Great! Is your ${deviceInfo.model || 'iPhone'} unlocked or locked to a specific carrier?`;
    case 'carrier':
      return `Thank you. What's the storage capacity of your ${deviceInfo.model}? (e.g., 64GB, 128GB, 256GB, etc.)`;
    case 'storage':
      return `Could you please describe the condition of your device? Please choose one of the following options:

1. **A/B**: Used condition, fully functional, no aftermarket parts (replaced by Apple is okay).
2. **C**: Cracked screen, but good LCD. No aftermarket parts. A bad button is okay.
3. **D**: Bad LCD (spots, bad touch), aftermarket LCDs, etc.`;
    case 'condition':
      return "Thank you for providing all the necessary details. **Calculate a quote**.";
    default:
      return "I'm sorry, I didn't understand that. Could you please provide more information?";
  }
}

// Function to extract device information from the conversation history
function extractDeviceInfo(conversationHistory: any[]) {
  let model = '';
  let storage = '';
  let carrier = '';
  let condition = '';

  conversationHistory.forEach((msg) => {
    if (msg.role === 'user') {
      const content = msg.content.toLowerCase();

      // Debugging: Log the user's message content
      console.log('Processing user message:', content);

      // Extract model
      const modelMatch = content.match(
        /iphone\s?(se\s?\d|[0-9]+|x[rs]?|[a-z]+\s?[a-z]*)(?:\s?(pro max|pro|plus|mini))?/i
      );
      if (modelMatch) {
        model = modelMatch[0].trim();
        // Debugging: Log the extracted model
        console.log('Extracted model:', model);
      }

      // Extract storage
      const storageMatch = content.match(/(\d+)\s*gb/i);
      if (storageMatch) {
        storage = storageMatch[1] + 'GB';
        // Debugging: Log the extracted storage
        console.log('Extracted storage:', storage);
      }

      // Extract carrier
      if (content.includes('unlocked')) {
        carrier = 'Unlocked';
        // Debugging: Log the extracted carrier
        console.log('Extracted carrier:', carrier);
      } else if (content.includes('locked')) {
        carrier = 'Locked';
        console.log('Extracted carrier:', carrier);
      }

      // Extract condition
      if (
        content.includes('a/b') ||
        content.includes('fully functional') ||
        content.includes('good') ||
        content.includes('working')
      ) {
        condition = 'A/B';
        // Debugging: Log the extracted condition
        console.log('Extracted condition:', condition);
      } else if (
        content.includes('c') ||
        content.includes('cracked screen') ||
        content.includes('cracked') ||
        content.includes('bad button')
      ) {
        condition = 'C';
        console.log('Extracted condition:', condition);
      } else if (
        content.includes('d') ||
        content.includes('bad lcd') ||
        content.includes('spots') ||
        content.includes('bad touch') ||
        content.includes('aftermarket')
      ) {
        condition = 'D';
        console.log('Extracted condition:', condition);
      }
    }
  });

  return { model, storage, carrier, condition };
}

















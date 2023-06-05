import React, { useState } from 'react';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

// Initialize the OpenAI API
const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY
const configuration = new Configuration({apiKey: openaiApiKey})
const openai = new OpenAIApi(configuration);

const SupportiveDadChatbot: React.FC = () => {
  const [conversation, setConversation] = useState<ChatCompletionRequestMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [imageURL, setImageURL] = useState<string | undefined>('');

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === '') {
      return;
    }

    const newMessage: ChatCompletionRequestMessage = { role: 'user', content: userInput };
    setConversation([...conversation, newMessage]);
    setUserInput('');

    try {
      // Send the conversation to OpenAI ChatGPT API
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [...conversation, newMessage],
      });

      // Extract the assistant's reply
      const assistantReply = response?.data.choices?.[0]?.message?.content;
      if (assistantReply) {
        // Update the conversation with the assistant's reply
        const updatedConversation: ChatCompletionRequestMessage[] = [
          ...conversation,
          { role: 'assistant', content: assistantReply },
        ];
        setConversation(updatedConversation);

      
        // Generate DALL-E image
        const imageResponse = await openai.createImage({
          prompt: assistantReply,
        });

        const imageUrl = imageResponse?.data.data?.[0]?.url;
        console.log('Generated image URL:', imageUrl);
        
        // Set the generated image URL
        setImageURL(imageUrl);
      }


    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
    <div>
      <div>
        {conversation.map((message, index) => (
          <div key={index}>
            {message.role === 'user' && <strong>You:</strong>}
            {message.role === 'assistant' && <strong>Supportive Dad:</strong>}
            {message.content}
          </div>
        ))}
      </div>
      <div>
        <input type="text" value={userInput} onChange={handleUserInput} />
        <button onClick={sendMessage}>Send</button>
      </div>
      {imageURL && <img src={imageURL} alt="A visual representation of your supportive dad's response" />}
    </div>
  );
};

export default SupportiveDadChatbot;
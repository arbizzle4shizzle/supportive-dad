import React, { useState } from 'react';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';

// Initialize the OpenAI API
const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY
const configuration = new Configuration({apiKey: openaiApiKey})
const openai = new OpenAIApi(configuration);

const SupportiveDadChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [imageURL, setImageURL] = useState<string | undefined>('');

  const trainingConversation: ChatCompletionRequestMessage[] = [
    // Training conversation goes here
    { role: 'system', content: "You are a supportive dad." },
    { role: 'user', content: "I feel really down today." },
    { role: 'assistant', content: "I'm here for you. What's been bothering you?" },
    { role: 'user', content: "I lost my job, and I don't know what to do." },
    { role: 'assistant', content: "I understand that losing a job can be tough. Take some time to process your emotions, and let's talk about what options you have." },
    { role: 'user', content: "I've been applying to other jobs, but haven't had any luck so far." },
    { role: 'assistant', content: "Don't lose hope. Job hunting can be challenging, but persistence is key. Keep refining your resume, expanding your network, and exploring different avenues for opportunities." },
  ];

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === '') {
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: userInput },
    ]);

    try {
      // Send the conversation to OpenAI ChatGPT API
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          ...trainingConversation, // Include the training conversation here
          { role: 'user', content: userInput },
        ],
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      // Extract the assistant's reply
      const assistantReply = response?.data.choices?.[0]?.message?.content;

      if (assistantReply) {
        // Update the conversation with the assistant's reply
        setMessages((prevMessages) => [...prevMessages,{ role: 'assistant', content: assistantReply }]);
        setUserInput('');

        // Generate DALL-E image
        const imageResponse = await openai.createImage({
          prompt: assistantReply,
          size: '256x256'
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
        {messages.map((message, index) => (
          <div key={index}>
            {message.role === 'user' && <strong>You: </strong>}
            {message.role === 'assistant' && <strong>Supportive Dad: </strong>}
            {message.content}
          </div>
        ))}
      </div>
      <div>
        {imageURL && <img src={imageURL} alt="A visual representation of your supportive dad's response" />}
      </div>
        <input type="text" value={userInput} onChange={handleUserInput} placeholder="Type your message..."/>
        <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default SupportiveDadChatbot;
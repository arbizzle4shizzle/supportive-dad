import React, { useState, useEffect } from 'react';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import './SupportiveDadChatbot.css';

const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;
const configuration = new Configuration({ apiKey: openaiApiKey });
const openai = new OpenAIApi(configuration);

const SupportiveDadChatbot: React.FC = () => {
  const [stage, setStage] = useState(1);
  const [response, setResponse] = useState('');
  const [userInput, setUserInput] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [imageURL, setImageURL] = useState<string | undefined>('');

  const trainingConversation: ChatCompletionRequestMessage[] = [
    { role: 'system', content: "You are a supportive dad." },
    { role: 'user', content: "I feel really down today." },
    { role: 'assistant', content: "I'm here for you. What's been bothering you?" },
    { role: 'user', content: "I lost my job, and I don't know what to do." },
    { role: 'assistant', content: "I understand that losing a job can be tough. Take some time to process your emotions, and let's talk about what options you have." },
    { role: 'user', content: "I've been applying to other jobs, but haven't had any luck so far." },
    { role: 'assistant', content: "Don't lose hope. Job hunting can be challenging, but persistence is key. Keep refining your resume, expanding your network, and exploring different avenues for opportunities." },
  ];


  useEffect(() => {
    const timer = setTimeout(() => {
      if (stage === 1) {
        setStage(2);
      } else if (stage === 2) {
        setStage(3);
      } else if (stage === 3 && messageSent) {
        setStage(4);
      } else if (stage === 4 && response) {
        setStage(5);
      }
    }, 4500);

    return () => clearTimeout(timer);
  }, [stage, messageSent, response]);

  const handleReset = () => {
    setStage(1);
    setUserInput('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevent the form submission (if any)
      sendMessage();
    }
  }

  const renderStage1 = () => (
    <div className="stage-container">
      <h1 className="fade-in-intro">Hey kid, heard there's something on your mind...</h1>
    </div>
  );

  const renderStage2 = () => (
    <div className="stage-container">
      <h1 className="fade-in-intro">Don't worry, everything will be okay.</h1>
      <h1 className="fade-in-intro">I'm here for you.</h1>
    </div>
  );

  const renderStage3 = () => (
    <div className="stage-container">
    <h1 className={!messageSent ? 'fade-in' : 'fade-out'}>
      Tell me, what's going on?
    </h1>
    <input
      className={`input-box ${messageSent ? 'fade-out' : 'fade-in'}`}
      type="text"
      value={userInput}
      onChange={handleUserInput}
      placeholder="Enter your text..."
      onKeyDown={handleKeyDown}
    />
    <button className={`send-button ${messageSent ? 'fade-out disabled' : 'fade-in'}`} onClick={sendMessage} disabled={messageSent} style={{ width: '100px' }}>
      {messageSent ? 'Sending...' : 'Send'}
    </button>
    </div>
  );

  const renderStage4 = () => (
    <div className="stage-container">
      <h1 className={`${!response ? "fade-in" : "fade-out" }`}>Ah, I see...</h1>
    </div>
  );

  const renderStage5 = () => {
    // const phrases = ['Phrase 1', 'Phrase 2', 'Phrase 3'];
    // const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    const imagePhrase = "And here's a little picture you can hold on to to remind you of our conversation:"

    return (
      <div className="stage-container">
        <h1 className="fade-in">{response}</h1>
        {imageURL && (
          <>
            <h2 className="fade-in">{imagePhrase}</h2>
            <img className="fade-in" src={imageURL} alt="A visual representation of your supportive dad's response" />
          </>
          )
        }
        <button className="fade-in reset-button" onClick={handleReset}>
          There's something else...
        </button>
      </div>
    );
  };

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const sendMessage = async () => {
    if (userInput.trim() === '') {
      return;
    }
    setMessageSent(true)

    try {
      const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          ...trainingConversation,
          { role: 'user', content: userInput },
        ],
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const assistantReply = response?.data.choices?.[0]?.message?.content;

      if (assistantReply) {
        setResponse(assistantReply)
        setUserInput('');

        const imageResponse = await openai.createImage({
          prompt: assistantReply,
          size: '256x256'
        });

        const imageUrl = imageResponse?.data.data?.[0]?.url;
        console.log('Generated image URL:', imageUrl);

        setImageURL(imageUrl);
      }
    } catch (error) {
      console.log('Error:', error);
    }
  };

  return (
  <div className="app-container">
    {stage === 1 && renderStage1()}
    {stage === 2 && renderStage2()}
    {stage === 3 && renderStage3()}
    {stage === 4 && renderStage4()}
    {stage === 5 && renderStage5()}
  </div>
    // <div className="container">

    //   {imageURL && (
    //     <div className="fade-in">
    //       <img src={imageURL} alt="A visual representation of your supportive dad's response" />
    //       {/* <button onClick={() => window.open(imageURL, '_blank')}>Save Image</button> */}
    //     </div>
    //   )}
    // </div>
  );
};

export default SupportiveDadChatbot;

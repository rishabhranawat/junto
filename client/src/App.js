import React, { useState } from 'react';
import './App.css'; // Adjust the path to where your CSS file is located


function playAudio(voiceId, apiKey, text) {
  return new Promise(async (resolve, reject) => {
    const apiEndpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`;
    const requestOptions = {
      method: "POST",
      headers: new Headers({
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify({ text: text }),
    };

    try {
      const response = await fetch(apiEndpoint, requestOptions);
      if (response.status === 200) {
        const audioArrayBuffer = await response.arrayBuffer();
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(audioArrayBuffer);
        const audioSource = audioContext.createBufferSource();
        audioSource.buffer = audioBuffer;
        audioSource.connect(audioContext.destination);
        audioSource.onended = () => resolve();
        audioSource.start(0);
      } else {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      reject(error);
    }
  });
}

async function fetchDebateResponses(topic) {
  try {
    const response = await fetch('https://junto-production.up.railway.app/api/junto/debate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include other headers as needed, like authorization tokens
      },
      body: JSON.stringify({
        topic: topic,
        character_a: "elon musk",
        character_b: "sam altman",
        conversation_length: 2
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.response; // assuming the response has the format you mentioned
  } catch (error) {
    console.error('Error fetching debate responses:', error);
  }
}



function App() {
  const [message, setMessage] = useState('');
  const [character_a, setCharacterA] = useState([]);
  const [character_b, setCharacterB] = useState([]);
  const [debateIndex, setDebateIndex] = useState(0); // Track the current debate index

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const samVoiceId = 'u7xgpULux19BNuHMP06q';
  const elonVoiceId = '1VUZprdAhYedtAMXjCOO';

  const handleSubmit = async () => {
    // Fetching responses only if we don't have any yet (i.e., when debateIndex is 0)
    if (debateIndex === 0) {
      const responses = await fetchDebateResponses(message);
      if (responses) {
        // Iterate over responses and update state
        for (const response of responses) {
          setCharacterA(prev => [...prev, response['elon musk']]);
          setCharacterB(prev => [...prev, response['sam altman']]);
          // Play audio for "elon musk"
          await playAudio(elonVoiceId, '5b20c03607efa79ee59c65b4242b139d', response['elon musk']);
          // Play audio for "sam altman"
          await playAudio(samVoiceId, '5b20c03607efa79ee59c65b4242b139d', response['sam altman']);
          setDebateIndex(prev => prev + 1);
        }
      }
    }
    setMessage(''); // Clear the input field
  };
  
  // Update playDebateSequence to accept responses as a parameter
  const playDebateSequence = async (index, responses) => {
    if (index < responses.length) {
      // Queue the response for Character A
      setCharacterA((prevA) => [...prevA, responses[index].character_a]);
      try {
        await playAudio(samVoiceId, '5b20c03607efa79ee59c65b4242b139d', responses[index].character_a);
      } catch (error) {
        console.error('Error playing audio for Character A:', error);
        return;
      }
  
      // Queue the response for Character B
      setCharacterB((prevB) => [...prevB, responses[index].character_b]);
      try {
        await playAudio(elonVoiceId, '5b20c03607efa79ee59c65b4242b139d', responses[index].character_b);
      } catch (error) {
        console.error('Error playing audio for Character B:', error);
        return;
      }
      
      setTimeout(() => playDebateSequence(index + 1, responses), 500);
    } else {
      console.log('Debate sequence finished');
    }
  };

  return (
    <div id="chat-container">
      <h1>Junto</h1>
      <input
        type="text"
        placeholder="Enter Debate Topic"
        value={message}
        onChange={handleInputChange}
        id="message-input"
      />
      <button onClick={handleSubmit} id="submit-button">Submit</button>
      <div id="response-container" style={{ display: 'flex' }}>
        <div className="character-response" style={{ flex: 1, padding: '10px' }}>
          <h2 className="character-name">Elon Musk:</h2>
          {character_a.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
        <div className="character-response" style={{ flex: 1, padding: '10px' }}>
          <h2 className="character-name">Sam Altman:</h2>
          {character_b.map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      </div>
    </div>
  );
  
}

export default App;

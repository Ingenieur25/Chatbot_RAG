import React, { useState, ChangeEvent, KeyboardEvent } from 'react';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages((prev) => [...prev, `You: ${userMessage}`]);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Server error: ${errorData}`);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, `Bot: ${data.response}`]);
    } catch (error) {
      console.error('Failed to get response:', error);
      setMessages((prev) => [...prev, 'Bot: Sorry, something went wrong.']);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      {/* Chat Messages */}
      <div style={{ marginBottom: '20px', maxHeight: '300px', overflowY: 'auto' }}>
        {messages.map((message, index) => (
          <p key={index} style={{ margin: '5px 0' }}>
            {message}
          </p>
        ))}
      </div>

      {/* Input Field */}
      <div>
      <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#ffc107', marginBottom: '10px' }}>
      Welcome to the RAG chatbot for hospital information.
        </p>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your question..."
          style={{
            width: 'calc(100% - 50px)',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <button
          onClick={handleSubmit}
          style={{
            marginLeft: '10px',
            padding: '10px 15px',
            backgroundColor: '#ffc107',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            color: 'white',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;

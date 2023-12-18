import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

const socket = io('http://localhost:3000'); 

const AgentChat = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    // Join the chat room when the component mounts
    socket.emit('join-chat', chatId);

    // Listen for incoming messages
    socket.on('receive-message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup when the component unmounts
    return () => {
      socket.emit('leave-chat', chatId);
      socket.off('receive-message');
    };
  }, [chatId]);

  // const getCurrentAgentId = async () => {
  //   try {
  //     const currentAgent = await axios.get('http://localhost:3000/api/v1/user/getCurUser');
  //     return currentAgent.data._id;
  //   } catch (error) {
  //     console.error('Error getting current agent:', error);
  //     // Handle error (return null or throw an error)
  //     return null;
  //   }
  // };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageInput.trim() !== '') {
      try {
        const agentId = socket.id;
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          console.error('Invalid userId:', userId);
          // Handle the error (display an error message, etc.)
          return;
        }
  
        // Emit the message to the server with the actual user ID
        socket.emit('send-message', {
          chatId,
          content: messageInput,
          createdBy: agentId,
        });
  
        // Update the local state with the sent message
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            _id: Math.random().toString(),
            chatId,
            content: messageInput,
            createdAt: new Date(),
            createdBy: agentId,
          },
        ]);
  
        // Clear the input field
        setMessageInput('');
      } catch (error) {
        console.error('Error sending message:', error);
        // Handle error (display an error message, etc.)
      }
    }
  };
  return (
    <Container>
      <div>
        <h2>Agent Chat Room: {chatId}</h2>
        <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
          {messages.map((msg) => (
            <div key={msg._id}>
              <strong>{msg.createdBy}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <Form onSubmit={handleSendMessage}>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
          </Form.Group>
          <Button type="submit">Send</Button>
        </Form>
      </div>
    </Container>
  );
};

export default AgentChat;

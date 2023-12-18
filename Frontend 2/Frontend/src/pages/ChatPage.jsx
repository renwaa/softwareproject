import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

// let backend_url = "http://localhost:3000/api/v1";
const socket = io('http://localhost:3000'); 

const Chat = () => {
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

  const getCurrentUserId = async () => {
    try {
      const currentUser = await axios.get('http://localhost:3000/api/v1/user/getCurUser');
      return currentUser.data._id;
    } catch (error) {
      console.error('Error getting current user:', error);
      // Handle error (return null or throw an error)
      return null;
    }
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageInput.trim() !== '') {
      try {
        const userId = await getCurrentUserId();
  
        if (userId) {
          // Emit the message to the server with the actual user ID
          socket.emit('send-message', {
            chatId,
            content: messageInput,
            createdBy: userId,
          });
  
          // Update the local state with the sent message
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              _id: Math.random().toString(),
              chatId,
              content: messageInput,
              createdAt: new Date(),
              createdBy: userId,
            },
          ]);
  
          // Clear the input field
          setMessageInput('');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        // Handle error (display an error message, etc.)
      }
    }
  };

  return (
    <Container>
      <div>
        <h2>Chat Room: {chatId}</h2>
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

export default Chat;

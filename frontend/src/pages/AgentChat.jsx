// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { io } from 'socket.io-client';
// import Container from 'react-bootstrap/Container';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';

// const socket = io('http://localhost:3000'); 

// const AgentChat = () => {
//   const { chatId } = useParams();
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState('');

//   useEffect(() => {
//     // Join the chat room when the component mounts
//     socket.emit('join-chat', chatId);

//     // Listen for incoming messages
//     socket.on('receive-message', (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]);
//     });

//     // Cleanup when the component unmounts
//     return () => {
//       socket.emit('leave-chat', chatId);
//       socket.off('receive-message');
//     };
//   }, [chatId]);

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (messageInput.trim() !== '') {
//       // Emit the message to the server
//       socket.emit('send-message', { chatId, message: messageInput, createdBy: 'agent123' }); // Replace with actual agent ID

//       // Update the local state with the sent message
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         {
//           _id: Math.random().toString(),
//           chatId,
//           content: messageInput,
//           createdAt: new Date(),
//           createdBy: 'agent123', // Replace with actual agent ID
//         },
//       ]);

//       // Clear the input field
//       setMessageInput('');
//     }
//   };

//   return (
//     <Container>
//       <div>
//         <h2>Agent Chat Room: {chatId}</h2>
//         <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
//           {messages.map((msg) => (
//             <div key={msg._id}>
//               <strong>{msg.createdBy}:</strong> {msg.content}
//             </div>
//           ))}
//         </div>
//         <Form onSubmit={handleSendMessage}>
//           <Form.Group>
//             <Form.Control
//               type="text"
//               placeholder="Type your message..."
//               value={messageInput}
//               onChange={(e) => setMessageInput(e.target.value)}
//             />
//           </Form.Group>
//           <Button type="submit">Send</Button>
//         </Form>
//       </div>
//     </Container>
//   );
// };

// export default AgentChat;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // Updated import
import 'bootstrap/dist/css/bootstrap.min.css';

const userId = localStorage.getItem("userId");
const role = localStorage.getItem("role");
let chatId=0;
let counter =0;

const AccessChat = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Function to fetch the chat by agent ID
  const fetchChatForAgent = async () => {
    setLoading(true);
    try {
      console.log("current local" ,localStorage);
      const agentId = localStorage.getItem("userId");
      const response = await axios.get(
        `http://localhost:3000/api/v1/realTimeChat/accessChat/${agentId}`,
        { withCredentials: true }
      );
    
      const { status } = response;

      if (status === 200) {
        chatId = response.data.chat._id;
      }

      // setChatId((currentChatId)=>response.data.chat._id);
      console.log("CHAT ID FROM FETCH", chatId);

      await handleReceiveMessage();
    } catch (err) {
      setShowAlert(true); // Show the alert 
      // setTimeout(() => {
      //   navigate('/homepage'); // Redirect after 30 seconds
      // }, 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (counter === 0) {
      fetchChatForAgent();
    }
    counter = 1;
  
    // Set up the interval
    const intervalId = setInterval(() => {
        fetchChatForAgent();
        handleReceiveMessage();
    }, 500);
  
    // Clear interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
    
  
  const handleSendMessage = async () => {
    if (!messageInput.trim()) {
      // Don't send empty messages
      return;
    }
        const response = await axios.post(
        'http://localhost:3000/api/v1/realTimeChat/send',
        { chatId: chatId, content: messageInput, role:role , userId : userId  },
        { withCredentials: true }
      );

      const { status } = response;

      if (status === 200) {
        console.log("SEND MESG" , response.data);
       }
       const newMessage = response.data.newMessage;
       setMessageInput('');
       await handleReceiveMessage();

  };

  const handleReceiveMessage = async () => {
    try {
      console.log("enter recieve messages in frontend");
      console.log("chat id: " , chatId);
      console.log(`http://localhost:3000/api/v1/realTimeChat/msgreceive/${chatId}`);

      const response = await axios.get(
        `http://localhost:3000/api/v1/realTimeChat/msgreceive/${chatId}`,
        { withCredentials: true }
      );
      console.log(response.data);
      
      setMessages(response.data.messages);
      console.log("messageS:" ,messages)
    } catch (error) {
      console.error("Error receiving messages:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
    navigate("/homepage")
  };


  return (
    <>
   
   {showAlert ? (
    <div className="row no-gutters">
      <div className="alert alert-danger shadow my-3" role="alert" 
           style={{ 
            borderRadius: '3px', 
            width: '600px', 
            margin: '40px auto', 
            justifyContent: 'center', 
            alignItems: 'center',
            textAlign: 'center',
        }}>
        <div className="text-center">
          <svg width="3em" height="3em" viewBox="0 0 16 16" className="m-1 bi bi-exclamation-circle-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
          </svg>
        </div>
        <p style={{ fontSize: '18px' }} className="mb-0 font-weight-light">
          <strong className="mr-1">Warning!</strong>User has ended the chat session.
        </p>
        <button className="btn btn-danger mt-3" onClick={handleCloseAlert}>Exit</button>
      </div>
    </div>
  ) : (
    <h1 className="h3 mb-3 font-weight-normal">Chat Room</h1>
  )}
        {/* Chat Box */}
        <div className="col-11 px-5 mx-auto" style ={{ width : "400 px"}}>
        <div className="px-4 py-5 chat-box bg-white" style={{ maxHeight: '400px', overflowY: 'scroll' }}> {/* Adjusted height and overflow */}
         



            {/* Dynamic Messages */}
            {messages.map((message, index) => {
              const isAgent = (message.creatorName === 'agent1' || message.creatorName === 'agent2' || message.creatorName === 'agent3');
              return (
                <div className={`media w-50 mb-3 ${isAgent ? '' : 'ml-auto '}`} key={message._id || index}>
                  {isAgent && <img src="https://bootstrapious.com/i/snippets/sn-chat/avatar.svg" alt="user" width="50" className="rounded-circle" />}
                  <div className={`media-body ${isAgent ? 'ml-3' : 'mr-3'}`}>
                    <strong>{message.creatorName}</strong>
                    <div className={`rounded py-2 px-3 mb-2 ${isAgent ? 'bg-light' : 'bg-blue padded-left'}`}>
                      <p className={`text-small mb-0 ${isAgent ? 'text-muted' : 'text-white'}`}>{message.content}</p>
                    </div>
                    {message.createdAt}
                  </div>
                </div>
              );
            })}
          </div>



          
          {/* Typing area */}
          <form action="#" className="bg-light">
            <div className="input-group">
              <input
                type="text"
                placeholder="Type a message"
                aria-describedby="button-addon2"
                className="form-control rounded-0 border-0 py-4 bg-light"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
              />
              <div className="input-group-append">
                {/* SVG as a button */}
                <button 
                  id="button-addon2" 
                  type="submit" 
                  className="btn btn-link" 
                  onClick={(e) => { e.preventDefault(); handleSendMessage(); }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path fill="none" d="M0 0h24v24H0V0z"></path>
                    <path d="M3.4 20.4l17.45-7.48c.81-.35.81-1.49 0-1.84L3.4 3.6c-.66-.29-1.39.2-1.39.91L2 9.12c0 .5.37.93.87.99L17 12 2.87 13.88c-.5.07-.87.5-.87 1l.01 4.61c0 .71.73 1.2 1.39.91z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </form>
        </div>
        </>
  );

};
export default AccessChat;
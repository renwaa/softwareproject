  import React, { useEffect, useState } from 'react';
  import axios from 'axios';
  import { Form } from 'react-bootstrap';
  import '../stylesheets/chat.css';
  import { useNavigate } from 'react-router-dom'; // Import useNavigate

  import { useCustomization } from "../contexts/CustomizationContext";

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("username");
  let chatId = 0;
  let counter =0;
  let chatEnded = false;
  const Chat = () => {
    const { customization, updateCustomization } = useCustomization();
    const [messages, setMessages] = useState([]);
    const [messageInput, setMessageInput] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false); // State for modal visibility

  

    const initiateRealTimeChat = async () => {
          try {
            console.log("INTIATE REAL TIME CHAT");
            console.log("current local" ,localStorage);
            const response = await axios.post(
              'http://localhost:3000/api/v1/realTimeChat/requestChat',
              {
                userId: userId,
              },
              {
                withCredentials: true,
              }
            ); 
            console.log("HELLO"); 
            console.log(response.data);
      
            chatId = response.data.chatId;
      
          } catch (error) {
            console.error("Error initiating real-time chat:", error.response?.data || error.message);
          }
      };
      
      useEffect(() => {
        if (counter === 0) {
          initiateRealTimeChat();
        }
        counter = 1;
      
        // Set up the interval
        const intervalId = setInterval(() => {
          handleReceiveMessage();
        }, 1000);
      
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

    const handlechatEnded = async () =>{
      try{
        console.log("enter end chat");
        const response = await axios.put(
          `http://localhost:3000/api/v1/realTimeChat/endChat/${chatId}`,{} , 
          { withCredentials: true }
        );
        console.log("response: " , response.data);
        if(response.status===200) {
          chatEnded = true;
        }

        navigate("/homepage");

      } catch(error){
        console.error("Error receiving messages:", error.response?.data || error.message);
      }
    }

    const handleEndChatClick = () => {
      setIsModalVisible(true); // Show the modal when button is clicked
    };

    const handleCloseModal = () => {
      setIsModalVisible(false); // Close the modal
    };
  
    

    return (
      <>
      <div className="container py-5 px-4">
        <header className="text-center">
          <h1 className="display-4 text-white">Chat Room</h1>
        </header>

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
                  {/* End Chat button */}
                  <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={handleEndChatClick}
        style={{ color: 'red' }} // Inline styling to change the color
      ></button>

      {/* Modal */}
      {isModalVisible && (
  <div id="myModal" className="modal fade show" style={{ display: 'block' }}>
    <div className="modal-dialog modal-confirm">
      <div className="modal-content">
        <div className="modal-header">
          <div className="icon-box">
            <i className="material-icons">&#xE5CD;</i>
          </div>        
          <h4 className="modal-title">Are you sure?</h4>
          <button type="button" className="close" onClick={handleCloseModal} aria-hidden="true">&times;</button>
        </div>
        <div className="modal-body">
          <p>Do you really want to exit chatting with our agent?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-info" onClick={handleCloseModal}>Cancel</button>
          <button type="button" className="btn btn-danger" onClick={handlechatEnded}>End Chat</button>
        </div>
      </div>
    </div>
  </div>
)}


                </div>
              </div>
            </form>
          </div>
      </div>
      </>
    );

 
    
    
    
    
  };

  export default Chat;
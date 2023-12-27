import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import '../stylesheets/WelcomePage.css'; // Assuming similar styling to WelcomePage
import '../stylesheets/notifyPopup.css';
import AppNavBarUser from '../components/navbarUser';
import AppNavBarAdmin from '../components/navBarAdmin';
import ButtonsUser from '../components/buttonsUser';
import ButtonsAdmin from '../components/buttonsAdmin';
import ButtonsAgent from '../components/buttonsAgent';
import ButtonsManager from '../components/buttonsManager';
import { useCustomization } from "../contexts/CustomizationContext";

let counter =0;



const HomePage = () => {
  const { customization, updateCustomization } = useCustomization();

  const name = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  console.log(name);  
  const [notificationMessage, setNotificationMessage] = useState("");
  const [hasNotifications, setHasNotifications] = useState(false);

  useEffect(() => {
    const callAssignTickets = async () => {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/v1/assignTickets`, {},
          { withCredentials: true },
       );

        
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    if (counter==0){
      console.log("ASSIGN TICKET");
      callAssignTickets();
      counter =1;
    }


    if(role=="user") {
      const checkNotifications = async () => {
        try {
          const userId = localStorage.getItem("userId"); 
          console.log("id :", userId);
          console.log(`http://localhost:3000/api/v1/emailNotifications/${userId}`);
          const response = await axios.get(
             `http://localhost:3000/api/v1/emailNotifications/${userId}`,
             { withCredentials: true },
          );
          
          if (response.status === 201) {
            setNotificationMessage(response.data.message);
            if (response.data.state==false){
              console.log("1");
              setHasNotifications(false);
            }else if (response.data.state==true){
              console.log("2");
              setHasNotifications(true);
            }
          } else {
            setNotificationMessage("There are no new notifications.");
            setHasNotifications(false);
          }
        } catch (error) {
          console.error("Error fetching notifications:", error);
          setNotificationMessage("Error occurred while fetching notifications.");
        }
      };
  
      checkNotifications();
    }

  }, []);

  return (
    < div style={{ 
      backgroundColor: customization.backgroundColor, 
      color: customization.fontColor, 
      fontSize: `${customization.fontSize} px`,
      minHeight: '100vh'
  }}
  >

    {
      role === "admin" ? (
        <>
        <AppNavBarAdmin />
        <Container fluid className="home-container">
          <Row className="dashboard-section">
            <Col md={6} className="dashboard-content">
            <h1>Hello Again,<br /> {name} !</h1>
              <p className="subtext">
                We have everything ready fro you to check and monitor!
              </p>
            </Col>
          </Row>
          <ButtonsAdmin />
        </Container>
      </>
      ) : role === "manager" ? (
        <>
           <AppNavBarAdmin /> 
       <Container fluid className="home-container">
         <Row className="dashboard-section">
           <Col md={6} className="dashboard-content">
           <h1>Hello Boss, {name} !</h1>
             <p className="subtext">
               We are happy to have you again boss. You can moderate everything and view detailed reports and analytics just with the press of a button!
             </p>
           </Col>
           </Row>
         <ButtonsManager />
       </Container>
     </>
      ) : role === "user" ? (
        <>
        <AppNavBarUser />
        <Container fluid className="home-container">
          <Row className="dashboard-section">
            <Col md={6} className="dashboard-content">
              <h1>Welcome Back, {name} !</h1>
              <p className="subtext">
                We offer around the clock replies. Send us a ticket, chat with one of our agents, and so many more features! .
              </p>
            </Col>
          </Row>
          <ButtonsUser />
        </Container>
      </>
      ) : role === "agent" ? (
        <>
        <AppNavBarAdmin />
        <Container fluid className="home-container">
          <Row className="dashboard-section">
            <Col md={6} className="dashboard-content">
              <h1>Ready to Continue Working, {name} !</h1>
              <p className="subtext">
                We offer around the clock replies. Send us a ticket, chat with one of our agents, and so many more features! .
              </p>
            </Col>
          </Row>
          <ButtonsAgent />
        </Container>
      </>
      ) : (
        // Default JSX for other roles or no role
        <>
          {/* Default components */}
        </>
      )
    }
    


        {hasNotifications && (
          <div className="notification">
            <div className="notification-header">
              <h3 className="notification-title">New notification!</h3>
              <i className="fa fa-times notification-close"></i>
            </div>
            <div className="notification-container">
              <div className="notification-media">
                <i className="fa fa-thumbs-up notification-reaction"></i>
              </div>
              <div className="notification-content">
                <p className="notification-text">
                  <strong>{notificationMessage}</strong>
                </p>
                <span className="notification-timer">a few seconds ago</span>
              </div>
              <span className="notification-status"></span>
            </div>
          </div>
        )}

    </div>
  );
};

export default HomePage;

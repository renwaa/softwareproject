import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../stylesheets/notify.css'; // Importing your custom CSS for NotifyPage
import AppNavBarUser from '../components/navbarUser';
import { useCustomization } from "../contexts/CustomizationContext";

let backend_url = "http://localhost:3000/api/v1";

const NotifyPage = () => {
    const { customization, updateCustomization } = useCustomization();

    const [notificationMessage, setNotificationMessage] = useState("");
    const [hasNotifications, setHasNotifications] = useState(false);

    useEffect(() => {
        const checkNotifications = async () => {
            try {
                const userId = localStorage.getItem("userId"); 
                console.log("id :" , userId)
                console.log( `http://localhost:3000/api/v1/emailNotifications/${userId}`);
                const response = await axios.get(
                   `http://localhost:3000/api/v1/emailNotifications/${userId}`,
                 { withCredentials: true } ,
                );
                
                if (response.status === 201) {
                    if (response.data.state===false){
                        setNotificationMessage("There are no new notifications.");
                      }else if (response.data.state===true){
                        setNotificationMessage("Please Check your email! One of our agents has solved your issue!");
                    }
                    setHasNotifications(true);
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
    }, []);

    return (
        < div style={{ 
            backgroundColor: customization.backgroundColor, 
            color: customization.fontColor, 
            fontSize: `${customization.fontSize} px`,
            minHeight: '100vh'
        }}
        >
        <AppNavBarUser/>
        <div className="notify-container">
            <h2>Notification</h2>
            {hasNotifications ? (
              <p>{notificationMessage}</p>


            ) : (
               
                <>
                <p>{notificationMessage}</p>
                <a href="https://outlook.com" target="_blank" rel="noopener noreferrer">
                    Please check your email!
                </a>
            </>
            )}
        </div>
        </div>
    );
};

export default NotifyPage;

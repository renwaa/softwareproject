import { useEffect, useState } from "react";
import AppNavBar from "../components/navbar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
let backend_url = "http://localhost:3000/api/v1";

export default function HomePage() {
  const navigate = useNavigate();
  const [cookies, removeCookies] = useCookies([]);
  const [userName, setUserName] = useState("");
  useEffect(() => {
    async function fetchData() {
      try {
        if (!cookies.token) {
          navigate("/login");
        }
        const uid = localStorage.getItem("userId");

        // const response = await axios.get(`${backend_url}/users/${uid}`, {
        //   withCredentials: true,
        // });

        // setUserName(response.data.displayName);
      } catch (error) {
        console.log("error");
        console.log(error);
      }
    }

    fetchData();
  }, [cookies, navigate]);

  return (
    <>
      <AppNavBar />
      <h1 style={{ textAlign: "center", margin: "30px", color: "white" }}>
        Welcome {userName}
      </h1>
    </>
  );
}

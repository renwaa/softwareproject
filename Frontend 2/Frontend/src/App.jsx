import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

// import '../public/styles/bootstrap.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route  , Router, Routes } from "react-router-dom";
import AppNavBar from "../src/components/navbar";
import Homepage from "./pages/HomePage";;
import Login from "./pages/login";
import Signup from "./pages/register";
import ChatPage from './pages/ChatPage';
import AgentChat from "./pages/AgentChat"; 
function App() {
  return (
    <>
        <Routes>
          <Route path="/login" element={<Login  />} />
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/ChatPage/:chatId" element={<ChatPage />} />
          <Route path="/Agentchat/:chatId" element={<AgentChat />} />
          <Route path="/" element={<Homepage />} />

          {/* <Route path="/products" element={<Productspage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/:id" element={<TryParams />} /> */}




        </Routes>
    </>
  );
}

export default App;
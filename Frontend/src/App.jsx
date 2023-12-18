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
import chatPage from "./pages/chatPage"
function App() {
  return (
    <>
        <Routes>
          <Route path="/login" element={<Login  />} />
          <Route path="/register" element={<Signup/>}/>
          <Route path="/chatPage" element={<chatPage/>} />
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
import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

// import '../public/styles/bootstrap.min.css'
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Route  , Router, Routes } from "react-router-dom";
import WelcomePage from "./pages/Welcome";  
import AppNavBar from "../src/components/navbar";
import Homepage from "./pages/HomePage";
import Login from "./pages/login";
import Signup from "./pages/register";
import Verify from "./pages/verify";
import MainPage from "./pages/Main";

function App() {
  return (
    <>
        <Routes>
          <Route path="/login" element={<Login  />} />
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/Verify" element={<Verify/>}/>
          <Route path="/" element={<MainPage />} />

          {/* <Route path="/products" element={<Productspage />} />np
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/:id" element={<TryParams />} /> */}




        </Routes>
    </>
  );
}

export default App;

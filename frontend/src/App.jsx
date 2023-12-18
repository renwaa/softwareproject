import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route  , Router, Routes } from "react-router-dom";
import Homepage from "./pages/HomePage";;
import Login from "./pages/login";
import Signup from "./pages/register";
import MFA from "./pages/MFA";

function App() {
  return (
    <>
        <Routes>
          <Route path="/login" element={<Login  />} />
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/" element={<Homepage />} />
          <Route path="/mfa" element={<MFA />} />
        </Routes>
    </>
  );
}

export default App;

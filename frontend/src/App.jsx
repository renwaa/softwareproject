import 'bootstrap/dist/css/bootstrap.min.css';
import { Route  , Router, Routes } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";;
import Login from "./pages/login";
import Signup from "./pages/register";
import MFA from "./pages/MFA";
import FAQ from "./pages/FAQ";
import NotifyPage from "./pages/NotifyPage";
import HomePage from './pages/HomePage.jsx';
import CreateTicket from './pages/createTicket.jsx';
import SetRolePage from "./pages/setRole.jsx";

import'./stylesheets/bootstrap.min.css'
import './bootstrap.min.js'; // Adjust the path accordingly

import Chat from "./pages/chat"
import AccessChat from "./pages/accessChat"


function App() {
  return (
    <>
        <Routes>
          <Route path="/login" element={<Login  />} />
          <Route path="/register" element={<Signup/>}/>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/mfa" element={<MFA />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/notifications" element={<NotifyPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/accessChat" element={<AccessChat />} />
          <Route path="/createTicket" element={<CreateTicket />} />
          <Route path="/setRole" element={<SetRolePage />} />
        </Routes>
    </>
  );
}

export default App;

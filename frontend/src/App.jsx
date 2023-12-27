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
import UpdateProfile from "./pages/updateProfile.jsx"



import GetUserTickets from "./pages/userViewTickets.jsx";
import AgentTicketList from './pages/AgentTicketList';
import RespondToTicket from "./pages/RespondToTicket";


import ViewReportsPage from "./pages/ViewReports";
import ManagerPage from "./pages/analyticsPage";
import ReportPage from "./pages/ReportPage";
import TicketsPage from "./pages/TicketsPage";
import TicketDetailsPage from "./pages/TicketDetailsPage";




import {CustomizationProvider} from "./contexts/CustomizationContext"
import Customize from "./pages/Customize.jsx";



import'./stylesheets/bootstrap.min.css'
import './bootstrap.min.js'; // Adjust the path accordingly

import Chat from "./pages/chat"
import AccessChat from "./pages/accessChat"


function App() {
  return (
    <>
    <CustomizationProvider>
        <Routes>
          <Route path="/login" element={<Login  />} />
          <Route path="/register" element={<Signup/>}/>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/mfa" element={<MFA />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/notifications" element={<NotifyPage />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/updateProfile" element={<UpdateProfile />} />
          <Route path="/createTicket" element={<CreateTicket />} />
          <Route path="/get-user-tickets" element={<GetUserTickets/>}/>



          <Route path="/setRole" element={<SetRolePage />} />



          <Route path="/accessChat" element={<AccessChat />} />
          <Route path="/agent-ticket-list" element={<AgentTicketList/>} />
          <Route path="/respond-to-ticket/:id" element={<RespondToTicket/>} /> 


          <Route path="/ViewReportsPage" element={<ViewReportsPage/>} />
          <Route path="/report/:reportId" element={<ReportPage />} />
          <Route path="/manager" element={<ManagerPage/>} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/tickets/:ticketId" element={<TicketDetailsPage />} />


          <Route path="/customize" element={<Customize />} />


        </Routes>
        </CustomizationProvider>
    </>
  );
}

export default App;

import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MyAreas from "./pages/MyAreas";
import AddArea from "./pages/AddArea";
import ManageArea from "./pages/ManageArea";
import Profile from "./pages/Profile";
import ProfileAdmin from "./pages/ProfileAdmin";
import MyChats from "./pages/MyChats";
import ChatRoom from "./pages/ChatRoom";
import Matchings from "./pages/Matchings";
import Criteria from "./pages/Criteria";
import Match from "./pages/Match";
import Notifications from "./pages/Notifications";
import NotificationsAdmin from "./pages/NotificationsAdmin";
import Index from "./pages/Index";
import Login from './pages/Login';
import Register from './pages/Register';
import Users from './pages/Users';
import Paroxoi from './pages/Paroxoi';
import ManageParoxo from './pages/ManageParoxo';
import AddParoxo from './pages/AddParoxo';

import ProtectedRoute from "./routes/ProtectedRoutes";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/index" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/add_area" element={<AddArea />} />

        </Route>
        <Route path="/profile/admin" element={<ProfileAdmin />} />
        <Route path="/my_areas" element={<MyAreas />} />
        <Route path="/manage_area" element={<ManageArea />} />
        <Route path="/my_chats" element={<MyChats />} />
        <Route path="/chatroom" element={<ChatRoom />} />
        <Route path="/matchings" element={<Matchings />} />
        <Route path="/criteria" element={<Criteria />} />
        <Route path="/match" element={<Match />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/notifications/admin" element={<NotificationsAdmin />} />
        
        <Route path="/users" element={<Users />} />
        <Route path="/paroxoi" element={<Paroxoi />} />
        <Route path="/manage_paroxo" element={<ManageParoxo />} />
        <Route path="/add_paroxo" element={<AddParoxo />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;
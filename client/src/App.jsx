import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";

import MyAreas from "./elements/MyAreas";
import AddArea from "./elements/AddArea";
import ManageArea from "./elements/ManageArea";
import Profile from "./elements/Profile";
import ProfileAdmin from "./elements/ProfileAdmin";
import MyChats from "./elements/MyChats";
import ChatRoom from "./elements/ChatRoom";
import Matchings from "./elements/Matchings";
import Criteria from "./elements/Criteria";
import Match from "./elements/Match";
import Notifications from "./elements/Notifications";
import NotificationsAdmin from "./elements/NotificationsAdmin";
import Index from "./elements/Index";
import Login from './elements/Login';
import Register from './elements/Register';
import Users from './elements/Users';
import Paroxoi from './elements/Paroxoi';
import ManageParoxo from './elements/ManageParoxo';
import AddParoxo from './elements/AddParoxo';
import ProtectedRoute from "./elements/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/profile/admin" element={
            <ProtectedRoute>
              <ProfileAdmin />
            </ProtectedRoute>
          } />
          <Route path="/my_areas" element={<MyAreas />} />
          <Route path="/manage_area" element={<ManageArea />} />
          <Route path="/add_area" element={
            <ProtectedRoute>
              <AddArea />
            </ProtectedRoute>} />
          <Route path="/my_chats" element={<MyChats />} />
          <Route path="/chatroom" element={<ChatRoom />} />
          <Route path="/matchings" element={<Matchings />} />
          <Route path="/criteria" element={<Criteria />} />
          <Route path="/match" element={<Match />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/notifications/admin" element={<NotificationsAdmin />} />
          <Route path="/index" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<Users />} />
          <Route path="/paroxoi" element={<Paroxoi />} />
          <Route path="/manage_paroxo" element={<ManageParoxo />} />
          <Route path="/add_paroxo" element={<AddParoxo />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
export default App;
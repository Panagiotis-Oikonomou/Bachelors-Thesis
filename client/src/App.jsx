import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MyAreas from "./pages/area/MyAreas";
import AddArea from "./pages/area/AddArea";
import ManageArea from "./pages/area/ManageArea";

import Profile from "./pages/profile/Profile";
import ProfileAdmin from "./pages/profile/ProfileAdmin";

import MyChats from "./pages/chat/MyChats";
import ChatRoom from "./pages/chat/ChatRoom";

import Matchings from "./pages/match/Matchings";
import Criteria from "./pages/criteria/Criteria";
import Match from "./pages/match/Match";

import Notifications from "./pages/notifications/Notifications";
import NotificationsAdmin from "./pages/notifications/NotificationsAdmin";

import Index from "./pages/public/Index";
import Login from './pages/public/Login';
import Register from './pages/public/Register';

import Users from './pages/manageUsers/Users';

import Paroxoi from './pages/paroxoi/Paroxoi';
import ManageParoxo from './pages/paroxoi/ManageParoxo';
import AddParoxo from './pages/paroxoi/AddParoxo';

import Layout from "./layouts/Layout";
import RequiredAuth from "./pages/RequiredAuth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<RequiredAuth />}>
          <Route path="/add_area" element={<AddArea />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* <Route path="/add_area" element={<AddArea />} />
        <Route path="/profile" element={<Profile />} /> */}


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
      </Route>
    </Routes>
  )
}
export default App;
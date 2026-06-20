import { Routes, Route } from "react-router-dom";

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

import Users from "./pages/adminWork/Users";
import Providers from "./pages/adminWork/Providers";

import RequiredAuth from "./pages/RequiredAuth";
import PersistLogin from "./pages/PersistLogin";

function App() {
  return (
    <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<PersistLogin />}>
          <Route element={<RequiredAuth admin={false} />}>
            <Route path="/add_area" element={<AddArea />} />
            <Route path="/my_areas" element={<MyAreas />} />
            <Route path="/manage_area/:id" element={<ManageArea />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/criteria" element={<Criteria />} />

            <Route path="/my_chats" element={<MyChats />} />
            <Route path="/chatroom" element={<ChatRoom />} />
            <Route path="/matchings" element={<Matchings />} />
            <Route path="/match" element={<Match />} />
          </Route>

          <Route element={<RequiredAuth admin={true} />}>
            <Route path="/users" element={<Users />} />
            <Route path="/profile/admin" element={<ProfileAdmin />} />
            <Route path="/providers" element={<Providers />} />

            <Route path="/notifications/admin" element={<NotificationsAdmin />} />
          </Route>
        </Route>
    </Routes>
  );
}
export default App;
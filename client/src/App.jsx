import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MyAreas from "./elements/MyAreas";
import AddArea from "./elements/AddArea";
import ManageArea from "./elements/ManageArea";
import Profile from "./elements/Profile";
import MyChats from "./elements/MyChats";
import ChatRoom from "./elements/ChatRoom";
import Matchings from "./elements/Matchings";
import Criteria from "./elements/Criteria";
import Match from "./elements/Match";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/my_areas" element={<MyAreas />} />
        <Route path="/manage_area" element={<ManageArea />} />
        <Route path="/add_area" element={<AddArea />} />
        <Route path="/my_chats" element={<MyChats />} />
        <Route path="/chatroom" element={<ChatRoom />} />
        <Route path="/matchings" element={<Matchings />} />
        <Route path="/criteria" element={<Criteria />} />
        <Route path="/match" element={<Match />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;
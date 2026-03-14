import React from "react";
import {BrowserRouter, Routes, Route} from "react-router-dom";

import AddArea from "./elements/AddArea";
import Profile from "./elements/Profile";
import MyChats from "./elements/MyChats";
import ChatRoom from "./elements/ChatRoom";
function App(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/add_area" element={<AddArea />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/my_chats" element={<MyChats />}/>
        <Route path="/chatroom" element={<ChatRoom />}/>
      </Routes>
    </BrowserRouter>
  )
}
export default App;
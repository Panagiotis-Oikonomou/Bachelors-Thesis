import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useNavigation } from "react-router-dom";
// import '../assets/css/my_chats.css';
import './MyChats.css';
import matchings from '../assets/images/mymatchings.png';
import myareas from '../assets/images/myareas.png';
import criteria from '../assets/images/criteria.png';
import match from '../assets/images/match.png';
import chats from '../assets/images/chats.png';
import notifications from '../assets/images/notifications.png';
import profile from '../assets/images/profile.png';
import menu from '../assets/images/menu.png';

function MyChats() {
    return (
        <div className="container">
            <img src={menu} className="menu" />
            <div className="up">
                <a href="checkmatchings.html"><img src={matchings} /></a>
                <Link to='/add_area'><img src={myareas} /></Link>
                <a href="criteria.html"><img src={criteria} /></a>
                <a href="match.html"><img src={match} /></a>
                <Link to='/my_chats'><img src={chats} /></Link>
                <a href="notifications.html"><img src={notifications} /></a>
                <Link to='/profile'><img src={profile} /></Link>
            </div>
            <div className="chats">
                <div className="chat">
                    <Link to='/chatroom' className="alink">
                        <div className="chat-data">
                            Username1 Username2 Username3 Username4 Username5 Username6 Username7
                        </div>
                    </Link>
                </div>

                <div className="chat">
                    <Link to='/chatroom' className="alink">
                        <div className="chat-data">
                            Username1 Username2 Username3 Username4 Username5 Username6 Username7
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default MyChats;
//     <!DOCTYPE html>
// <html>
//     <head>
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <meta charset="UTF-8">
//         <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
//         <link rel="stylesheet" href="styles/profile.css?v1.1">
//         <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
//         <script src="scripts/checkArea.js" defer></script>
//         <script src="scripts/getCordinates.js" defer></script>
//         <script src="scripts/hideMain.js" defer></script>
//         <script src="scripts/openMap.js" defer></script>
import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import '../assets/css/profile.css';
import matchings from '../assets/images/mymatchings.png';
import myareas from '../assets/images/myareas.png';
import criteria from '../assets/images/criteria.png';
import match from '../assets/images/match.png';
import chats from '../assets/images/chats.png';
import notifications from '../assets/images/notifications.png';
import profile from '../assets/images/profile.png';
import menu from '../assets/images/menu.png';
import map from '../assets/images/map.png';

function AddArea() {
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

            <div className="addarea">
                <p className="titlee">Δημιουργία καινούργιας περιοχής</p><br />
                <form autoComplete="off" onSubmit="return checkArea();">
                    Όνομα περιοχής:<br /><input type="text" id="area-name" required />
                    <div id="error_msg1"></div><br />

                    Μέγεθος έκτασης (σε km<sup>2</sup>):<br /><input type="number" id="size" max="131" required /><br /><br />

                    Ποσοστό ηληοφάνειας:<br /><input type="text" id="sun" readOnly required /><br /><br />

                    Cordinates:<br /><input type="text" id="cordinates" readOnly required /><br /><br />
                    <div>Map&nbsp;&nbsp;&nbsp;<img src={map} className="map-button" /></div><br />

                    <div id="error_msg2"></div><br />

                    <input type="submit" value="Δημιουργία" />
                </form>
            </div>
            <div id="map" className="map"></div>
        </div>
    )
}

export default AddArea;
import React, { useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import styles from './AddArea.module.css';

import { MapContainer, TileLayer, Marker, useMapEvents} from 'react-leaflet'

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
    const [location, setLocation] = useState(null);

    function MyComponent({ setLocation }) {
        const map = useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setLocation({ lat, lng });
            }
        });
        return null
    }

    return (
        <div className={styles.container}>
            <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <Link to='/matchings'><img src={matchings} /></Link>
                <Link to='/my_areas'><img src={myareas} /></Link>
                <Link to='/criteria'><img src={criteria} /></Link>
                <Link to='/match'><img src={match} /></Link>
                <Link to='/my_chats'><img src={chats} /></Link>
                <Link to='/notifications'><img src={notifications} /></Link>
                <Link to='/profile'><img src={profile} /></Link>
            </div>

            <div className={styles.addArea}>
                <p className={styles.titlee}>Δημιουργία καινούργιας περιοχής</p><br />
                <form autoComplete="off">
                    Όνομα περιοχής:<br /><input type="text" id="area-name" required />
                    <div id="error_msg1"></div><br />

                    Μέγεθος έκτασης (σε km<sup>2</sup>):<br /><input type="number" id="size" max="131" required /><br /><br />

                    Ποσοστό ηληοφάνειας:<br /><input type="text" id="sun" readOnly required /><br /><br />

                    Cordinates:<br /><input
                        type="text"
                        value={location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : ""}
                        readOnly
                        required
                    /><br /><br />
                    <div>Map&nbsp;&nbsp;&nbsp;<img src={map} className={styles.mapButton} /></div><br />


                    <div id="error_msg2"></div><br />

                    <input type="submit" value="Δημιουργία" />
                </form>
            </div>
            <div className={styles.map}>
                <MapContainer key="map" center={[38, 23]} zoom={6} className={styles.leafletMap}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MyComponent setLocation={setLocation} />
                    {location && (
                        <Marker position={[location.lat, location.lng]}></Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    )
}

export default AddArea;
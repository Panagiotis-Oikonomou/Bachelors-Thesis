import React, { useState, useEffect } from "react";
import styles from './AddArea.module.css';
import MyComponent from "../components/maps/MyComponent";
import userAddArea from "../hooks/userAddArea";
import { Up } from "../components/Up";
import axios from 'axios';

import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import map from '../assets/images/map.png';

function AddArea() {
    const [location, setLocation] = useState(null);
    const userId = 1;
    const {
        areaData, setAreaData, nameError, formError, panelData, handleChange, handleSubmit
    } = userAddArea(userId);

    useEffect(() => {
        if (location) {
            setAreaData(prev => ({
                ...prev,
                lat: location.lat.toFixed(6),
                lng: location.lng.toFixed(6)
            }));
        }
    }, [location]);

    useEffect(() => {
        if (areaData.lat && areaData.lng && areaData.size) {
            if (panelData.panelType === "vertical") {
                axios.get(`http://localhost:5000/api/pv?lat=${areaData.lat}&lon=${areaData.lng}&type=1`)
                    .then((res) => {
                        const energy = Number(res.data) * Number(areaData.size) * 0.2;
                        if (energy !== undefined) {
                            setAreaData(prev => ({ ...prev, energy: energy.toFixed(3) }));
                        } else {
                            console.log("PVcalc data missing:", res.data);
                        }
                    })
                    .catch((err) => console.log(err));
            }
            else if (panelData.panelType == "inclined") {
                axios.get(`http://localhost:5000/api/pv?lat=${areaData.lat}&lon=${areaData.lng}&type=2`)
                    .then((res) => {
                        const energy = Number(res.data) * Number(areaData.size) * 0.2;
                        if (energy !== undefined) {
                            setAreaData(prev => ({ ...prev, energy: energy.toFixed(3) }));
                        } else {
                            console.log("PVcalc data missing:", res.data);
                        }
                    })
                    .catch((err) => console.log(err));
            }
            else if (panelData.panelType == "two") {
                axios.get(`http://localhost:5000/api/pv?lat=${areaData.lat}&lon=${areaData.lng}&type=3`)
                    .then((res) => {
                        const energy = Number(res.data) * Number(areaData.size) * 0.2;
                        if (energy !== undefined) {
                            setAreaData(prev => ({ ...prev, energy: energy.toFixed(3) }));
                        } else {
                            console.log("PVcalc data missing:", res.data);
                        }
                    })
                    .catch((err) => console.log(err));
            }
        }
    }, [areaData.lat, areaData.lng, panelData.panelType, areaData.size]);

    return (
        <div className={styles.container}>
            <Up></Up>

            <div className={styles.addArea}>
                <p className={styles.titlee}>Δημιουργία καινούργιας περιοχής</p><br />
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div className={styles.data}>Όνομα περιοχής:<br />
                        <input
                            type="text"
                            name="name"
                            value={areaData.name}
                            onChange={handleChange}
                            className={nameError.name ? styles.inputError : ""}
                            required
                        />
                        <div className={styles.msg}>{nameError.name}</div>
                    </div>

                    <div className={styles.data}>Μέγεθος έκτασης (σε m<sup>2</sup>):<br />
                        <input
                            type="number"
                            name="size"
                            value={areaData.size}
                            min="1"
                            step="0.01"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.data}>Είδος ηλιακού πάνελ:<br />
                        <div className={styles.radioButtons}>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio" name="panelType"
                                    checked={panelData.panelType === 'vertical'}
                                    onChange={handleChange} value="vertical" required
                                />Vertical Axis
                            </label>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio" name="panelType"
                                    checked={panelData.panelType === 'inclined'}
                                    onChange={handleChange} value="inclined" required
                                />Inclined Axis
                            </label>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio" name="panelType"
                                    checked={panelData.panelType === 'two'}
                                    onChange={handleChange} value="two" required
                                />Two Axis
                            </label>
                        </div>
                    </div>

                    <div className={styles.data}>Coordinates(lat, lng):<br />
                        <input
                            type="text"
                            name="coordinates"
                            value={location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : ""}
                            readOnly
                            required
                        />
                    </div>
                    <div>Map&nbsp;&nbsp;&nbsp;<img src={map} className={styles.mapButton} /></div><br />

                    <div className={styles.data}>Ετήσια παραγωγή PV ενέργειας(kWh):<br />
                        <input type="text"
                            name="energy"
                            value={areaData.energy}
                            readOnly
                            required
                        />
                    </div>

                    <div className={styles.msg}>{formError.err}</div>
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
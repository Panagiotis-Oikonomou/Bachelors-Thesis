import { useState, useEffect } from "react";
import styles from './AddArea.module.css';
import MyComponent from "../../components/maps/MyComponent";
import useAddArea from "../../hooks/useAddArea";
import { Up } from "../../components/up/Up";

import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import map from '../../assets/images/map.png';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useGetEnergy from "../../hooks/useGetEnergy";

function AddArea() {
    const axiosPrivate = useAxiosPrivate();
    const [location, setLocation] = useState(null);
    const { areaData, setAreaData, nameError, formError, panelData, handleChange, handleSubmit } = useAddArea();

    useEffect(() => {
        if (location) {
            setAreaData(prev => ({
                ...prev,
                lat: location.lat.toFixed(6),
                lng: location.lng.toFixed(6)
            }));
        }
    }, [location]);

    useGetEnergy(panelData, setAreaData, areaData.size, areaData.lat, areaData.lng)

    return (
        <div className={styles.container}>
            <Up></Up>

            <div className={styles.addArea}>
                <p className={styles.titlee}>Δημιουργία καινούργιας περιοχής</p><br />
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div className={styles.data}>
                        <label htmlFor="areaname">Όνομα περιοχής:</label><br />
                        <input
                            type="text"
                            id="areaname"
                            name="name"
                            value={areaData.name}
                            onChange={handleChange}
                            className={nameError ? styles.inputError : ""}
                            required
                        />
                        <div className={styles.msg}>{nameError}</div>
                    </div>

                    <div className={styles.data}>
                        <label htmlFor="size">Έκταση περιοχής (σε km<sup>2</sup>):</label><br />
                        <input
                            type="number"
                            id="size"
                            name="size"
                            value={areaData.size}
                            min="1"
                            step="0.1"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.data}>Είδος ηλιακού πάνελ:<br />
                        <div className={styles.radioButtons}>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio" name="panelType"
                                    checked={panelData === 'vertical'}
                                    onChange={handleChange} value="vertical" required
                                />Vertical Axis
                            </label>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio" name="panelType"
                                    checked={panelData === 'inclined'}
                                    onChange={handleChange} value="inclined" required
                                />Inclined Axis
                            </label>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio" name="panelType"
                                    checked={panelData === 'two'}
                                    onChange={handleChange} value="two" required
                                />Two Axis
                            </label>
                        </div>
                    </div>

                    <div className={styles.data}>
                        Coordinates(lat, lng):<br />
                        <input
                            type="text"
                            name="coordinates"
                            value={location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : ""}
                            readOnly
                            required
                        />
                    </div>
                    <div>Map&nbsp;&nbsp;&nbsp;<img src={map} className={styles.mapButton} /></div><br />

                    <div className={styles.data}>
                        Ετήσια παραγωγή PV ενέργειας(kWh):<br />
                        <input
                            type="text"
                            name="ac"
                            value={areaData.ac}
                            readOnly
                            required
                        />
                    </div>
                    <div className={styles.msg}>{formError}</div>
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
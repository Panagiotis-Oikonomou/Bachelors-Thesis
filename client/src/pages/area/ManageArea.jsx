import { lazy, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from './ManageArea.module.css';
import { Up } from '../../components/up/Up';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useManageArea from "../../hooks/useManageArea";

function ManageArea() {
    const { id } = useParams();
    const { areaData, nameError, formError, areaUpdated, handleChange, handleSubmit } = useManageArea(id);

    return (
        <div className={styles.container}>
            <Up></Up>

            <div className={styles.addArea}>
                <form onSubmit={handleSubmit}>
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
                            min="1"
                            step="0.1"
                            value={areaData.size}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.data}>
                        Coordinates(lat, lng):<br />
                        <input
                            type="text"
                            value={`${Number(areaData.lat).toFixed(4)}, ${Number(areaData.lng).toFixed(4)}`}
                            readOnly
                        />
                    </div>

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
                    <div className={styles.correct}>{areaUpdated}</div>
                    <input type="submit" value="Αποθήκευση αλλαγών" />
                </form>
            </div>
        </div>
    )
}

export default ManageArea;
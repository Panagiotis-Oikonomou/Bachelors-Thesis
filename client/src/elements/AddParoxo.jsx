import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import styles from './AddParoxo.module.css';

import { UpAdmin } from "../components/UpAdmin";


function AddParoxo() {
    return (
        <div className={styles.container}>
            <UpAdmin></UpAdmin>
            {/* <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <Link to='/paroxoi'><img src={paroxoi} /></Link>
                <Link to='/users'><img src={users} /></Link>
                <Link to='/notifications/admin'><img src={notifications} /></Link>
                <Link to='/profile/admin'><img src={profile} /></Link>
            </div> */}

            <div className={styles.paroxos}>
                <p className={styles.titlee}>Δημιουργία καινούργιας περιοχής</p><br/>
                <form>
                    Όνομα Παρόχου Ενέργειας:<br/><input type="text" id="paroxos" required/>
                    <div id="error_msg1"></div><br/>
                    
                    <div id="error_msg2"></div><br/>    

                    <input type="submit" value="Δημιουργία"/>
                </form>
            </div>
        </div>
    )
}

export default AddParoxo;
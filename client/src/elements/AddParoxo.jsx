import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import styles from './AddParoxo.module.css';

import paroxoi from '../assets/images/paroxoi.png';
import users from '../assets/images/users.png';
import notifications from '../assets/images/notifications.png';
import profile from '../assets/images/profile.png';
import menu from '../assets/images/menu.png';


function AddParoxo() {
    return (
        <div className={styles.container}>
            <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <Link to='/paroxoi'><img src={paroxoi} /></Link>
                <Link to='/users'><img src={users} /></Link>
                <Link to='/notifications/admin'><img src={notifications} /></Link>
                <Link to='/profile/admin'><img src={profile} /></Link>
            </div>

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
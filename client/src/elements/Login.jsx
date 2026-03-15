import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import styles from './LoginRegister.module.css';


function Notifications() {
    return (
        <div className={styles.container}>

            <div className={styles.header}>Login Form</div>

            <div className={styles.loginForm}>
                <form>
                    Username:<br /><input type="text" required autofocus /><br /><br />

                    Password:<br /><input type="text" required /><br /><br />

                    <input type="submit" value="Login" />
                </form>
                <p>Δεν έχεις λογαριασμό; κάνε <Link to='/register'>Εγγραφή</Link></p>

            </div>

        </div>
    )
}

export default Notifications;
import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import styles from './NotificationsAdmin.module.css';
import { UpAdmin } from "../../components/up/UpAdmin";

function Notifications() {
    return (
        <div className={styles.container}>
            <UpAdmin></UpAdmin>

            <div className={styles.notifications}>
                <div className={styles.not}>
                    Κάποιο μήνυμα Admin
                </div>

                <div className={styles.not}>
                    Κάποιο μήνυμα
                </div>

                <div className={styles.not}>
                    Κάποιο μήνυμα
                </div>
            </div>
        </div>
    )
}

export default Notifications;
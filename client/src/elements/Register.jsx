import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import styles from './LoginRegister.module.css';


function Notifications() {
    return (
        <div className={styles.container}>

            <div className={styles.header}>Register Form</div>

            <div className={styles.registerForm}>
                <form>
                    <p className={styles.titlee}>Πρέπει να συμπληρώσεται όλα τα πεδία της φόρμας</p><br/>

                    Όνομα<span class="must">*</span>:<br/><input type="text" id="fname" required/>
                    <div id = "error_msg1"> </div><br/>

                    Επώνυμο<span class="must">*</span>:<br/><input type="text" id="lname" required/>
                    <div id = "error_msg2"> </div><br/>

                    Αριθμός ρολογιού<span class="must">*</span>:<br/><input type="text" id="clock" placeholder="x-xxxxxxxx-xx" required/>
                    <div id = "error_msg3"> </div><br/>

                    Πάροχος ενέργειας<span class="must">*</span>:<br/>
                    <select id="id_power" required>
                        <option value="some">SOMDSO</option>
                        <option value="zeniu">ZENIU</option>
                        <option value="protergia">PROTERGIA</option>
                        <option value="other">PROTERGIA</option>
                    </select><br/><br/>

                    Email<span class="must">*</span>:<br/><input type="email" id="mail" pattern = "'/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/'" required/><br/><br/>

                    Username<span class="must">*</span>:<br/><input type="text" id="usr" required/>
                    <div id = "error_msg4"> </div><br/>

                    Password<span class="must">*</span>:<br/><input type="password" id="psw" required/><br/>
                    <input type="checkbox" id="pswshow"/> Εμφάνιση κωδικού<br/>
                    <div id = "error_msg5"> </div><br/>

                    Confirm Password<span class="must">*</span>:<br/><input type="password" id="cpsw" required/><br/>
                    <input type="checkbox" id="cpswshow"/> Εμφάνιση κωδικού<br/>
                    <div id = "error_msg6"> </div>
                    <div id = "pswmatch"> </div><br/>

                    <div id="not_send"> </div>
                    <input type="submit" value="Εγγραφή"/>
                </form>

                <p>Έχεις λογαριασμό; κάνε <Link to='/login'>Σύνδεση</Link></p>

            </div>

        </div>
    )
}

export default Notifications;
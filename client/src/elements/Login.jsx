import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate, useNavigation } from "react-router-dom";
import styles from './LoginRegister.module.css';


function Notifications() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [loginData, setLoginData] = useState({
        usr: "",
        psw: ""
    });

    function handleSubmit(e) {
        e.preventDefault();
        axios.get('http://localhost:5000/login', {
            params: {
                usr: loginData.usr,
                psw: loginData.psw
            }
        })
        .then((res) => {
            if (res.data.exists) navigate('/profile');
            else alert("wrong");
        })
        .catch((err) => console.log(err));
    }

    return (
        <div className={styles.container}>

            <div className={styles.header}>Login Form</div>

            <div className={styles.loginForm}>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formData}>
                        <label>Username</label><br />
                        <input
                            type="text"
                            name="usr"
                            required
                            autoFocus
                            onChange={(e) => { setLoginData({ ...loginData, usr: e.target.value}) }}
                        />
                    </div>

                    <div className={styles.formData}>
                        <label>Password</label><br />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="psw"
                            required
                            onChange={(e) => { setLoginData({ ...loginData, psw: e.target.value }) }}
                        /><br />
                        <input type="checkbox" onChange={() => setShowPassword(!showPassword)} /> Εμφάνιση κωδικού
                    </div>

                    <input type="submit" value="Login" />
                </form>
                <p>Δεν έχεις λογαριασμό; κάνε <Link to='/register'>Εγγραφή</Link></p>

            </div>

        </div>
    )
}

export default Notifications;
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from './LoginRegister.module.css';
import api from "../apiCalls/axiosInstance";


function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [notFound, setNotFound] = useState({ notf: "" });
    const [loginData, setLoginData] = useState({
        usr: "",
        psw: ""
    });

    useEffect(() => {
        if (notFound.notf !== "") {
            const timer = setTimeout(() => {
                setNotFound({ ...notFound, notf: "" });
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [notFound.notf]);

    function handleSubmit(e) {
        e.preventDefault();

        api.post('/users/login', { usr: loginData.usr, psw: loginData.psw })
            .then((res) => {
                if (res.data.exists) {
                    localStorage.setItem("accessToken", res.data.accessToken);
                    localStorage.setItem("refreshToken", res.data.refreshToken);
                    if(res.data.isAdmin){
                        navigate('/profile/admin');
                    }
                    else{
                        navigate('/profile');
                    }
                }
                else {
                    setNotFound({ ...notFound, notf: "Το username ή ο κωδικός είναι λάθος" });
                }
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
                            onChange={(e) => { setLoginData({ ...loginData, usr: e.target.value }) }}
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
                    <div className={styles.errorMsg}>{notFound.notf}</div>
                    <input type="submit" value="Login" />
                </form>
                <p>Δεν έχεις λογαριασμό; κάνε <Link to='/register'>Εγγραφή</Link></p>

            </div>

        </div>
    )
}

export default Login;
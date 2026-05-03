import React, { useEffect, useState } from "react";
// import AuthContext from '../../context/AuthProvider';
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from './LoginRegister.module.css';
import api from "../../apiCalls/axiosInstance";

function Login() {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
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

        api.post('/users/login', { usr: loginData.usr, psw: loginData.psw }, { withCredentials: true })
            .then((res) => {
                if (res.data.exists) {
                    console.log(res.data);
                    // localStorage.setItem("accessToken", res.data.accessToken);
                    // localStorage.setItem("refreshToken", res.data.refreshToken);
                    const accessToken = res.data.accessToken;
                    const isAdmin = res.data.isAdmin;
                    setAuth({ accessToken, isAdmin });
                    // setAuth(res.data.accessToken);
                    // console.log(from);
                    if (isAdmin) {
                        if (from !== "/") {
                            navigate(from, { replace: true });
                        }
                        else navigate('/profile/admin', {replace:true});
                        // '/profile/admin'
                    }
                    else {
                        // navigate('/profile');
                        if (from !== "/") {
                            navigate(from, { replace: true });
                        }
                        else navigate('/profile', {replace:true});
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
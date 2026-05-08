import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styles from './LoginRegister.module.css';
import axios from "../../api/axios";

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

        axios.post('/public/login', { usr: loginData.usr, psw: loginData.psw }, { withCredentials: true })
            .then((res) => {
                if (res.data.exists) {
                    const accessToken = res.data.accessToken;
                    const isAdmin = res.data.isAdmin;
                    setAuth({ accessToken, isAdmin });
                    if (isAdmin) {
                        if (from !== "/") {
                            navigate(from, { replace: true });
                        }
                        else navigate('/profile/admin', { replace: true });
                    }
                    else {
                        if (from !== "/") {
                            navigate(from, { replace: true });
                        }
                        else navigate('/profile', { replace: true });
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
                        <label htmlFor="usr">Username</label><br />
                        <input
                            type="text"
                            id="usr"
                            name="usr"
                            required
                            autoFocus
                            autoComplete="on"
                            onChange={(e) => { setLoginData({ ...loginData, usr: e.target.value }) }}
                        />
                    </div>

                    <div className={styles.formData}>
                        <label htmlFor="psw">Password</label><br />
                        <input
                            type={showPassword ? "text" : "password"}
                            id="psw"
                            name="psw"
                            required
                            autoComplete="on"
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
    );
}

export default Login;
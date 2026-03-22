import { useState, useEffect } from "react";
import axios, { all } from 'axios';
import { Link, useAsyncError, useNavigate } from "react-router-dom";
import styles from './LoginRegister.module.css';


function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        clock: '',
        provider: '',
        email: '',
        username: '',
        password: ''
    });
    const [conPass, setConPass] = useState({ cpsw: "" });

    const [providers, setProviders] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/get_providers')
            .then((res) => {
                setProviders(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const [errors, setErrors] = useState({
        fname: "",
        lname: "",
        clock: "",
        username: "",
        email: "",
        password: "",
        pswmatch: ""
    });

    const [cpswError, setCpswError] = useState({ cpsw: "" });

    const [cpswMatch, setCpswMatch] = useState({ cpsw: "" });

    const [allError, setAllError] = useState({ all: "" });

    function handleChange(e) {
        const { name, value } = e.target;

        if (name === "cpsw") {
            setConPass({
                ...conPass,
                [name]: value
            });
        }
        else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
        validateField(name, value);
    }

    function validateField(name, value) {
        let error = "";
        let cpswerror = "";
        let cpswmatch = "";
        if (name === "fname") {
            let len = value.length;
            let regex = /\d/;
            if (len === 0) error = "";

            else if (len < 4 || len > 15) error = "Το όνομά σας πρέπει να αποτελείται από 4 μέχρι 15 γράμματα";

            else if (value.includes(" ")) error = "Το όνομά σας δεν μπορεί να περιέχει κενά";

            else if (regex.test(value)) error = "Το όνομά σας δεν επιτρέπεται να περιέχει ψηφία";
        }

        if (name === "lname") {
            let len = value.length;
            let regex = /\d/;
            if (len === 0) error = "";

            else if (len <= 3 || len >= 16) error = "Το επιθετό σας πρέπει να αποτελείται από 4 μεχρι 15 γράμματα";

            else if (value.includes(" ")) error = "Το επιθετό σας δεν μπορεί να περιέχει κενά";

            else if (regex.test(value)) error = "Το επιθετό σας δεν επιτρέπεται να περιέχει ψηφία";
        }

        if (name === "clock") {
            let len = value.length;
            let regex = /^\d-\d{8}-\d{2}$/;
            if (len === 0) error = "";

            else if (regex.test(value)) error = "";

            else error = "Ο αριθμός πρέπει να είναι αυτής της μορφής χ-χχχχχχχχ-χχ";

            axios.get(`http://localhost:5000/check_clock/${value}`)
                .then((res) => {
                    if (res.data.exists) {
                        setErrors(prev => ({ ...prev, clock: "Υπάρχει ήδη αυτό το ρολόϊ." }));
                    }
                })
                .catch((err) => console.log(err));
        }

        if (name === "username") {
            let len = value.length;

            if (len === 0) error = "";

            else if (len < 5 || len > 10) error = "Το username σας πρέπει να αποτελείται από 5 μέχρι 10 γράμματα";

            else if (value.includes(" ")) error = "Το username σας δεν μπορεί να περιέχει κενά";

            axios.get(`http://localhost:5000/check_username/${value}`)
                .then((res) => {
                    if (res.data.exists) {
                        setErrors(prev => ({ ...prev, username: "Υπάρχει χρήστης με αυτό το username." }));
                    }
                })
                .catch((err) => console.log(err.message));
        }

        if (name === "email") {
            let len = value.length;
            if (len === 0) error = "";

            axios.get(`http://localhost:5000/check_email/${value}`)
                .then((res) => {
                    if (res.data.exists) {
                        setErrors(prev => ({ ...prev, email: "Υπάρχει ήδη αυτό το email." }));
                    }
                })
                .catch((err) => console.log(err));
        }

        let password = formData.password;
        let confirm = conPass.cpsw;

        if (name === "password") {
            password = value;
            let len = password.length;
            let cpswlen = confirm.length;
            let specialRegex = /[!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>\/?]/;
            if (password === confirm && len != 0) {
                cpswerror = "";
                cpswmatch = "Οι δύο κωδικοί ταιρίαζουν";
            }
            else if (password !== confirm && cpswlen === 0) {
                cpswerror = "";
                cpswmatch = "";
            }
            else if (password !== confirm && len !== 0) {
                cpswerror = "Οι δύο κωδικοί δεν ταιρίαζουν";
                cpswmatch = "";
            }

            if (len < 5 || len > 15) error = "Ο κωδικός σας πρέπει να αποτελείται απο 5 μέχρι 15 χαρακτήρες";

            else if (password.includes(" ")) error = "Ο κωδικός σας δεν μπορεί να περιέχει κενά";

            else if (!specialRegex.test(password)) error = "Ο κωδικός σας πρέπει να περιέχει τουλάχιστον έναν χαρακτήρα σύμβολο";

            else error = "";

            if (len === 0) error = "";
        }

        if (name === "cpsw") {
            confirm = value;
            let len = confirm.length;
            if (len === 0) {
                cpswerror = "";
                cpswmatch = "";
            }
            else if (confirm !== password) {
                cpswerror = "Οι δύο κωδικοί δεν ταιρίαζουν";
                cpswmatch = "";
            }
            else if (confirm === password) {
                cpswerror = "";
                cpswmatch = "Οι δύο κωδικοί ταιρίαζουν";
            }
        }

        if (name !== "provider") {
            setErrors(prev => ({ ...prev, [name]: error}));

            setCpswError(prev => ({ ...prev, cpsw: cpswerror }));

            setCpswMatch(prev => ({ ...prev, cpsw: cpswmatch }));
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        const hasErrors = Object.values(errors).some(err => err !== "");
        const hasCpswErrors = Object.values(cpswError).some(err => err !== "");

        // alert(hasErrors);
        // true if one of them is wrong
        // alert(hasCpswErrors);
        // false if its empty
        if (hasErrors || hasCpswErrors) {
            setAllError(prev => ({ ...prev, all: "Υπάρχουν λάθη στη φόρμα" }));
            return;
        }

        axios.post('http://localhost:5000/register', formData)
            .then((res) => {
                navigate('/match');
                console.log(res);
                console.log("Form submitted:", formData);
            })
            .catch((err) => console.log(err));
    }

    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);
    return (
        <div className={styles.container}>
            <div className={styles.header}>Register Form</div>
            <div className={styles.registerForm}>
                <form onSubmit={handleSubmit}>
                    <p className={styles.titlee}>Πρέπει να συμπληρώσεται όλα τα πεδία της φόρμας</p><br />
                    Όνομα<span className={styles.must}>*</span>:<br /><input type="text" name="fname" value={formData.fname} required onChange={handleChange} className={errors.fname ? styles.inputError : ""} />
                    <div className={styles.errorMsg}>{errors.fname}</div><br />

                    Επώνυμο<span className={styles.must}>*</span>:<br /><input type="text" name="lname" value={formData.lname} required onChange={handleChange} className={errors.lname ? styles.inputError : ""} />
                    <div className={styles.errorMsg}>{errors.lname}</div><br />

                    Αριθμός ρολογιού<span className={styles.must}>*</span>:<br /><input type="text" name="clock" value={formData.clock} placeholder="x-xxxxxxxx-xx" required onChange={handleChange} className={errors.clock ? styles.inputError : ""} />
                    <div className={styles.errorMsg}>{errors.clock}</div><br />

                    Πάροχος ενέργειας<span className={styles.must}>*</span>:<br />
                    <select name="provider" required onChange={handleChange} value={formData.provider}>
                        {providers.map((provider) => {
                            return (
                                <option key={provider.providerid} value={provider.providername}>
                                    {provider.providername}
                                </option>);
                        })}
                    </select><br /><br />

                    Email<span className={styles.must}>*</span>:<br /><input type="email" name="email" value={formData.email} required onChange={handleChange} className={errors.email ? styles.inputError : ""} />
                    <div className={styles.errorMsg}>{errors.email}</div><br />

                    Username<span className={styles.must}>*</span>:<br /><input type="text" name="username" value={formData.username} required onChange={handleChange} className={errors.username ? styles.inputError : ""} />
                    <div className={styles.errorMsg}>{errors.username}</div><br />

                    Password<span className={styles.must}>*</span>:<br />
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} required onChange={handleChange} className={errors.password ? styles.inputError : ""} /><br />
                    <input type="checkbox" onChange={() => setShowPassword(!showPassword)} /> Εμφάνιση κωδικού<br />
                    <div className={styles.errorMsg}>{errors.password}</div><br />

                    Confirm Password<span className={styles.must}>*</span>:<br />
                    <input type={showConfPassword ? "text" : "password"} name="cpsw" value={conPass.cpsw} required onChange={handleChange} className={cpswError.cpsw ? styles.inputError : ""} /><br />
                    <input type="checkbox" onChange={() => setShowConfPassword(!showConfPassword)} /> Εμφάνιση κωδικού<br />
                    <div className={styles.errorMsg}>{cpswError.cpsw}</div><br />
                    <div className={styles.pswmatch}>{cpswMatch.cpsw}</div><br />

                    <div className={styles.errorMsg}>{allError.all}</div>
                    <input type="submit" value="Εγγραφή" />
                </form>
                <p>Έχεις λογαριασμό; κάνε <Link to='/login'>Σύνδεση</Link></p>
            </div>
        </div>
    )
}
export default Register;
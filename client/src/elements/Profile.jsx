import React, { useState, useEffect } from "react";
import axios from 'axios';
import {Link} from "react-router-dom";
import debounce from "lodash/debounce";
import styles from './Profile.module.css';
import matchings from '../assets/images/mymatchings.png';
import myareas from '../assets/images/myareas.png';
import criteria from '../assets/images/criteria.png';
import match from '../assets/images/match.png';
import chats from '../assets/images/chats.png';
import notifications from '../assets/images/notifications.png';
import profile from '../assets/images/profileVisit.png';
import menu from '../assets/images/menu.png';

function Profile() {
    const checkEmail = debounce((value) => {
        axios.get("http://localhost:5000/check_email_profile/", {
            params: { id: 10, email: value }
        })
            .then((res) => {
                if (res.data.exists) {
                    setErrors(prev => ({ ...prev, email: "Υπάρχει ήδη αυτό το email." }));
                }
            })
            .catch((err) => console.log(err));
    }, 500);

    const checkClock = debounce((value) => {
        axios.get("http://localhost:5000/check_clock_profile/", {
            params: { id: 10, clock: value }
        })
            .then((res) => {
                if (res.data.exists) {
                    setErrors(prev => ({ ...prev, clock: "Υπάρχει ήδη αυτό το ρολόϊ." }));
                }
            })
            .catch((err) => console.log(err));
    }, 500);

    const checkUsername = debounce((value) => {
        axios.get("http://localhost:5000/check_username_profile/", {
            params: {
                id: 10,
                username: value
            }
        })
            .then((res) => {
                if (res.data.exists) {
                    setErrors(prev => ({ ...prev, username: "Υπάρχει ήδη αυτό το username." }));
                }
            })
            .catch((err) => console.log(err));
    }, 500);
    const [data, setData] = useState({
        fname: '',
        lname: '',
        clock: '',
        provider: '',
        email: '',
        username: '',
        password: ''
    });

    const [conPass, setConPass] = useState({ cpsw: "" });
    const [originalPassword, setOriginalPassword] = useState("");

    const [errors, setErrors] = useState({
        fname: "",
        lname: "",
        clock: "",
        username: "",
        email: "",
        password: "",
        pswmatch: ""
    });

    const [providers, setProviders] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:5000/get_providers')
            .then((res) => { setProviders(res.data); })
            .catch((err) => { console.log(err); });
    }, []);

    const [cpswError, setCpswError] = useState({ cpsw: "" });
    const [cpswMatch, setCpswMatch] = useState({ cpsw: "" });
    const [cpswRequired, setCpswRequired] = useState(false);
    const [allError, setAllError] = useState({ all: "" });
    const [saved, setSaved] = useState({ saved: "" });

    const [loading, setLoading] = useState(false);

    // timer
    useEffect(() => {
        if (saved.saved !== "") {
            const timer = setTimeout(() => {
                setSaved(prev => ({ ...prev, saved: "" }));
            }, 5000);

            return () => clearTimeout(timer);
        }

        if (allError.all !== "") {
            const timer = setTimeout(() => {
                setAllError(prev => ({ ...prev, all: "" }));
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [saved.saved, allError.all]);

    useEffect(() => {
        axios.get(`http://localhost:5000/user_profile/${10}`)
            .then((res) => {
                if (res.data) {
                    setData(res.data)
                    setOriginalPassword(res.data.password);
                }
            })
            .catch((err) => { console.log(err); });
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        if (name === "cpsw") setConPass({...conPass, [name]: value});
        else setData({...data, [name]: value});

        validateField(name, value);
    };
    function validateField(name, value) {
        let error = "";
        let cpswerror = "";
        let cpswmatch = "";
        let len = value.length;
        if (name === "fname") {
            let regex = /\d/;
            if (len === 0) error = "Το όνομα είναι κενό";

            else if (len < 4 || len > 15) error = "Το όνομά σας πρέπει να αποτελείται από 4 μέχρι 15 γράμματα";

            else if (value.includes(" ")) error = "Το όνομά σας δεν μπορεί να περιέχει κενά";

            else if (regex.test(value)) error = "Το όνομά σας δεν επιτρέπεται να περιέχει ψηφία";
        }
        else if (name === "lname") {
            let regex = /\d/;
            if (len === 0) error = "Το επιθετό σας είναι κενό";

            else if (len < 4 || len > 15) error = "Το επιθετό σας πρέπει να αποτελείται από 4 μεχρι 15 γράμματα";

            else if (value.includes(" ")) error = "Το επιθετό σας δεν μπορεί να περιέχει κενά";

            else if (regex.test(value)) error = "Το επιθετό σας δεν επιτρέπεται να περιέχει ψηφία";
        }
        else if (name === "clock") {
            let regex = /^\d-\d{8}-\d{2}$/;
            if (len === 0) error = "Ο αριθμός ρολογιού είναι κενός";

            else if (regex.test(value)) error = "";

            else error = "Ο αριθμός πρέπει να είναι αυτής της μορφής χ-χχχχχχχχ-χχ";

            checkClock(value);
        }
        else if (name === "email") {
            if (len === 0) error = "Το email σας είναι κενό";
            else error = "";
            checkEmail(value);
        }
        else if (name === "username") {
            if (len === 0) error = "Το username σας είναι κενό";

            else if (len < 5 || len > 10) error = "Το username σας πρέπει να αποτελείται από 5 μέχρι 10 γράμματα";

            else if (value.includes(" ")) error = "Το username σας δεν μπορεί να περιέχει κενά";

            checkUsername(value);
        }

        if (name === "password") {
            let len = value.length;
            let confirm = conPass.cpsw;
            let cpswlen = confirm.length;
            let specialRegex = /[!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>\/?]/;

            if (!originalPassword) return;

            setCpswRequired(originalPassword !== value);
            alert(value + " " + originalPassword);

            if(originalPassword === value){
                cpswerror = "";
                cpswmatch = "";
            }
            else if(originalPassword !== value){
                cpswerror = "Οι δύο κωδικοί δεν ταιρίαζουν";
                cpswmatch = "";
            }
            else if (password === confirm && len !== 0) {
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

            if (len === 0) error = "Ο κωδικός σας είναι κενός";

            else if (len < 5 || len > 15) error = "Ο κωδικός σας πρέπει να αποτελείται απο 5 μέχρι 15 χαρακτήρες";

            else if (value.includes(" ")) error = "Ο κωδικός σας δεν μπορεί να περιέχει κενά";

            else if (!specialRegex.test(value)) error = "Ο κωδικός σας πρέπει να περιέχει τουλάχιστον έναν χαρακτήρα σύμβολο";
        }

        if (name === "cpsw") {
            confirm = value;
            let len = confirm.length;
            let password = data.password;

            if (!originalPassword) return;

            if (len === 0 || password == originalPassword) {
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
            setErrors(prev => ({ ...prev, [name]: error }));

            setCpswError(prev => ({ ...prev, cpsw: cpswerror }));

            setCpswMatch(prev => ({ ...prev, cpsw: cpswmatch }));
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        const hasErrors = Object.values(errors).some(err => err !== "");
        const hasCpswErrors = Object.values(cpswError).some(err => err !== "");

        if (hasErrors || hasCpswErrors) {
            setAllError(prev => ({ ...prev, all: "Υπάρχουν λάθη στη φόρμα" }));
            setLoading(false);
            return;
        }

        try {
            await axios.put(`http://localhost:5000/edit_user/${10}`, data);

            const res = await axios.get(`http://localhost:5000/user_profile/10`);
            if (res.data) {
                setData(res.data);
                setOriginalPassword(res.data.password);
            }

            setAllError(prev => ({ ...prev, all: "" }))
            setSaved(prev => ({ ...prev, saved: "Οι αλλαγές ήταν επιτυχής" }));
            setConPass({cpsw:""});
            setCpswMatch({cpsw:""});
        }
        catch (err) { console.log(err); }
        finally { setLoading(false); }
    }

    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);
    return (
        <div className={styles.container}>
            <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <Link to='/matchings'><img src={matchings} /></Link>
                <Link to='/my_areas'><img src={myareas} /></Link>
                <Link to='/criteria'><img src={criteria} /></Link>
                <Link to='/match'><img src={match} /></Link>
                <Link to='/my_chats'><img src={chats} /></Link>
                <Link to='/notifications'><img src={notifications} /></Link>
                <Link to='/profile'><img src={profile} /></Link>
            </div>

            <div className={styles.profile}>
                <div className={styles.logoutContainer}>
                    <button className={styles.logout}><Link to='/index'>Logout</Link></button>
                </div>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className={styles.profileData}><label>Ονομα</label><br />
                        <input
                            type="text"
                            name="fname"
                            value={data.fname}
                            onChange={handleChange}
                            className={errors.fname ? styles.inputError : ""}
                        />
                        <div className={styles.errorMsg}>{errors.fname}</div>
                    </div>

                    <div className={styles.profileData}><label>Επώνυμο</label><br />
                        <input
                            type="text"
                            name="lname"
                            value={data.lname}
                            onChange={handleChange}
                            className={errors.lname ? styles.inputError : ""}
                        />
                        <div className={styles.errorMsg}>{errors.lname}</div>
                    </div>

                    <div className={styles.profileData}><label>Ρολόι</label><br />
                        <input
                            type="text"
                            name="clock"
                            value={data.clock}
                            onChange={handleChange}
                            className={errors.clock ? styles.inputError : ""}
                        />
                        <div className={styles.errorMsg}>{errors.clock}</div>
                    </div>

                    <div className={styles.profileData}><label>Πάροχος</label><br />
                        <select name="provider" onChange={handleChange} value={data.provider}>
                            <option defaultValue={data.provider} key={10}>{data.provider}</option>
                            {providers.map((provider) => {
                                return (
                                    <option key={provider.providerid} value={provider.providername}>
                                        {provider.providername}
                                    </option>);
                            })}
                        </select>
                    </div>

                    <div className={styles.profileData}><label>Email</label><br />
                        <input
                            type="text"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                            className={errors.email ? styles.inputError : ""}
                        />
                        <div className={styles.errorMsg}>{errors.email}</div>
                    </div>

                    <div className={styles.profileData}><label>Username</label><br />
                        <input
                            type="text"
                            name="username"
                            value={data.username}
                            onChange={handleChange}
                            className={errors.username ? styles.inputError : ""}
                        />
                        <div className={styles.errorMsg}>{errors.username}</div>
                    </div>

                    <div className={styles.profileData}><label>Password</label><br />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                            className={errors.password ? styles.inputError : ""}
                        />
                        <br />
                        <input type="checkbox" onChange={() => setShowPassword(!showPassword)} /> Εμφάνιση κωδικού
                        <div className={styles.errorMsg}>{errors.password}</div>
                    </div>

                    <div className={styles.profileData}><label>Confirm Password</label><br />
                        <input
                            type={showConfPassword ? "text" : "password"}
                            name="cpsw"
                            value={conPass.cpsw}
                            onChange={handleChange}
                            required={cpswRequired}
                            className={cpswError.cpsw ? styles.inputError : ""}
                        />
                        <br />
                        <input type="checkbox" onChange={() => setShowConfPassword(!showConfPassword)} /> Εμφάνιση κωδικού
                        <div className={styles.errorMsg}>{cpswError.cpsw}</div>
                        <div className={styles.pswmatch}>{cpswMatch.cpsw}</div><br />
                    </div>

                    <div className={styles.errorMsg}>{allError.all}</div>
                    <div className={styles.pswmatch}>{saved.saved}</div>
                    <input type="submit" value="Αποθήκευση αλλαγών" disabled={loading} />
                </form>
            </div>
        </div>
    )
}
export default Profile;
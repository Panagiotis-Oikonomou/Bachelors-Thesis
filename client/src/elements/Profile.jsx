
import React, { useState, useEffect } from "react";
import axios, { all } from 'axios';
import { Link } from "react-router-dom";
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
    const [data, setData] = useState({
        fname: '',
        lname: '',
        clock: '',
        provider: '',
        email: '',
        username: '',
        password: ''
    });

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

    const [allError, setAllError] = useState({ all: "" });
    const [saved, setSaved] = useState({ saved: "" });

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

    // const [conPass, setConPass] = useState({ cpsw: "" });

    useEffect(() => {
        axios.get(`http://localhost:5000/user_profile/${10}`)
            .then((res) => { if (res.data) setData(res.data) })
            .catch((err) => { console.log(err); });
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });

        validateField(name, value);
    };

    function validateField(name, value) {
        let error = "";
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

            axios.get("http://localhost:5000/check_clock_profile/", {
                params: {
                    id: 10,
                    clock: value
                }
            })
                .then((res) => {
                    if (res.data.exists) {
                        setErrors(prev => ({ ...prev, clock: "Υπάρχει ήδη αυτό το ρολόϊ." }));
                    }
                })
                .catch((err) => console.log(err));
        }
        else if (name === "email") {
            if (len === 0) error = "Το email σας είναι κενό";
            else error = "";
            axios.get("http://localhost:5000/check_email_profile/", {
                params: {
                    id: 10,
                    email: value
                }
            })
                .then((res) => {
                    if (res.data.exists) {
                        setErrors(prev => ({ ...prev, email: "Υπάρχει ήδη αυτό το email." }));
                    }
                })
                .catch((err) => console.log(err));

        }
        else if (name === "username") {
            if (len === 0) error = "Το username σας είναι κενό";

            else if (len < 5 || len > 10) error = "Το username σας πρέπει να αποτελείται από 5 μέχρι 10 γράμματα";

            else if (value.includes(" ")) error = "Το username σας δεν μπορεί να περιέχει κενά";

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
        }

        let password = data.password;
        // let confirm = conPass.cpsw;

        if (name === "password") {
            password = value;
            let len = password.length;
            // let cpswlen = confirm.length;
            let specialRegex = /[!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>\/?]/;
            // if (password === confirm && len != 0) {
            //     cpswerror = "";
            //     cpswmatch = "Οι δύο κωδικοί ταιρίαζουν";
            // }
            // else if (password !== confirm && cpswlen === 0) {
            //     cpswerror = "";
            //     cpswmatch = "";
            // }
            // else if (password !== confirm && len !== 0) {
            //     cpswerror = "Οι δύο κωδικοί δεν ταιρίαζουν";
            //     cpswmatch = "";
            // }

            if (len === 0) error = "Ο κωδικός σας είναι κενός";

            else if (len < 5 || len > 15) error = "Ο κωδικός σας πρέπει να αποτελείται απο 5 μέχρι 15 χαρακτήρες";

            else if (password.includes(" ")) error = "Ο κωδικός σας δεν μπορεί να περιέχει κενά";

            else if (!specialRegex.test(password)) error = "Ο κωδικός σας πρέπει να περιέχει τουλάχιστον έναν χαρακτήρα σύμβολο";

            axios.get("http://localhost:5000/get_password_profile/", {
                params: {
                    id: 10,
                    password: value
                }
            })
                .then((res) => {
                    if (res.data.exists) {
                        setErrors(prev => ({ ...prev, password: "Edv eimaste einaia oi kvdikoi eiidoi." }));
                    }
                })
                .catch((err) => console.log(err));
        }

        setErrors(prev => ({ ...prev, [name]: error }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        const hasErrors = Object.values(errors).some(err => err !== "");

        if (hasErrors) {
            setAllError(prev => ({ ...prev, all: "Υπάρχουν λάθη στη φόρμα" }));
            return;
        }
        axios.put(`http://localhost:5000/edit_user/${10}`, data)
            .then((res) => console.log(res))
            .catch((err) => console.log(err))

        setAllError(prev => ({ ...prev, all: "" }))
        setSaved(prev => ({ ...prev, saved: "Οι αλλαγές ήταν επιτυχής" }));
    }

    const [showPassword, setShowPassword] = useState(false);
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
                        <div className={styles.errorMsg}>{errors.password}</div>
                        <input type="checkbox" onChange={() => setShowPassword(!showPassword)} /> Εμφάνιση κωδικού
                    </div>

                    <div className={styles.errorMsg}>{allError.all}</div>
                    <div className={styles.pswmatch}>{saved.saved}</div>
                    <input type="submit" value="Αποθήκευση αλλαγών" />
                </form>
            </div>
        </div>
    )
}
export default Profile;
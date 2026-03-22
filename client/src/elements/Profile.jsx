
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
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

    // const [conPass, setConPass] = useState({ cpsw: "" });

    useEffect(() => {
        axios.get(`http://localhost:5000/user_profile/${10}`)
            .then((res) => { setData(res.data[0]) })
            .catch((err) => { console.log(err); });
    }, [10]);

    function handleChange(e) {
        const { name, value } = e.target;
        setData({
            ...data,
            [name]: value
        });

        validateField(name, value);
    };

    function validateField(name, value){
        let error = "";
        let len = value.length;
        if(name === "fname"){
            let regex = /\d/;
            if (len === 0) error = "Το όνομα είναι κενό";

            else if (len < 4 || len > 15) error = "Το όνομά σας πρέπει να αποτελείται από 4 μέχρι 15 γράμματα";

            else if (value.includes(" ")) error = "Το όνομά σας δεν μπορεί να περιέχει κενά";

            else if (regex.test(value)) error = "Το όνομά σας δεν επιτρέπεται να περιέχει ψηφία";
        }
        else if(name === "lname"){
            let regex = /\d/;
            if (len === 0) error = "Το επιθετό σας είναι κενό";

            else if (len < 4 || len > 15) error = "Το επιθετό σας πρέπει να αποτελείται από 4 μεχρι 15 γράμματα";

            else if (value.includes(" ")) error = "Το επιθετό σας δεν μπορεί να περιέχει κενά";

            else if (regex.test(value)) error = "Το επιθετό σας δεν επιτρέπεται να περιέχει ψηφία";
        }
        else if(name === "clock"){
            
        }else if(name === "email"){
            
        }
        else if(name === "username"){
            
        }
        else if(name === "password"){
            
        }

        setErrors(prev => ({ ...prev, [name]: error}));
    }

    function handleSubmit(e) {
        e.preventDefault();
        axios.put(`http://localhost:5000/edit_user/${10}`, data)
            .then((res) => console.log(res))
            .catch((err) => console.log(err))
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
                        />
                        <div className={styles.errorMsg}>{errors.fname}</div>
                    </div>

                    <div className={styles.profileData}><label>Επώνυμο</label><br />
                        <input
                            type="text"
                            name="lname"
                            value={data.lname}
                            onChange={handleChange}
                        />
                        <div className={styles.errorMsg}>{errors.lname}</div>
                        </div>

                    <div className={styles.profileData}><label>Ρολόι</label><br />
                        <input
                            type="text"
                            name="clock"
                            value={data.clock}
                            onChange={handleChange}
                        />
                        <div className={styles.errorMsg}>{errors.clock}</div>
                        </div>

                    <div className={styles.profileData}><label>Πάροχος</label><br />
                        <input
                            type="text"
                            name="provider"
                            value={data.provider}
                            onChange={handleChange}
                        /></div>

                    <div className={styles.profileData}><label>Email</label><br />
                        <input
                            type="text"
                            name="email"
                            value={data.email}
                            onChange={handleChange}
                        />
                        <div className={styles.errorMsg}>{errors.email}</div>
                    </div>

                    <div className={styles.profileData}><label>Username</label><br />
                        <input
                            type="text"
                            name="username"
                            value={data.username}
                            onChange={handleChange}
                        />
                        <div className={styles.errorMsg}>{errors.username}</div>
                        </div>

                    <div className={styles.profileData}><label>Password</label><br />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                        /><div className={styles.errorMsg}>{errors.fname}</div>
                        <input type="checkbox" onChange={() => setShowPassword(!showPassword)} /> Εμφάνιση κωδικού
                    </div>

                    <input type="submit" value="Αποθήκευση αλλαγών" />
                </form>
            </div>
        </div>
    )
}
export default Profile;
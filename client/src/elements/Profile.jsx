import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import styles from './Profile.module.css';
import userProfile from "../hooks/userProfile";
import axios from "axios";

import matchings from '../assets/images/mymatchings.png';
import myareas from '../assets/images/myareas.png';
import criteria from '../assets/images/criteria.png';
import match from '../assets/images/match.png';
import chats from '../assets/images/chats.png';
import notifications from '../assets/images/notifications.png';
import profile from '../assets/images/profileVisit.png';
import menu from '../assets/images/menu.png';
import { useEffect } from 'react';
import { getUserFromToken } from '../helpers/auth';

function Profile() {
    const user = getUserFromToken();
    const userid = user?.userid;
    // if (!userid) return null;
    const navigate = useNavigate();

    const {
        data, conPass, errors, providers, cpswError, cpswMatch,
        cpswRequired, allError, saved, loading,
        showPassword, setShowPassword,
        showConfPassword, setShowConfPassword,
        handleChange, handleSubmit
    } = userProfile(userid);



    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/login');
            return;
        }

        axios.get('http://localhost:5000/api/users/checkAuth', {
            headers: {
                'authorization': `Bearer ${token}`
            }
        })
            .then(res => console.log(res))
            .catch(err => {
                localStorage.removeItem("token");
                navigate('/login');
            });
    }, []);

    if(!data) return <div>Loading...</div>

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
                            value={data?.fname || ""}
                            onChange={handleChange}
                            className={errors.fname ? styles.inputError : ""}
                        />
                        <div className={styles.errorMsg}>{errors.fname}</div>
                    </div>

                    <div className={styles.profileData}><label>Επώνυμο</label><br />
                        <input
                            type="text"
                            name="lname"
                            value={data?.lname || ""}
                            onChange={handleChange}
                            className={errors.lname ? styles.inputError : ""}
                        />
                        <div className={styles.errorMsg}>{errors.lname}</div>
                    </div>

                    <div className={styles.profileData}><label>Ρολόι</label><br />
                        <input
                            type="text"
                            name="clock"
                            value={data?.clock || ""}
                            onChange={handleChange}
                            className={errors.clock ? styles.inputError : ""}
                        />
                        <div className={styles.errorMsg}>{errors.clock}</div>
                    </div>

                    <div className={styles.profileData}><label>Πάροχος</label><br />
                        <select name="provider" onChange={handleChange} value={data?.provider || ""}>
                            <option defaultValue={data.provider} key={userId}>{data.provider}</option>
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
                            value={data?.email || ""}
                            onChange={handleChange}
                            className={errors.email ? styles.inputError : ""}
                        />
                        <div className={styles.errorMsg}>{errors.email}</div>
                    </div>

                    <div className={styles.profileData}><label>Username</label><br />
                        <input
                            type="text"
                            name="username"
                            value={data?.username || ""}
                            onChange={handleChange}
                            className={errors.username ? styles.inputError : ""}
                        />
                        <div className={styles.errorMsg}>{errors.username}</div>
                    </div>

                    <div className={styles.profileData}><label>Password</label><br />
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={data?.password || ""}
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
                            value={conPass?.cpsw || ""}
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
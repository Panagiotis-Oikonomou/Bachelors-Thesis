import { Link } from "react-router-dom";
import useAdminProfile from "../../hooks/useAdminProfile";
import styles from "./ProfileAdmin.module.css";

import paroxoi from "../../assets/images/paroxoi.png";
import users from "../../assets/images/users.png";
import notifications from "../../assets/images/notifications.png";
import profile from "../../assets/images/profileVisit.png";
import menu from "../../assets/images/menu.png";

function ProfileAdmin() {
    const {
        data, conPass, errors, providers, cpswError,
        cpswMatch, cpswRequired, allError, saved,
        showPassword, setShowPassword, showConfPassword,
        setShowConfPassword, handleChange, handleSubmit, signOut,
    } = useAdminProfile();

    return (
        <div className={styles.container}>
            <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <Link to="/paroxoi">
                    <img src={paroxoi} />
                </Link>
                <Link to="/users">
                    <img src={users} />
                </Link>
                <Link to="/notifications/admin">
                    <img src={notifications} />
                </Link>
                <Link to="/profile/admin">
                    <img src={profile} />
                </Link>
            </div>

            <div className={styles.profile}>
                <div className={styles.logoutContainer}>
                    <button className={styles.logout} id="logout" onClick={signOut}>
                        Logout
                    </button>
                </div>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    <div className={styles.profileData}>
                        <label htmlFor="fname">Ονομα</label>
                        <br />
                        <input
                            type="text"
                            id="fname"
                            name="fname"
                            value={data.fname}
                            onChange={handleChange}
                            className={errors.fname ? styles.inputError : ""}
                        />
                        <div className={styles.errorMsg}>{errors.fname}</div>
                    </div>

                    <div className={styles.profileData}><label htmlFor="lname">Επώνυμο</label><br />
                        <input
                            type="text"
                            id="lname"
                            name="lname"
                            value={data.lname}
                            onChange={handleChange}
                            className={errors.lname ? styles.inputError : ""}
                        />
                        <div className={styles.errorMsg}>{errors.lname}</div>
                    </div>

                    <div className={styles.profileData}><label htmlFor="email">Email</label><br />
                        <input
                            type="text"
                            id="email"
                            name="email"
                            autoComplete="off"
                            value={data.email}
                            onChange={handleChange}
                            className={errors.email ? styles.inputError : ""}
                        />
                        <div className={styles.errorMsg}>{errors.email}</div>
                    </div>

                    <div className={styles.profileData}><label htmlFor="username">Username</label><br />
                        <input
                            type="text"
                            id="username"
                            name="username"
                            autoComplete="off"
                            value={data.username}
                            onChange={handleChange}
                            className={errors.username ? styles.inputError : ""}
                        />
                        <div className={styles.errorMsg}>{errors.username}</div>
                    </div>

                    <div className={styles.profileData}><label htmlFor="password">Password</label><br />
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={data.password}
                            onChange={handleChange}
                            className={errors.password ? styles.inputError : ""}
                        />
                        <br />
                        <input type="checkbox" id="showpsw" onChange={() => setShowPassword(!showPassword)} /> <label htmlFor="showpsw"> Εμφάνιση κωδικού</label>
                        <div className={styles.errorMsg}>{errors.password}</div>
                    </div>

                    <div className={styles.profileData}><label htmlFor="cpsw">Confirm Password</label><br />
                        <input
                            type={showConfPassword ? "text" : "password"}
                            id="cpsw"
                            name="cpsw"
                            value={conPass}
                            onChange={handleChange}
                            required={cpswRequired}
                            className={cpswError ? styles.inputError : ""}
                        />
                        <br />
                        <input type="checkbox" id="showcpsw" onChange={() => setShowConfPassword(!showConfPassword)} /> <label htmlFor="showcpsw">Εμφάνιση κωδικού</label>
                        <div className={styles.errorMsg}>{cpswError}</div>
                        <div className={styles.pswmatch}>{cpswMatch}</div><br />
                    </div>

                    <div className={styles.errorMsg}>{allError}</div>
                    <div className={styles.pswmatch}>{saved}</div>
                    <input type="submit" value="Αποθήκευση αλλαγών" />
                </form>
            </div>
        </div>
    );
}
export default ProfileAdmin;
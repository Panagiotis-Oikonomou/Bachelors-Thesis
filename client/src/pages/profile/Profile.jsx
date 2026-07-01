import { Link } from "react-router-dom";
import styles from './Profile.module.css';
import useUserProfile from '../../hooks/useUserProfile';
import { Up } from "../../components/up/Up";

function Profile() {
    const {
        data, conPass, errors, providers, cpswError, cpswMatch,
        cpswRequired, allError, saved,
        showPassword, setShowPassword,
        showConfPassword, setShowConfPassword,
        handleChange, handleSubmit, signOut
    } = useUserProfile();

    return (
        <div className={styles.container}>
            <Up></Up>

            <div className={styles.profile}>
                <div className={styles.logoutContainer}>
                    <button className={styles.logout} onClick={signOut}>Logout</button>
                </div>
                <form onSubmit={handleSubmit} autoComplete="off">
                    <div className={styles.profileData}><label htmlFor="fname">Ονομα</label><br />
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

                    <div className={styles.profileData}><label htmlFor="clock">Ρολόι</label><br />
                        <input
                            type="text"
                            id="clock"
                            name="clock"
                            value={data.clock}
                            onChange={handleChange}
                            className={errors.clock ? styles.inputError : ""}
                        />
                        <div className={styles.errorMsg}>{errors.clock}</div>
                    </div>

                    <div className={styles.profileData}><label htmlFor="provider">Πάροχος</label><br />
                        <select id="provider" name="provider" onChange={handleChange} value={data.provider}>
                            {/* key={userId} */}
                            <option defaultValue={data.provider} >{data.provider}</option>
                            {providers.map((provider) => {
                                return (
                                    <option key={provider.providerid} value={provider.providername}>
                                        {provider.providername}
                                    </option>);
                            })}
                        </select>
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
                    <input type="submit" value="Αποθήκευση αλλαγών"  />
                </form>
            </div>
        </div>
    )
}
export default Profile;
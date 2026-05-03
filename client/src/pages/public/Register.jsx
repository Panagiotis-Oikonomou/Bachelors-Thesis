import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from './LoginRegister.module.css';
import useUserRegister from "../../hooks/useUserRegister";

function Register() {
    const {
        formData, conPass, errors, providers, cpswError, cpswMatch,
        allError, showConfPassword, showPassword,
        setShowConfPassword, setShowPassword,
        handleChange, handleSubmit
    } = useUserRegister();
    return (
        <div className={styles.container}>
            <div className={styles.header}>Register Form</div>
            <div className={styles.registerForm}>
                <form onSubmit={handleSubmit}>
                    <p className={styles.titlee}>Πρέπει να συμπληρώσεται όλα τα πεδία της φόρμας</p><br />
                    <div className={styles.formData}><label htmlFor="fname">Όνομα<span className={styles.must}>*</span></label><br />
                        <input
                            type="text"
                            id="fname"
                            name="fname"
                            value={formData.fname}
                            required
                            onChange={handleChange}
                            className={errors.fname ? styles.inputError : ""}
                            autoFocus
                            autoComplete="off"
                        />
                        <div className={styles.errorMsg}>{errors.fname}</div>
                    </div>

                    <div className={styles.formData}><label htmlFor="lname">Επώνυμο<span className={styles.must}>*</span></label><br />
                        <input
                            type="text"
                            id="lname"
                            name="lname"
                            value={formData.lname}
                            required
                            onChange={handleChange}
                            className={errors.lname ? styles.inputError : ""}
                            autoComplete="off"
                        />
                        <div className={styles.errorMsg}>{errors.lname}</div>
                    </div>

                    <div className={styles.formData}><label htmlFor="clock">Αριθμός ρολογιού<span className={styles.must}>*</span></label><br />
                        <input
                            type="text"
                            id="clock"
                            name="clock"
                            value={formData.clock}
                            required
                            onChange={handleChange}
                            className={errors.clock ? styles.inputError : ""}
                            autoComplete="off"
                        />
                        <div className={styles.errorMsg}>{errors.clock}</div>
                    </div>

                    <div className={styles.formData}><label htmlFor="provider">Πάροχος ενέργειας<span className={styles.must}>*</span></label><br />
                        <select id="provider" name="provider" required onChange={handleChange} value={formData.provider}>
                            <option defaultValue={""}></option>
                            {providers.map((provider) => {
                                return (
                                    <option key={provider.providerid} value={provider.providername}>
                                        {provider.providername}
                                    </option>);
                            })}
                        </select>
                    </div>

                    <div className={styles.formData}><label htmlFor="email">Email<span className={styles.must}>*</span></label><br />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            required
                            onChange={handleChange}
                            className={errors.email ? styles.inputError : ""}
                            autoComplete="off"
                        />
                        <div className={styles.errorMsg}>{errors.email}</div>
                    </div>

                    <div className={styles.formData}><label htmlFor="username">Username<span className={styles.must}>*</span></label><br />
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            required
                            onChange={handleChange}
                            className={errors.username ? styles.inputError : ""}
                            autoComplete="off"
                        />
                        <div className={styles.errorMsg}>{errors.username}</div>
                    </div>

                    <div className={styles.formData}><label htmlFor="password">Password<span className={styles.must}>*</span></label><br />
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            required
                            onChange={handleChange}
                            className={errors.password ? styles.inputError : ""}
                        /><br />
                        <input type="checkbox" onChange={() => setShowPassword(!showPassword)} /> Εμφάνιση κωδικού
                        <div className={styles.errorMsg}>{errors.password}</div>
                    </div>

                    <div className={styles.formData}><label htmlFor="cpsw">Confirm Password<span className={styles.must}>*</span></label><br />
                        <input
                            type={showConfPassword ? "text" : "password"}
                            id="cpsw"
                            name="cpsw"
                            value={conPass.cpsw}
                            required
                            onChange={handleChange}
                            className={cpswError.cpsw ? styles.inputError : ""}
                        /><br />
                        <input type="checkbox" onChange={() => setShowConfPassword(!showConfPassword)} /> Εμφάνιση κωδικού
                        <div className={styles.errorMsg}>{cpswError.cpsw}</div><br />
                        <div className={styles.pswmatch}>{cpswMatch.cpsw}</div>
                    </div>
                    <div className={styles.errorMsg}>{allError.all}</div>
                    <input type="submit" value="Εγγραφή" />
                </form>
                <p>Έχεις λογαριασμό; κάνε <Link to='/login'>Σύνδεση</Link></p>
            </div>
        </div>
    )
}
export default Register;
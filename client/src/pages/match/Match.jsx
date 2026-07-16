import { useState } from "react";
import { Link } from "react-router-dom";
import useMatch from "../../hooks/useMatch";
import styles from './Match.module.css';
import { Up } from "../../components/up/Up";

import checkMark from '../../assets/images/checkMark.png';
import xMark from '../../assets/images/xMark.png';

function Match() {
    const { criteria, isSizeChecked, isEnergyChecked, isIncomeChecked, isMoneyChecked, isPapersChecked,
        isOtherChecked, checkboxOptions, formError, handleChange, handleSearchSubmit, setMinMaxToZero,
        isAreaChecked, havingArea, areas, selectedArea, handleCreationSubmit, users, removeSelectedUser,
        addUser, searchedUsers, visibleUser, nextUser, hoveredUser, setHoveredUser } = useMatch();
    return (
        <div className={styles.container}>
            <Up/>

            <div className={styles.users}>
                {users.map((user, index) => (
                    <div className={styles.user} key={index}
                        onMouseEnter={() => setHoveredUser(user.userid)} onMouseLeave={() => setHoveredUser(null)}>
                        {user.username} {index > 0 && (<div className={styles.x} onClick={() => removeSelectedUser(index)}>X</div>)}

                        {hoveredUser === user.userid && (
                            <div className={styles.userData}>
                                {<>Περιοχή:{user.areaid === null ? " Όχι" : " Ναι"}<br /></>}

                                {user.areaid !== null && (
                                    <>
                                        Έκταση περιοχής: {user.size}m²<br />
                                        Ποσότητα PV ενέργειας: {user.ac}kwh<br />
                                    </>)}<br />

                                Ζήτηση και Προσφορά<br />

                                {user.areasize !== null && (<>Έκταση: {user.areasize}m²<br /></>)}

                                {user.energy !== null && (<>Ποσότητα PV ενέργειας: {user.energy}kwh<br /></>)}

                                {user.income !== null && (<>Ποσοστό εσόδων: {user.income}<br /></>)}

                                {user.money !== null && (<>Χρήματα: {user.money}<br /></>)}

                                Χαρτιά: {user.papers !== null && user.papers ? "Ναι" : "Όχι"}<br />

                                Άλλα: {user.other !== null && user.other ? "Ναι" : "Όχι"}<br />
                            </div>
                        )}
                    </div>
                ))}

                <form className={styles.user} onSubmit={handleCreationSubmit}> <input type="submit" value="Δημιουργία" /></form>
            </div>

            <div className={styles.searchArea}>
                <div className={styles.search}>
                    <form onSubmit={handleSearchSubmit}>
                        <div className={styles.criteria}>
                            <label htmlFor="size">Έκταση(km<sup>2</sup>):<br /></label>
                            <input
                                type="number"
                                name="size"
                                id="size"
                                value={criteria.size}
                                disabled={isSizeChecked}
                                required={!isSizeChecked}
                                onChange={handleChange}
                                step="0.1" min="0" max="131.000"
                            />
                            <label htmlFor="chsize">Δεν θέλω</label>
                            <input type="checkbox" checked={isSizeChecked} onChange={setMinMaxToZero} disabled={isAreaChecked} name="chsize" id="chsize" />
                        </div>

                        <div className={styles.criteria}>
                            <label htmlFor="energy">Ποσότητα PV ενέργειας(kwh):<br /></label>
                            <input
                                type="number"
                                name="energy"
                                id="energy"
                                disabled={isEnergyChecked}
                                required={!isEnergyChecked}
                                value={criteria.energy}
                                onChange={handleChange}
                                step="0.1" min="0"
                            />
                            <label htmlFor="chenergy">Δεν θέλω</label>
                            <input type="checkbox" checked={isEnergyChecked} onChange={setMinMaxToZero} disabled={isAreaChecked} name="chenergy" id="chenergy" />
                        </div>

                        <div className={styles.criteria}>
                            <label htmlFor="income">Ποσοστό εσόδων:<br /></label>
                            <input
                                type="number"
                                name="income"
                                id="income"
                                disabled={isIncomeChecked}
                                required={!isIncomeChecked}
                                value={criteria.income}
                                onChange={handleChange}
                                step="0.1" min="0" max="100"
                            />
                            <label htmlFor="chincome">Δεν θέλω</label>
                            <input type="checkbox" checked={isIncomeChecked} onChange={setMinMaxToZero} name="chincome" id="chincome" />
                        </div>

                        <div className={styles.criteria}>
                            <label htmlFor="money">Αριθμός χρημάτων:<br /></label>
                            <input
                                type="number"
                                name="money"
                                id="money"
                                disabled={isMoneyChecked}
                                required={!isMoneyChecked}
                                value={criteria.money}
                                onChange={handleChange}
                                min="0"
                            />
                            <label htmlFor="chmoney">Δεν θέλω</label>
                            <input type="checkbox" checked={isMoneyChecked} onChange={setMinMaxToZero} name="chmoney" id="chmoney" />
                        </div>

                        <label className={styles.checkboxLabel} htmlFor="area">
                            <input type="checkbox" name="area" id="area" disabled={!havingArea} checked={isAreaChecked} onChange={checkboxOptions} />Έκταση
                            <select name="areaid" onChange={handleChange} disabled={!isAreaChecked} value={selectedArea} required>
                                <option value="">Select area</option>
                                {areas.map((item) => (
                                    <option key={item.areaid} value={item.areaid}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <div className={styles.criteria}>
                            <label className={styles.checkboxLabel} htmlFor="papers">
                                <input type="checkbox" name="papers" id="papers" checked={isPapersChecked} onChange={checkboxOptions} />Διαδικαστικά</label>
                        </div>

                        <div className={styles.criteria}>
                            <label className={styles.checkboxLabel} htmlFor="other">
                                <input type="checkbox" name="other" id="other" checked={isOtherChecked} onChange={checkboxOptions} />Άλλο</label>
                        </div>

                        <div className={styles.msg}>{formError}</div>
                        <input type="submit" value="Αναζήτηση" />
                    </form>
                </div>
            </div>
            <div className={styles.match}>
                {visibleUser && (
                    <>
                        <div className={styles.area}>
                            {visibleUser.username !== null && (<>Username: {visibleUser.username}<br /><br /></>)}

                            {<>Περιοχή:{visibleUser.areaid === null ? " Όχι" : " Ναι"}<br /></>}

                            {visibleUser.areaid !== null && (
                                <>
                                    Έκταση περιοχής: {visibleUser.size}m²<br />
                                    Ποσότητα PV ενέργειας: {visibleUser.ac}kwh<br />
                                </>)}<br />

                            Ζήτηση και Προσφορά<br />
                            {visibleUser.areasize !== null && (<>Έκταση: {visibleUser.areasize}m²<br /></>)}

                            {visibleUser.energy !== null && (<>Ποσότητα PV ενέργειας: {visibleUser.energy}kwh<br /></>)}

                            {visibleUser.income !== null && (<>Ποσοστό εσόδων: {visibleUser.income}<br /></>)}

                            {visibleUser.money !== null && (<>Χρήματα: {visibleUser.money}<br /></>)}

                            Χαρτιά: {visibleUser.papers !== null && visibleUser.papers ? "Ναι" : "Όχι"}<br />

                            Άλλα: {visibleUser.other !== null && visibleUser.other ? "Ναι" : "Όχι"}<br />
                        </div>

                        <div className={styles.choices}>No <img src={xMark} className={styles.images} onClick={nextUser} /></div>

                        <div className={styles.choices}>Yes<img src={checkMark} className={styles.images} onClick={() => addUser(visibleUser)} /></div>
                    </>
                )}
            </div>
        </div >
    )
}

export default Match;
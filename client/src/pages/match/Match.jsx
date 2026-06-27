import { useState } from "react";
import { Link } from "react-router-dom";
import useMatch from "../../hooks/useMatch";
import styles from './Match.module.css';

import matchings from '../../assets/images/mymatchings.png';
import myareas from '../../assets/images/myareas.png';
import criterias from '../../assets/images/criteria.png';
import match from '../../assets/images/matchVisit.png';
import chats from '../../assets/images/chats.png';
import notifications from '../../assets/images/notifications.png';
import profile from '../../assets/images/profile.png';
import menu from '../../assets/images/menu.png';
import checkMark from '../../assets/images/checkMark.png';
import xMark from '../../assets/images/xMark.png';


function Match() {
    const { criteria, isSizeChecked, isEnergyChecked, isIncomeChecked, isMoneyChecked, isPapersChecked, isOtherChecked, checkboxOptions, formError, handleChange, handleSearchSubmit, setMinMaxToZero, isAreaChecked, havingArea, areas, selectedArea, handleCreationSubmit, users, removeSelectedUser, addUser, searchedUsers, visibleUser, nextUser } = useMatch();
    return (
        <div className={styles.container}>
            <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <Link to='/matchings'><img src={matchings} /></Link>
                <Link to='/my_areas'><img src={myareas} /></Link>
                <Link to='/criteria'><img src={criterias} /></Link>
                <Link to='/match'><img src={match} /></Link>
                <Link to='/my_chats'><img src={chats} /></Link>
                <Link to='/notifications'><img src={notifications} /></Link>
                <Link to='/profile'><img src={profile} /></Link>
            </div>

            <div className={styles.users}>
                {users.map((user, index) => (
                    <div className={styles.user} key={index}>{user.username} {index > 0 && (<div className={styles.x} onClick={() => removeSelectedUser(index)}>X</div>)}
                        {/* // ( <img src={larrow} className={styles.x} onClick={() => removeSelectedUser(index)}/>)} */}
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
                            {visibleUser.username !== null && (<>Username: {visibleUser.username}<br /><br/></>)}

                            {<>Περιοχή:{visibleUser.areaid === null ? " Όχι" : " Ναι"}<br /></>}

                            {visibleUser.areaid !== null && (
                                <>
                                    Έκταση περιοχής(km<sup>2</sup>): {visibleUser.size}<br /> 
                                    Ποσότητα PV ενέργειας(kwh): {visibleUser.ac}<br />
                                </>)}<br/>

                            Ζήτηση και Προσφορά<br/>

                            {visibleUser.areasize !== null && (<>Έκταση(km<sup>2</sup>): {visibleUser.size}<br /></>)}

                            {visibleUser.energy !== null && (<>Ποσότητα PV ενέργειας(kwh): {visibleUser.energy}<br /></>)}

                            {visibleUser.income !== null && (<>Ποσοστό εσόδων: {visibleUser.income}<br /></>)}

                            {visibleUser.money !== null && (<>Χρήματα: {visibleUser.money}<br /></>)}

                            {visibleUser.papers !== null && (<>Χαρτιά: {visibleUser.papers ? "Ναι" : "Όχι"}<br /></>)}

                            {visibleUser.other !== null && (<>Άλλα: {visibleUser.other ? "Ναι" : "Όχι"}<br /></>)}
                        </div>

                        <div className={styles.choices}>No <img src={xMark} className={styles.images} onClick={nextUser} /></div>

                        <div className={styles.choices}>Yes<img src={checkMark} className={styles.images} onClick={() => addUser(visibleUser)} /></div>
                    </>
                )}
            </div>
        </div>
    )
}

export default Match;
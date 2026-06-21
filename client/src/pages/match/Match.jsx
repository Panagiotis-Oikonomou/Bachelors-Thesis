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
import larrow from '../../assets/images/leftArrowBlack.png';
import rarrow from '../../assets/images/rightArrowBlack.png';


function Match() {
    const { criteria, isSizeChecked, isEnergyChecked, isIncomeChecked, isMoneyChecked, isPapersChecked, isOtherChecked, checkboxOptions, formError, handleChange, handleSubmit, setMinMaxToZero } = useMatch();
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

            <div className={styles.searchArea}>
                <div className={styles.search}>
                    <form onSubmit={handleSubmit}>
                        <div className={styles.criteria}>
                            <label htmlFor="size">Έκταση(km<sup>2</sup>):<br /></label>
                            <input
                                type="number"
                                name="minsize"
                                id="size"
                                value={criteria.minsize}
                                disabled={isSizeChecked}
                                required={!isSizeChecked}
                                onChange={handleChange}
                                step="0.1" min="0"
                                max={Number(criteria.maxsize) - 1}
                            />
                            <input
                                type="number"
                                value={criteria.maxsize}
                                disabled={isSizeChecked}
                                required={!isSizeChecked}
                                onChange={handleChange}
                                name="maxsize"
                                min={Number(criteria.minsize) + 1}
                                max="3000" step="0.1"
                            /><br />
                            <label htmlFor="chsize">Δεν θέλω</label>
                            <input type="checkbox" checked={isSizeChecked} onChange={setMinMaxToZero} name="chsize" id="chsize" />
                        </div>

                        <div className={styles.criteria}>
                            <label htmlFor="energy">Ποσότητα PV ενέργειας(kwh):<br /></label>
                            <input
                                type="number"
                                name="minenergy"
                                id="energy"
                                disabled={isEnergyChecked}
                                required={!isEnergyChecked}
                                value={criteria.minenergy}
                                onChange={handleChange}
                                step="0.1" min="0"
                                max={Number(criteria.maxenergy) - 1}
                            />
                            <input
                                type="number"
                                disabled={isEnergyChecked}
                                required={!isEnergyChecked}
                                value={criteria.maxenergy}
                                onChange={handleChange}
                                min={Number(criteria.minenergy) + 1}
                                step="0.1" name="maxenergy"
                            /><br />
                            <label htmlFor="chenergy">Δεν θέλω</label>
                            <input type="checkbox" checked={isEnergyChecked} onChange={setMinMaxToZero} name="chenergy" id="chenergy" />
                        </div>

                        <div className={styles.criteria}>
                            <label htmlFor="income">Ποσοστό εσόδων:<br /></label>
                            <input
                                type="number"
                                name="minincome"
                                id="income"
                                disabled={isIncomeChecked}
                                required={!isIncomeChecked}
                                value={criteria.minincome}
                                onChange={handleChange}
                                step="0.1" min="0"
                                max={Number(criteria.maxincome) - 1}
                            />
                            <input
                                type="number"
                                name="maxincome"
                                disabled={isIncomeChecked}
                                required={!isIncomeChecked}
                                value={criteria.maxincome}
                                onChange={handleChange}
                                min={Number(criteria.minincome) + 1} max="100"
                                step="0.1"
                            /><br />
                            <label htmlFor="chincome">Δεν θέλω</label>
                            <input type="checkbox" checked={isIncomeChecked} onChange={setMinMaxToZero} name="chincome" id="chincome" />
                        </div>

                        <div className={styles.criteria}>
                            <label htmlFor="money">Αριθμός χρημάτων:<br /></label>
                            <input
                                type="number"
                                name="minmoney"
                                id="money"
                                disabled={isMoneyChecked}
                                required={!isMoneyChecked}
                                value={criteria.minmoney}
                                onChange={handleChange}
                                max={Number(criteria.maxmoney) - 1} min="0"
                            />
                            <input
                                type="number"
                                name="maxmoney"
                                disabled={isMoneyChecked}
                                required={!isMoneyChecked}
                                value={criteria.maxmoney}
                                onChange={handleChange}
                                min={Number(criteria.minmoney) + 1}
                            /><br />
                            <label htmlFor="chmoney">Δεν θέλω</label>
                            <input type="checkbox" checked={isMoneyChecked} onChange={setMinMaxToZero} name="chmoney" id="chmoney" />
                        </div>

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
            <div className={styles.lArrow}>Πάτα για απόρριψη<img src={larrow} /></div>
            <div className={styles.match}>
                <div className={styles.area}>
                    Όνομα: Κάτι <br /><br />

                    Έκταση(σε km<sup>2</sup>): 23 <br /><br />

                    Ποσοστό ηλειοφάνειας: 23% <br /><br />

                    Τοποθεσία:
                </div>
            </div>
            <div className={styles.rArrow}>Πάτα για αποδοχή<img src={rarrow} /></div>
        </div>
    )
}

export default Match;
import { Link } from "react-router-dom";
import styles from './Criteria.module.css';
import useCriteria from "../../hooks/useCriteria";

import matchings from '../../assets/images/mymatchings.png';
import myareas from '../../assets/images/myareas.png';
import criteriaimg from '../../assets/images/criteriaVisit.png';
import match from '../../assets/images/match.png';
import chats from '../../assets/images/chats.png';
import notifications from '../../assets/images/notifications.png';
import profile from '../../assets/images/profile.png';
import menu from '../../assets/images/menu.png';

function Criteria() {
    const { criteria, handleChange, setMinMaxToZero, isSizeChecked, setIsSizeChecked,
        isEnergyChecked, setIsEnergyChecked, isIncomeChecked, setIsIncomeChecked
    } = useCriteria();
    return (
        <div className={styles.container}>
            <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <Link to='/matchings'><img src={matchings} /></Link>
                <Link to='/my_areas'><img src={myareas} /></Link>
                <Link to='/criteria'><img src={criteriaimg} /></Link>
                <Link to='/match'><img src={match} /></Link>
                <Link to='/my_chats'><img src={chats} /></Link>
                <Link to='/notifications'><img src={notifications} /></Link>
                <Link to='/profile'><img src={profile} /></Link>
            </div>

            <div className={styles.criterias}>
                <p className={styles.titlee}>Βάλε από ένα εύρος τιμών για το τι θέλεις</p><br /><br />
                <form >
                    <div className={styles.criteria}>
                        <label htmlFor="size">Έκταση(km<sup>2</sup>):<br /></label>
                        <input
                            type="number"
                            name="minsize"
                            disabled={isSizeChecked}
                            value={criteria.minsize}
                            onChange={handleChange}
                            id="size" max={criteria.maxsize - 1} min="0"
                        />
                        <input
                            type="number"
                            name="maxsize"
                            disabled={isSizeChecked}
                            value={criteria.maxsize}
                            onChange={handleChange}
                            max="3000" min={criteria.minsize + 1}
                        /><br />
                        <label htmlFor="chsize">Δεν θέλω</label> <input type="checkbox" checked={isSizeChecked} onChange={setMinMaxToZero} name="chsize" id="chsize" />
                    </div>

                    <div className={styles.criteria}>
                        <label htmlFor="energy">Ποσότητα PV ενέργειας(kwh):<br /></label>
                        <input
                            type="number"
                            name="minenergy"
                            disabled={isEnergyChecked}
                            value={criteria.minenergy}
                            onChange={handleChange}
                            id="energy" max={criteria.maxenergy - 1} min="0"
                        />
                        <input
                            type="number"
                            name="maxenergy"
                            disabled={isEnergyChecked}
                            value={criteria.maxenergy}
                            onChange={handleChange}
                            min={criteria.minenergy + 1}
                        /><br />
                        <label htmlFor="chenergy">Δεν θέλω</label> <input type="checkbox" checked={isEnergyChecked} onChange={setMinMaxToZero} name="chenergy" id="chenergy" />
                    </div>

                    <div className={styles.criteria}>
                        <label htmlFor="income">Ποσοστό εσόδων:<br /></label>
                        <input
                            type="number"
                            name="minincome"
                            disabled={isIncomeChecked}
                            value={criteria.minincome}
                            onChange={handleChange}
                            id="income" max={criteria.maxincome - 1} min="0"
                        />
                        <input
                            type="number"
                            name="maxincome"
                            disabled={isIncomeChecked}
                            value={criteria.maxincome}
                            onChange={handleChange}
                            min={criteria.minincome + 1} max="100"
                        /><br />
                        <label htmlFor="chincome">Δεν θέλω</label> <input type="checkbox" checked={isIncomeChecked} onChange={setMinMaxToZero} name="chincome" id="chincome" />
                    </div>

                    {/* Τι προσφέρω:<br />
                    <div className={styles.offer}>
                        <input type="radio" name="give" id="money" /><label htmlFor="money">Χρήματα</label>
                        <input type="radio" name="give" id="area" /><label htmlFor="area">Έκταση</label>
                        <input type="radio" name="give" id="other" /><label htmlFor="other">Άλλο</label>
                    </div> */}

                    {/* <input type="radio" value="Εκταση" name="give" /><br />
                    <input type="radio" value="Αλλο" name="give" /><br /> */}

                    {/* Ποσοστό ηλίου:<br /><input type="number" value="0" id="sun1" min="0" /> <input type="number" value="100" id="sun2" max="100" /><br />
                    Δεν θέλω <input type="checkbox" id="chsun" /><br /><br />

                    Ποσοστό που θα έχεις:<br /><input type="number" value="0" id="per1" min="0" /> &nbsp;&nbsp;&nbsp; <input type="number" value="100" id="per2" max="100" /><br />
                    Δεν θέλω <input type="checkbox" id="chper" /><br /><br />

                    <div id="msg"> </div><br /> */}
                    <input type="submit" value="Αποθήκευση αλλαγών" />
                </form>
            </div>
        </div>
    )
}

export default Criteria;
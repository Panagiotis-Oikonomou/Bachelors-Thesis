import { Link } from "react-router-dom";
import styles from './Criteria.module.css';
import useCriteria from "../../hooks/useCriteria";
import { Up } from "../../components/up/Up";

function Criteria() {
    const { criteria, formError, handleChange, setMinMaxToZero, isSizeChecked, setIsSizeChecked,
        isEnergyChecked, setIsEnergyChecked, isIncomeChecked, setIsIncomeChecked,
        isAreaChecked, isMoneyChecked, isPapersChecked, isOtherChecked, areas,
        havingArea, formSuccess, checkboxOptions, handleSubmit, selectedArea
    } = useCriteria();

    return (
        <div className={styles.container}>
            <Up></Up>

            <div className={styles.criterias}>
                <p className={styles.titlee}>Βάλε από ένα εύρος τιμών για το τι θέλεις</p><br /><br />
                <form onSubmit={handleSubmit}>
                    <div className={styles.criteria}>
                        <label htmlFor="size">Έκταση(km<sup>2</sup>):<br /></label>
                        <input
                            type="number"
                            name="size"
                            disabled={isSizeChecked}
                            required={!isSizeChecked}
                            value={criteria.size}
                            onChange={handleChange}
                            id="size" step="0.1" min="0"
                        /><br/>
                        <label htmlFor="chsize">Δεν θέλω</label> <input type="checkbox" checked={isSizeChecked} disabled={isAreaChecked} onChange={setMinMaxToZero} name="chsize" id="chsize" />
                    </div>

                    <div className={styles.criteria}>
                        <label htmlFor="energy">Ποσότητα PV ενέργειας(kwh):<br /></label>
                        <input
                            type="number"
                            name="energy"
                            disabled={isEnergyChecked}
                            required={!isEnergyChecked}
                            value={criteria.energy}
                            onChange={handleChange}
                            id="energy" step="0.1"
                            // max={Number(criteria.maxenergy) - 1} 
                            min="0"
                        /><br/>
                        <label htmlFor="chenergy">Δεν θέλω</label> <input type="checkbox" checked={isEnergyChecked} disabled={isAreaChecked} onChange={setMinMaxToZero} name="chenergy" id="chenergy" />
                    </div>

                    <div className={styles.criteria}>
                        <label htmlFor="income">Ποσοστό εσόδων:<br /></label>
                        <input
                            type="number"
                            name="income"
                            disabled={isIncomeChecked}
                            required={!isIncomeChecked}
                            value={criteria.income}
                            onChange={handleChange}
                            id="income" step="0.1"
                            max="100" min="0"
                        /><br/>
                        <label htmlFor="chincome">Δεν θέλω</label>
                        <input type="checkbox" checked={isIncomeChecked} onChange={setMinMaxToZero} name="chincome" id="chincome" />
                    </div>

                    <div className={styles.criteria}>Τι προσφέρω:<br />
                        <div className={styles.checkboxButtons}>
                            <label className={styles.checkboxLabel} htmlFor="moneyM">
                                <input type="checkbox" name="moneyM" id="moneyM" checked={isMoneyChecked} onChange={checkboxOptions} />Χρήματα
                                <input type="number" name="money" value={criteria.money} min="1" required disabled={!isMoneyChecked} onChange={handleChange} />
                            </label>

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

                            <label className={styles.checkboxLabel} htmlFor="papers">
                                <input type="checkbox" name="papers" id="papers" checked={isPapersChecked} onChange={checkboxOptions} />Διαδικαστικά</label>

                            <label className={styles.checkboxLabel} htmlFor="other">
                                <input type="checkbox" name="other" id="other" checked={isOtherChecked} onChange={checkboxOptions} />Άλλο</label>
                        </div>
                    </div>

                    <div className={styles.msg}>{formError}</div>
                    <div className={styles.success}>{formSuccess}</div>
                    <input type="submit" value="Αποθήκευση αλλαγών" />
                </form>
            </div>
        </div>
    )
}

export default Criteria;
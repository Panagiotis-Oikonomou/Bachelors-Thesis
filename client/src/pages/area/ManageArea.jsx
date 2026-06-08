import { lazy, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styles from './ManageArea.module.css';
import { Up } from '../../components/up/Up';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

function ManageArea() {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const { id } = useParams();

    const [areaData, setAreaData] = useState({
        name: "",
        size: "",
        paneltype: "",
        lat: "",
        lng: "",
        ac: ""
    });

    useEffect(() => {
        if (!id) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const res = await axiosPrivate.get(`/areas/${id}`);

                if (res.data) setAreaData(res.data);

                else navigate('/my_areas');
            }
            catch (err) {
                if (err.response?.status === 404) {
                    console.log(err.response.data.message);
                    navigate('/my_areas');
                    return;
                }
                console.log(err);
            }
        }

        fetchData();

    }, [id]);

    return (
        <div className={styles.container}>
            <Up></Up>

            <div className={styles.addArea}>
                <form>
                    <div className={styles.data}>
                    <label htmlFor="areaname">Όνομα περιοχής:</label><br />
                    <input
                        type="text"
                        id="areaname"
                        value={areaData.name}
                        readOnly
                    />
                    <div id="error_msg1"></div>
                    </div>

                    <div className={styles.data}>
                    <label htmlFor="size">Έκταση περιοχής (σε km<sup>2</sup>):</label><br />
                    <input
                        type="number"
                        id="size"
                        value={areaData.size}
                        readOnly
                    />
                    <div id="error_msg2"></div>
                    </div>
                   

                    <div className={styles.data}>
                        Είδος ηλιακού πάνελ:<br />
                        <div className={styles.radioButtonss}>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio" name="panelType"
                                    checked={areaData.paneltype === 'vertical'}
                                    readOnly
                                    // onChange={handleChange} value="vertical" required
                                />Vertical Axis
                            </label>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio" name="panelType"
                                    checked={areaData.paneltype === 'inclined'}
                                    readOnly
                                    // onChange={handleChange} value="inclined" required
                                />Inclined Axis
                            </label>
                            <label className={styles.radioLabel}>
                                <input
                                    type="radio" name="panelType"
                                    checked={areaData.paneltype === 'two'}
                                    readOnly
                                    // onChange={handleChange} value="two" required
                                />Two Axis
                            </label>
                        </div>
                    </div>

                    <div className={styles.data}>
                        <label htmlFor="coordinates">Coordinates(lat, lng):</label><br />
                        <input
                            type="text"
                            id="coordinates"
                            value={`${Number(areaData.lat).toFixed(4)}, ${Number(areaData.lng).toFixed(4)}`}
                            readOnly
                        />
                    </div>

                    <div className={styles.data}>
                        <label htmlFor="ac">Ετήσια παραγωγή PV ενέργειας(kWh):</label><br />
                        <input type="text"
                            id="ac"
                            value={areaData.ac}
                            readOnly
                            required
                        />
                    </div>

                    <input type="submit" value="Αποθήκευση αλλαγών" />
                </form>
            </div>
        </div>
    )
}

export default ManageArea;
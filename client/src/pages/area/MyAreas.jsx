import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from './MyAreas.module.css'
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Up } from "../../components/up/Up";
import Swal from "sweetalert2";

import plus from '../../assets/images/plus.png';

function MyAreas() {
    const axiosPrivate = useAxiosPrivate();
    const [search, setSearch] = useState('');
    const [areas, setAreas] = useState([]);
    const [filteredAreas, setFilteredAreas] = useState([]);

    useEffect(() => {
        const getAreas = async () => {
            try {
                const res = await axiosPrivate.get('/areas');
                if (res.data) {
                    setFilteredAreas(res.data);
                    setAreas(res.data);
                }
            }
            catch (err) {
                console.log(err);
            }
        }

        getAreas();
    }, []);

    async function deleteArea(id) {
        const result = await Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        });

        if (!result.isConfirmed) return;

        try {
            await axiosPrivate.delete(`/areas/${id}`);
            setAreas(prev => prev.filter(a => a.areaid !== id));
            setFilteredAreas(prev => prev.filter(a => a.areaid !== id));
        }
        catch (err) {
            Swal.fire("Error", "Something went wrong", "error");
        }
    }

    function searchArea(value) {
        setSearch(value);

        if (value == "") setFilteredAreas(areas);

        else setFilteredAreas(areas.filter(a => a.name.toLowerCase().includes(value.toLowerCase())));
    }

    return (
        <div className={styles.container}>
            <Up></Up>

            <div className={styles.searchBar}>
                <form>
                    <input
                        type="search"
                        placeholder="Search area"
                        value={search}
                        onChange={(e) => searchArea(e.target.value)}
                    />
                </form>
            </div>

            <div className={styles.areas}>
                <p>Δημιουργία νέας έκτασης <Link to='/add_area'><img src={plus} className={styles.plus} /></Link></p>

                {filteredAreas.map((id) => (
                    <div className={styles.area} key={id.areaid}>
                        <Link to={`/manage_area/${id.areaid}`} className={styles.alink}>
                            <div className={styles.areaData}>
                                Όνομα περιοχής: {id.name}<br />

                                Έκταση περιοχής: {id.size}<br />

                                Γεωγραφικό πλάτος: {id.lat}<br />

                                Γεωγραφικό μήκος: {id.lng}<br />

                                Ηλεκτρική ενέργεια: {id.ac}<br />
                            </div>
                        </Link>
                        <button className={styles.delete} onClick={() => deleteArea(id.areaid)}>Διαγραφή</button>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default MyAreas;
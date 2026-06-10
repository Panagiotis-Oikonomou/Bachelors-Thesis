import { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";
import styles from './MyAreas.module.css'
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Swal from "sweetalert2";

import matchings from '../../assets/images/mymatchings.png';
import myareas from '../../assets/images/myareasVisit.png';
import criteria from '../../assets/images/criteria.png';
import match from '../../assets/images/match.png';
import chats from '../../assets/images/chats.png';
import notifications from '../../assets/images/notifications.png';
import profile from '../../assets/images/profile.png';
import menu from '../../assets/images/menu.png';
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
            text: "You won't be able to revert this!",
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
            <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <Link to='/matchings'><img src={matchings} /></Link>
                <Link to='/my_areas'><img src={myareas} /></Link>
                <Link to='/criteria'><img src={criteria} /></Link>
                <Link to='/match'><img src={match} /></Link>
                <Link to='/my_chats'><img src={chats} /></Link>
                <Link to='/notifications'><img src={notifications} /></Link>
                <Link to='/profile'><img src={profile} /></Link>
            </div>

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

                {filteredAreas.map((id) => {
                    return <div className={styles.area} key={id.areaid}>
                        <Link to={`/manage_area/${id.areaid}`} className={styles.alink}>
                            <div className={styles.areaData}>
                                Όνομα περιοχής: {id.name}<br />

                                Έκταση περιοχής: {id.size}<br />

                                Τύπος πάνελ: {id.paneltype}<br />

                                Γεωγραφικό πλάτος: {id.lat}<br />

                                Γεωγραφικό μήκος: {id.lng}<br />

                                Ηλεκτρική ενέργεια: {id.ac}<br />
                            </div>
                        </Link>
                        <button className={styles.delete} onClick={() => deleteArea(id.areaid)}>Διαγραφή</button>
                    </div>
                })}


            </div>
        </div>
    )
}
export default MyAreas;
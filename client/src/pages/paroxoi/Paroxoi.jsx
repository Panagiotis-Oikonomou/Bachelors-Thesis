import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from './Paroxoi.module.css';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useGetProvider from "../../hooks/useGetProviders";

import paroxoi from '../../assets/images/paroxoiVisit.png';
import users from '../../assets/images/users.png';
import notifications from '../../assets/images/notifications.png';
import profile from '../../assets/images/profile.png';
import menu from '../../assets/images/menu.png';
import plus from '../../assets/images/plus.png';


function Paroxoi() {
    const axiosPrivate = useAxiosPrivate();
    const getproviders = useGetProvider();
    const [search, setSearch] = useState('');
    const [filteredProviders, setFilteredProviders] = useState([]);

    useEffect(() => {
        setFilteredProviders(getproviders);
    }, [getproviders]);

    async function deleteProvider(providerid) {
        try {
            await axiosPrivate.delete(`/admins/providers/${providerid}`);
            setFilteredProviders(prev => prev.filter(p => p.providerid !== providerid));
        }
        catch (err) {
            console.log(err);
        }
    }

    function searchProvider(value) {
        setSearch(value);

        if (value === "") setFilteredProviders(getproviders);

        else setFilteredProviders(getproviders.filter(u => u.providername.toLowerCase().includes(value.toLowerCase())));
    }


    return (
        <div className={styles.container}>
            <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <Link to='/paroxoi'><img src={paroxoi} /></Link>
                <Link to='/users'><img src={users} /></Link>
                <Link to='/notifications/admin'><img src={notifications} /></Link>
                <Link to='/profile/admin'><img src={profile} /></Link>
            </div>

            <div className={styles.searchBar}>
                <form>
                    <input
                        type="search"
                        placeholder="Search provider"
                        value={search}
                        onChange={(e) => searchProvider(e.target.value)}
                    />
                </form>
            </div>

            <div className={styles.main}>
                <p>Προσθήκη νέου Πάροχου Ενέργειας <Link to='/add_paroxo'><img src={plus} className={styles.plus} /></Link></p>


                {filteredProviders.map((item) => {
                    return <div className={styles.area} key={item.providerid}>
                        {/* <Link to='/manage_paroxo' className={styles.alink}> */}
                        <div className={styles.paroxos}>
                            Όνομα Πάροχου Ενέργειας:<br />
                            {item.providername}
                        </div>
                        {/* </Link> */}
                        <button className={styles.delete} onClick={() => deleteProvider(item.providerid)}>Διαγραδή παρόχου</button>
                    </div>
                })}
            </div>
        </div>
    )
}

export default Paroxoi;
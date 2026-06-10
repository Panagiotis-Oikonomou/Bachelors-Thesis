import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from './Providers.module.css';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useGetProvider from "../../hooks/useGetProviders";
import axios from "../../api/axios";
import Swal from "sweetalert2";

import paroxoi from '../../assets/images/paroxoiVisit.png';
import users from '../../assets/images/users.png';
import notifications from '../../assets/images/notifications.png';
import profile from '../../assets/images/profile.png';
import menu from '../../assets/images/menu.png';
import plus from '../../assets/images/plus.png';


function Providers() {
    const axiosPrivate = useAxiosPrivate();
    const getproviders = useGetProvider();
    const [search, setSearch] = useState('');
    const [filteredProviders, setFilteredProviders] = useState([]);
    const [provider, setProvider] = useState('');
    const [providerError, setProviderError] = useState('');

    useEffect(() => {
        setFilteredProviders(getproviders);
    }, [getproviders]);

    async function deleteProvider(providerid) {
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
            await axiosPrivate.delete(`/admins/providers/${providerid}`);
            setFilteredProviders(prev => prev.filter(p => p.providerid !== providerid));
        }
        catch (err) {
            Swal.fire("Error", "Something went wrong", "error");
        }
    }

    function searchProvider(value) {
        setSearch(value);

        if (value === "") setFilteredProviders(getproviders);

        else setFilteredProviders(getproviders.filter(u => u.providername.toLowerCase().includes(value.toLowerCase())));
    }

    async function checkName(value) {
        setProvider(value);
        const providername = value.trim();
        const len = providername.length;
        if (providername === "") {
            setProviderError('');
            return;
        }

        if (providername.length < 2) return;

        try {
            const res = await axiosPrivate.get(`/validate/provider_name/${encodeURIComponent(providername)}`);
            if (res.data.exists) setProviderError('Υπάρχει ήδη αυτός ο πάροχος');

            else setProviderError('');
        }
        catch (err) {
            console.log(err);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (provider.length === 0) return;

        if (providerError.trim() === "") {
            try {
                await axiosPrivate.post('/admins/providers', { providername: provider });
                setProvider('');
                try {
                    const res = await axios.get('/providers');
                    setFilteredProviders(res.data);
                } catch (err) {
                    console.error("Error fetching providers:", err);
                }
            }
            catch (err) {
                console.log(err);
            }
        }
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
                <div className={styles.paroxos}>
                    <p>Προσθήκη νέου Πάροχου Ενέργειας:
                        {/* <Link to='/add_paroxo'><img src={plus} className={styles.plus} /></Link> */}
                    </p>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="providername">Όνομα παρόχου</label>
                        <input
                            type="text"
                            id="providername"
                            name="providername"
                            value={provider}
                            autoComplete="off"
                            autoFocus="on"
                            onChange={(e) => checkName(e.target.value)}
                        />
                        <p className={styles.errorMsg}>{providerError}</p>
                        <input type="submit" value="Πρόσθεσε" />
                    </form>
                </div>



                {filteredProviders.map((item) => {
                    return <div className={styles.area} key={item.providerid}>
                        <div className={styles.paroxos}>
                            Όνομα Πάροχου Ενέργειας:<br />
                            {item.providername}
                        </div>
                        <button className={styles.delete} onClick={() => deleteProvider(item.providerid)}>Διαγραδή παρόχου</button>
                    </div>
                })}
            </div>
        </div>
    )
}

export default Providers;
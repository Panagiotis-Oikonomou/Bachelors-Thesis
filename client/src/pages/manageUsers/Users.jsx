import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";
import styles from './Users.module.css';

import paroxoi from '../../assets/images/paroxoi.png';
import userss from '../../assets/images/usersVisit.png';
import notifications from '../../assets/images/notifications.png';
import profile from '../../assets/images/profile.png';
import menu from '../../assets/images/menu.png';


function Users() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const getUsers = async () => {
            try {
                const res = await axiosPrivate.get('/admins/users');
                if (res.data) setUsers(res.data);
            }
            catch (error) {
                console.log(error);
            }
        }
        getUsers();
    }, []);

    async function deleteUser(userid) {
        try {
            await axiosPrivate.delete(`/admins/users/${userid}`);
            setUsers(prev => prev.filter(u => u.userid !== userid));
        }
        catch (err) {
            console.log(err);
        }
    }

    return (
        <div className={styles.container}>
            <img src={menu} className={styles.menu} />
            <div className={styles.up}>
                <Link to='/paroxoi'><img src={paroxoi} /></Link>
                <Link to='/users'><img src={userss} /></Link>
                <Link to='/notifications/admin'><img src={notifications} /></Link>
                <Link to='/profile/admin'><img src={profile} /></Link>
            </div>
            <div className={styles.searchBar}>
                <form >
                    <input
                        type="search"
                        placeholder="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {/* <button>Go</button> */}
                </form>
            </div>

            <div className={styles.main}>
                <div className={styles.users}>
                    <table>
                        <thead>
                            <tr>
                                <th> Όνομα </th>
                                <th> Επώνυμο </th>
                                <th> Α.Π.Ρ </th>
                                <th> Πάροχος </th>
                                <th> Email </th>
                                <th> Username </th>
                                <th> Διαγραφή </th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((item) => {
                                return <tr key={item.userid}>
                                    <td> {item.fname} </td>
                                    <td> {item.lname} </td>
                                    <td> {item.clock} </td>
                                    <td> {item.provider} </td>
                                    <td> {item.email} </td>
                                    <td> {item.username} </td>
                                    <td> <button onClick={() => deleteUser(item.userid)}>Διαγραφή</button> </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Users;
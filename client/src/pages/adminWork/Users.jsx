import { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Link } from "react-router-dom";
import styles from './Users.module.css';
import Swal from "sweetalert2";
import { UpAdmin } from "../../components/up/UpAdmin";

function Users() {
    const [users, setUsers] = useState([]);
    const [usersToDelete, setUsersToDelete] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [search, setSearch] = useState('');
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const getUsers = async () => {
            try {
                const res = await axiosPrivate.get('/admins/users');
                if (res.data) {
                    setUsers(res.data);
                    setFilteredUsers(res.data);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
        getUsers();
    }, []);

    function addUserToDelete(userid, checked) {
        if (checked) setUsersToDelete(prev => [...prev, userid]);

        else setUsersToDelete(prev => prev.filter(id => id != userid));
    }

    async function deleteMultiple() {
        const result = await Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete them!"
        });

        if (!result.isConfirmed) return;

        try {
            await axiosPrivate.delete("/admins/users", { data: { users: usersToDelete }});
            setUsers(prev => prev.filter(u => !usersToDelete.includes(u.userid)));
            setFilteredUsers(prev => prev.filter(u => !usersToDelete.includes(u.userid)));
            setUsersToDelete([])
            Swal.fire("Deleted!", "Users have been deleted.", "success");
        }
        catch (err) {
            // Swal.fire("Error", "Something went wrong", "error");
            Swal.fire("Error", `${err}`, "error");
        }
    }

    async function deleteUser(userid) {
        const result = await Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete him!"
        });

        if (!result.isConfirmed) return;

        try {
            await axiosPrivate.delete(`/admins/user/${userid}`);
            setUsers(prev => prev.filter(u => u.userid !== userid));
            setFilteredUsers(prev => prev.filter(u => u.userid !== userid));
            setUsersToDelete(prev => prev.filter(id => id !== userid))
        }
        catch (err) {
            Swal.fire("Error", "Something went wrong", "error");
        }
    }

    function searchUser(value) {
        setSearch(value);

        if (value === "") setFilteredUsers(users);

        else setFilteredUsers(users.filter(u => u.username.toLowerCase().includes(value.toLowerCase())));
    }

    return (
        <div className={styles.container}>
            <UpAdmin />

            <div className={styles.searchBar}>
                <form >
                    <input
                        type="search"
                        placeholder="Search user"
                        value={search}
                        onChange={e => searchUser(e.target.value)}
                    />
                </form>
            </div>

            <div className={styles.main}>
                {usersToDelete.length > 0 && (<span className={styles.multDelete}><button onClick={deleteMultiple}>Delete</button></span>)}
                <div className={styles.users}>
                    <table>
                        <thead>
                            <tr>
                                <th> Διαγραφή </th>
                                <th> Multiple </th>
                                <th> Username </th>
                                <th> Όνομα </th>
                                <th> Επώνυμο </th>
                                <th> Α.Π.Ρ </th>
                                <th> Πάροχος </th>
                                <th> Email </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredUsers.map((item) => {
                                return <tr key={item.userid}>
                                    <td> <button onClick={() => deleteUser(item.userid)}>Διαγραφή</button> </td>
                                    <td> <input type="checkbox" name={item.username} value={item.userid} onChange={(e) => addUserToDelete(item.userid, e.target.checked)} /> </td>
                                    <td> {item.username} </td>
                                    <td> {item.fname} </td>
                                    <td> {item.lname} </td>
                                    <td> {item.clock} </td>
                                    <td> {item.provider} </td>
                                    <td> {item.email} </td>
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
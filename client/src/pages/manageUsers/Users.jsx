import React, { useState } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import styles from './Users.module.css';

import paroxoi from '../../assets/images/paroxoi.png';
import users from '../../assets/images/usersVisit.png';
import notifications from '../../assets/images/notifications.png';
import profile from '../../assets/images/profile.png';
import menu from '../../assets/images/menu.png';


function Users(){
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
                <input type="search" placeholder="search"/>
                <button>Go</button>
            </div>

            <form className={styles.main}>
                <div className={styles.users}>
                    <tbody>
                        <tr>
                            <th> Όνομα </th>
                            <th> Επώνυμο </th>
                            <th> Α.Π.Ρ </th>
                            <th> Email </th>
                            <th> Username </th>
                            <th> Διαγραφή </th>
                        </tr>

                        <tr>
                            <td> wewew </td>
                            <td> Givrows </td>
                            <td> Givrows </td>
                            <td> Givrows </td>
                            <td> Givrows </td>
                            <td> <input type="checkbox"/> </td>
                        </tr>

                        
                    </tbody> 
                    {/* <input type="submit" class="delete" value="Διαγραφή"> */}
                </div>
                <input type="submit" className={styles.delete} value="Διαγραφή"/>
            </form>
           
        </div>
    )
}

export default Users;
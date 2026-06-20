import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from './Matchings.module.css';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import matchings from '../../assets/images/mymatchingsVisit.png';
import myareas from '../../assets/images/myareas.png';
import criteria from '../../assets/images/criteria.png';
import match from '../../assets/images/match.png';
import chats from '../../assets/images/chats.png';
import notifications from '../../assets/images/notifications.png';
import profile from '../../assets/images/profile.png';
import menu from '../../assets/images/menu.png';
import check from '../../assets/images/CheckmarkNew.png'

function Matchings() {
    const axiosPrivate = useAxiosPrivate();
    const [myMatchings, setMyMatchings] = useState([]);
    const grouped = myMatchings.reduce((acc, item) => {
        if (!acc[item.groupid]) acc[item.groupid] = [];

        acc[item.groupid].push(item);
        return acc;
    }, {});

    useEffect(() => {
        const getMatchings = async () => {
            try {
                const res = await axiosPrivate.get('/matchings');
                if (res.data) setMyMatchings(res.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        getMatchings();
    }, []);

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

            <div className={styles.matchings}>
                {Object.entries(grouped).map(([groupId, members]) => (
                    <div className={styles.match} key={groupId}>
                        <div className={styles.check} >
                            {members.filter(m => Number(m.agrees) === 1).length} / {members.length}
                        </div>
                        
                        {members.map(member => (
                            <div className={styles.nameCheck} key={member.rowid}>
                                {member.username}

                                {Number(member.agrees) === 1 && (<img src={check} className={styles.v}/>)}&nbsp;&nbsp;&nbsp;&nbsp;
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Matchings;
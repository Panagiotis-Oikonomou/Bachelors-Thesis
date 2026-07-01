import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from './Matchings.module.css';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Up } from "../../components/up/Up";

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
            <Up></Up>

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
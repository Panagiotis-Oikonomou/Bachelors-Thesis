import React, { useState } from "react";
import axios from 'axios';
import { Link} from "react-router-dom";
// import styles from './Notifications.module.css';


function Index() {
    return (
        <div>
            <Link to='/login'>Login</Link><br></br>
            <Link to='/register'>Register</Link>
        </div>
    )
}

export default Index;
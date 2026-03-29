import axios from "axios";
import debounce from "lodash/debounce";

export const checkClock = (setErrors) => debounce((clock) => {
    axios.get(`http://localhost:5000/check_clock/${clock}`)
        .then((res) => {
            if (res.data.exists) setErrors(prev => ({ ...prev, clock: "Υπάρχει ήδη αυτό το ρολόϊ." }));
        })
        .catch((err) => console.log(err));
}, 500);

export const checkUsername = (setErrors) => debounce((username) => {
    axios.get(`http://localhost:5000/check_username/${username}`)
        .then((res) => {
            if (res.data.exists) setErrors(prev => ({ ...prev, username: "Υπάρχει χρήστης με αυτό το username." }));
        })
        .catch((err) => console.log(err.message));
}, 500);

export const checkEmail = (setErrors) => debounce((email) => {
    axios.get(`http://localhost:5000/check_email/${email}`)
        .then((res) => {
            if (res.data.exists) setErrors(prev => ({ ...prev, email: "Υπάρχει ήδη αυτό το email." }));
        })
        .catch((err) => console.log(err));
}, 500);
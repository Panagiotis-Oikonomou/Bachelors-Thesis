import axios from "axios";
import debounce from "lodash/debounce";

export const checkEmail = (userId, setErrors) => debounce((email) => {
        axios.get("http://localhost:5000/check_email_profile/", {
            params: { id: userId, email: email }
        })
            .then((res) => {
                if (res.data.exists) {
                    setErrors(prev => ({ ...prev, email: "Υπάρχει ήδη αυτό το email." }));
                }
            })
            .catch((err) => console.log(err));
    }, 500);

export const checkClock = (userId, setErrors) => debounce((clock) => {
        axios.get("http://localhost:5000/check_clock_profile/", {
            params: { id: userId, clock: clock }
        })
            .then((res) => {
                if (res.data.exists) {
                    setErrors(prev => ({ ...prev, clock: "Υπάρχει ήδη αυτό το ρολόϊ." }));
                }
            })
            .catch((err) => console.log(err));
    }, 500);
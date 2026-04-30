// import axios from "axios";
import debounce from "lodash/debounce";
import api from "./axiosInstance";

export const checkClock = (setErrors) => debounce((clock) => {
    api.get(`/validate/clock?clock=${clock}`)
        .then((res) => {
            if (res.data.exists) setErrors(prev => ({ ...prev, clock: "Υπάρχει ήδη αυτό το ρολόϊ." }));
        })
        .catch((err) => console.log(err));
}, 500);

export const checkUsername = (setErrors) => debounce((username) => {
    api.get(`/validate/username?username=${username}`)
        .then((res) => {
            if (res.data.exists) setErrors(prev => ({ ...prev, username: "Υπάρχει χρήστης με αυτό το username." }));
        })
        .catch((err) => console.log(err.message));
}, 500);

export const checkEmail = (setErrors) => debounce((email) => {
    api.get(`/validate/email?email=${email}`)
        .then((res) => {
            if (res.data.exists) setErrors(prev => ({ ...prev, email: "Υπάρχει ήδη αυτό το email." }));
        })
        .catch((err) => console.log(err));
}, 500);
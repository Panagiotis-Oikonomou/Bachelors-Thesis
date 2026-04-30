import debounce from "lodash/debounce";
import api from "./axiosInstance";

export const checkEmail = (setErrors) => debounce((email) => {
    // api.get("/validate/email_profile/", { params: { id: userId, email: email } })
    api.get(`/validate/email_profile?email=${email}`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem("accessToken")
        }
    })
        .then((res) => {
            if (res.data.exists) {
                setErrors(prev => ({ ...prev, email: "Υπάρχει ήδη αυτό το email." }));
            }
        })
        .catch((err) => console.log(err));
}, 500);

export const checkClock = (setErrors) => debounce((clock) => {
    api.get(`/validate/clock_profile?clock=${clock}`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem("accessToken")
        }
    })
        .then((res) => {
            if (res.data.exists) {
                setErrors(prev => ({ ...prev, clock: "Υπάρχει ήδη αυτό το ρολόϊ." }));
            }
        })
        .catch((err) => console.log(err));
}, 500);

export const checkUsername = (setErrors) => debounce((usr) => {
    api.get(`/validate/username_profile?username=${usr}`, {
        headers:{
            Authorization: 'Bearer ' + localStorage.getItem("accessToken")
        }
    })
        .then((res) => {
            if (res.data.exists) {
                setErrors(prev => ({ ...prev, username: "Υπάρχει ήδη αυτό το username." }));
            }
        })
        .catch((err) => console.log(err));
}, 500);
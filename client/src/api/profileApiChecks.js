import debounce from "lodash/debounce";

export const checkEmail = (axiosPrivate, setErrors) => debounce((email) => {
    axiosPrivate.get(`/validate/email_profile?email=${email}`)
        .then((res) => {
            if (res.data.exists) {
                setErrors(prev => ({ ...prev, email: "Υπάρχει ήδη αυτό το email." }));
            }
        })
        .catch((err) => console.log(err));
}, 500);

export const checkClock = (axiosPrivate, setErrors) => debounce((clock) => {
    axiosPrivate.get(`/validate/clock_profile?clock=${clock}`)
        .then((res) => {
            if (res.data.exists) {
                setErrors(prev => ({ ...prev, clock: "Υπάρχει ήδη αυτό το ρολόϊ." }));
            }
        })
        .catch((err) => console.log(err));
}, 500);

export const checkUsername = (axiosPrivate, setErrors) => debounce((usr) => {
    axiosPrivate.get(`/validate/username_profile?username=${usr}`)
        .then((res) => {
            if (res.data.exists) {
                setErrors(prev => ({ ...prev, username: "Υπάρχει ήδη αυτό το username." }));
            }
        })
        .catch((err) => console.log(err));
}, 500);

export const checkEmailAdmin = (axiosPrivate, setErrors) => debounce((email) => {
    axiosPrivate.get(`/validate/email_profile_admin?email=${email}`)
        .then((res) => {
            if (res.data.exists) {
                setErrors(prev => ({ ...prev, email: "Υπάρχει ήδη αυτό το email." }));
            }
        })
        .catch((err) => console.log(err));
}, 500);

export const checkUsernameAdmin = (axiosPrivate, setErrors) => debounce((usr) => {
    axiosPrivate.get(`/validate/username_profile_admin?username=${usr}`)
        .then((res) => {
            if (res.data.exists) {
                setErrors(prev => ({ ...prev, username: "Υπάρχει ήδη αυτό το username." }));
            }
        })
        .catch((err) => console.log(err));
}, 500);
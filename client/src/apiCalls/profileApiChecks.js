import axios from "axios";
import debounce from "lodash/debounce";

export const checkEmail = (userId, setErrors) => debounce((email) => {
        axios.get("http://localhost:5000/check_email_profile/", {
            params: { id: 10, email: email }
        })
            .then((res) => {
                if (res.data.exists) {
                    setErrors(prev => ({ ...prev, email: "Υπάρχει ήδη αυτό το email." }));
                }
            })
            .catch((err) => console.log(err));
    }, 500);
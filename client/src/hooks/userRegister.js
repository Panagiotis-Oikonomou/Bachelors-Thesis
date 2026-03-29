import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import { checkEmail as checkEmailApi, checkClock as checkClockApi, checkUsername as checkUsernameApi} from "../apiCalls/registerApiChecks.js";

export default function userRegister(userId) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        clock: '',
        provider: '',
        email: '',
        username: '',
        password: ''
    });
    const [conPass, setConPass] = useState({ cpsw: "" });
    const [errors, setErrors] = useState({
        fname: "",
        lname: "",
        clock: "",
        username: "",
        email: "",
        password: "",
        pswmatch: ""
    });

    const [cpswError, setCpswError] = useState({ cpsw: "" });
    const [cpswMatch, setCpswMatch] = useState({ cpsw: "" });
    const [allError, setAllError] = useState({ all: "" });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);

    const checkClock = checkClockApi(setErrors);
    const checkUsername = checkUsernameApi(setErrors);
    const checkEmail = checkEmailApi(setErrors);

    const [providers, setProviders] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:5000/get_providers')
            .then((res) => { setProviders(res.data); })
            .catch((err) => { console.log(err); });
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;

        if (name === "cpsw") setConPass(prev => ({ ...prev, [name]: value }));

        else setFormData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    }

    function validateField(name, value) {
        let error = "";
        let cpswerror = "";
        let cpswmatch = "";
        let len = value.length;
        if (name === "fname") {
            let regex = /\d/;
            if (len === 0) error = "";

            else if (len < 4 || len > 15) error = "Το όνομά σας πρέπει να αποτελείται από 4 μέχρι 15 γράμματα";

            else if (value.includes(" ")) error = "Το όνομά σας δεν μπορεί να περιέχει κενά";

            else if (regex.test(value)) error = "Το όνομά σας δεν επιτρέπεται να περιέχει ψηφία";
        }

        if (name === "lname") {
            let regex = /\d/;
            if (len === 0) error = "";

            else if (len < 4 || len > 15) error = "Το επιθετό σας πρέπει να αποτελείται από 4 μεχρι 15 γράμματα";

            else if (value.includes(" ")) error = "Το επιθετό σας δεν μπορεί να περιέχει κενά";

            else if (regex.test(value)) error = "Το επιθετό σας δεν επιτρέπεται να περιέχει ψηφία";
        }

        if (name === "clock") {
            let regex = /^\d-\d{8}-\d{2}$/;
            if (len === 0) error = "";

            else if (regex.test(value)) error = "";

            else error = "Ο αριθμός πρέπει να είναι αυτής της μορφής χ-χχχχχχχχ-χχ";
            checkClock(value);
        }

        if (name === "username") {
            if (len === 0) error = "";

            else if (len < 5 || len > 10) error = "Το username σας πρέπει να αποτελείται από 5 μέχρι 10 γράμματα";

            else if (value.includes(" ")) error = "Το username σας δεν μπορεί να περιέχει κενά";

            checkUsername(value);
        }

        if (name === "email") {
            if (len === 0) error = "";
            checkEmail(value);
        }

        if (name === "password") {
            let confirm = conPass.cpsw;
            let cpswlen = confirm.length;
            let specialRegex = /[!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>\/?]/;
            if (value === confirm && len != 0) {
                cpswerror = "";
                cpswmatch = "Οι δύο κωδικοί ταιρίαζουν";
            }
            else if (value !== confirm && cpswlen === 0) {
                cpswerror = "";
                cpswmatch = "";
            }
            else if (value !== confirm && len !== 0) {
                cpswerror = "Οι δύο κωδικοί δεν ταιρίαζουν";
                cpswmatch = "";
            }

            if (len === 0) error = "";

            else if (len < 5 || len > 15) error = "Ο κωδικός σας πρέπει να αποτελείται απο 5 μέχρι 15 χαρακτήρες";

            else if (value.includes(" ")) error = "Ο κωδικός σας δεν μπορεί να περιέχει κενά";

            else if (!specialRegex.test(value)) error = "Ο κωδικός σας πρέπει να περιέχει τουλάχιστον έναν χαρακτήρα σύμβολο";

            else error = "";
        }

        if (name === "cpsw") {
            let password = formData.password;
            if (len === 0) {
                cpswerror = "";
                cpswmatch = "";
            }
            else if (value !== password) {
                cpswerror = "Οι δύο κωδικοί δεν ταιρίαζουν";
                cpswmatch = "";
            }
            else if (value === password) {
                cpswerror = "";
                cpswmatch = "Οι δύο κωδικοί ταιρίαζουν";
            }
        }

        if (name !== "provider") {
            setErrors(prev => ({ ...prev, [name]: error }));

            setCpswError(prev => ({ ...prev, cpsw: cpswerror }));

            setCpswMatch(prev => ({ ...prev, cpsw: cpswmatch }));
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        const hasErrors = Object.values(errors).some(err => err !== "");
        const hasCpswErrors = Object.values(cpswError).some(err => err !== "");

        // alert(hasErrors);
        // true if one of them is wrong
        // alert(hasCpswErrors);
        // false if its empty
        if (hasErrors || hasCpswErrors) {
            setAllError(prev => ({ ...prev, all: "Υπάρχουν λάθη στη φόρμα" }));
            return;
        }

        axios.post('http://localhost:5000/register', formData)
            .then((res) => {
                navigate('/match');
                // console.log(res);
                // console.log("Form submitted:", formData);
            })
            .catch((err) => console.log(err));
        navigate('/profile');
    }

    return{
        formData, conPass, errors, providers,
        cpswError, cpswMatch, allError,
        showConfPassword, showPassword,
        setShowConfPassword, setShowPassword,
        handleChange, handleSubmit
    };
}
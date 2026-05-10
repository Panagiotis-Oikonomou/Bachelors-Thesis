import { useState, useEffect } from "react";
import axios from "../api/axios.js";
import { useNavigate } from "react-router-dom";
import { checkEmail as checkEmailApi, checkClock as checkClockApi, checkUsername as checkUsernameApi} from "../api/registerApiChecks.js";
import userDataValidation from "../utils/userDataValidation.js";
import useGetProvider from "./useGetProviders.js";

export default function useRegister() {
    const navigate = useNavigate();
    const providers = useGetProvider();

    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        clock: '',
        provider: '',
        email: '',
        username: '',
        password: ''
    });
    const [conPass, setConPass] = useState("");
    const [errors, setErrors] = useState({
        fname: "",
        lname: "",
        clock: "",
        username: "",
        email: "",
        password: "",
        pswmatch: ""
    });
    const [cpswError, setCpswError] = useState("");
    const [cpswMatch, setCpswMatch] = useState("");
    const [allError, setAllError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);

    const checkClock = checkClockApi(setErrors);
    const checkUsername = checkUsernameApi(setErrors);
    const checkEmail = checkEmailApi(setErrors);

    function handleChange(e) {
        const { name, value } = e.target;

        if (name === "cpsw") setConPass(value);

        else setFormData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    }

    function validateField(name, value) {
        let cpswerror = "";
        let cpswmatch = "";
        let trimmed = value.trim();
        let len = trimmed.length;
        let error = userDataValidation(name, trimmed);

        switch(name){
            case "clock": {
                checkClock(trimmed);
                break;
            }
            case "email": {
                checkEmail(trimmed);
                break;
            }
            case "username": {
                checkUsername(trimmed);
                break;
            }
        }

        if (name === "password") {
            let confirm = conPass;
            let cpswlen = confirm.length;
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

            setCpswError(cpswerror);

            setCpswMatch(cpswmatch);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const hasErrors = Object.values(errors).some(err => err !== "");
        const hasCpswErrors = Object.values(cpswError).some(err => err !== "");

        // alert(hasErrors);
        // true if one of them is wrong
        // alert(hasCpswErrors);
        // false if its empty
        if (hasErrors || hasCpswErrors) {
            setAllError("Υπάρχουν λάθη στη φόρμα");
            return;
        }

        try{
            const res = await axios.post('/public/register', formData);
            if(res.data) navigate('/login');
        } catch(err){
            console.log(err);
        }
        // axios.post('/public/register', formData)
        //     .then((res) => {
        //         navigate('/login');
        //     })
        //     .catch((err) => console.log(err));
    }

    return{
        formData, conPass, errors, providers,
        cpswError, cpswMatch, allError,
        showConfPassword, showPassword,
        setShowConfPassword, setShowPassword,
        handleChange, handleSubmit
    };
}
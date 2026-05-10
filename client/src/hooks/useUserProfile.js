import { useState, useEffect, useMemo } from "react";
import { checkEmail as checkEmailApi, checkClock as checkClockApi, checkUsername as checkUsernameApi } from "../api/profileApiChecks";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "./useAxiosPrivate.js";
import useLogout from "./useLogout.js";
import useGetProvider from "./useGetProviders.js";
import userDataValidation from "../utils/userDataValidation.js";

export default function useUserProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();
    const logout = useLogout();
    const providers = useGetProvider();
    
    const [data, setData] = useState({
        fname: "",
        lname: "",
        clock: "",
        provider: "",
        email: "",
        username: "",
        password: ""
    });

    const [conPass, setConPass] = useState("");
    const [originalPassword, setOriginalPassword] = useState("");

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
    const [cpswRequired, setCpswRequired] = useState(false);
    const [allError, setAllError] = useState("");
    const [saved, setSaved] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);

    useEffect(() => {
        axiosPrivate.get('/users/profile')
            .then((res) => {
                if (res.data) {
                    setData(res.data);
                    setOriginalPassword(res.data.password);
                }
            })
            .catch((err) => { console.log(err); });
    }, []);

    useEffect(() => {
        if (saved !== "") {
            const timer = setTimeout(() => {
                setSaved("");
            }, 5000);

            return () => clearTimeout(timer);
        }

        if (allError !== "") {
            const timer = setTimeout(() => {
                setAllError("");
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [saved, allError]);

    const checkEmail = useMemo(() => checkEmailApi(axiosPrivate, setErrors), []);
    const checkClock = useMemo(() => checkClockApi(axiosPrivate, setErrors), []);
    const checkUsername = useMemo(() => checkUsernameApi(axiosPrivate, setErrors), []);

    function handleChange(e) {
        const { name, value } = e.target;
        if (name === "cpsw") setConPass(value);
        else setData(prev => ({ ...prev, [name]: value }));

        validateField(name, value);
    };

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
            let len = trimmed.length;
            let confirm = conPass;
            let cpswlen = confirm.length;

            if (!originalPassword) return;

            setCpswRequired(originalPassword !== trimmed);

            if (originalPassword === trimmed) {
                cpswerror = "";
                cpswmatch = "";
            }
            else if (originalPassword !== trimmed) {
                cpswerror = "Οι δύο κωδικοί δεν ταιρίαζουν";
                cpswmatch = "";
            }
            else if (trimmed === confirm && len !== 0) {
                cpswerror = "";
                cpswmatch = "Οι δύο κωδικοί ταιρίαζουν";
            }
            else if (trimmed !== confirm && cpswlen === 0) {
                cpswerror = "";
                cpswmatch = "";
            }
            else if (trimmed !== confirm && len !== 0) {
                cpswerror = "Οι δύο κωδικοί δεν ταιρίαζουν";
                cpswmatch = "";
            }
        }

        if (name === "cpsw") {
            confirm = trimmed;
            let len = confirm.length;
            let password = data.password;

            if (!originalPassword) return;

            if (len === 0 || password == originalPassword) {
                cpswerror = "";
                cpswmatch = "";
            }
            else if (confirm !== password) {
                cpswerror = "Οι δύο κωδικοί δεν ταιρίαζουν";
                cpswmatch = "";
            }
            else if (confirm === password) {
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

    async function signOut() {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error("Logout failed:", err.response?.data || err.message);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const hasErrors = Object.values(errors).some(err => err !== "");
        const hasCpswErrors = Object.values(cpswError).some(err => err !== "");

        if (hasErrors || hasCpswErrors) {
            setAllError("Υπάρχουν λάθη στη φόρμα");
            return;
        }

        try {
            await axiosPrivate.put('/users/profile', data);

            const res = await axiosPrivate.get('/users/profile');
            if (res.data) {
                setData(res.data);
                setOriginalPassword(res.data.password);
            }

            setAllError("");
            setSaved("Οι αλλαγές ήταν επιτυχής");
            setConPass("");
            setCpswMatch("");
        }
        catch (err) {
            console.log(err);
            navigate('/login', { state: { from: location }, replace: true });
        }
    }

    return {
        data, conPass, errors, providers, cpswError, cpswMatch, cpswRequired,
        allError, saved, showPassword, setShowPassword, showConfPassword,
        setShowConfPassword, handleChange, handleSubmit, signOut
    };
}
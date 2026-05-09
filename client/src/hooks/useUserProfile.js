import { useState, useEffect, useMemo } from "react";
import { checkEmail as checkEmailApi, checkClock as checkClockApi, checkUsername as checkUsernameApi } from "../api/profileApiChecks";
import { getProviders } from "../api/getProviders.js";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "./useAxiosPrivate.js";
import axios from "../api/axios.js";
import useLogout from "./useLogout.js";

export default function useUserProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate  = useAxiosPrivate();
    const logout = useLogout();
    const [data, setData] = useState({
        fname: "",
        lname: "",
        clock: "",
        provider: "",
        email: "",
        username: "",
        password: ""
    });

    const [conPass, setConPass] = useState({ cpsw: "" });
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

    const [providers, setProviders] = useState([]);
    const [cpswError, setCpswError] = useState({ cpsw: "" });
    const [cpswMatch, setCpswMatch] = useState({ cpsw: "" });
    const [cpswRequired, setCpswRequired] = useState(false);
    const [allError, setAllError] = useState({ all: "" });
    const [saved, setSaved] = useState({ saved: "" });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfPassword, setShowConfPassword] = useState(false);

    useEffect(() => {
        getProviders()
            .then(setProviders)
            .catch(console.log)
    }, []);

    useEffect(() => {
        axiosPrivate.get('/users/profile')
            .then((res) => {
                if (res.data) {
                    setData(prev => ({...prev, ...res.data}));
                    setOriginalPassword(res.data.password);
                }
            })
            .catch((err) => { console.log(err); });
    }, []);

    useEffect(() => {
        if (saved.saved !== "") {
            const timer = setTimeout(() => {
                setSaved(prev => ({ ...prev, saved: "" }));
            }, 5000);

            return () => clearTimeout(timer);
        }

        if (allError.all !== "") {
            const timer = setTimeout(() => {
                setAllError(prev => ({ ...prev, all: "" }));
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [saved.saved, allError.all]);

    const checkEmail = useMemo(() => checkEmailApi(axiosPrivate, setErrors), []);
    const checkClock = useMemo(() => checkClockApi(axiosPrivate, setErrors), []);
    const checkUsername = useMemo(() => checkUsernameApi(axiosPrivate, setErrors), []);

    function handleChange(e) {
        const { name, value } = e.target;
        if (name === "cpsw") setConPass(prev => ({ ...prev, [name]: value }));
        else setData(prev => ({ ...prev, [name]: value }));

        validateField(name, value);
    };

    function validateField(name, value) {
        let error = "";
        let cpswerror = "";
        let cpswmatch = "";
        let len = value.length;
        if (name === "fname") {
            let regex = /\d/;
            if (len === 0) error = "Το όνομα είναι κενό";

            else if (len < 4 || len > 15) error = "Το όνομά σας πρέπει να αποτελείται από 4 μέχρι 15 γράμματα";

            else if (value.includes(" ")) error = "Το όνομά σας δεν μπορεί να περιέχει κενά";

            else if (regex.test(value)) error = "Το όνομά σας δεν επιτρέπεται να περιέχει ψηφία";
        }
        else if (name === "lname") {
            let regex = /\d/;
            if (len === 0) error = "Το επιθετό σας είναι κενό";

            else if (len < 4 || len > 15) error = "Το επιθετό σας πρέπει να αποτελείται από 4 μεχρι 15 γράμματα";

            else if (value.includes(" ")) error = "Το επιθετό σας δεν μπορεί να περιέχει κενά";

            else if (regex.test(value)) error = "Το επιθετό σας δεν επιτρέπεται να περιέχει ψηφία";
        }
        else if (name === "clock") {
            let regex = /^\d-\d{8}-\d{2}$/;
            if (len === 0) error = "Ο αριθμός ρολογιού είναι κενός";

            else if (regex.test(value)) error = "";

            else error = "Ο αριθμός πρέπει να είναι αυτής της μορφής χ-χχχχχχχχ-χχ";

            checkClock(value);
        }
        else if (name === "email") {
            if (len === 0) error = "Το email σας είναι κενό";
            else error = "";
            checkEmail(value);
        }
        else if (name === "username") {
            if (len === 0) error = "Το username σας είναι κενό";

            else if (len < 5 || len > 10) error = "Το username σας πρέπει να αποτελείται από 5 μέχρι 10 γράμματα";

            else if (value.includes(" ")) error = "Το username σας δεν μπορεί να περιέχει κενά";

            checkUsername(value);
        }

        if (name === "password") {
            let len = value.length;
            let confirm = conPass.cpsw;
            let cpswlen = confirm.length;
            let specialRegex = /[!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>\/?]/;

            if (!originalPassword) return;

            setCpswRequired(originalPassword !== value);

            if (originalPassword === value) {
                cpswerror = "";
                cpswmatch = "";
            }
            else if (originalPassword !== value) {
                cpswerror = "Οι δύο κωδικοί δεν ταιρίαζουν";
                cpswmatch = "";
            }
            else if (value === confirm && len !== 0) {
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

            if (len === 0) error = "Ο κωδικός σας είναι κενός";

            else if (len < 5 || len > 15) error = "Ο κωδικός σας πρέπει να αποτελείται απο 5 μέχρι 15 χαρακτήρες";

            else if (value.includes(" ")) error = "Ο κωδικός σας δεν μπορεί να περιέχει κενά";

            else if (!specialRegex.test(value)) error = "Ο κωδικός σας πρέπει να περιέχει τουλάχιστον έναν χαρακτήρα σύμβολο";
        }

        if (name === "cpsw") {
            confirm = value;
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

            setCpswError(prev => ({ ...prev, cpsw: cpswerror }));

            setCpswMatch(prev => ({ ...prev, cpsw: cpswmatch }));
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
            setAllError(prev => ({ ...prev, all: "Υπάρχουν λάθη στη φόρμα" }));
            setLoading(false);
            return;
        }

        try {
            await axiosPrivate.put('/users/profile', data);

            const res = await axiosPrivate.get('/users/profile');
            if (res.data) {
                setData(prev => ({...prev, ...res.data}));
                setOriginalPassword(res.data.password);
            }

            setAllError(prev => ({ ...prev, all: "" }))
            setSaved(prev => ({ ...prev, saved: "Οι αλλαγές ήταν επιτυχής" }));
            setConPass(prev => ({ ...prev, cpsw: "" }));
            setCpswMatch(prev => ({ ...prev, cpsw: "" }));
        }
        catch (err) { 
            console.log(err);
            navigate('/login', { state: { from: location}, replace: true});
        }
    }

    return {
        data, conPass, errors, providers, cpswError, cpswMatch, cpswRequired,
        allError, saved, showPassword, setShowPassword, showConfPassword,
        setShowConfPassword, handleChange, handleSubmit, signOut
    };
}
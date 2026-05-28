import { useState, useEffect, useMemo } from "react";
import { checkEmailAdmin as checkEmailApi, checkUsernameAdmin as checkUsernameApi } from "../api/profileApiChecks";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "./useAxiosPrivate.js";
import useLogout from "./useLogout.js";
import dataValidation from "../utils/dataValidation.js";
import passwordChecking from "../utils/passwordChecking.js";

export default function useAdminProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const axiosPrivate = useAxiosPrivate();
    const logout = useLogout();

    const [data, setData] = useState({
        fname: "",
        lname: "",
        email: "",
        username: "",
        password: ""
    });
    const [conPass, setConPass] = useState("");
    const [originalPassword, setOriginalPassword] = useState("");

    const [errors, setErrors] = useState({
        fname: "",
        lname: "",
        email: "",
        username: "",
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
        const getProfile = async () => {
            try {
                const res = await axiosPrivate.get('/admins/profile');
                if (res.data) {
                    setData(res.data);
                    setOriginalPassword(res.data.password);
                }
            } catch (err) {
                console.log(err);
            }
        }
        getProfile();
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
    const checkUsername = useMemo(() => checkUsernameApi(axiosPrivate, setErrors), []);

    function handleChange(e) {
        const { name, value } = e.target;
        if (name === "cpsw") setConPass(value);
        else setData(prev => ({ ...prev, [name]: value }));

        validateField(name, value);
    };

    function validateField(name, value) {
        let trimmed = value.trim();
        let error = dataValidation(name, trimmed);

        switch (name) {
            case "email": {
                checkEmail(trimmed);
                break;
            }
            case "username": {
                checkUsername(trimmed);
                break;
            }
            case "password": {
                const { cpswerror, cpswmatch } = passwordChecking(name, trimmed, conPass, originalPassword, setCpswRequired);
                setCpswError(cpswerror);

                setCpswMatch(cpswmatch);
                break;
            }
            case "cpsw": {
                const { cpswerror, cpswmatch } = passwordChecking(name, data.password, trimmed, originalPassword, setCpswRequired);
                setCpswError(cpswerror);

                setCpswMatch(cpswmatch);
                break;
            }
        }

        if (name !== "provider") setErrors(prev => ({ ...prev, [name]: error }));
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
            const res = await axiosPrivate.put('/admins/profile', data);

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
        }
    }

    return {
        data, conPass, errors, cpswError, cpswMatch, cpswRequired,
        allError, saved, showPassword, setShowPassword, showConfPassword,
        setShowConfPassword, handleChange, handleSubmit, signOut
    };
}
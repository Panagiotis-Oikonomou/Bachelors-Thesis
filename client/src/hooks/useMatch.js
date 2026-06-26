import { useState, useEffect } from "react";
import resetTimer from "../utils/resetTimer.js";
import useAxiosPrivate from './useAxiosPrivate.js';
import Swal from "sweetalert2";
import useAuth from "./useAuth.js";
import { jwtDecode } from "jwt-decode";

export default function useMatch() {
    const axiosPrivate = useAxiosPrivate();
    const { auth } = useAuth();
    const [criteria, setCriteria] = useState({
        minsize: "",
        maxsize: "",
        minenergy: "",
        maxenergy: "",
        minincome: "",
        maxincome: "",
        minmoney: "",
        maxmoney: "",
        papers: false,
        other: false
    });

    const [readyToGo, setReadyToGo] = useState({
        area: false,
        money: false,
        papers: false,
        other: false
    });
    const [isSizeChecked, setIsSizeChecked] = useState(false);
    const [isEnergyChecked, setIsEnergyChecked] = useState(false);
    const [isIncomeChecked, setIsIncomeChecked] = useState(false);
    const [isMoneyChecked, setIsMoneyChecked] = useState(false);
    const [isPapersChecked, setIsPapersChecked] = useState(false);
    const [isOtherChecked, setIsOtherChecked] = useState(false);
    const [isAreaChecked, setIsAreaChecked] = useState(false);
    const [havingArea, setHavingArea] = useState(true);
    const [areas, setAreas] = useState([]);
    const [formError, setFormError] = useState("");
    const [selectedArea, setSelectedArea] = useState("");
    const [users, setUsers] = useState([]);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [currentIndex, setCurrectIndex] = useState(0);
    let visibleUser = searchedUsers[currentIndex];

    useEffect(() => {
        if (!auth?.accessToken) return;
        const decoded = jwtDecode(auth.accessToken);
        setUsers([decoded.username]);
    }, [auth.accessToken]);

    function addUser(name) {
        if (users.includes(name)) {
            nextUser();
            return;
        }
        setUsers([...users, name]);
        nextUser();
    }

    useEffect(() => {
        resetTimer(formError, setFormError);
    }, [formError]);

    function removeSelectedUser(i) {
        setUsers(users.filter((_, index) => index !== i));
    }

    useEffect(() => {
        const getAreas = async () => {
            try {
                const res = await axiosPrivate.get('/areas');
                if (Array.isArray(res.data) && res.data.length > 0) setAreas(res.data);
                else setHavingArea(false);
            }
            catch (err) {
                console.log(err);
            }
        }

        getAreas();
    }, []);

    useEffect(() => {
        if (criteria.areaid !== undefined) setSelectedArea(criteria.areaid ?? "");
    }, [criteria.areaid]);

    function handleChange(e) {
        const { name, value } = e.target;

        setCriteria(prev => ({ ...prev, [name]: value }));
    }

    function setMinMaxToZero(e) {
        const { name, checked } = e.target;
        if (name === "chsize") {
            setCriteria(prev => ({ ...prev, minsize: "", maxsize: "" }));
            setIsSizeChecked(checked);
        }
        else if (name === "chenergy") {
            setCriteria(prev => ({ ...prev, minenergy: "", maxenergy: "" }));
            setIsEnergyChecked(checked);
        }
        else if (name === "chincome") {
            setCriteria(prev => ({ ...prev, minincome: "", maxincome: "" }));
            setIsIncomeChecked(checked);
        }
        else if (name === "chmoney") {
            setCriteria(prev => ({ ...prev, minmoney: "", maxmoney: "" }));
            setIsMoneyChecked(checked);
        }

    }

    function checkboxOptions(e) {
        const { name, checked } = e.target;
        if (name === "papers") {
            setCriteria(prev => ({ ...prev, papers: checked }));
            setIsPapersChecked(checked);
        }
        else if (name === "other") {
            setCriteria(prev => ({ ...prev, other: checked }));
            setIsOtherChecked(checked);
        }
        else if (name === "area") {
            setIsAreaChecked(checked);
            setIsSizeChecked(checked);
            setIsEnergyChecked(checked);
            setReadyToGo(prev => ({ ...prev, area: checked }));
            setCriteria(prev => ({ ...prev, minsize: "", maxsize: "", minenergy: "", maxenergy: "", areaid: "" }));
        }
    }

    function nextUser() {
        if (currentIndex + 1 <= searchedUsers.length) {
            visibleUser = searchedUsers[currentIndex + 1];
            setCurrectIndex(currentIndex + 1);
        }
    }

    async function handleSearchSubmit(e) {
        e.preventDefault();
        if (isEnergyChecked && isIncomeChecked && isSizeChecked && isMoneyChecked && !isPapersChecked && !isOtherChecked && !isAreaChecked) {
            setFormError("Πρέπει να έχεις επιλέξει κάποιο από τα κριτήρια.");
            return;
        }

        const send = {
            ...criteria,
            area: readyToGo.area
        };

        try {
            const res = await axiosPrivate.post('/match', send);

            if (res.data) {
                setSearchedUsers(res.data);
                setCurrectIndex(0)
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    async function handleCreationSubmit(e) {
        e.preventDefault();
        if (users.length < 5) {
            Swal.fire({
                title: "You need at least 5 members",
                icon: "warning",
                showConfirmButton: true,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Ok"
            });
            return;
        }
        if (!readyToGo.area || !readyToGo.money || !readyToGo.papers || !readyToGo.other) {
            Swal.fire({
                title: "You need at least 1 of each requirments",
                icon: "warning",
                showConfirmButton: true,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Ok"
            });
            console.log(readyToGo);
            return;
        }
        console.log("created");
    }

    return {
        criteria, formError, handleChange, setMinMaxToZero, isSizeChecked,
        isEnergyChecked, isIncomeChecked,
        isMoneyChecked, isPapersChecked, isOtherChecked, checkboxOptions, handleSearchSubmit,
        areas, isAreaChecked, havingArea, selectedArea, handleCreationSubmit, users,
        removeSelectedUser, addUser, searchedUsers, visibleUser, nextUser
    };
}
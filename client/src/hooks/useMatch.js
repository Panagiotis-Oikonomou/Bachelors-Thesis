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
        size: "",
        energy: "",
        income: "",
        money: "",
        areaid: "",
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
    const [areaId, setAreaId] = useState(null);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [currentIndex, setCurrectIndex] = useState(0);
    const [username, setUsername] = useState("");
    let visibleUser = searchedUsers[currentIndex];

    useEffect(() => {
        resetTimer(formError, setFormError);
    }, [formError]);

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

    useEffect(() => {
        const getMyOffers = async () => {
            try {
                if (!auth?.accessToken) return;
                const decoded = jwtDecode(auth.accessToken);

                const res = await axiosPrivate.get('/criteria/my_offers');
                if (res.data) {
                    const area = res.data.areaid !== null;
                    const money = res.data.money !== null;
                    const papers = res.data.papers !== null && res.data.papers !== 0;
                    const other = res.data.other !== null && res.data.other !== 0;
                    setReadyToGo(prev => ({ ...prev, area }));
                    setReadyToGo(prev => ({ ...prev, money }));
                    setReadyToGo(prev => ({ ...prev, papers }));
                    setReadyToGo(prev => ({ ...prev, other }));
                    const m = money ? res.data.money : null;
                    const p = papers ? res.data.papers : 0;
                    const o = other ? res.data.other : 0;
                    setUsers([{ username: decoded.username, userid: decoded.id, areaid: null, money: m, papers: p, other: o }]);
                    setUsername(decoded.username);
                }
            }
            catch (err) {
                console.log(err);
            }
        }

        getMyOffers();
    }, []);

    function handleChange(e) {
        const { name, value } = e.target;

        if (name === "areaid") {
            setAreaId(value === "" ? null : value);
            setHavingArea(true)
            setUsers(prev => prev.map(u => u.username === username ? { ...u, areaid: value } : u));
        }

        setCriteria(prev => ({ ...prev, [name]: value }));
    }

    function setMinMaxToZero(e) {
        const { name, checked } = e.target;
        if (name === "chsize") {
            setCriteria(prev => ({ ...prev, size: "" }));
            setIsSizeChecked(checked);
        }
        else if (name === "chenergy") {
            setCriteria(prev => ({ ...prev, energy: "" }));
            setIsEnergyChecked(checked);
        }
        else if (name === "chincome") {
            setCriteria(prev => ({ ...prev, income: "" }));
            setIsIncomeChecked(checked);
        }
        else if (name === "chmoney") {
            setCriteria(prev => ({ ...prev, money: "" }));
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
            setCriteria(prev => ({ ...prev, size: "", energy: "", areaid: "" }));
            if (!checked) setAreaId(null);
        }
    }

    function nextUser() {
        if (currentIndex + 1 <= searchedUsers.length) {
            visibleUser = searchedUsers[currentIndex + 1];
            setCurrectIndex(currentIndex + 1);
        }
    }

    function fixReadyToGoForAdd(user) {
        if (readyToGo.area && readyToGo.money && readyToGo.papers && readyToGo.other) return;

        if (!readyToGo.money && user.money) setReadyToGo(prev => ({ ...prev, money: true }));
        if (!readyToGo.papers && user.papers) setReadyToGo(prev => ({ ...prev, papers: true }));
        if (!readyToGo.other && user.other) setReadyToGo(prev => ({ ...prev, other: true }));
    }

    function fixReadyToGoForRemove(user) {
        setReadyToGo(prev => ({ ...prev, money: users.some(u => u.money) }));
        setReadyToGo(prev => ({ ...prev, papers: users.some(u => u.papers) }));
        setReadyToGo(prev => ({ ...prev, other: users.some(u => u.other) }));
    }

    function addUser(user) {
        if (users.some(u => u.username === user.username)) {
            nextUser();
            return;
        }
        if (user.areaid && areaId && user.areaid !== areaId) {
            nextUser();
            return;
        }
        if (user.areaid && !areaId) {
            setAreaId(user.areaid);
            setHavingArea(false);
            setReadyToGo(prev => ({ ...prev, area: true }));
        }
        fixReadyToGoForAdd(user);
        console.log(user);
        setUsers([...users, { username: user.username, userid: user.userid, areaid: user.areaid, money: user.money, papers: user.papers, other: user.other }]);
        nextUser();
    }

    function removeSelectedUser(i) {
        const removed = users[i];
        const newUsers = users.filter((_, index) => index !== i);
        setUsers(newUsers);
        if (removed.areaid && !newUsers.some(u => u.areaid)) {
            setAreaId(null);
            setHavingArea(true);
            setReadyToGo(prev => ({ ...prev, area: false }));
        }
        fixReadyToGoForRemove(i);
    }

    async function handleSearchSubmit(e) {
        e.preventDefault();
        if (isEnergyChecked && isIncomeChecked && isSizeChecked && isMoneyChecked && !isPapersChecked && !isOtherChecked && !isAreaChecked) {
            setFormError("Πρέπει να έχεις επιλέξει κάποιο από τα κριτήρια.");
            return;
        }

        const send = {
            size: criteria.size === "" ? false : Number(criteria.size),
            energy: criteria.energy === "" ? false : Number(criteria.energy),
            income: criteria.income === "" ? false : Number(criteria.income),
            money: criteria.money === "" ? false : Number(criteria.money),
            papers: criteria.papers,
            other: criteria.other
        };

        try {
            const res = await axiosPrivate.post('/match', send);

            if (res.data.length === 0) {
                Swal.fire({
                    title: "There were no users with that criteria",
                    icon: "warning",
                    showConfirmButton: true,
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Ok"
                });
                return;
            }
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
            return;
        }

        try {
            await axiosPrivate.post('notifications', users);

            Swal.fire({
                title: "A invitation has been send to the other users",
                icon: "success",
                showConfirmButton: true,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Ok"
            });
        } catch (err) {
            console.log(err);
            Swal.fire({
                title: "There was a problem with the server",
                icon: "warning",
                showConfirmButton: true,
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Ok"
            });
        }
        setUsers(prev => prev.filter(u => u.username === username).map(u => ({ ...u, areaid: null })));
        setCriteria(prev => ({ ...prev, areaid: "", size: "", energy: "", income: "", money: "", papers: "", other: "" }));
        setIsPapersChecked(false);
        setIsAreaChecked(false);
        setIsOtherChecked(false);
        setIsSizeChecked(false);
        setIsEnergyChecked(false);
        setIsIncomeChecked(false);
        setIsMoneyChecked(false);
        setHavingArea(true);
        setSearchedUsers([]);
        setAreaId(null);
    }

    return {
        criteria, formError, handleChange, setMinMaxToZero, isSizeChecked,
        isEnergyChecked, isIncomeChecked,
        isMoneyChecked, isPapersChecked, isOtherChecked, checkboxOptions, handleSearchSubmit,
        areas, isAreaChecked, havingArea, selectedArea, handleCreationSubmit, users,
        removeSelectedUser, addUser, searchedUsers, visibleUser, nextUser
    };
}
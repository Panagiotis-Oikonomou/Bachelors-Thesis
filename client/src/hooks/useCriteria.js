import { useState, useEffect } from "react";
import resetTimer from "../utils/resetTimer.js";
import useAxiosPrivate from './useAxiosPrivate.js';
import { useSocket } from "../context/SocketContext.jsx";

export default function useCriteria() {
    const axiosPrivate = useAxiosPrivate();
    const { onlineUsers, socket } = useSocket();
    const [criteria, setCriteria] = useState({ size: "", energy: "", income: "", money: "", areaid: "", papers: false, other: false });
    const [isSizeChecked, setIsSizeChecked] = useState(false);
    const [isEnergyChecked, setIsEnergyChecked] = useState(false);
    const [isIncomeChecked, setIsIncomeChecked] = useState(false);
    const [isMoneyChecked, setIsMoneyChecked] = useState(false);
    const [isAreaChecked, setIsAreaChecked] = useState(false);
    const [isPapersChecked, setIsPapersChecked] = useState(false);
    const [isOtherChecked, setIsOtherChecked] = useState(false);
    const [havingArea, setHavingArea] = useState(true);
    const [areas, setAreas] = useState([]);
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [wrongNumber, setWrongNumber] = useState({ size: "", energy: "", income: "", money: "", });
    const areaValue = areas.some(a => String(a.areaid) === String(criteria.areaid)) ? String(criteria.areaid) : "";

    useEffect(() => {
        resetTimer(formError, setFormError);
        resetTimer(formSuccess, setFormSuccess);
    }, [formError, formSuccess]);

    function handleChange(e) {
        const { name, value } = e.target;

        setCriteria(prev => ({ ...prev, [name]: value }));
        if (name !== "areaid") validateField(name, value);
    }

    function validateField(name, value) {
        let error = "";
        let val = value.trim();
        let len = val.length;
        let regex = /^[1-9]\d*(\.\d+)?$/;

        if (name === "income") {
            if (len === 0) error = "";

            else if (!regex.test(value)) error = "Ο αριθμός δεν έχει συμπληρωθεί σωστά";

            else if (Number(value) > 100) error = "Ο αριθμός δεν πρέπει να περνάει το 100%";
            setWrongNumber(prev => ({ ...prev, [name]: error }));
        }
        else {
            if (len === 0) error = "";

            else if (!regex.test(value)) error = "Ο αριθμός δεν έχει συμπληρωθεί σωστά";
            setWrongNumber(prev => ({ ...prev, [name]: error }));
        }
    }

    function setMinMaxToZero(e) {
        const { name, checked } = e.target;
        if (name === "chsize") {
            setCriteria(prev => ({ ...prev, size: "" }));
            setIsSizeChecked(checked);
            setWrongNumber(prev => ({ ...prev, size: "" }));
        }
        else if (name === "chenergy") {
            setCriteria(prev => ({ ...prev, energy: "" }));
            setIsEnergyChecked(checked);
            setWrongNumber(prev => ({ ...prev, energy: "" }));
        }
        else if (name === "chincome") {
            setCriteria(prev => ({ ...prev, income: "" }));
            setIsIncomeChecked(checked);
            setWrongNumber(prev => ({ ...prev, income: "" }));
        }
    }

    function checkboxOptions(e) {
        const { name, checked } = e.target;
        if (name === "moneyM") {
            setCriteria(prev => ({ ...prev, money: "" }));
            setWrongNumber(prev => ({ ...prev, money: "" }));
            setIsMoneyChecked(checked);
        }
        else if (name === "area") {
            setIsAreaChecked(checked);
            setIsSizeChecked(checked);
            setIsEnergyChecked(checked);
            setCriteria(prev => ({ ...prev, size: "", energy: "", areaid: "" }));
        }
        else if (name === "papers") {
            setCriteria(prev => ({ ...prev, papers: checked }));
            setIsPapersChecked(checked);
        }
        else if (name === "other") {
            setCriteria(prev => ({ ...prev, other: checked }));
            setIsOtherChecked(checked);
        }
    }

    useEffect(() => {
        const getCriteria = async () => {
            try {
                const res = await axiosPrivate.get('/criteria');
                if (res.data) {
                    setCriteria(prev => ({
                        ...prev, ...Object.fromEntries(Object.entries(res.data ?? {}).map(([key, value]) => [key, key === "areaid" ?
                            (value === null ? "" : String(value)) : (value ?? "")])
                        )
                    }));
                    setIsSizeChecked(res.data.areasize === null);
                    setIsEnergyChecked(res.data.energy === null);
                    setIsIncomeChecked(res.data.income === null);
                    setIsMoneyChecked(res.data.money !== null);
                    setIsAreaChecked(res.data.areaid !== null);
                    setIsPapersChecked(res.data.papers === 1);
                    setIsOtherChecked(res.data.other === 1);
                }
            }
            catch (err) {
                console.log(err);
            }
        }

        getCriteria();
    }, []);

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

    async function handleSubmit(e) {
        e.preventDefault();
        const hasErrors = Object.values(wrongNumber).some(err => err !== "");
        if (hasErrors) {
            setFormError("Κάποια πεδία αριθμών είναι λάθος συμπληρωμένα.");
            return;
        }

        if (isEnergyChecked && isIncomeChecked && isSizeChecked) {
            setFormError("Πρέπει να έχεις επιλέξει κάποιο από τα τρία πρώτα κριτήρια.");
            return;
        }

        if (!isMoneyChecked && !isAreaChecked && !isPapersChecked && !isOtherChecked) {
            setFormError("Πρέπει να έχεις επιλέξει κάποια, από τις τέσσερις επιλογές το τι προσφέρεις.");
            return;
        }

        if (isAreaChecked && criteria.areaid === "") {
            setFormError("Πρέπει να έχεις επιλέξει κάποια από τις περιοχές σου, για να προσφέρεις.");
            return;
        }

        const send = {
            ...criteria,
            areaid: !criteria.areaid ? null : Number(criteria.areaid),
            size: !criteria.size ? null : Number(criteria.size),
            energy: !criteria.energy ? null : Number(criteria.energy),
            income: !criteria.income ? null : Number(criteria.income),
            money: !criteria.money ? null : Number(criteria.money),
        }

        try {
            const res = await axiosPrivate.put('/criteria', {send, onlineUsers});
            if(res.data) socket.emit("sendChatAlgoInfo", {notifications: res.data});
            setFormSuccess("Οι αλλαγές αποθυκεύτικαν με επιτυχία");
        }
        catch (err) {
            console.log(err);
        }
    }

    return {
        criteria, formError, handleChange, setMinMaxToZero, isSizeChecked, setIsSizeChecked,
        isEnergyChecked, setIsEnergyChecked, isIncomeChecked, setIsIncomeChecked,
        isAreaChecked, isMoneyChecked, isPapersChecked, isOtherChecked, areas,
        havingArea, formSuccess, checkboxOptions, handleSubmit, wrongNumber, areaValue
    };
}
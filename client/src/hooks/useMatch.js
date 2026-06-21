import { useState, useEffect } from "react";
import resetTimer from "../utils/resetTimer.js";
import useAxiosPrivate from './useAxiosPrivate.js';

export default function useMatch() {
    const axiosPrivate = useAxiosPrivate();
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
    const [isSizeChecked, setIsSizeChecked] = useState(false);
    const [isEnergyChecked, setIsEnergyChecked] = useState(false);
    const [isIncomeChecked, setIsIncomeChecked] = useState(false);
    const [isMoneyChecked, setIsMoneyChecked] = useState(false);
    const [isPapersChecked, setIsPapersChecked] = useState(false);
    const [isOtherChecked, setIsOtherChecked] = useState(false);
    const [formError, setFormError] = useState("");


    // const [havingArea, setHavingArea] = useState(true);

    useEffect(() => {
        resetTimer(formError, setFormError);
    }, [formError]);

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
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (isEnergyChecked && isIncomeChecked && isSizeChecked && isMoneyChecked && !isPapersChecked && !isOtherChecked) {
            setFormError("Πρέπει να έχεις επιλέξει κάποιο από τα κριτήρια.");
            return;
        }
        console.log(criteria);
    }

    return {
        criteria, formError, handleChange, setMinMaxToZero, isSizeChecked, setIsSizeChecked,
        isEnergyChecked, setIsEnergyChecked, isIncomeChecked, setIsIncomeChecked, 
        isMoneyChecked, isPapersChecked, isOtherChecked, checkboxOptions, handleSubmit
    };
}
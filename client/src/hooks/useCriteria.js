import { useState, useEffect } from "react";
import resetTimer from "../utils/resetTimer.js";
import useAxiosPrivate from './useAxiosPrivate.js';

export default function useCriteria() {
    const axiosPrivate = useAxiosPrivate();
    const [criteria, setCriteria] = useState({
        minsize: "",
        maxsize: "",
        minenergy: "",
        maxenergy: "",
        minincome: "",
        maxincome: "",
        area: ""
    });
    const [isSizeChecked, setIsSizeChecked] = useState(false);
    const [isEnergyChecked, setIsEnergyChecked] = useState(false);
    const [isIncomeChecked, setIsIncomeChecked] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target;

        setCriteria(prev => ({ ...prev, [name]: value }));
    }

    function setMinMaxToZero(e) {
        const { name, checked } = e.target;
        if (name === "chsize") {
            setCriteria(prev => ({...prev, minsize: "", maxsize: "" }));
            setIsSizeChecked(checked);
        }
        else if (name === "chenergy") {
            setCriteria(prev => ({...prev,  minenergy: "", maxenergy: "" }));
            setIsEnergyChecked(checked);
        }
        else if (name === "chincome") {
            setCriteria(prev => ({...prev,  minincome: "", maxincome: "" }));
            setIsIncomeChecked(checked);
        }

    }

    return {
        criteria, handleChange, setMinMaxToZero, isSizeChecked, setIsSizeChecked,
        isEnergyChecked, setIsEnergyChecked, isIncomeChecked, setIsIncomeChecked
    };
}
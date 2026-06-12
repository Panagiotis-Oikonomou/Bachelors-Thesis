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
        moneyM:"",
        areaname: "",
        papers:false,
        other:false
    });
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

    function checkboxOptions(e){
        const {name, checked } = e.target;
        if(name === "money"){
            setCriteria(prev => ({...prev, money: checked }));
            setIsMoneyChecked(checked);
        }
        else if(name === "area") {
            setIsAreaChecked(checked);
            setIsSizeChecked(checked);
            setIsEnergyChecked(checked);
            setCriteria(prev => ({...prev, minsize: "", maxsize: "", minenergy: "", maxenergy: "" }));
        }

        else if(name === "papers"){
            setCriteria(prev => ({...prev, papers: checked }));
            setIsPapersChecked(checked);
        }
        else if(name === "other"){
            setCriteria(prev => ({...prev, other: checked }));
            setIsOtherChecked(checked);
        }
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

    function handleSubmit(e){
        e.preventDefault();
        if(isEnergyChecked && isIncomeChecked && isSizeChecked){
            setFormError("Πρέπει να έχεις επιλέξει κάποιο από τα τρία πρώτα κριτήρια.");
            return;
        }

        if(!isMoneyChecked && !isAreaChecked && !isPapersChecked && !isOtherChecked){
            setFormError("Πρέπει να έχεις επιλέξει κάποια, από τις τέσσερις επιλογές το τι προσφέρεις.");
            return;
        }

        if(isAreaChecked && criteria.areaname === ""){
            setFormError("Πρέπει να έχεις επιλέξει κάποια από τις περιοχές σου, για να προσφέρεις.");
            return;
        }
        console.log("Submitted");
    }

    return {
        criteria, formError, handleChange, setMinMaxToZero, isSizeChecked, setIsSizeChecked,
        isEnergyChecked, setIsEnergyChecked, isIncomeChecked, setIsIncomeChecked,
        isAreaChecked, isMoneyChecked, isPapersChecked, isOtherChecked, areas,
        havingArea, checkboxOptions, handleSubmit
    };
}
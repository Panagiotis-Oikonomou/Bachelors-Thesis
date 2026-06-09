import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "./useAxiosPrivate";
import resetTimer from "../utils/resetTimer";

export default function useAddArea() {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const [areaData, setAreaData] = useState({
        name: "",
        size: "",
        energy: "",
        lat: "",
        lng: ""
    });
    const [panelData, setPanelData] = useState("");

    const [formError, setFormError] = useState("");
    const [nameError, setNameError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;

        if (name === "name" || name === "size") {
            setAreaData(prev => ({ ...prev, [name]: value }));
            validateField(name, value);
        }

        if (name === "panelType") setPanelData(value);
    }

    function validateField(name, value) {
        if (name === "name") {
            let len = value.length;
            let error = "";
            let regex = /\d/;
            if (len === 0) error = "";

            else if (len < 4 || len > 20) error = "Το όνομά περιοχής πρέπει να αποτελείται από 4 μέχρι 20 γράμματα";

            else if (regex.test(value)) error = "Το όνομά περιοχής δεν επιτρέπεται να περιέχει ψηφία";
            setNameError(error);
        }
    }

    useEffect(() => {
        resetTimer(formError, setFormError);
    }, [formError]);

    async function handleSubmit(e) {
        e.preventDefault();

        const fields = ["lat", "lng", "energy"];
        const isMissing = fields.some(field => areaData[field] === "");

        if (nameError || isMissing) {
            setFormError("Υπάρχουν κάποια λάθοι ή λείπουν στοιχεία από την φόρμα");
            return;
        }

        const send = {
            ...areaData,
            size: Number(areaData.size),
            paneltype: panelData,
            lat: Number(areaData.lat),
            lng: Number(areaData.lng),
            ac: Number(areaData.energy)
        };
        try {
            await axiosPrivate.post('/areas', send);
            navigate('/my_areas');
        } catch (err) {
            console.log(err);
        }
    }

    return {
        areaData, setAreaData, nameError, formError,
        panelData, handleChange, handleSubmit
    };
}
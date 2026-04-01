import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


export default function userAddArea(userId) {
    const navigate = useNavigate();
    const [areaData, setAreaData] = useState({
        name: "",
        size: "",
        energy: "",
        lat: "",
        lng: ""
    });

    const [panelData, setPanelData] = useState({
        // power: 1,
        // loss: 14,
        panelType: ""
    });

    const [formError, setFormError] = useState({ err: "" });
    const [nameError, setNameError] = useState({ name: "" });

    function handleChange(e) {
        const { name, value } = e.target;

        if(name === "name" || name === "size") {
            setAreaData(prev => ({ ...prev, [name]: value }));
            validateField(name, value);
        }

        if(name === "panelType") {
            setPanelData(prev => ({...prev, panelType:value}));
        }
    }

    function validateField(name, value) {
        let len = value.length;
        let error = "";
        if (name === "name") {
            let regex = /\d/;
            if (len === 0) error = "";

            else if (len < 4 || len > 20) error = "Το όνομά περιοχής πρέπει να αποτελείται από 4 μέχρι 20 γράμματα";

            // else if (value.includes(" ")) error = "Το όνομά σας δεν μπορεί να περιέχει κενά";

            else if (regex.test(value)) error = "Το όνομά περιοχής δεν επιτρέπεται να περιέχει ψηφία";
            setNameError(prev => ({ ...prev, [name]: error }));
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        const hasErrors = Object.values(nameError).some(err => err !== "");
        const emptyCoordinates = Object.values(areaData).some(err => err !== "");

        if (hasErrors || emptyCoordinates) {
            setFormError(prev => ({ ...prev, err: "Υπάρχουν κάποια λάθοι ή λείπουν στοιχεία από την φόρμα" }));
            return;
        }

        navigate('/my_areas');
    }

    return {
        areaData, setAreaData, nameError, formError, 
        setPanelData, panelData, handleChange, handleSubmit
    };
}
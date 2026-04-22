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
    const [panelData, setPanelData] = useState({ panelType: "" });

    const [formError, setFormError] = useState({ err: "" });
    const [nameError, setNameError] = useState({ name: "" });

    function handleChange(e) {
        const { name, value } = e.target;

        if (name === "name" || name === "size") {
            setAreaData(prev => ({ ...prev, [name]: value }));
            validateField(name, value);
        }

        if (name === "panelType") setPanelData(prev => ({ ...prev, [name]: value }));
    }

    function validateField(name, value) {
        if (name === "name") {
            let len = value.length;
            let error = "";
            let regex = /\d/;
            if (len === 0) error = "";

            else if (len < 4 || len > 20) error = "Το όνομά περιοχής πρέπει να αποτελείται από 4 μέχρι 20 γράμματα";

            else if (regex.test(value)) error = "Το όνομά περιοχής δεν επιτρέπεται να περιέχει ψηφία";
            setNameError(prev => ({ ...prev, [name]: error }));
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        const hasErrors = Object.values(nameError).some(err => err !== "");
        const fields = ["lat", "lon", "energy"];
        const isMissing = fields.some(field => areaData[field] === "");

        if (hasErrors || isMissing) {
            setFormError(prev => ({ ...prev, err: "Υπάρχουν κάποια λάθοι ή λείπουν στοιχεία από την φόρμα" }));
            return;
        }

        const send = {
            ...areaData,
            userid: userId,
            size: Number(areaData.size),
            paneltype: panelData.panelType,
            lat: Number(areaData.lat),
            lng: Number(areaData.lng),
            ac: Number(areaData.energy)
        };
        axios.post('http://localhost:5000/api/areas', send)
            .then((res) => {
                navigate('/my_areas');
            })
            .catch((err) => console.log(err));
    }

    return {
        areaData, setAreaData, nameError, formError,
        panelData, handleChange, handleSubmit
    };
}
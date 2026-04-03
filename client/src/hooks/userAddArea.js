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

        if (name === "panelType") {
            setPanelData(prev => ({ ...prev, [name]: value }));
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
        const fields = ["lat", "lon", "energy"];
        const isMissing = fields.some(field => areaData[field] === "");
        
        if (hasErrors || isMissing) {
            setFormError(prev => ({ ...prev, err: "Υπάρχουν κάποια λάθοι ή λείπουν στοιχεία από την φόρμα" }));
            return;
        }

        const send = {
            ...areaData,
            userid:userId,
            size: Number(areaData.size),
            paneltype: panelData.panelType,
            lat : Number(areaData.lat),
            lng: Number(areaData.lng),
            ac: Number(areaData.energy)
        };
        axios.post('http://localhost:5000/addArea', send)
            .then((res) => {
            })
            .catch((err) => console.log(err));
        navigate('/my_areas');
    }

    return {
        areaData, setAreaData, nameError, formError,
        panelData, setPanelData, handleChange, handleSubmit
    };
}
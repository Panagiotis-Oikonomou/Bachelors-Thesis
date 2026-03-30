import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function userAddArea(userId){
    const navigate = useNavigate();
    const [areaData, setAreaData] = useState({
        name:"",
        size:"",
        sun:"3",
        lat:"",
        lng:""
    });

    const [panelData, setPanelData] = useState({
        power:1,
        loss:1.4,
        panelAxis:""
    });

    const [formError, setFormError] = useState({err:""});
    const [nameError, setNameError] = useState({name:""});

    function handleChange(e){
        const {name, value} = e.target;

        // if(name === "cordinates"){
        //     // setAreaData(prev => ({...prev, lat:value.lat, lng:value.lng}));
        //     // alert(value.lat + " " + value.lng);
        //     // alert(areaData.lat + " " + areaData.lng);
        // }
        if(name !== "coordinates"){
            setAreaData(prev => ({...prev, [name]:value}));
            validateField(name, value);
        }
            
    }

    function validateField(name, value){
        let len = value.length;
        let error = "";
        if(name === "name"){
            let regex = /\d/;
            if (len === 0) error = "";

            else if (len < 4 || len > 20) error = "Το όνομά περιοχής πρέπει να αποτελείται από 4 μέχρι 20 γράμματα";

            // else if (value.includes(" ")) error = "Το όνομά σας δεν μπορεί να περιέχει κενά";

            else if (regex.test(value)) error = "Το όνομά περιοχής δεν επιτρέπεται να περιέχει ψηφία";
            setNameError(prev => ({...prev, [name]:error}));
        }
    }

    function handleSubmit(e){
        e.preventDefault();

        const hasErrors = Object.values(nameError).some(err => err !== "");

        if(hasErrors){
            setFormError(prev => ({...prev, err:"Υπάρχουν κάποια λάθοι στην φόρμα"}));
            return;
        }
        
        navigate('/my_areas');
        // axios.post('http://localhost:5000/register', areaData)
        //     .then((res) => {
        //         navigate('/my_areas');
        //         console.log(res);
        //         console.log("Form submitted:", areaData);
        //     })
        //     .catch((err) => console.log(err));
    }

    return{
        areaData, setAreaData, nameError,
        formError, handleChange, handleSubmit
    };
}
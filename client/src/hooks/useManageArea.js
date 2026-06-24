import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "./useAxiosPrivate";
import resetTimer from "../utils/resetTimer";
import useGetEnergy from "./useGetEnergy";

export default function useManageArea(id) {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();

    const [areaData, setAreaData] = useState({
        name: "",
        size: "",
        lat: "",
        lng: "",
        ac: ""
    });
    const [nameError, setNameError] = useState("");
    const [formError, setFormError] = useState("");
    const [areaUpdated, setAreaUpdated] = useState("");

    useEffect(() => {
        if (!id) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const res = await axiosPrivate.get(`/areas/${id}`);

                if (res.data) setAreaData(res.data);

                else navigate('/my_areas');
            }
            catch (err) {
                if (err.response?.status === 404) {
                    console.log(err.response.data.message);
                    navigate('/my_areas');
                    return;
                }
                console.log(err);
            }
        }

        fetchData();

    }, [id]);

    useEffect(() => {
        resetTimer(formError, setFormError);
        resetTimer(areaUpdated, setAreaUpdated);
    }, [formError, areaUpdated]);

    useGetEnergy(setAreaData, areaData.size, areaData.lat, areaData.lng);
    
    function handleChange(e) {
        const { name, value } = e.target;

        setAreaData(prev => ({ ...prev, [name]: value }));
        validateField(name, value);
    }

    function validateField(name, value) {
        if (name === "name") {
            let len = value.length;
            let error = "";
            let regex = /\d/;
            if (len === 0) error = "Το όνομα είναι κενό";

            else if (len < 4 || len > 20) error = "Το όνομά περιοχής πρέπει να αποτελείται από 4 μέχρι 20 γράμματα";

            else if (regex.test(value)) error = "Το όνομά περιοχής δεν επιτρέπεται να περιέχει ψηφία";
            setNameError(error);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (nameError) {
            setFormError("Υπάρχουν κάποια λάθοι ή λείπουν στοιχεία από την φόρμα");
            setAreaUpdated("");
            return;
        }

        try{
            await axiosPrivate.put(`/areas/${id}`, areaData);
        }
        catch(err){
            console.log(err);
        }

        setAreaUpdated("Η αλλαγές αποθυκεύτικαν επιτυχώς");
        setFormError("");
    }

    return {
        areaData, nameError, formError, areaUpdated,
        handleSubmit, handleChange
    };
}
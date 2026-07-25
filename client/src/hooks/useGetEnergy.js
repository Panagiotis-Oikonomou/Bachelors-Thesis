import { useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

export default function useGetEnergy(setAreaData, size, lat, lng, setError) {
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {

        const getEnergy = async () => {
            if (!lat || !lng || !size) return;
            
            try {
                const res = await axiosPrivate.get(`/pv?lat=${lat}&lon=${lng}`);
                if(res.data) {
                    const energy = Number(res.data) * Number(size) * 0.2;
                    setAreaData((prev) => ({ ...prev, ac: energy.toFixed(3),}));
                }
            } catch (error) {
                console.log(error);
                setError("Υπήρξε κάποιο πρόβλημα με τις συντεταγμένες.");
                setAreaData((prev) => ({ ...prev, ac: ""}))
            }
        }
        getEnergy();
    }, [size, lat, lng, axiosPrivate, setAreaData]);
}
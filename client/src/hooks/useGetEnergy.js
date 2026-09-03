import { useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

export default function useGetEnergy(setAreaData, size, lat, lng, setError) {
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {

        const getEnergy = async () => {
            if (!lat || !lng || !size) return;
            
            try {
                const peakpower = Number(size) * 0.2;
                const res = await axiosPrivate.get(`/pv?lat=${lat}&lon=${lng}&peakpower=${peakpower}`);
                if(res.data) {
                    setAreaData((prev) => ({ ...prev, ac: res.data.toFixed(3),}));
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
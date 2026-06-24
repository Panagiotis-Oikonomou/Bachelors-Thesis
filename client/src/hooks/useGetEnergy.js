import { useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

export default function useGetEnergy(setAreaData, size, lat, lng) {
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (!lat || !lng || !size) return;

        axiosPrivate
            .get(`/pv?lat=${lat}&lon=${lng}`)
            .then((res) => {
                const energy = Number(res.data) * Number(size) * 0.2;

                setAreaData((prev) => ({
                    ...prev,
                    ac: energy.toFixed(3),
                }));
            })
            .catch(console.error);
    }, [size, lat, lng, axiosPrivate, setAreaData]);
}
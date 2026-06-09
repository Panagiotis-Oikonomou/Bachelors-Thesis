import { useEffect } from "react";
import useAxiosPrivate from "./useAxiosPrivate";

export default function useGetEnergy(panelType, setAreaData, size, lat, lng) {
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        if (!lat || !lng || !size) return;

        let type;

        if (panelType === "vertical") type = 1;
        else if (panelType === "inclined") type = 2;
        else if (panelType === "two") type = 3;
        else return;

        axiosPrivate
            .get(`/pv?lat=${lat}&lon=${lng}&type=${type}`)
            .then((res) => {
                const energy = Number(res.data) * Number(size) * 0.2;

                setAreaData((prev) => ({
                    ...prev,
                    ac: energy.toFixed(3),
                }));
            })
            .catch(console.error);
    }, [panelType, size, lat, lng, axiosPrivate, setAreaData]);
}
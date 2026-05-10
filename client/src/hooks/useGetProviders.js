import { useEffect, useState } from "react";
import { getProviders } from "../api/getProviders";

const useGetProvider = () => {
    const [providers, setProviders] = useState([]);
    useEffect(() => {
        getProviders()
        .then(setProviders)
        .catch(console.error);
    }, []);

    return providers;
}

export default useGetProvider;
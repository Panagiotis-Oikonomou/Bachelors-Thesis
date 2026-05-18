import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth, persist, setAuth } = useAuth();

    useEffect(() => {
        let isMounted = true;
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.log(err);
                setAuth({});
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        // !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
        if (!auth?.accessToken && persist) {
            verifyRefreshToken();
        } else {
            setIsLoading(false);
        }

        return () => isMounted = false;
    }, []);

    return (
        <>
            {!persist
                ? <Outlet />
                : isLoading
                    ? <p>is loading...</p>
                    : <Outlet />
            }
        </>
    )
}

export default PersistLogin;
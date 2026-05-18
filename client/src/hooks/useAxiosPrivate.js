import { useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, setAuth } = useAuth();

    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    // this happens the first time you login
                    // you dont have sth in the headers
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 401 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    try {
                        const newAccessToken = await refresh();
                        prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                        return axiosPrivate(prevRequest);

                    } catch (err) {
                        setAuth({});
                        navigate('/login', {
                            state: { from: location },
                            replace: true
                        });
                        return Promise.reject(err);
                    }
                }

                if (error?.response?.status === 403) {

                    setAuth({});

                    navigate('/login', {
                        state: { from: location },
                        replace: true
                    });
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.response.eject(responseIntercept);
            axiosPrivate.interceptors.request.eject(requestIntercept);
        }
    }, [auth, refresh, navigate, location, setAuth]);

    return axiosPrivate;
}

export default useAxiosPrivate;
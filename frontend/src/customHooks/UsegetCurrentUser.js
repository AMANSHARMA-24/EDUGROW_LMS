import React, { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../App";

function useGetUser() {
    const dispatch = useDispatch();
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/current`,
                    { withCredentials: true });
                dispatch(setUserData(result.data))
            } catch (err) {
                
                console.error(err);
            }
        }
        fetchUsers();
    }, [dispatch])

}
export default useGetUser;
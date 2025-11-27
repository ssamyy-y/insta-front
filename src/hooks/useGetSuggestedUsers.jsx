import { setSuggestedUsers } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const VITE_APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:8000";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const res = await axios.get(`${VITE_APP_URL}/api/v1/user/suggested`, {
          withCredentials: true,
        });
        if (res.data.success) {
          // console.log(res.data);

          dispatch(setSuggestedUsers(res.data.users));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchSuggestedUsers();
  }, []);
};

export default useGetSuggestedUsers;

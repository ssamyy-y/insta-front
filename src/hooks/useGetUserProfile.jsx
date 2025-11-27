import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const VITE_APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:8000";

const useGetUserProfile = (userId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUSerProfile = async () => {
      try {
        const res = await axios.get(
          `${VITE_APP_URL}/api/v1/user/${userId}/profile`,
          { withCredentials: true }
        );
        if (res.data.success) {
          // console.log(res.data);

          dispatch(setUserProfile(res.data.user));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUSerProfile();
  }, [userId]);
};

export default useGetUserProfile;

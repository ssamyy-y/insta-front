import { setPosts } from "@/redux/postSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const VITE_APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:8000";

const useGetAllPost = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const res = await axios.get(`${VITE_APP_URL}/api/v1/post/all`, {
          withCredentials: true,
        });
        if (res.data.success) {
          // console.log(res.data);

          dispatch(setPosts(res.data.post));
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllPost();
  }, []);
};

export default useGetAllPost;

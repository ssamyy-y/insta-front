// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
// import axios from "axios";
// import { toast } from "sonner";

// const VITE_APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:8000";

// const SuggestedUsers = () => {
//   const { suggestedUsers } = useSelector((store) => store.auth);

//   return (
//     <div className="my-10">
//       <div className="flex items-center justify-between text-sm">
//         <h1 className="font-semibold text-gray-600">Suggested for you</h1>
//         {/* <span className="font-medium cursor-pointer">See All</span> */}
//       </div>
//       {suggestedUsers?.map((user) => {
//         const followHandler = async () => {
//           try {
//             const res = await axios.get(
//               `${VITE_APP_URL}/api/v1/user/followorunfollow/${user?._id}`,
//               { withCredentials: true }
//             );

//             if (res.data.success) {
//               toast.success(res.data.message);
//             }
//           } catch (error) {
//             console.log(error);
//           }
//         };
//         return (
//           <div
//             key={user._id}
//             className="flex items-center justify-between my-5"
//           >
//             <div className="flex items-center gap-2">
//               <Link to={`/profile/${user?._id}`}>
//                 <Avatar>
//                   <AvatarImage src={user?.profilePicture} alt="post_image" />
//                   <AvatarFallback>CN</AvatarFallback>
//                 </Avatar>
//               </Link>
//               <div>
//                 <h1 className="font-semibold text-sm">
//                   <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
//                 </h1>
//                 <span className="text-gray-600 text-sm">
//                   {user?.bio || "Bio here..."}
//                 </span>
//               </div>
//             </div>
//             <span
//               className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#4698cf] "
//               onClick={followHandler}
//             >
//               Follow
//             </span>
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default SuggestedUsers;

import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import { setSuggestedUsers } from "@/redux/authSlice";

const VITE_APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:8000";

const SuggestedUsers = () => {
  const dispatch = useDispatch();
  const { suggestedUsers, user: currentUser } = useSelector(
    (store) => store.auth
  );

  const updateFollowState = (userId) => {
    const updatedUsers = suggestedUsers.map((u) => {
      if (u._id === userId) {
        const isFollowing = u.followers.includes(currentUser._id);

        return {
          ...u,
          followers: isFollowing
            ? u.followers.filter((id) => id !== currentUser._id)
            : [...u.followers, currentUser._id],
        };
      }
      return u;
    });

    dispatch(setSuggestedUsers(updatedUsers));
  };

  return (
    <div className="my-10">
      <h1 className="font-semibold text-gray-600 text-sm">Suggested for you</h1>

      {suggestedUsers?.map((user) => {
        const isFollowing = user.followers.includes(currentUser._id);

        const followHandler = async () => {
          try {
            const res = await axios.get(
              `${VITE_APP_URL}/api/v1/user/followorunfollow/${user._id}`,
              { withCredentials: true }
            );

            if (res.data.success) {
              toast.success(res.data.message);

              // Update UI immediately
              updateFollowState(user._id);
            }
          } catch (err) {
            console.log(err);
          }
        };

        return (
          <div
            key={user._id}
            className="flex items-center justify-between my-5"
          >
            <div className="flex items-center gap-2">
              <Link to={`/profile/${user._id}`}>
                <Avatar>
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Link>

              <div>
                <h1 className="font-semibold text-sm">
                  <Link to={`/profile/${user._id}`}>{user.username}</Link>
                </h1>
                <span className="text-gray-600 text-sm">
                  {user.bio || "Bio here..."}
                </span>
              </div>
            </div>

            <span
              className={`ml-4 text-xs font-bold cursor-pointer ${
                isFollowing
                  ? "text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
                  : "text-[#3BADF8] hover:text-[#4698cf] dark:text-[#3BADF8] dark:hover:text-[#4698cf]"
              }`}
              onClick={followHandler}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;

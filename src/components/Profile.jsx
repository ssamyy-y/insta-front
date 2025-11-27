/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

// Inside Profile component:

const FollowersList = ({ users, onUserClick }) => {
  if (!users || users.length === 0)
    return <p className="text-center text-sm text-gray-500">No users found.</p>;

  return (
    <div className="flex flex-col gap-4 max-h-64 overflow-y-auto">
      {users.map((u) => (
        <div
          key={u._id}
          onClick={() => onUserClick(u._id)}
          className="
            flex items-center gap-3 p-2 
            hover:bg-gray-100 dark:hover:bg-gray-800 
            rounded-lg cursor-pointer
          "
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={u.profilePicture} />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>

          <div className="flex flex-col">
            <span className="font-medium text-gray-900 dark:text-white">
              {u.username}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {u.bio || "Bio..."}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

const VITE_APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:8000";

const Profile = () => {
  const [followersDialogOpen, setFollowersDialogOpen] = useState(false);
  const [followingDialogOpen, setFollowingDialogOpen] = useState(false);

  const params = useParams();
  const userId = params.id;
  const [activeTab, setActiveTab] = useState("posts");
  useGetUserProfile(userId);
  const navigate = useNavigate();

  const { userProfile, user } = useSelector((store) => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = user.following.includes(userProfile?._id);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  const followHandler = async () => {
    try {
      const res = await axios.get(
        `${VITE_APP_URL}/api/v1/user/followorunfollow/${userProfile?._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigateToMessage = () => {
    navigate(`/chat`);
  };

  return (
    <div className="flex max-w-4xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32 border-2 border-gray-200 shadow-sm">
              <AvatarImage src={userProfile?.profilePicture} alt="profileImg" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-3 flex-wrap">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button
                        className="hover:bg-gray-200 h-8"
                        variant="secondary"
                      >
                        Edit Profile
                      </Button>
                    </Link>
                    <Button
                      className="hover:bg-gray-200 h-8"
                      variant="secondary"
                    >
                      View Archive
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button
                      variant="secondary"
                      className=" h-8"
                      onClick={followHandler}
                    >
                      Unfollow
                    </Button>
                    <Button
                      className="bg-[#0095F6] hover:bg-[#50a1d6] h-8"
                      onClick={navigateToMessage}
                    >
                      Message
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={followHandler}
                    className="bg-[#0095F6] hover:bg-[#50a1d6] h-8"
                  >
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-6">
                {/* POSTS */}
                <p className="font-semibold">
                  {userProfile?.posts.length}
                  <span className="font-normal"> Posts</span>
                </p>

                {/* FOLLOWERS */}

                {/* FOLLOWERS */}
                <Dialog
                  open={followersDialogOpen}
                  onOpenChange={setFollowersDialogOpen}
                >
                  <DialogTrigger asChild>
                    <p className="font-semibold cursor-pointer hover:opacity-70">
                      {userProfile?.followers.length}
                      <span className="font-normal"> Followers</span>
                    </p>
                  </DialogTrigger>

                  <DialogContent
                    className="
      max-w-sm w-full max-h-[70vh] overflow-y-auto 
      p-4 bg-white dark:bg-gray-900 rounded-2xl 
      shadow-lg ring-0
    "
                  >
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        Followers
                      </DialogTitle>
                    </DialogHeader>

                    <FollowersList
                      users={userProfile?.followersData}
                      onUserClick={(id) => {
                        navigate(`/profile/${id}`);
                        setFollowersDialogOpen(false);
                      }}
                    />
                  </DialogContent>
                </Dialog>

                {/* FOLLOWING */}
                <Dialog
                  open={followingDialogOpen}
                  onOpenChange={setFollowingDialogOpen}
                >
                  <DialogTrigger asChild>
                    <p className="font-semibold cursor-pointer hover:opacity-70">
                      {userProfile?.following.length}
                      <span className="font-normal"> Following</span>
                    </p>
                  </DialogTrigger>

                  <DialogContent
                    className="
      max-w-sm w-full max-h-[70vh] overflow-y-auto 
      p-4 bg-white dark:bg-gray-900 rounded-2xl 
      shadow-lg ring-0
    "
                  >
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                        Following
                      </DialogTitle>
                    </DialogHeader>

                    <FollowersList
                      users={userProfile?.followingData}
                      onUserClick={(id) => {
                        navigate(`/profile/${id}`);
                        setFollowingDialogOpen(false);
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex flex-col gap-1 text-sm md:text-base leading-relaxed">
                <span className="font-semibold">
                  {userProfile?.bio || "Bio..."}
                </span>
                <Badge className="w-fit mt-2" variant="secondary">
                  <AtSign className="h-3 w-3" />{" "}
                  <span className="pl-1">{userProfile?.username}</span>
                </Badge>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              Posts
            </span>
            <span
              className={`py-3 cursor-pointer  ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              Saved
            </span>
            <span
              className={`py-3 cursor-pointer`}
              // onClick={() => handleTabChange("reels")}
            >
              Reels
            </span>
            <span
              className={`py-3 cursor-pointer`}
              // onClick={() => handleTabChange("tags")}
            >
              Tags
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img
                    src={post?.image}
                    alt="postImg"
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                  />
                  <div className="absolute rounded inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <Heart />
                        <span>{post?.likes?.length}</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-gray-300">
                        <MessageCircle />
                        <span>{post?.comments?.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

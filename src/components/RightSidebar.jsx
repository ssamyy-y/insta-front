import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const RightSidebar = () => {
  const { user } = useSelector((store) => store.auth);
  const { theme, toggleTheme } = useContext(ThemeContext);
  return (
    <div className="w-fit my-10 pr-10 md:pr-32 dark:bg-black">
      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition cursor-pointer">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="h-12 w-12 border shadow-sm">
            <AvatarImage src={user?.profilePicture} alt="user-avatar" />
            <AvatarFallback className="bg-gray-200 text-gray-600">
              CN
            </AvatarFallback>
          </Avatar>
        </Link>

        <div className="flex flex-col leading-tight">
          <Link to={`/profile/${user?._id}`}>
            <h1 className="font-semibold text-sm hover:underline">
              {user?.username}
            </h1>
          </Link>
          <span className="text-gray-500 text-xs">
            {user?.bio || "Bio here..."}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <SuggestedUsers />
      </div>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-full transition hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        {theme === "dark" ? (
          <Sun size={18} className="text-yellow-400" />
        ) : (
          <Moon size={18} className="text-gray-700" />
        )}
      </button>
    </div>
  );
};

export default RightSidebar;

/* eslint-disable react/jsx-key */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { setSelectedUser } from "@/redux/authSlice";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import Messages from "./Messages";
import axios from "axios";
import { setMessages } from "@/redux/chatSlice";
import { Link } from "react-router-dom";

const VITE_APP_URL = import.meta.env.VITE_APP_URL;

const ChatPage = () => {
  const [textMessage, setTextMessage] = useState("");
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const dispatch = useDispatch();

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `${VITE_APP_URL}/api/v1/message/send/${receiverId}`,
        { textMessage },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setTextMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  return (
    <div className="flex ml-[16%] h-screen">
      <section className="w-full md:w-1/4 my-5">
        <div className="flex items-center gap-3 px-3 py-1">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <h1 className="text-lg font-semibold text-gray-900">
            {user?.username}
          </h1>
        </div>
        <hr className="my-3 border-gray-300" />

        <div className="overflow-y-auto h-[80vh]">
          <div className="overflow-y-auto h-[80vh] space-y-2 px-2">
            {suggestedUsers.map((su) => {
              const isOnline = onlineUsers.includes(su?._id);
              const isSelected = selectedUser && selectedUser._id === su._id;

              return (
                <div
                  key={su._id}
                  onClick={() => dispatch(setSelectedUser(su))}
                  className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-150
          ${isSelected ? "bg-gray-200" : "hover:bg-gray-50"}`}
                >
                  {/* avatar + status dot (bottom-right) */}
                  <div className="relative">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={su?.profilePicture} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>

                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
              ${isOnline ? "bg-green-500" : "bg-red-500"}`}
                      title={isOnline ? "Online" : "Offline"}
                    />
                  </div>

                  {/* name + small bio (truncated) */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-sm truncate">
                        {su.username}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {su.bio || "Hey there — I use ChatApp!"}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(setSelectedUser(su));
                    }}
                    className={`text-sm font-semibold px-3 py-1 rounded-full transition
            ${
              isSelected
                ? "bg-blue-500 text-white"
                : "text-[#3BADF8] hover:bg-blue-50"
            }`}
                  >
                    {isSelected ? "Open" : "Message"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-4 py-3 border-b border-gray-300 sticky top-0 bg-white z-10 shadow-sm dark:bg-black">
            {/* Avatar */}
            <div className="relative">
              <Avatar>
                <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              {/* Bottom-right status dot */}
              <span
                className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white 
        ${
          onlineUsers.includes(selectedUser?._id)
            ? "bg-green-500"
            : "bg-red-500"
        }`}
              ></span>
            </div>

            {/* Username + View Profile */}
            <div className="flex flex-col ">
              {/* USERNAME */}
              <span className="font-semibold">{selectedUser?.username}</span>

              {/* VIEW PROFILE */}
              <Link
                to={`/profile/${selectedUser?._id}`}
                className="text-xs text-blue-600 font-medium hover:underline"
              >
                View profile
              </Link>
            </div>
          </div>

          <Messages selectedUser={selectedUser} />
          <div className="flex items-center p-4 border-t border-t-gray-300">
            <Input
              value={textMessage}
              onChange={(e) => setTextMessage(e.target.value)}
              type="text"
              className="flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Messages..."
            />
            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto text-center py-12">
          <div className="p-6 rounded-full bg-blue-50 animate-pulse">
            <MessageCircleCode className="w-20 h-20 text-blue-600" />
          </div>

          <h1 className="font-semibold text-xl mt-4 tracking-wide">
            Your Messages
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Select a chat or start a new conversation.
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatPage;

/* eslint-disable react/prop-types */
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";

const Messages = ({ selectedUser }) => {
  useGetRTM();
  useGetAllMessage();
  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  return (
    <div className="overflow-y-auto flex-1 p-4">
      {/* ---- USER BLOCK (centered top) ---- */}
      <div className="flex justify-center mb-4">
        <div className="flex flex-col items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedUser?.profilePicture} alt="profile" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <span className="mt-3 mb-1 text-lg font-medium">
            {selectedUser?.username}
          </span>

          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View profile
            </Button>
          </Link>
        </div>
      </div>

      {/* ---- MESSAGE BUBBLES ---- */}
      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((msg) => {
            const isMe = msg.senderId === user?._id;

            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 max-w-sm rounded-2xl shadow-sm text-sm break-words
                  ${
                    isMe
                      ? "bg-blue-500 text-white rounded-br-none"
                      : "bg-gray-100 text-gray-900 rounded-bl-none"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })}
      </div>

      <div className="h-5"></div>
    </div>
  );
};

export default Messages;

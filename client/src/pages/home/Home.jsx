import { useSelector } from "react-redux";
import Chat from "./component/Chat";
import Header from "./component/Header";
import Sidebar from "./component/Sidebar";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("https://quick-chat-app-server-l0yu.onrender.com");

const Home = () => {
  const { selectedChat, user } = useSelector((state) => state.userReducer);
  const [onlineUser, setOnlineUser] = useState([]);

  useEffect(() => {
    if (user) {
      socket.emit("join-room", user._id);
      socket.emit("user-login", user._id);
      socket.on("online-users", (onlineUsers) => {
        setOnlineUser(onlineUsers);
      });
      socket.on("online-users-updated", (onlineUsers) => {
        setOnlineUser(onlineUsers);
      });
    }
  }, [user, onlineUser]);

  return (
    <div className="home-page ">
      <Header socket={socket} />
      <div className="main-content">
        {/* SIDEBAR LAYOUT */}
        <Sidebar socket={socket} onlineUser={onlineUser} />
        {/* CHAT AREA LAYOUT   */}
        {selectedChat && <Chat socket={socket} />}
      </div>
    </div>
  );
};
export default Home;

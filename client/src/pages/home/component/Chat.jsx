/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { createNewMessage, getAllMessages } from "../../../apiCalls/message";
import { clearUnreadMessageCount } from "../../../apiCalls/chat";
import store from "../../../redux/store";
import { setAllChats } from "../../../redux/userSlice";
import EmojiPicker from "emoji-picker-react";

const Chat = ({ socket }) => {
  const [data, setData] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);
  const { selectedChat, user, allChats } = useSelector(
    (state) => state.userReducer
  );
  const selectedUser = selectedChat.members.find((u) => u._id !== user._id);
  const dispatch = useDispatch();

  const sendMessage = async (image) => {
    try {
      const newMessage = {
        chatId: selectedChat._id,
        sender: user._id,
        text: message,
        image: image,
      };

      socket.emit("send-message", {
        ...newMessage,
        members: selectedChat.members.map((m) => m._id),
        read: false,
        createdAt: moment().format("YYYY-MM-DD HH:mm:ss"),
      });

      const response = await createNewMessage(newMessage);

      if (response.success) {
        setMessage("");
        setShowEmojiPicker(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formatTime = (timestamp) => {
    if (!moment(timestamp).isValid()) {
      return "Invalid date"; // Handle invalid timestamp
    }

    const now = moment();
    const time = moment(timestamp);
    const diff = now.diff(time, "days");

    if (diff < 1 && now.isSame(time, "day")) {
      return `Today ${time.format("hh:mm A")}`;
    } else if (
      diff === 1 &&
      now.clone().subtract(1, "days").isSame(time, "day")
    ) {
      return `Yesterday ${time.format("hh:mm A")}`;
    } else {
      return time.format("MMM D, hh:mm A");
    }
  };

  const getMessages = async () => {
    try {
      dispatch(showLoader());
      const response = await getAllMessages(selectedChat._id);
      dispatch(hideLoader());

      if (response.success) {
        setAllMessages(response.data);
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getMessages();
    if (selectedChat?.lastMessage?.sender !== user._id) {
      clearUnreadMessage();
    }

    socket.off("receive-message").on("receive-message", (messages) => {
      const selectedChat = store.getState().userReducer.selectedChat;
      if (selectedChat._id === messages.chatId) {
        setAllMessages((prev) => [...prev, messages]);
      }

      if (selectedChat._id === message.chatId && message.sender !== user._id) {
        clearUnreadMessage();
      }
    });

    socket.on("message-count-cleared", (data) => {
      const selectedChat = store.getState().userReducer.selectedChat;
      const allChats = store.getState().userReducer.allChats;

      if (selectedChat._id === data.chatId) {
        // Updating unread message count
        const updatedChats = allChats.map((chat) => {
          if (chat._id === data.chatId) {
            return { ...chat, unreadMessageCount: 0 };
          }
          return chat;
        });
        dispatch(setAllChats(updatedChats));

        // Updating read property in message object
        setAllMessages((prev) => {
          return prev.map((msg) => {
            return { ...msg, read: true };
          });
        });
      }
    });

    socket.on("started-typing", (data) => {
      setData(data);
      if (selectedChat._id === data.chatId && data.sender !== user._id) {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    });
  }, [selectedChat]);

  useEffect(() => {
    const msgContainer = document.getElementById("main-chat-area");
    msgContainer.scrollTop = msgContainer.scrollHeight;
  }, [allMessages, isTyping]);

  const formatName = (user) => {
    let fname =
      user.firstName.at(0).toUpperCase() +
      user.firstName.slice(1).toLowerCase();
    let lname =
      user.lastName.at(0).toUpperCase() + user.lastName.slice(1).toLowerCase();

    return fname + " " + lname;
  };

  const clearUnreadMessage = async () => {
    try {
      socket.emit("clear-unread-messages", {
        chatId: selectedChat._id,
        members: selectedChat.members.map((m) => m._id),
      });
      const response = await clearUnreadMessageCount(selectedChat._id);

      if (response.success) {
        allChats.map((chat) => {
          if (chat._id === selectedChat._id) {
            return response.data;
          }
          return chat;
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(file);
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      sendMessage(reader.result);
    };
  };

  return (
    <>
      {selectedChat && (
        <div className="app-chat-area">
          <div className="app-chat-area-header">{formatName(selectedUser)}</div>

          {/* Chat Area */}
          <div className="main-chat-area" id="main-chat-area">
            {allMessages.map((msg, i) => {
              const isCurrentUser = msg.sender === user._id;
              return (
                <div
                  key={i}
                  className="message-container"
                  style={
                    isCurrentUser
                      ? { justifyContent: "end" }
                      : { justifyContent: "start" }
                  }
                >
                  <div className="">
                    <div
                      className={
                        isCurrentUser ? "send-message" : "received-message"
                      }
                    >
                      <div className=""> {msg.text}</div>
                      <div className="">
                        {msg.image && (
                          <img
                            src={msg.image}
                            alt="image"
                            height="120"
                            width="120"
                          />
                        )}
                      </div>
                    </div>
                    <div
                      className="message-timestamp"
                      style={
                        isCurrentUser ? { float: "right" } : { float: "left" }
                      }
                    >
                      {formatTime(msg.createdAt)}{" "}
                      {isCurrentUser && msg.read && (
                        <i
                          className="fa fa-check-circle "
                          aria-hidden="true"
                          style={{ color: "red" }}
                        ></i>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {showEmojiPicker && (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  padding: "0px 20px",
                  justifyContent: "right",
                }}
              >
                <EmojiPicker
                  style={{ width: "300px", height: "400px" }}
                  onEmojiClick={(e) => {
                    setMessage(message + e.emoji);
                  }}
                ></EmojiPicker>
              </div>
            )}
            <div className="typing-indicator">
              {isTyping &&
                selectedChat?.members
                  .map((m) => m._id)
                  .includes(data?.sender) && <i>Typing...</i>}
            </div>
          </div>
          <div className="send-message-div">
            <input
              type="text"
              className="send-message-input"
              placeholder="Type a message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                socket.emit("user-typing", {
                  chatId: selectedChat._id,
                  members: selectedChat.members.map((m) => m._id),
                  sender: user._id,
                });
              }}
            />
            <label htmlFor="file">
              <i className="fa fa-picture-o send-image-btn"></i>
              <input
                type="file"
                id="file"
                className=""
                style={{ display: "none" }}
                accept="image/jpg,image/png,image/jpeg,image/gif"
                onChange={handleImage}
              />
            </label>
            <button
              className="fa fa-smile-o send-emoji-btn"
              aria-hidden="true"
              onClick={() => {
                setShowEmojiPicker(!showEmojiPicker);
              }}
            ></button>
            <button
              className="fa fa-paper-plane send-message-btn"
              aria-hidden="true"
              onClick={() => sendMessage("")}
            ></button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;

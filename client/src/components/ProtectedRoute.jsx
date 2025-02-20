/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoggedUser, getAllUsers } from "../apiCalls/user";
import { useDispatch, useSelector } from "react-redux";
import { hideLoader, showLoader } from "../redux/loaderSlice";
import { setUser, setAllUsers, setAllChats } from "../redux/userSlice";
import toast from "react-hot-toast";
import { getAllChats } from "../apiCalls/chat";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const getLoggedInUser = async () => {
    try {
      dispatch(showLoader());
      const response = await getLoggedUser();
      dispatch(hideLoader());

      if (response.success) {
        dispatch(setUser(response.data));
      } else {
        toast.error(response.message);
        navigate("/login");
      }
    } catch (error) {
      dispatch(hideLoader());
      navigate("/login");
    }
  };

  const getUsers = async () => {
    try {
      dispatch(showLoader());
      const response = await getAllUsers();
      dispatch(hideLoader());

      if (response.success) {
        dispatch(setAllUsers(response.data));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(hideLoader());
      console.log(error);
    }
  };

  const getCurrentUserChats = async () => {
    try {
      dispatch(showLoader());
      const response = await getAllChats();
      dispatch(hideLoader());

      if (response.success) {
        dispatch(setAllChats(response.data));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      navigate("/login");
      dispatch(hideLoader());
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      // Get details of current user

      getLoggedInUser();
      getUsers();
      getCurrentUserChats();
    } else {
      navigate("/login");
    }
  }, []);
  return <div>{children}</div>;
};
export default ProtectedRoute;

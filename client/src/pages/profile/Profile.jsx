import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import moment from "moment";
import { useEffect, useState } from "react";
import { uploadProfilePic } from "../../apiCalls/user";
import { showLoader, hideLoader } from "../../redux/loaderSlice";
import { setUser } from "../../redux/userSlice";

const Profile = () => {
  const { user } = useSelector((state) => state.userReducer);
  const [image, setImage] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.profilePic) {
      setImage(user.profilePic);
    }
  }, [user]);

  function getFullName() {
    let fname =
      user?.firstName.at(0).toUpperCase() +
      user?.firstName.slice(1).toLowerCase();
    let lname =
      user?.lastName.at(0).toUpperCase() +
      user?.lastName.slice(1).toLowerCase();

    return fname + " " + lname;
  }

  function getInitials() {
    let f = user?.firstName.toUpperCase()[0];
    let l = user?.lastName.toUpperCase()[0];
    return f + l;
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader(file);

    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      setImage(reader.result);
    };
  };

  const updateProfilePic = async () => {
    try {
      dispatch(showLoader());
      const response = await uploadProfilePic(image);
      dispatch(hideLoader());

      if (response.success) {
        toast.success(response.message);
        dispatch(setUser(response.data));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(hideLoader());
      toast.error(error.message);
    }
  };

  return (
    <div className="profile-page-container">
      <div className="profile-pic-container">
        {image && (
          <img
            src={image}
            alt="Profile Pic"
            className="user-profile-pic-upload"
          />
        )}
        {!image && (
          <div className="user-default-profile-avatar">{getInitials()}</div>
        )}
      </div>

      <div className="profile-info-container">
        <div className="user-profile-name">
          <h1>{getFullName()}</h1>
        </div>
        <div>
          <b>Email: </b>
          {user?.email}
        </div>
        <div>
          <b>Account Created: </b>

          {moment(user?.createdAt).format("MMM DD, YYYY")}
        </div>
        <div className="select-profile-pic-container">
          <input type="file" onChange={handleFileSelect} />
          <button onClick={updateProfilePic} className="upload-image-btn">
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};
export default Profile;

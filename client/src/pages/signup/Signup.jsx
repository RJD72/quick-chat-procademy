import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../apiCalls/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../redux/loaderSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(showLoader());
      const response = await signupUser(user);
      dispatch(hideLoader());
      if (response.success) {
        toast.success(response.message);
        navigate("/signin");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
      dispatch(hideLoader());
    }
  };

  return (
    <div className="container">
      <div className="container-back-img"></div>
      <div className="container-back-color"></div>
      <div className="card">
        <div className="card-tile">
          <h1>Create Account</h1>
        </div>
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="column">
              <input
                type="text"
                placeholder="First Name"
                id="firstName"
                value={user.firstName}
                onChange={handleChange}
              />
              <input
                type="text"
                placeholder="Last Name"
                id="lastName"
                value={user.lastName}
                onChange={handleChange}
              />
            </div>
            <input
              type="email"
              name=""
              id="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
            />
            <input
              type="password"
              name=""
              id="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
            />
            <button>Sign Up</button>
          </form>
        </div>
        <div className="card-terms">
          <span>
            Already have an account?
            <Link to={"/login"}>Login Here</Link>
          </span>
        </div>
      </div>
    </div>
  );
};
export default Signup;

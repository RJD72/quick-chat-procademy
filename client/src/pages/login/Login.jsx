import { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../../apiCalls/auth";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../redux/loaderSlice";

const Login = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setUser((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(showLoader());
      const response = await loginUser(user);
      dispatch(hideLoader());
      if (response.success) {
        toast.success(response.message);
        localStorage.setItem("token", response.token);
        window.location.href = "/";
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
        <div className="card-title">
          <h1>Login Here</h1>
        </div>
        <div className="form">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={user.email}
              onChange={handleChange}
            />
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
            />
            <button>Login</button>
          </form>
        </div>
        <div className="card-terms">
          <span>
            Don&#39;t have an account yet?
            <Link to={"/signup"}>Signup here</Link>
          </span>
        </div>
      </div>
    </div>
  );
};
export default Login;

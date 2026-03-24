import jwtDecode from "jwt-decode";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);

    if (decoded.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  }, []);

  return null;
};

export default LoginSuccess;

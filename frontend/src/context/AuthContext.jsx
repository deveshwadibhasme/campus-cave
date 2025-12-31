import axios from "axios";
import { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import getURL from "../utils/get-url";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [token, setToken] = useState(null);
  const [isLogIn, setIsLogIn] = useState(null);

  const fetchData = async (role, logInToken) => {
    try {
      const currentToken = logInToken || token;
      if (!currentToken || !role) return;

      const response = await axios.get(getURL(`/user/${role}-data`), {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      setData(response.data.result);
    } catch (error) {
      console.error("Error fetching user data:", error);
      if (error.response?.status === 401) {
        logOut();
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const tokenCookie = await cookieStore.get("token");
      const dataCookie = await cookieStore.get("data");

      if (tokenCookie?.value && dataCookie?.value) {
        const parsedData = JSON.parse(dataCookie.value);
        setToken(tokenCookie.value);
        setData(parsedData);
        setIsLogIn(true);
        fetchData(parsedData.role, tokenCookie.value); 
        if (parsedData.role === "student") navigate("/student");
        else if (parsedData.role === "alumni") navigate("/alumni");
      } else {
        setIsLogIn(false);
      }
    };
    loadData();
  }, []);

  const logIn = async (data) => {
    await cookieStore.set({
      name: "token",
      value: data.token,
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
    await cookieStore.set({
      name: "data",
      value: JSON.stringify(data),
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });
    setToken(data.token);
    setIsLogIn(true);
    fetchData(data.role, data.token); 
    if (data.role == "student") navigate("/student");
    else if (data.role == "alumni") navigate("/alumni");
    // else navigate("/");
  };

  const logOut = () => {
    setToken(null);
    setData(null);
    cookieStore.delete("token");
    cookieStore.delete("data");
    navigate("/login");
    setIsLogIn(false);
  };

  const value = { data, token, logIn, logOut, isLogIn };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

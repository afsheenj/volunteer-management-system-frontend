import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleRedirect = (role) => {
  if (["USER", "VOLUNTEER", "BOTH","ORGANIZATION_MEMBER"].includes(role)) {
    navigate("/user/dashboard"); // same dashboard for all three roles
  } else if (role === "ADMIN") {
    navigate("/admin/dashboard");
  } else if (role === "ORGANIZATION_MEMBER") {
    navigate("/user/dashboard");
  } else {
    navigate("/organization/dashboard"); // fallback for org
  }
};

  const login = (token) => {

    console.log("Toke,token",token);

    if (!token || !token.includes(".")) {
      console.warn("Invalid token received:", token);
      return; // stop execution
    }

    try {
      localStorage.setItem("token", token);

      const decode = jwtDecode(token);

      

      const accountType = decode?.accountType || null;
      const role = decode?.roles?.[0]?.replace("ROLE_", "") || null;
      const userId = decode?.userId || null;
      const orgId = decode?.orgId || null;

      setUser({
        accountType,
        role,
        userId,
        orgId
      });

      handleRedirect(role);

    } catch (err) {
      console.error("JWT decode failed", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token || !token.includes(".")) {
      setLoading(false)
      return; // allow public pages
    }

    try {
      const decode = jwtDecode(token);

      if(decode?.exp * 1000 < Date.now()){
        logout();
      }

      const accountType = decode?.accountType || null;
      const role = decode?.roles?.[0]?.replace("ROLE_", "") || null;
      const userId = decode?.userId || null;
      const orgId = decode?.orgId || null;

      setUser({
        accountType,
        role,
        userId,
        orgId
      });
  

    } catch (err) {
      console.error("Invalid stored token");
      localStorage.removeItem("token");
    }
    finally{
      setLoading(false)
    }

  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthContext.jsx
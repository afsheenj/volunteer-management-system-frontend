import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { APP_CONFIG } from "../config/config";  
import api from "../services/api";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { showError } from "../utils/alertservice";

const API_BASE = APP_CONFIG.BASE_URL;

export default function Login() {
  const navigate = useNavigate();
  const {login} = useContext(AuthContext)

  const [loginType, setLoginType] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const newErrors = {};

    if (!loginType)
      newErrors.loginType = "Please select login type";

    if (!form.username.trim())
      newErrors.username = "Email required";

    if (!form.password)
      newErrors.password = "Password required";

    if (form.password && form.password.length < 6)
      newErrors.password = "Minimum 6 characters required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setErrorMsg("");

    if (!validate()) {
  showError("Validation Error", "Please fill all required fields correctly");
  return;
}

    try {
      setLoading(true);

      let endpoint = "";
  
        if (loginType === "Organization") {
         const res = await api.post("/auth/organization/login",form);
         if (!res?.token) {
  throw new Error("Invalid credentials");
}
          login(res?.token);
          

      } else {
        const res = await api.post("/auth/user/login", form);
        if (!res?.token) {
  throw new Error("Invalid credentials");
}
         
        const token = res?.token;
        login(token);
      }

    } catch (err) {
  const message = err?.response?.data?.message || err.message || "Login failed";
  setErrorMsg(message); 
  showError("Login Failed", message); 
}
   finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100 px-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-[#1e40af] via-[#3b82f6] to-[#d624e7] text-white gap-4">
          <h1 className="text-5xl font-bold" style={{ fontFamily: "Orbitron" }}>
            V-Serve
          </h1>
          <p className="text-xl opacity-90">
            Welcome back, Changemaker.
          </p>
          <p className="text-sm opacity-80 leading-relaxed">
            Continue volunteering, requesting help, and making impact.
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-8 md:p-10 flex flex-col justify-center">

          <h2 className="text-2xl font-bold text-[#1e40af] mb-4">
            Login to Account
          </h2>

          {errorMsg && (
            <div className="mb-4 text-red-500 text-sm">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="text-slate-600 font-semibold">

            {/* LOGIN TYPE */}
            <div className="mb-4">
              <label>
                Choose Login Type <span className="text-red-500">*</span>
              </label>

              <select
                value={loginType}
                onChange={(e) => setLoginType(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300"
              >
                <option value="">Select role</option>
                <option value="Volunteer">Volunteer</option>
                <option value="User">User</option>
                <option value="Organization">Organization</option>
              </select>

              {errors.loginType && (
                <p className="text-sm text-red-500">{errors.loginType}</p>
              )}
            </div>

            {/* USERNAME */}
            <div className="mb-4">
              <label>
                Email <span className="text-red-500">*</span>
              </label>

              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full px-4 py-3 rounded-lg border border-slate-300"
              />

              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="mb-2">
              <label>
                Password <span className="text-red-500">*</span>
              </label>

              <div className="relative">

                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPass ? <EyeOff size={20}/> : <Eye size={20}/>}
                </button>

              </div>

              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* LOGIN BUTTON */}
            <div className="pt-6">
              <button
                disabled={loading}
                type="submit"
                className="w-full py-3 rounded-lg bg-[#1e40af] text-white font-semibold hover:bg-[#1e3a8a]"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

          </form>

          {/* LINKS */}
          <div className="flex flex-col items-center gap-2 mt-4 text-sm">

            <Link
              to="/forgot-password"
              className="text-[#1e40af] font-semibold hover:underline"
            >
              Forgot password?
            </Link>

            <span>
              Don’t have an account?{" "}
              <Link to="/register" className="text-[#1e40af] font-semibold">
                Register
              </Link>
            </span>

          </div>

        </div>
      </div>
    </div>
  );
}


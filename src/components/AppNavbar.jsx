import { Bell, User } from "lucide-react";
import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo1-r1.png";
import { showLogoutConfirm } from "../utils/alertservice";
import { useLocation } from "react-router-dom";

const AppNavbar = () => {
  const [open, setOpen] = useState(false); ``
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDashboardRoute = () => {
    if (!user) return "/home";
    if (["USER", "VOLUNTEER", "BOTH","ORGANIZATION_MEMBER"].includes(user.role)) return "/user/dashboard";
    if (user.role === "ADMIN") return "/admin/dashboard";
    // if (user.role === "ORGANIZATION_MEMBER") return "/organization-member/dashboard";
    return "/organization/dashboard";
  };

const getHistory = () => {
  if (["USER", "VOLUNTEER", "BOTH","ORGANIZATION_MEMBER"].includes(user?.role)) return "/history";
  if (user?.role === "ORGANIZATION") return "/organization/history";
  return "/login";
};

const handleLogout = async () => {
  const confirmed = await showLogoutConfirm();
  if (confirmed) {
    logout();
    setProfileOpen(false); // Close dropdown if open
    setOpen(false);        // Close mobile menu if open
    navigate("/login");
  }
};

const handleLogoClick = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
    return;
  }

  if (["USER", "VOLUNTEER", "BOTH", "ORGANIZATION_MEMBER"].includes(user?.role)) {
    navigate("/user/dashboard");
  } else if (user?.role === "ORGANIZATION") {
    navigate("/organization/dashboard");
  } else {
    navigate("/");
  }
};

const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50">
      <div className="max-w-screen mx-auto h-full flex items-center justify-between px-4 md:px-8">


        {/* LOGO */}
<div 
  className="flex items-center gap-2 cursor-pointer"
  onClick={handleLogoClick}
>
  <img src={logo} alt="V-Serve Logo" className="h-11.25" />
  <span
    className="text-2xl font-bold text-[#1e40af]"
    style={{ fontFamily: "Orbitron" }}
  >
    V-Serve
  </span>
</div>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-10 font-semibold text-slate-600">
          <Link to={getDashboardRoute()} className={`relative group px-1 py-1 transition-colors duration-200 ${
    isActive(getDashboardRoute())
      ? "text-[#1e40af]"
      : "text-slate-600 hover:text-[#1e40af]"
  }`}
  >Home
  
    <span
    className={`absolute left-0 -bottom-1 h-[2px] bg-[#1e40af] transition-all duration-300 ${
      isActive(getDashboardRoute())
        ? "w-full"
        : "w-0"
    }`}
  />
  
  </Link>
          <Link to="/posts" className={`relative group px-1 py-1 transition-colors duration-200 ${
    isActive("/posts")
      ? "text-[#1e40af]"
      : "text-slate-600 hover:text-[#1e40af]"
  }`}>Posts
  
    <span
    className={`absolute left-0 -bottom-1 h-[2px] bg-[#1e40af] transition-all duration-300 ${
      isActive("/posts")
        ? "w-full"
        : "w-0"
    }`}
  />
  </Link>
          <Link to={getHistory()} className={`relative group px-1 py-1 transition-colors duration-200 ${
    isActive(getHistory())
      ? "text-[#1e40af]"
      : "text-slate-600 hover:text-[#1e40af]"
  }`}
  >History
  
    <span
    className={`absolute left-0 -bottom-1 h-[2px] bg-[#1e40af] transition-all duration-300 ${
      isActive(getHistory())
        ? "w-full"
        : "w-0"
    }`}
  />
  </Link>
          <Link to="/organizations" className={`relative group px-1 py-1 transition-colors duration-200 ${
    isActive("/organizations")
      ? "text-[#1e40af]"
      : "text-slate-600 hover:text-[#1e40af]"
  }`}
  >Organization
  
    <span
    className={`absolute left-0 -bottom-1 h-[2px] bg-[#1e40af] transition-all duration-300 ${
      isActive("/organizations")
        ? "w-full"
        : "w-0"
    }`}
  />
  </Link>
          <Link to="/categories" className={`relative group px-1 py-1 transition-colors duration-200 ${
    isActive("/categories")
      ? "text-[#1e40af]"
      : "text-slate-600 hover:text-[#1e40af]"
  }`}
  >Categories
  
    <span
    className={`absolute left-0 -bottom-1 h-[2px] bg-[#1e40af] transition-all duration-300 ${
      isActive("/categories")
        ? "w-full"
        : "w-0"
    }`}
  />
  </Link>
        </div>

        {/* RIGHT ICONS */}
        <div className="flex items-center gap-5 relative">
          <div className="hidden md:flex items-center gap-5 relative">
            

            {/* PROFILE ICON WITH DROPDOWN */}
            {user ? (
              <div ref={profileRef} className="relative">
                <div
                  className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-300 transition"
                  onClick={() => setProfileOpen(!profileOpen)}
                >


                  <User className="text-slate-600" size={18} />
                </div>

                {/* DROPDOWN */}
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 flex flex-col">
                    <button
                      onClick={() => {
                        // All three roles go to same UserProfile page
                        if (["USER", "VOLUNTEER", "BOTH","ORGANIZATION_MEMBER"].includes(user.role)) {
                          navigate("/user/profile");
                        } else if (user.role === "ADMIN") {
                          navigate("/admin/profile");
                        } else {
                          navigate("/organization/profile");
                        }
                        setProfileOpen(false);
                      }}
                      className="px-4 py-2 text-left hover:bg-gray-100 transition"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-left hover:bg-gray-100 transition text-red-600 font-medium"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-sm font-bold text-[#1e40af] hover:underline">
                Login
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-slate-600"
            onClick={() => setOpen(!open)}
          >
            {/* {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#1e40af"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#1e40af"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
            )} */}
            {open ? (
              <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#1e40af"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#1e40af"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" /></svg>
            )}
          </button>

        </div>


        {/* MOBILE MENU DROPDOWN - ADDED THIS SECTION */}
        {open && (
          <div className="md:hidden absolute top-16 items-center left-0 right-0 bg-white border-b border-slate-200 shadow-lg flex flex-col p-4 gap-4 font-semibold text-slate-600 animate-in slide-in-from-top duration-300">
            <Link to={getDashboardRoute()} onClick={() => setOpen(false)} className="hover:text-[#1e40af]">Home</Link>
            <Link to="/posts" onClick={() => setOpen(false)} className="hover:text-[#1e40af]">Posts</Link>
            <Link to={getHistory()} onClick={() => setOpen(false)} className="hover:text-[#1e40af]">History</Link>
            <Link to="/organizations" onClick={() => setOpen(false)} className="hover:text-[#1e40af]">Organization</Link>
            <Link to="/categories" onClick={() => setOpen(false)} className="hover:text-[#1e40af]">Categories</Link>
            <hr className="border-slate-100" />
            <div className="flex items-center gap-2 justify-between">
              <span onClick={() => {
               if (user && (user.role === "USER" || user.role === "VOLUNTEER" || user.role === "BOTH" || user.role === "ORGANIZATION_MEMBER"))
                  navigate("/user/profile");
                else
                  navigate("/organization/profile");
              }
              } className="text-[#1e40af]">Profile</span>
              <button onClick={handleLogout} className="text-red-500">Logout</button>
            </div>
          </div>
        )}

      </div>


    </div>
  );
};

export default AppNavbar;
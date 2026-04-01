import { User } from "lucide-react";
import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo1-r1.png";
import { Menu } from "lucide-react";
import { showLogoutConfirm } from "../utils/alertservice";

const AdminNavbar = ({ toggleSidebar }) => {

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setProfileOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50">

      <div className="h-full flex items-center justify-between px-4 sm:px-6 lg:px-10 max-w-[1600px] mx-auto">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-4 md:gap-10">
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            <Menu size={22} />
          </button>
        <div className="flex gap-2 sm:gap-3 items-center">
          <img src={logo} alt="V-Serve Logo" className="h-8 sm:h-9 md:h-10" />

          <span
            className="text-lg sm:text-xl font-bold text-[#1e40af]"
            style={{ fontFamily: "Orbitron" }}
          >
            V-Serve
          </span>
        </div>
          <span className="hidden md:block text-lg text-slate-500 ml-4 font-medium">
            Administrator
          </span>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3 sm:gap-4">

          <div ref={profileRef} className="relative">

  <div
    onClick={() => setProfileOpen(!profileOpen)}
    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-300 transition"
  >
    <User size={18} />
  </div>

  {profileOpen && (
    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 flex flex-col overflow-hidden">

      <button
        onClick={() => {
          navigate("/admin/profile");
          setProfileOpen(false);
        }}
        className="px-4 py-2 text-left hover:bg-gray-100 transition"
      >
        View Profile
      </button>

      <button
       onClick={async () => {
  const confirmed = await showLogoutConfirm();
  if (confirmed) {
    logout();
  }
}}
        className="px-4 py-2 text-left hover:bg-gray-100 transition"
      >
        Logout
      </button>

    </div>
  )}

</div>

        </div>

      </div>

    </div>
  );
};

export default AdminNavbar;
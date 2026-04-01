import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, PenTool, Building2, ClipboardList, Calendar } from "lucide-react";

const FloatingMenu = ({ role }) => {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  // USER
  let menuItems = [];

if (role === "USER") {
  menuItems = [
    {
      label: "Create Request",
      icon: <PenTool size={20} />,
      path: "/user/create-request",
    },
    {
      label: "My Requests",
      icon: <ClipboardList size={20} />,
      path: "/user/my-requests",
    },
  ];
} 
else if (role === "VOLUNTEER" || role === "ORGANIZATION_MEMBER") {
  menuItems = [
    {
      label: "Explore Service Requests",
      icon: <Building2 size={20} />,
      path: "/posts",
    },
    {
      label: "My Activity",
      icon: <ClipboardList size={20} />,
      path: "/user/my-activity",
    },
  ];
} 
else if (role === "BOTH") {
  menuItems = [
    {
      label: "Create Request",
      icon: <PenTool size={20} />,
      path: "/user/create-request",
    },
    {
      label: "Explore Service Requests",
      icon: <Building2 size={20} />,
      path: "/posts",
    },
    {
      label: "My Activity",
      icon: <ClipboardList size={20} />,
      path: "/user/my-activity",
    },
    {
      label: "My Requests",
      icon: <ClipboardList size={20} />,
      path: "/user/my-requests",
    },
  ];
}
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">

      {menuItems.map((item, index) => (
        <button
          key={index}
          onClick={() => navigate(item.path)}
          className={`fab-option ${open ? "show" : ""}`}
          style={{ transitionDelay: `${index * 0.1}s` }}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}

      {/* MAIN BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className={`fab-main ${open ? "rotate" : ""}`}
      >
        <Plus size={28} />
      </button>

    </div>
  );
};

export default FloatingMenu;
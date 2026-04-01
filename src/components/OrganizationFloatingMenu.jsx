import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, Building2, PenTool, Users } from "lucide-react";

const OrganizationFloatingMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4 pointer-events-none">

      {/* OPTION 1 */}
      <button
        onClick={() => navigate("/organization/create-request")}
        className={`fab-option pointer-events-auto ${open ? "show" : ""}`}
        style={{ transitionDelay: "0.1s" }}
      >
        {/* <PenTool size={20} /> */}
        <span>Create New Request</span>
      </button>

      {/* OPTION 2 */}

      <button
        onClick={() => navigate("/organization/my-requests")}
        className={`fab-option pointer-events-auto ${open ? "show" : ""}`}
        style={{ transitionDelay: "0.3s" }}
      >
        {/* <Building2 size={20} /> */}
        <span>My Requests</span>
      </button>

      <button
        onClick={() => navigate("/organization/my-activities")}
        className={`fab-option pointer-events-auto ${open ? "show" : ""}`}
        style={{ transitionDelay: "0.3s" }}
      >
        {/* <Building2 size={20} /> */}
        <span>My Activities</span>
      </button>
      
      <button
        onClick={() => navigate("/organization/add-members")}
        className={`fab-option pointer-events-auto ${open ? "show" : ""}`}
        style={{ transitionDelay: "0.3s" }}
      >
        {/* <Building2 size={20} /> */}
        <span>Add Members</span>
      </button>

      <button
        onClick={() => navigate("/organization/manage-members")}
        className={`fab-option pointer-events-auto ${open ? "show" : ""}`}
        style={{ transitionDelay: "0.3s" }}
      >
        {/* <Building2 size={20} /> */}
        <span>Manage Members</span>
      </button>

      {/* MAIN FAB */}
      <button
        onClick={() => setOpen(!open)}
        className={`fab-main pointer-events-auto ${open ? "rotate" : ""}`}
      >
        <Plus size={28} />
      </button>

    </div>
  );
};

export default OrganizationFloatingMenu;

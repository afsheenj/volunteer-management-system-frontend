import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, Building2, PenTool,ShieldCheck , Users, ScanSearch} from "lucide-react";

const AdminFloatingMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-4">

      {/* OPTION 1 */}
      <button
        onClick={() => navigate("/admin/document-verification")}
        className={`fab-option ${open ? "show" : ""}`}
        style={{ transitionDelay: "0.1s" }}
      >
        <ShieldCheck  size={20}/>
        <span>Document Verification</span>
      </button>

      {/* OPTION 2 */}
      <button
        onClick={() => navigate("/users")}
        className={`fab-option ${open ? "show" : ""}`}
        style={{ transitionDelay: "0.3s" }}
      >
        <Users size={20} />
        <span>Manage All Users</span>
      </button>

      <button
        onClick={() => navigate("/organization")}
        className={`fab-option ${open ? "show" : ""}`}
        style={{ transitionDelay: "0.3s" }}
      >
        <Building2 size={20} />
        <span>Manage All Organizations</span>
      </button>

      {/* MAIN FAB */}
      <button
        onClick={() => setOpen(!open)}
        className={`fab-main ${open ? "rotate" : ""}`}
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default AdminFloatingMenu;

import { Link } from "react-router-dom";

const AdminSidebar = ({ sidebarOpen }) => {
  return (
<div
className={`fixed top-16 left-0 w-[17.5rem] h-[calc(100vh-4rem)] 
  bg-white border-r border-slate-200 px-8 py-5 z-40
  transform transition-transform duration-300 ease-in-out
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
  md:translate-x-0`}
>

      <div className="flex flex-col gap-3 text-sm md:text-base font-medium text-slate-600">

        <Link to="/admin/dashboard" className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition">
          Dashboard
        </Link>

        <Link to="/admin/users" className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition">
          Users
        </Link>

        <Link to="/admin/organizations" className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition">
          Organizations
        </Link>

        <Link to="/admin/requests"className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition">
          Service Requests
        </Link>

        <Link to="/admin/document-verification" className="px-3 py-2 rounded-lg hover:bg-slate-100 hover:text-blue-600 transition">
          Document Verification
        </Link>

      </div>

    </div>
  );
};

export default AdminSidebar;
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import { Users, Building2, FileText, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardData } from "../services/adminService";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminDashboard = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading,setLoading] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    try {
            setLoading(true);
      const res = await getDashboardData();
      console.log(res);
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
    finally{
      setLoading(false);
    }
  };

  fetchData();
}, []);

// if(loading) return <LoadingSpinner/>

const toggleSidebar = () => {
  setSidebarOpen(!sidebarOpen);
};
  return (
  <div className="min-h-screen bg-slate-100">
    
    <AdminNavbar toggleSidebar={toggleSidebar} />

    {sidebarOpen && (
      <div
        className="fixed inset-0 bg-black/30 z-30 md:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    <AdminSidebar sidebarOpen={sidebarOpen} />
    {/* PAGE CONTENT */}
   <div className="flex-1 flex flex-col gap-4 pt-20 p-6 md:pl-[20rem] transition-all duration-300 w-full">
        {loading ? (
        <div className="flex justify-center items-center ">
          <LoadingSpinner />
        </div>
      ) :(
      <div className="flex flex-col gap-4">
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-800">
          Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500">
          Overview of platform activity and management tools
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-500">Total Users</p>
            <h2 className="text-2xl font-bold text-slate-800">{data?.totalUsers}</h2>
          </div>
          <Users size={28} className="text-blue-600" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-500">Total Organizations</p>
            <h2 className="text-2xl font-bold text-slate-800">{data?.totalOrganizations}</h2>
          </div>
          <Building2 size={28} className="text-green-600" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-500">Service Requests</p>
            <h2 className="text-2xl font-bold text-slate-800">{data?.totalRequests}</h2>
          </div>
          <FileText size={28} className="text-purple-600" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-slate-500">Pending Verifications</p>
            <h2 className="text-2xl font-bold text-slate-800">{data?.pendingVerifications}</h2>
          </div>
          <ShieldCheck size={28} className="text-red-500" />
        </div>

      </div>

      {/* GRID SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">

        {/* RECENT USERS */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-2">

          <div className="flex justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-800">
              Recent Users
            </h2>
            <a href="/admin/users" className="text-sm text-blue-600">
              View All
            </a>
          </div>

          <div className="space-y-3 text-sm flex flex-col gap-2">

            {data?.recentUsers?.map((user, i) => (
              <div key={i} className="flex justify-between">
                <span>{user.username}</span>
                <span>{user.role}</span>
              </div>
            ))}

          </div>

        </div>


        {/* ORGANIZATIONS */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-2">

          <div className="flex justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-800">
              Recent Organizations
            </h2>
            <a href="/admin/organizations" className="text-sm text-blue-600">
              View All
            </a>
          </div>

          <div className="space-y-3 text-sm flex flex-col gap-2">

            {data?.recentOrganizations?.map((org, i) => (
              <div key={i} className="flex justify-between">
                <span>{org.orgName}</span>
              </div>
            ))}
          </div>

        </div>


        {/* DOCUMENT ALERT */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col gap-2">

          <div className="flex justify-between mb-5">
            <h2 className="text-lg font-semibold text-slate-800">
              Document Verification
            </h2>
            <a
              href="/admin/document-verification"
              className="text-sm text-blue-600"
            >
              View All
            </a>
          </div>

          <div className="space-y-3 text-sm d flex flex-col gap-2">
            {data?.documentSubmit?.map((doc, i) => (
              <div key={i} className="border border-slate-200 rounded-lg p-3 flex justify-between">
                
                <span>
                  {doc.user.username} - {doc.documentType}
                </span>

                <span
                  className={`text-xs px-2 py-1 rounded ${
                    doc.documentStatus === "APPROVED"
                      ? "bg-green-100 text-green-700"
                      : doc.documentStatus === "REJECTED"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {doc.documentStatus}
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>
      {/* SERVICE REQUEST TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mt-8 flex flex-col gap-3">

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-800">
            Recent Service Requests
          </h2>

          <a
            href="/admin/requests"
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            View All
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead>
              <tr className="text-left text-slate-500 border-b border-slate-200">
                <th className="pb-3">Request</th>
                <th className="pb-3">Posted By</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
      <tbody className="text-slate-700">
        {data?.recentRequests?.map((req, i) => (
          <tr key={i} className="border-b border-slate-100">

            {/* TITLE */}
            <td className="py-3">{req.title}</td>

            {/* WHO POSTED */}
            <td>
              {req.organization
                ? req.organization.orgName
                : req.requestedBy?.username}
            </td>

            {/* LOCATION */}
            <td>{req.city}, {req.state}</td>

            {/* STATUS */}
            <td>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  req.status === "OPEN"
                    ? "bg-green-100 text-green-700"
                    : req.status === "COMPLETED"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {req.status}
              </span>
            </td>

          </tr>
        ))}
      </tbody>

          </table>
        </div>

      </div>
      </div>
      )}
    </div>
      
  </div>
);
};

export default AdminDashboard;
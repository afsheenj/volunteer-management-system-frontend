import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminViewUsers = () => {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [filters, setFilters] = useState({
    username: "",
    role: "",
    availability: ""
  });

 
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/users", {
        params: {
          page,
          size: 10,
          username: filters.username || null,
          role: filters.role || null,
          availability:
            filters.availability === ""
              ? null
              : filters.availability === "true"
        }
      });

      console.log("Users",res);

      setUsers(res.data.content);
      setTotalPages(res.data.totalPages);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, filters]);

  return (
    <div>
      <AdminNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <AdminSidebar sidebarOpen={sidebarOpen} />

      <div className="ml-0 md:pl-[20rem] pt-20 px-4 md:px-8">

       
        <h1 className="text-2xl font-bold mb-6 text-slate-800">
          Manage Users
        </h1>

       
        <div className="bg-white p-2 md:p-5 rounded-xl border-0  mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Search username..."
            className="border p-2 rounded-lg"
            value={filters.username}
            onChange={(e) =>
              setFilters({ ...filters, username: e.target.value })
            }
          />

          <select
            className="border p-2 rounded-lg"
            value={filters.role}
            onChange={(e) =>
              setFilters({ ...filters, role: e.target.value })
            }
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="VOLUNTEER">Volunteer</option>
            <option value="BOTH">Both</option>
            <option value="ORGANIZATION_MEMBER">Organization Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="flex flex-col gap-4">
     
                {loading ? (
            <LoadingSpinner />
            ) : users.length === 0 ? (
            <p className="p-6 text-center text-slate-500">
                No users found
            </p>
            ) : (
            <>
                {/* DESKTOP TABLE (md and above) */}
                <div className="hidden md:block">
<div className="hidden md:block">

  {/* TABLE HEADER */}
  <div className="grid grid-cols-6 p-4 text-sm font-semibold text-slate-600 border-b bg-slate-100 rounded-t-lg">
    <p>Username</p>
    <p>Email</p>
    <p>Role</p>
    <p>Status</p>
    <p>Availability</p>
    <p className="text-center">Action</p>
  </div>

  {/* TABLE ROWS */}
  {users.map((u) => (
    <div
      key={u.id}
      className="grid grid-cols-6 p-4 text-sm border-b hover:bg-slate-50 items-center"
    >
      <p>{u.username}</p>
      <p className="truncate">{u.email}</p>
      <p>{u.role}</p>
      <p>{u.status}</p>

      <p>
        <span
          className={`px-2 py-1 rounded-full text-xs 
          ${
            u.availability
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {u.availability ? "Available" : "Not Available"}
        </span>
      </p>

      <div className="flex justify-center">
        <button
          onClick={() => navigate(`/profile/${u.username}`)}
          className="text-blue-600 hover:underline text-sm"
        >
          View
        </button>
      </div>
    </div>
  ))}
</div>
                </div>

                {/* MOBILE / TABLET CARD VIEW */}
                <div className="md:hidden space-y-4 p-3 flex flex-col gap-4">
                {users.map((u) => (
                    <div
                    key={u.id}
                    className="bg-white rounded-xl shadow-sm border p-4 space-y-2"
                    >
                    <div className="flex justify-between">
                        <h2 className="font-semibold text-slate-800">
                        {u.username}
                        </h2>
                        <span className="text-xs text-slate-500">{u.role}</span>
                    </div>

                    <p className="text-sm text-slate-600 break-all">
                        {u.email}
                    </p>

                    <div className="flex justify-between text-sm">
                        <p>
                        <span className="font-medium">Status:</span> {u.status}
                        </p>

                        <span
                        className={`px-2 py-1 rounded-full text-xs 
                        ${
                            u.availability
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                        >
                        {u.availability ? "Available" : "Not Available"}
                        </span>
                    </div>

                    <div className="pt-2 flex justify-end">
                        <button
                        onClick={() => navigate(`/profile/${u.username}`)}
                        className="text-blue-600 text-sm font-medium"
                        >
                        View Details →
                        </button>
                    </div>
                    </div>
                ))}
                </div>
            </>
            )}
            <div className="flex justify-end items-center gap-3 mt-6">

              <button
                disabled={page === 0}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                Prev
              </button>

              <span className="text-sm text-white bg-[#1e40af] rounded-xs pl-3 pr-3 pt-1 pb-1"  >
                 {page + 1}
              </span>

              <button
                disabled={page === totalPages - 1}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-3 py-1 border rounded-lg disabled:opacity-50"
              >
                Next
              </button>
</div>
            </div>
      </div>
    </div>
  );
};

export default AdminViewUsers;
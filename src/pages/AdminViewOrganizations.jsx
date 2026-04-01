import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import Spinner from "../components/LoadingSpinner";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AdminViewOrganizations = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const navigate = useNavigate();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);

      const res = await api.get("/public/organizations/list", {
        params: {
          page,
          size: 10,
          sortBy,
          order,
          search,
          status:statusFilter
        }
      });
      console.log(res);

      setOrganizations(res.data.content);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, [page, search, sortBy, order,statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/organizations/${id}/status`, null, {
        params: { status }
      });

      fetchOrganizations();
    } catch (err) {
      console.error(err);
    }
  };

  // const deleteOrg = async (id) => {
  //   try {
  //     await api.delete(`/admin/organizations/${id}`);
  //     fetchOrganizations();
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

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

      <div className="flex flex-col gap-4 pt-20 p-6 md:pl-[20rem] w-full">

        <h1 className="text-2xl font-bold text-slate-800">
          Manage Organizations
        </h1>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3">

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          />

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            className="border px-3 py-2 rounded-lg text-sm"
          >
            <option value="desc">Latest</option>
            <option value="asc">Oldest</option>
          </select>

          <select
  value={statusFilter}
  onChange={(e) => {
    setStatusFilter(e.target.value);
    setPage(0); // reset page
  }}
  className="border px-3 py-2 rounded-lg text-sm"
>
  <option value="">All Status</option>
  <option value="PENDING_VERIFICATION">Pending</option>
  <option value="ACTIVE">Active</option>
  <option value="INACTIVE">Inactive</option>
  <option value="LOCKED">Locked</option>
</select>

        </div>

        {/* TABLE */}
        <div className="bg-white border-0 rounded-xl p-6 shadow-sm">

          {loading ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : (
            <div className="overflow-x-auto">
                {/* DESKTOP TABLE */}
<div className="hidden md:block">

  
              <table className="w-full text-sm">

                <thead>
                  <tr className="border-0 text-left text-slate-500">
                    <th className="pb-3">Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Members</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody className="text-slate-700 flex-col items-center">

                  {organizations.map((org) => (
                    <tr key={org.id} className="border-b items-center">

                      <td className="py-3">{org.organizationName}</td>
                      <td>{org.email}</td>
                      <td>{org.phone}</td>

                      <td>
                        <select
                          value={org.status}
                          onChange={(e) =>
                            updateStatus(org.id, e.target.value)
                          }
                          className="border rounded px-2 py-1 text-xs"
                        >
                          <option value="PENDING_VERIFICATION">Pending</option>
                          <option value="ACTIVE">Active</option>
                          <option value="INACTIVE">Inactive</option>
                          <option value="LOCKED">Locked</option>
                        </select>
                      </td>

                      <td>{org.totalMembers}</td>

                      <td className="flex items-center gap-2 py-2">

                        <button
                          onClick={() =>
                            navigate(`/profile/${org.organizationName}`)
                          }
                          className="text-blue-600 text-xs"
                        >
                          View
                        </button>

                        {/* <button
                          onClick={() => deleteOrg(org.id)}
                          className="text-red-600 text-xs"
                        >
                          Delete
                        </button> */}

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>
</div>

{/* MOBILE CARD VIEW */}
<div className="md:hidden flex flex-col gap-4">
  {organizations.map((org) => (
    <div key={org.id} className="bg-white p-4 flex flex-col gap-2 rounded-xl shadow-sm border-0">

      <div className="flex justify-between items-center">
        <h2 className="font-semibold">{org.organizationName}</h2>
        <span className="text-xs">{org.status}</span>
      </div>

      <p className="text-sm text-slate-500">{org.email}</p>
      <p className="text-sm text-slate-500">{org.phone}</p>

      <div className="flex justify-between items-center mt-3">

        <select
          value={org.status}
          onChange={(e) => updateStatus(org.id, e.target.value)}
          className="border px-2 py-1 text-xs rounded"
        >
          <option value="PENDING_VERIFICATION">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="LOCKED">Locked</option>
        </select>

        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/public/${org.organizationName}`)}
            className="text-blue-600 text-xs"
          >
            View
          </button>
{/* 
          <button
            onClick={() => deleteOrg(org.id)}
            className="text-red-600 text-xs"
          >
            Delete
          </button> */}
        </div>

      </div>

    </div>
  ))}
</div>


            </div>
          )}

        </div>

        {/* PAGINATION */}
        <div className="flex justify-end  items-center gap-2 text-sm">

          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
            className="p-2 border rounded-lg"
          >
            Prev
          </button>

          <span>{page + 1}</span>

          <button
            onClick={() => setPage((prev) => prev + 1)}
            className="p-2 border rounded-lg"
          >
            Next
          </button>

        </div>

      </div>

    </div>
  );
};

export default AdminViewOrganizations;
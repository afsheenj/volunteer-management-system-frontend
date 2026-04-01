import { useEffect, useState } from "react";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const AdminViewRequests = () => {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
   const [sidebarOpen, setSidebarOpen] = useState(false);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [category, setCategory] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [city, setCity] = useState("");
  const [order, setOrder] = useState("desc");

  const navigate = useNavigate();

 
  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await api.get("/admin/all-requests", {
        params: {
          page,
          size: 9,
          category,
          state: stateFilter,
          city,
          sortBy: "createdAt",
          order
        }
      });
      console.log("Response",res)
      setRequests(res.content);
      setTotalPages(res.totalPages);

    } catch (err) {
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  //  Trigger on filter change
  useEffect(() => {
    fetchRequests();
  }, [page, category, stateFilter, city, order]);

  //  Reset filters
  const resetFilters = () => {
    setCategory("");
    setStateFilter("");
    setCity("");
    setOrder("desc");
    setPage(0);
  };
  const toggleSidebar = () => {
  setSidebarOpen(!sidebarOpen);
};

  return (
    <div>
 
      <AdminNavbar toggleSidebar={toggleSidebar} />

    {sidebarOpen && (
      <div
        className="fixed inset-0 bg-black/30 z-30 md:hidden"
        onClick={() => setSidebarOpen(false)}
      />
    )}

    <AdminSidebar sidebarOpen={sidebarOpen} />

      <div className="ml-0 flex flex-col gap-3 md:pl-[20rem] pt-20 px-4 md:px-8">

        {/*  HEADER */}
        <h1 className="text-xl md:text-2xl font-semibold mb-4">
          Service Requests
        </h1>

        {/*  FILTER SECTION */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6 flex flex-wrap gap-3 items-center">

          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setPage(0);
            }}
            className="border px-3 py-2 rounded-lg text-sm w-full sm:w-auto"
          />

          <input
            type="text"
            placeholder="State"
            value={stateFilter}
            onChange={(e) => {
              setStateFilter(e.target.value);
              setPage(0);
            }}
            className="border px-3 py-2 rounded-lg text-sm w-full sm:w-auto"
          />

          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(0);
            }}
            className="border px-3 py-2 rounded-lg text-sm w-full sm:w-auto"
          >
            <option value="">All Categories</option>
            <option value="HEALTH">Health</option>
            <option value="EDUCATION">Education</option>
            <option value="ENVIRONMENT">Environment</option>
          </select>

          <select
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
              setPage(0);
            }}
            className="border px-3 py-2 rounded-lg text-sm w-full sm:w-auto"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>

          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200"
          >
            Reset
          </button>

        </div>

        {/*  CONTENT */}
        {loading ? (
          <p className="text-center text-slate-500">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-center text-slate-500">No requests found</p>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

            {requests.map((req) => (
              <div
                key={req.id} onClick={() => navigate(`/admin/requests/${req.id}`)}
                className="bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition"
              >

                {/* Title */}
                <h2 className="text-lg font-semibold mb-2 line-clamp-1">
                  {req.title}
                </h2>

                {/* Description */}
                <p className="text-sm text-slate-500 mb-3 line-clamp-2">
                  {req.description}
                </p>

                {/* Details */}
                <div className="text-sm text-slate-600 space-y-1">

                  <p><b>Category:</b> {req.category}</p>

                  <p>
                    <b>Location:</b> {req.city}, {req.state}
                  </p>

                  <p>
                    <b>Status:</b>
                    <span className={`ml-1 px-2 py-1 rounded text-xs 
                      ${req.status === "OPEN" ? "bg-green-100 text-green-600" : ""}
                      ${req.status === "CLOSED" ? "bg-red-100 text-red-600" : ""}
                    `}>
                      {req.status}
                    </span>
                  </p>

                  <p>
                    <b>Volunteers:</b> {req.registeredCount} / {req.maxVolunteers}
                  </p>

                  <p>
                    <b>Posted By:</b> {req.postedBy} ({req.createdByType})
                  </p>

                  <p>
                    <b>Date:</b> {req.serviceDate}
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

        {/*  PAGINATION */}
        <div className="flex justify-center items-center gap-3 mt-8">

          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-3 py-2 border rounded-lg disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm">
            Page {page + 1} of {totalPages}
          </span>

          <button
            disabled={page === totalPages - 1}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-3 py-2 border rounded-lg disabled:opacity-50"
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
};

export default AdminViewRequests;
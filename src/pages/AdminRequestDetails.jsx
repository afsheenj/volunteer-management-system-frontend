import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";

const AdminRequestDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
   const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchRequest = async () => {
    try {
      const res = await api.get(`/requests/id/${id}`);
      console.log("Res from req details",res);
      setRequest(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, []);

 
  const handleDelete = async () => {

    const confirmDelete = window.confirm("Are you sure you want to delete this request?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/admin/request/${id}`);
      alert("Deleted successfully");
      navigate("/admin/requests");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!request) return <p className="text-center mt-10">Not found</p>;
  
  const Detail = ({ label, value }) => (
  <div className="bg-slate-50 p-4 rounded-xl border-0">
    <p className="text-xs text-slate-400 mb-1">{label}</p>
    <p className="font-medium text-slate-700">{value || "-"}</p>
  </div>
);
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

    <div className="ml-0 md:pl-[20rem] pt-20 px-4 md:px-8">

    
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm text-blue-600 hover:underline"
      >
        ← Back to Requests
      </button>

      {/*  CARD */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border-zinc-600">

        {/*  HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-6">

          <h1 className="text-2xl font-bold text-slate-800">
            {request.title}
          </h1>

          <span
            className={`px-3 py-1 text-xs font-medium rounded-full w-fit
              ${request.status === "OPEN" ? "bg-green-100 text-green-600" : ""}
              ${request.status === "CLOSED" ? "bg-red-100 text-red-600" : ""}
            `}
          >
            {request.status}
          </span>
        </div>

        {/* DESCRIPTION */}
        <p className="text-slate-600 mb-6 leading-relaxed">
          {request.description}
        </p>

        {/*  DETAILS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">

          <Detail label="Category" value={request.category} />
          <Detail label="Request Type" value={request.requestType} />

          <Detail label="City" value={request.city} />
          <Detail label="State" value={request.state} />
          <Detail label="Landmark" value={request.landmark} />

          <Detail label="Date" value={request.serviceDate} />
          <Detail label="Time" value={request.serviceTime} />

          <Detail
            label="Volunteers"
            value={`${request.registeredCount} / ${request.maxVolunteers}`}
          />

          <Detail label="Approved Count" value={request.approvedCount} />
        <Detail label="Description" value={`${request.description}`}/>

        </div>

        {/*  DELETE BUTTON */}
        {/* <div className="mt-8 flex justify-end">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition shadow-sm"
          >
            Delete Request
          </button>
        </div> */}

      </div>

    </div>
  </div>
);
};

export default AdminRequestDetails;
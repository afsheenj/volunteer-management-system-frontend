import { useContext, useEffect, useState } from "react";
import AppNavbar from "../components/AppNavbar";
import { AuthContext } from "../context/AuthContext";
import { getUserRequests } from "../services/serviceRequestService";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";

const statusStyles = {
  OPEN: "bg-green-100 text-green-700",
  CLOSED: "bg-red-100 text-red-600",
  COMPLETED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-gray-200 text-gray-700",
};

const UserRequests = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.userId;

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (userId) fetchRequests();
  }, [userId, page]);

  const fetchRequests = async () => {
    try {
      const res = await getUserRequests(userId, page, 10);
      setRequests(res.content);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("Error fetching requests", err);
    }
  };

  const cancelRequest = async (id) => {
  try {
    const res = await api.put(`/requests/users/${id}/cancel`);

    if (res?.status === false) {
      throw new Error(res?.message || "Cancel failed");
    }

    return res; // return response

  } catch (err) {
    console.error("Failed to cancel request", err);
    throw err;
  }
};

  return (
    <>
      <AppNavbar />

      <div className="min-h-screen bg-slate-50 p-6 pt-25">
        <h1 className="text-3xl font-bold text-[#1e40af] mb-18">
          My Posted Requests
        </h1>

        {requests.length === 0 ? (
          <p className="text-slate-500">No requests created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {requests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                cancelRequest={cancelRequest}
                statusStyles={statusStyles}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-end mt-12 gap-3">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            ‹
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-4 py-2 rounded-lg font-semibold ${
                page === i
                  ? "bg-[#1e40af] text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            ›
          </button>
        </div>
      </div>
    </>
  );
};

// =====================
// RequestCard Component
// =====================
const RequestCard = ({ request, cancelRequest, statusStyles }) => {
  const {
    id,
    title,
    city,
    state,
    serviceDate,
    maxVolunteers,
    registeredCount,
    approvedCount,
    status: initialStatus,
  } = request;

  const joined = approvedCount || 0;

  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const isCancelled = status === "CANCELLED";

const handleCancel = async () => {
  if (!cancelRequest || loading || isCancelled) return;

  try {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to cancel this request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Cancel it"
    });

    if (!result.isConfirmed) return;

    setLoading(true);

    const res = await cancelRequest(id);

    setStatus("CANCELLED");

    await Swal.fire({
      icon: "success",
      title: "Cancelled",
      text: res?.message || "Request cancelled successfully"
    });

  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Failed",
      text: err?.response?.data?.message || err.message || "Failed to cancel request"
    });

  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className={`flex flex-col gap-3 h-full rounded-2xl p-6 shadow-lg transition-all
        ${isCancelled ? "bg-gray-100 text-gray-500 pointer-events-none" : "bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl hover:-translate-y-1"}
      `}
    >
      {/* TITLE */}
      <h3 className={`text-xl font-bold mb-1 ${isCancelled ? "text-gray-400" : "text-[#1e40af]"}`}>
        {title}
      </h3>

      <p className={`text-sm mb-5 ${isCancelled ? "text-gray-400" : "text-slate-500"}`}>
        Posted by <span className="font-medium">You</span>
      </p>

      {/* INFO */}
      <div className="flex flex-wrap gap-3 mb-5 pt-2">
        <InfoChip icon={<Calendar size={16} />} text={serviceDate} disabled={isCancelled} />
        <InfoChip icon={<MapPin size={16} />} text={`${city ?? "-"}, ${state ?? "-"}`} disabled={isCancelled} />
        <InfoChip icon={<Users size={16} />} text={`${registeredCount}/${maxVolunteers} Joined`} disabled={isCancelled} />
      </div>

      {/* BOTTOM ROW */}
      <div className="flex justify-between items-center mt-auto gap-3">
        {/* View Details */}
        {!isCancelled ? (
          <Link to={`/user/request/${id}`}>
            <p className="font-bold cursor-pointer text-blue-600">View Details</p>
          </Link>
        ) : (
          <p className="font-bold text-gray-400">View Details</p>
        )}

        {/* Status Badge */}
        <span
          className={`px-4 py-1 rounded-full text-sm font-medium ${
            isCancelled ? "bg-gray-300 text-gray-500" : statusStyles[status] || "bg-gray-100"
          }`}
        >
          {status}
        </span>

        {/* Cancel Button */}
        {!isCancelled && (
          <button
            onClick={handleCancel}
            disabled={loading}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              loading ? "bg-red-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"
            }`}
          >
            {loading ? "Cancelling..." : "Cancel"}
          </button>
        )}
      </div>
    </div>
  );
};

// =====================
// InfoChip Component
// =====================
const InfoChip = ({ icon, text, disabled }) => (
  <div
    className={`flex items-center gap-2 border px-4 py-2 rounded-xl text-sm transition ${
      disabled ? "bg-gray-100 text-gray-400 border-gray-200" : "bg-blue-50 border-blue-100 text-slate-700 hover:bg-blue-100"
    }`}
  >
    <span className="text-[#1e40af]">{icon}</span>
    {text}
  </div>
);

export default UserRequests;
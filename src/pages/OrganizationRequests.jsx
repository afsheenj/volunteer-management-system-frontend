import { useContext, useEffect, useState } from "react";
import AppNavbar from "../components/AppNavbar";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";

const statusStyles = {
  OPEN: "bg-green-100 text-green-700",
  CLOSED: "bg-red-100 text-red-600",
  COMPLETED: "bg-blue-100 text-blue-700",
};

const OrganizationRequests = () => {

  const { user } = useContext(AuthContext);
  const orgId = user?.orgId;

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (orgId) fetchRequests();
  }, [orgId, page]);

  const fetchRequests = async () => {
    try {

      const res = await api.get(`/requests/organizations/${orgId}`, {
        params: { page, size: 10 }
      });

      setRequests(res.data.content);
      setTotalPages(res.data.totalPages);

    } catch (err) {

      console.error("Error fetching organization requests", err);

    }
  };

  return (
    <>
      <AppNavbar />

      <div className="min-h-screen bg-slate-50 p-6 pt-25">

        <h1 className="text-3xl font-bold text-[#1e40af] mb-18">
          Organization Posted Requests
        </h1>

        {requests.length === 0 ? (

          <p className="text-slate-500">No requests created yet.</p>

        ) : (

          <div className="grid grid-cols-1 grid-cols-2 gap-8">

            {requests.map((req) => (
              <RequestCard key={req.id} request={req} />
            ))}

          </div>

        )}

        {/* PAGINATION */}
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

export default OrganizationRequests;



const RequestCard = ({ request }) => {

  const {
    id,
    title,
    description,
    city,
    state,
    serviceDate,
    minVolunteers,
    maxVolunteers,
    status
  } = request;

  return (

    <div className="relative flex flex-col gap-3 h-full bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">

      <span
        className={`absolute top-5 right-5 px-4 py-1 rounded-full text-sm font-medium ${
          statusStyles[status] || "bg-gray-100"
        }`}
      >
        {status}
      </span>

      <h3 className="text-xl font-bold text-[#1e40af] mb-1 pr-20">
        {title}
      </h3>

      <p className="text-sm text-slate-500 mb-5">
        Posted by <span className="font-medium">Your Organization</span>
      </p>

      <div className="flex flex-wrap gap-3 mb-5 pt-2">

        <InfoChip icon={<Calendar size={16} />} text={serviceDate} />

        <InfoChip
          icon={<MapPin size={16} />}
          text={`${city}, ${state}`}
        />

        <InfoChip
          icon={<Users size={16} />}
          text={`${minVolunteers}/${maxVolunteers} Needed`}
        />

      </div>

      <p className="text-slate-600 mb-6 leading-relaxed pt-2 flex-grow line-clamp-3">
        {description}
      </p>

      <div className="flex justify-between items-center mt-auto">

        <Link to={`/posts/${id}`}>
          <p className="text-blue-600 font-bold">View Details</p>
        </Link>

      </div>

    </div>
  );
};



const InfoChip = ({ icon, text }) => (

  <div
    className="flex items-center gap-2 
    bg-blue-50 
    border border-blue-100 
    px-4 py-2 
    rounded-xl 
    text-sm 
    text-slate-700
    transition
    hover:bg-blue-100"
  >

    <span className="text-[#1e40af]">{icon}</span>
    {text}

  </div>

);
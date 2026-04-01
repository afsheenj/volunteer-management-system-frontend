import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const OrganizationActivity = () => {
  const { user } = useContext(AuthContext);
  const orgId = user?.orgId;

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (orgId) fetchOrgActivities();
  }, [orgId]);

  const fetchOrgActivities = async () => {
    try {
      const res = await api.get(`/organization/participations/${orgId}`, {
        params: { pageNumber: 0, pageSize: 10 }
      });

      console.log("Org Activities:", res.data.content);
      setRequests(res.data?.content || []);
    } catch (err) {
      console.error(err);
    }
  };

  const statusStyles = {
    REQUESTED: "bg-yellow-100 text-yellow-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-600",
    WITHDRAWN: "bg-gray-200 text-gray-600",
    ATTENDED: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-indigo-100 text-indigo-700",
    NO_SHOW: "bg-red-200 text-red-700"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">
      <AppNavbar />

      <div className="p-8 pt-24 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-[#1e40af]">
          Organization Activities
        </h1>

        <div className="grid md:grid-cols-2 gap-8 pt-4 auto-rows-fr items-stretch">
          {requests.map((req) => (
            <div
              key={req.id}
              className={`relative flex flex-col gap-2 h-full rounded-2xl p-8 shadow-lg transition-all
              ${
                req.status === "REJECTED" || req.status === "WITHDRAWN"
                  ? "bg-gray-200 opacity-60 blur-[1px]"
                  : "bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl hover:-translate-y-1"
              }`}
            >
              <span
                className={`absolute top-5 right-5 px-4 py-1 rounded-full text-sm font-medium ${
                  statusStyles[req.status] || "bg-gray-100"
                }`}
              >
                {req.status}
              </span>

              <h3 className="text-xl font-bold text-[#1e40af] mb-1 pr-20">
                {req.serviceTitle}
              </h3>

              <p className="text-slate-600 mb-4">
                Organization Members Added : <b>{req.memberCount}</b>
              </p>

              <div className="flex justify-between items-center mt-auto">
                <Link to={`/organization/activity/${req.serviceId}`}>
                  <p className="text-blue-600 font-bold">
                    View Details
                  </p>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizationActivity;
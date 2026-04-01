import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

const OrganizationActivityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const orgId = user?.orgId;

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orgId) fetchDetails();
  }, [id, orgId]);

  const fetchDetails = async () => {
    try {
      const res = await api.get(`/requests/id/${id}`);
      setRequest(res);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      const res = await api.put("/organization/participations/withdraw", {
        serviceId: Number(id),
        organizationId: Number(orgId)
      });

      if (res.status === false) {
        await Swal.fire("Error", res.message, "error");
        return;
      }

      await Swal.fire("Success", "Withdrawn successfully", "success");
      navigate("/organization/activity");

    } catch (e) {
      await Swal.fire(
        "Error",
        e?.response?.data?.message || "Withdraw failed",
        "error"
      );
    }
  };

  if (loading) return <div className="mt-40 text-center">Loading...</div>;
  if (!request) return <div className="mt-40 text-center">Not found</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">
      <AppNavbar />

      <div className="pt-24 px-6 md:px-12 pb-12 w-full">
        <div className="bg-white rounded-2xl shadow-lg p-10 relative flex flex-col gap-3">

          <span className="absolute top-6 right-6 px-4 py-1 bg-blue-100 text-[#1e40af] rounded-full">
            {request.status}
          </span>

          <h1 className="text-3xl font-bold text-[#1e40af] mb-4">
            {request.title}
          </h1>

          <p className="text-slate-600 mb-6">
            {request.description}
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <InfoBox label="Category" value={request.category} />
            <InfoBox label="City" value={request.city} />
            <InfoBox label="State" value={request.state} />
            <InfoBox label="Date" value={request.serviceDate} />
            <InfoBox label="Time" value={`${request.serviceStartTime} -  ${request.serviceEndTime} `} />
            <InfoBox label="Volunteers Needed" value={`${request.minVolunteers} -  ${request.maxVolunteers} `} />
          </div>

          {request.status !== "COMPLETED" && request.status!== "CANCELLED" && (
            <div className="mt-10 flex justify-end">
              <button
                onClick={handleWithdraw}
                className="px-6 py-2 rounded-full bg-orange-100 text-orange-700 hover:bg-orange-200"
              >
                Withdraw
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ label, value }) => (
  <div className="bg-slate-50 border border-blue-100 rounded-xl p-4">
    <p className="text-xs text-slate-500">{label}</p>
    <p className="font-semibold">{value || "--"}</p>
  </div>
);

export default OrganizationActivityDetails;
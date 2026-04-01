import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import Swal from "sweetalert2";

const MyActivityDetails = () => {

const { id } = useParams();
const navigate = useNavigate();
const { user } = useContext(AuthContext);

const [request, setRequest] = useState(null);
const [loading, setLoading] = useState(true);

const userId = user?.userId;

useEffect(() => {
if (userId) fetchDetails();
}, [id, userId]);

const fetchDetails = async () => {
try {
setLoading(true);
const res = await api.get(`/requests/id/${id}`);
console.log("Volunteer Request Details", res);
setRequest(res);
} catch (e) {
console.log("Error fetching request details", e);
} finally {
setLoading(false);
}
};
const handleWithdraw = async () => {

  if (!userId) return;

  try {

    const res = await api.put("/user/participations/withdraw", {
      serviceId: Number(id),
      userId: Number(userId)
    });

    if (res.status === false) {

      await Swal.fire({
        icon: "error",
        title: "Withdraw Not Allowed",
        text: res.message
      });
      return;
    }
    await Swal.fire({
      icon: "success",
      title: "Withdrawn",
      text: "You have withdrawn successfully"
    });

    navigate("/user/my-activity");

  } catch (e) {

    await Swal.fire({
      icon: "error",
      title: "Error",
      text:
        e?.response?.data?.message ||
        "Withdraw failed"
    });

  }
};

if (loading) {
return (
<> <AppNavbar /> <div className="mt-40 text-center text-xl font-semibold">
Loading request details... </div>
</>
);
}

if (!request) {
return (
<> <AppNavbar /> <div className="mt-40 text-center text-xl font-semibold">
Request not found </div>
</>
);
}

return ( 
<div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100"> <AppNavbar />

<div className="pt-24 px-6 md:px-12 pb-12 w-full">

    <div className="bg-white rounded-2xl shadow-lg p-10 relative w-full">

      {/* STATUS */}
      <span className="absolute top-6 right-6 px-4 py-1 rounded-full text-sm font-semibold bg-blue-100 text-[#1e40af]">
        {request.status}
      </span>

      {/* TITLE */}
      <h1 className="text-3xl font-bold text-[#1e40af] mb-4 pr-20">
        {request.title}
      </h1>

      {/* DESCRIPTION */}
      <p className="text-slate-600 leading-relaxed mb-8 max-w-3xl">
        {request.description}
      </p>

      {/* INFO GRID */}
      <div className="grid md:grid-cols-3 gap-6">

        <InfoBox label="Category" value={request.category} />
        <InfoBox label="Landmark" value={request.landmark} />
        <InfoBox label="City" value={request.city} />
        <InfoBox label="State" value={request.state} />
        <InfoBox label="Service Date" value={request.serviceDate} />
        <InfoBox label="Service Time" value={`${request.serviceStartTime} - ${request.serviceEndTime}`} />
        <InfoBox
          label="Volunteers Needed"
          value={`${request.minVolunteers} - ${request.maxVolunteers}`}
        />
        <InfoBox label="Registered Count" value={request.registeredCount} />
        <InfoBox label="Request Type" value={request.requestType} />

      </div>

      {/* WITHDRAW BUTTON */}
      {request.status !== "COMPLETED" && (
        <div className="mt-10 flex justify-end">

        <button
  disabled={!userId || request.status=="CANCELLED"}
  onClick={handleWithdraw}
  className="px-6 py-2 rounded-full 
           bg-orange-100 text-orange-700 
           font-semibold 
           hover:bg-orange-200 
           transition 
           disabled:bg-gray-200 disabled:text-gray-500"
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
    <p className="text-xs text-slate-500 mb-1">{label}</p>
    <p className="font-semibold text-slate-800">
      {value || "--"}
    </p>
  </div>
);

export default MyActivityDetails;

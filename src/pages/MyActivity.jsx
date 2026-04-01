import { useEffect, useState, useContext } from "react";
import { Calendar, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { showError,showSuccess,showWarning } from "../utils/alertService";


const MyActivity = () => {

  const { user } = useContext(AuthContext);
  const userId = user?.userId;

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (userId) fetchJoinedRequests();
  }, [userId]);

  const fetchJoinedRequests = async () => {
    try {
    const res = await api.get(`/user/participations/user/${userId}`, { params: { page: 0, size: 10 } });
      console.log("response data",res.data.content);
      setRequests(res.data?.content || []);
      if ((res.data?.content || []).length === 0) {
  showWarning("Info", "No activity found");
}
    } catch (err) {
     showError("Error", "Failed to load your activity");
    }
  };

  const statusStyles = {
    OPEN: "bg-green-100 text-green-700",
    ACCEPTED: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-gray-200 text-gray-700",
    CANCELLED: "bg-red-100 text-red-600",
    REQUESTED: "bg-orange-100 text-orange-700"
  };

  const role = localStorage.getItem("role");
  const isUser = role === "USER";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">

      <AppNavbar />

     <div className="px-4 sm:px-6 md:px-8 pt-24 flex flex-col gap-6">

       <h1 className="text-2xl sm:text-3xl font-bold text-[#1e40af]">
          My Activity
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 pt-4 auto-rows-fr items-stretch">

          {requests?.map((req) => (

            <div
              key={req.id}
              className={`relative flex flex-col gap-2 h-full rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg transition-all
${
  req.status === "WITHDRAWN" || req.status === "REJECTED"
    ? "bg-gray-200 opacity-60 blur-[1px] cursor-not-allowed"
    : "bg-gradient-to-br from-white to-blue-50 hover:shadow-2xl hover:-translate-y-1"
}`}
            >

              <span
                className={`absolute top-3 right-3 sm:top-5 sm:right-5 px-3 sm:px-4 py-1 text-xs sm:text-sm rounded-full font-medium ${
                  statusStyles[req.status] || "bg-gray-100"
                }`}
              >
                {req.status}
              </span>

              <h3 className="text-xl font-bold text-[#1e40af] mb-1 pr-12 sm:pr-16 md:pr-20">
                {req.serviceTitle}
              </h3>

              {/* <p className="text-sm text-slate-500 mb-5">
                Posted by <span className="font-medium">{req.postedBy}</span> • {req.userName}
              </p> */}

              {/* <div className="flex flex-wrap gap-3 mb-5 pt-2">

                <InfoChip
                  icon={<Calendar size={16} />}
                  text={req.serviceDate}
                />

                <InfoChip
                  icon={<MapPin size={16} />}
                  text={req.location}
                />

                <InfoChip
                  icon={<Users size={16} />}
                  text={`${req.minVolunteers}/${req.maxVolunteers} Joined`}
                />

              </div> */}

              <p className="text-sm sm:text-base text-slate-600 mb-6 leading-relaxed pt-2 flex-grow line-clamp-3">
                {req.description}
              </p>

              <div className="flex justify-between items-center mt-auto">

                <Link to={`/user/my-activity/${req.serviceId}`}>
                  <p className="text-blue-600 font-bold">
                    View Details
                  </p>
                </Link>

                {/* Volunteer already joined so no join button */}
                

              </div>

            </div>

          ))}

        </div>

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

export default MyActivity;
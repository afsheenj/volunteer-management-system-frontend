import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Tag,
  Clock,
  Info, ChevronLeft,ChevronRight,
  User
} from "lucide-react";

import AppNavbar from "../components/AppNavbar";
import Spinner from "../components/LoadingSpinner";
import { getRequestById } from "../services/requestService";
import { AuthContext } from "../context/AuthContext";
import api from  "../services/api"
import Swal from "sweetalert2";


const ViewPost = () => {
  const { id } = useParams();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);
  const {user,logout} = useContext(AuthContext);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [joinedRequests, setJoinedRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [participantTypeFilter, setParticipantTypeFilter] = useState("");

  const [currentRegistered, setCurrentRegistered] = useState(0);

  const navigate = useNavigate();

  const role = user?.role;
  const isUser = role === "USER" ;
  const orgId = user?.orgId;
  const userId = user?.userId;
  const alreadyJoined = joinedRequests?.includes(Number(id));

  const isDisabled =
  alreadyJoined ||
  request?.status === "COMPLETED" ||
  request?.status === "CANCELLED" ||
  request?.status === "FULL";

useEffect(() => {
  fetchRequest();
}, []);

useEffect(() => {
  if (request) {
    setCurrentRegistered(request.registeredCount); // initialize current count
    fetchParticipants();
    fetchJoinedRequests();
  }
}, [request, page, statusFilter, participantTypeFilter, userId, orgId, role]);


  const fetchRequest = async () => {
    try {
      setLoading(true);
      const data = await getRequestById(id);
      console.log("Post",data);
      setRequest(data);
    } catch (err) {
      console.error("Failed to fetch request", err);
      await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load request details",
      confirmButtonColor: "#1e40af"
    });
    } finally {
      setLoading(false);
    }
  };

  const participate = async () => {
          try {
            // LOGIN CHECK
    if (!role) {
      await Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first",
        confirmButtonColor: "#1e40af"
      });
      return;
    }

    // CONFIRMATION ALERT (VERY IMPORTANT)
    const confirm = await Swal.fire({
      title: "Join this request?",
      text: "Do you want to participate in this service?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#1e40af",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Join"
    });

    if (!confirm.isConfirmed) return;

            if (role === "VOLUNTEER" || role === "BOTH" || role === "ORGANIZATION_MEMBER" || role === "USER") {
              if (currentRegistered >= request.maxVolunteers) {
        await Swal.fire({
          icon: "error",
          title: "Cannot Join",
          text: `Max volunteers reached (${request.maxVolunteers})`,
          confirmButtonColor: "#1e40af"
        });
        return;
      }

              const res = await api.post("user/participations/register", {
                serviceId: id , userId
              });

              // if(res.status == false){
              //   alert(res.message);
              // }
              // else{
              //   alert("Successfully registered for the request");

              // BACKEND ERROR
      if (res?.status === false) {
        await Swal.fire({
          icon: "error",
          title: "Failed",
          text: res?.message || "Registration failed"
        });
        return;
      }

      // SUCCESS
      await Swal.fire({
        icon: "success",
        title: "Joined",
        text: "Successfully registered for the request",
        confirmButtonColor: "#1e40af"
      });
                setJoinedRequests(prev => [...prev, Number(id)]);
                setCurrentRegistered(prev => prev + 1); // update live count
              }
              
            

            else if (role === "ORGANIZATION") {
              // const memberCount = prompt("Enter number of members participating:");
              const { value: memberCount } = await Swal.fire({
        title: "Enter number of members",
        input: "number",
        inputLabel: "Members participating",
        inputPlaceholder: "Enter count",
        showCancelButton: true,
        confirmButtonColor: "#1e40af",
        inputValidator: (value) => {
          if (!value || value <= 0) {
            return "Please enter valid number";
          }
          if (currentRegistered + Number(value) > request.maxVolunteers){
            return `Cannot exceed max volunteers (${request.maxVolunteers})`;
          }
        }
      });

              if (!memberCount) return;

              const res = await api.post("organization/participations/register", {
                serviceId: id,
                // orgId,
                organizationId: orgId,
                memberCount : Number(memberCount)
              });
              
              // if(res.status == false){
              //   alert(res.message);
              // }
              // else{
              //   alert("Organization registered successfully");

               //  ERROR
      if (res?.status === false) {
        await Swal.fire({
          icon: "error",
          title: "Failed",
          text: res?.message || "Registration failed"
        });
        return;
      }

      // SUCCESS
      await Swal.fire({
        icon: "success",
        title: "Registered",
        text: "Organization registered successfully",
        confirmButtonColor: "#1e40af"
      });
                setJoinedRequests(prev => [...prev, Number(id)]);
                setCurrentRegistered(prev => prev + Number(memberCount)); // update live count
              

              

            }

          } catch (e) {
            console.log(e);
            // alert("Registration failed");
            await Swal.fire({
      icon: "error",
      title: "Error",
      text: e?.response?.data?.message || "Registration failed",
      confirmButtonColor: "#1e40af"
    });
          }
        };

  const fetchParticipants = async () => {
  try {
    setParticipantsLoading(true);

    const res = await api.get(`public/participations/service/${id}`,{
          params: {
          status: statusFilter,
          participantType: participantTypeFilter,
          pageNumber: page,
          pageSize: 6
        }
    });
    setParticipants(res.data.content);
    setTotalPages(res.totalPages);

  } catch (err) {
    console.error("Failed to fetch participants", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load participants"
    });
  } finally {
    setParticipantsLoading(false);
  }
};

const fetchJoinedRequests = async () => {
    
  try {
    let res;
    if(role === "USER" || role === "VOLUNTEER" || role === "ORGANIZATION_MEMBER" || role === "BOTH"){
    res = await api.get(`/user/participations/user/${userId}`, {
      params: { page: 0, size: 50 }
    });
  }
  else {
    res = await api.get(`/organization/participations/${orgId}`, {
      params: { page: 0, size: 50 }
    });
  }
    const ids = res.data.content.map(p => p.serviceId);
    setJoinedRequests(ids);

  } catch (err) {
    console.error("Error fetching joined requests", err);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to load your participation data"
    });
  }
};

  const statusStyles = {
    OPEN: "bg-green-100 text-green-700",
    ACCEPTED: "bg-blue-100 text-blue-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-gray-200 text-gray-700",
  };

  if (loading) return <Spinner />;

  if (!request)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Request not found</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">
      <AppNavbar />

      <div className="max-w-full mx-auto pt-24 px-6 pb-12">

        {/* CARD */}

        <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col gap-6">

          {/* HEADER */}

          <div className="flex justify-between items-start flex-col gap-3 ">

            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-[#1e40af]">
                {request.title}
              </h1>

              <p className="text-slate-500 mt-2">
              {request.postedBy} •  {request.category} • {request.requestType}
              </p>
            </div>

            <span
              className={`px-4 py-1 rounded-full text-sm font-medium ${
                statusStyles[request.status] || "bg-gray-100"
              }`}
            >
              {request.status}
            </span>
          </div>

          {/* INFO GRID */}

          <div className="grid md:grid-cols-3 gap-4 pt-2">

            <InfoChip
              icon={<Calendar size={18} />}
              label="Service Date"
              value={request.serviceDate}
            />

            <InfoChip
              icon={<Clock size={18} />}
              label="Service Time"
              value={request.serviceStartTime && request.serviceEndTime ? `${request.serviceStartTime} - ${request.serviceEndTime}` : "Not specified"}
            />
            <InfoChip
              icon={<Users size={18} />}
              label="Min Volunteers"
              value={`${request.minVolunteers}`}
            />

            <InfoChip
              icon={<Users size={18} />}
              label="Max Volunteers"
              value={`${request.maxVolunteers}`}
            />

            <InfoChip
              icon={<Users size={18} />}
              label="Joined"
              // value={request.registeredCount}
              value={currentRegistered}
            />

            <InfoChip
              icon={<MapPin size={18} />}
              label="Location"
              value={`${request.city}, ${request.state}`}
            />

            <InfoChip
              icon={<Tag size={18} />}
              label="Category"
              value={request.category}
            />

            <InfoChip
              icon={<Info size={18} />}
              label="Landmark"
              value={request.landmark}
            />

          </div>

          {/* DESCRIPTION */}

          <div className="pt-4 flex flex-col gap-3 ">

            <h2 className="text-xl font-semibold text-[#1e40af] ">
              Description
            </h2>

            <p className="text-slate-600 leading-relaxed">
              {request.description}
            </p>

          </div>

            <div className="pt-8 flex flex-col gap-4">
              
              <h2 className="text-xl font-semibold text-[#1e40af]">
                Participants
              </h2>
                 <div className="flex flex-wrap gap-3 mb-4">

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setPage(0);
                  setStatusFilter(e.target.value);
                }}
                className="px-4 py-2 rounded-lg border border-slate-300"
              >
                <option value="">All Status</option>
                <option value="REQUESTED">Requested</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="WITHDRAWN">Withdrawn</option>
                <option value="ATTENDED">Attended</option>
                <option value="NO_SHOW">No Show</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>

              </select>

              {/* Participant Type Filter */}
              <select
                value={participantTypeFilter}
                onChange={(e) => {
                  setPage(0);
                  setParticipantTypeFilter(e.target.value);
                }}
                className="px-4 py-2 rounded-lg border border-slate-300"
              >
                <option value="">All Participants</option>
                <option value="USER">User</option>
                <option value="ORGANIZATION">Organization</option>
              </select>    

            </div>

          {participantsLoading ? (
            <Spinner />
          ) : participants.length === 0 ? (
            <p className="text-slate-500">No participants yet</p>
          ) : (
            <div className="flex flex-col gap-3">

              {participants.map((p) => (
                <div
                  key={p.id}
                  className="flex justify-between items-center border border-blue-100 rounded-lg px-4 py-3 bg-slate-50"
                >
                  <div className="flex flex-col gap-1">
                      <span className="font-semibold">{p.participantName}</span>
                        <span className="text-xs text-slate-500">{p.participantType}</span>
                    <span className="text-sm text-slate-500 flex gap-3">
                      <span>Applied at: </span><span>{new Date(p.appliedAt).toLocaleString()}</span>
                    </span>
                  </div>
                  <div className="flex gap-4">
                      <span className="text-sm font-medium px-3 py-1 rounded bg-blue-100 text-blue-700">
                              {p.status}
                      </span>
                 <button className="bg-blue-700 text-white px-3 py-1 rounded" onClick={()=>{navigate(`/profile/${p.participantName}`)}}>View Profile</button>

                  </div>
             </div>
                        ))}

                      </div>
                    )}
                  </div>
          <div className="flex justify-end pt-4">
  <div className="flex items-center gap-2 text-sm">
    <button
      className="p-2 rounded-lg border border-slate-300"
      disabled={page === 0}
      onClick={() => setPage((prev) => prev - 1)}
    >
      <ChevronLeft size={16} />
    </button>

    {[...Array(totalPages)].map((_, i) => (
      <button
        key={i}
        className={`px-3 py-1 rounded-lg ${
          i === page
            ? "bg-[#1e40af] text-white"
            : "bg-white border border-slate-300"
        }`}
        onClick={() => setPage(i)}
      >
        {i + 1}
      </button>
    ))}

    <button
      className="p-2 rounded-lg border border-slate-300"
      disabled={page === totalPages - 1}
      onClick={() => setPage((prev) => prev + 1)}
    >
      <ChevronRight size={16} />
    </button>
  </div>
</div>

          {/* ACTIONS */}

          <div className="flex justify-end pt-6">

            <button
              // disabled={isUser || alreadyJoined}
              disabled={isDisabled || isUser}
              className={`px-8 py-3 rounded-xl font-semibold shadow transition ${
                // isUser || alreadyJoined
                isDisabled || isUser
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-[#1e40af] text-white hover:bg-[#1a369d]"
              }`}
              onClick={participate}
            >
              {alreadyJoined ? "Joined" : "Join Request"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

const InfoChip = ({ icon, label, value }) => (
  <div className="flex flex-col gap-1 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
    <div className="flex items-center gap-2 text-[#1e40af] font-medium">
      {icon}
      {label}
    </div>

    <p className="text-sm text-slate-700">{value}</p>
  </div>
);

export default ViewPost;

import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import Swal from "sweetalert2";

const OrganizationRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const orgId = user?.orgId;

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState([]);

  const [openFeedbackFormId, setOpenFeedbackFormId] = useState(null);
const [feedbackMap, setFeedbackMap] = useState({});
const [openViewFeedbackId, setOpenViewFeedbackId] = useState(null);

const [rating, setRating] = useState(5);
const [comment, setComment] = useState("");

  useEffect(() => {
    if (!orgId) return;
    loadRequest();
  }, [id, orgId]);

  // ---------- FETCH REQUEST DETAILS ----------
  const loadRequest = async () => {
    try {
      setLoading(true);
      const reqRes = await api.get(`/requests/organizations/${orgId}/${id}`);
      console.log("Request Data:", reqRes);
      setRequest(reqRes);
      await fetchParticipants();
    } catch (e) {
      console.log("Error loading request", e);
    } finally {
      setLoading(false);
    }
  };

    const fetchFeedbackForParticipants = async (participantsList) => {
  const feedbackData = {};

  await Promise.all(
    participantsList.map(async (p) => {
      try {
        let res;

        if (p.participantType === "USER") {
          res = await api.get(`/feedbacks/user-participation/${p.id}`);
        } else {
          res = await api.get(`/feedbacks/organization-participation/${p.id}`);
        }

        const list = res.data;

        if (list && list.length > 0) {
          feedbackData[p.id] = {
            rating: list[0].rating,
            comment: list[0].comment,
            givenBy: list[0].givenBy,
          };
        }
      } catch (e) {
        console.log("No feedback for", p.id);
      }
    })
  );

  setFeedbackMap(feedbackData);
};

  // ---------- FETCH PARTICIPANTS (USER + ORGANIZATION) ----------
  const fetchParticipants = async () => {
    try {
      const [userPartRes, orgPartRes] = await Promise.all([
        api.get(`/user/participations/service/${id}`, {
          params: { pageNumber: 0, pageSize: 50 },
        }),
        api.get(`/organization/participations/service/${id}`, {
          params: { pageNumber: 0, pageSize: 50 },
        }),
      ]);

      // Map user participants to unified shape
      console.log("User particpaunts",userPartRes.data.content);
      console.log("Organization particpaunts",orgPartRes.data.content);
      const userParticipants = (userPartRes.data.content || []).map((u) => ({
        id: u.id,
        serviceId: u.serviceId,
        participantId: u.userId,
        participantName: u.username,
        participantType: "USER",
        status: u.status,
        appliedAt: u.appliedAt,
        memberCount: null,
      }));

      // Map organization participants to unified shape
      const orgParticipants = (orgPartRes.data.content || []).map((o) => ({
        id: o.id,
        serviceId: o.serviceId,
        participantId: o.organizationId,
        participantName: o.organizationName,
        participantType: "ORGANIZATION",
        status: o.status,
        appliedAt: o.appliedAt,
        memberCount: o.memberCount,
      }));

     const allParticipants = [...userParticipants, ...orgParticipants];
setParticipants(allParticipants);

await fetchFeedbackForParticipants(allParticipants);
    } catch (e) {
      console.log("Error fetching participants", e);
    }
  };


  // ---------- APPROVE PARTICIPANT ----------
const approve = async (p) => {
  try {
   if (p.participantType === "USER" || p.participantType === "BOTH") {
      // Send UserParticipationDto in body
      await api.put(`/user/participations/approve`, {
        serviceId: p.serviceId,
        userId: p.participantId,
      });
    } else if (p.participantType === "ORGANIZATION") {
      // Send OrganizationParticipationDto in body
      await api.put(`/organization/participations/approve`, {
        serviceId: p.serviceId,
        organizationId: p.participantId,
        memberCount: p.memberCount || 1,
      });
    }

    alert("Volunteer Approved");

    await loadRequest();

    // Update participant locally
    setParticipants((prev) =>
      prev.map((part) =>
        part.id === p.id ? { ...part, status: "APPROVED" } : part
      )
    );

    // Update approved count in request
    const approvedCount = participants.reduce(
      (acc, part) =>
        part.status === "APPROVED" || part.id === p.id
          ? acc + (part.memberCount || 1)
          : acc,
      0
    );

    setRequest((prev) => ({ ...prev, approvedCount }));
  } catch (e) {
    console.log("Approve error", e);
    alert("Failed to approve");
  }
};

// ---------- REJECT PARTICIPANT ----------
const reject = async (p) => {
  try {
   if (p.participantType === "USER" || p.participantType === "BOTH") {
      await api.put(`/user/participations/reject`, {
        serviceId: p.serviceId,
        userId: p.participantId,
      });
    } else if (p.participantType === "ORGANIZATION") {
      await api.put(`/organization/participations/reject`, {
        serviceId: p.serviceId,
        organizationId: p.participantId,
        memberCount: p.memberCount || 1,
      });
    }

    alert("Volunteer Rejected");
    await loadRequest();

    setParticipants((prev) =>
      prev.map((part) =>
        part.id === p.id ? { ...part, status: "REJECTED" } : part
      )
    );

    const approvedCount = participants.reduce(
      (acc, part) => (part.status === "APPROVED" ? acc + (part.memberCount || 1) : acc),
      0
    );

    setRequest((prev) => ({ ...prev, approvedCount }));
  } catch (e) {
    console.log("Reject error", e);
    alert("Failed to reject");
  }
};

const markAttendance = async (p, attended) => {
  try {
    if (p.participantType === "USER") {
      await api.put(`/user/participations/attendance`, {
        serviceId: p.serviceId,
        userId: p.participantId,
        attended
      });
    } else {
      await api.put(`/organization/participations/attendance`, {
        serviceId: p.serviceId,
        organizationId: p.participantId,
        attended
      });
    }

    setParticipants(prev =>
      prev.map(part =>
        part.id === p.id
          ? { ...part, status: attended ? "ATTENDED" : "NO_SHOW" }
          : part
      )
    );

  } catch (e) {
    Swal.fire("Error", "Attendance failed", "error");
  }
};
  
  // ---------- RENDER ----------
  if (loading) {
    return (
      <>
        <AppNavbar />
        <div className="mt-40 text-center text-xl font-semibold">
          Loading request details...
        </div>
      </>
    );
  }

  if (!request) {
    return (
      <>
        <AppNavbar />
        <div className="mt-40 text-center text-xl font-semibold">
          No request found
        </div>
      </>
    );
  }



const submitFeedback = async (p) => {
  try {
    const payload = {
      userParticipationId:
        p.participantType === "USER" ? p.id : null,
      organizationParticipationId:
        p.participantType === "ORGANIZATION" ? p.id : null,
      givenByUserId: user?.userId,
      rating,
      comment,
    };

    await api.post("/feedbacks", payload);

    setFeedbackMap(prev => ({
      ...prev,
      [p.id]: {
        rating,
        comment,
        givenBy: "You"
      }
    }));

    setOpenFeedbackFormId(null);
    setRating(5);
    setComment("");

    alert("Feedback submitted");
  } catch (e) {
    alert("Error submitting feedback");
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">
      <AppNavbar />
      <div className="pt-24 px-6 md:px-12 pb-12 w-full flex flex-col gap-4">
        {/* ---------- REQUEST CARD ---------- */}
        {request && (
          <div className="bg-white rounded-2xl shadow-md p-8 mb-10 relative">
            {/* STATUS */}
            <div className="absolute top-6 right-6 flex gap-3 items-center">
              <button
                disabled={request.status === "COMPLETED"}
                onClick={() => navigate(`/organization/request/edit/${id}`)}
                className={`px-4 py-2 rounded-lg text-white font-semibold ${
                  request.status === "COMPLETED"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }` }
              >
                Edit
              </button>
              <span className="px-4 py-1 rounded-full text-sm font-semibold bg-blue-100 text-[#1e40af]">
                {request.status}
              </span>
            </div>

            <h1 className="text-3xl font-bold text-[#1e40af] mb-3 pr-20">
              {request.title}
            </h1>
            <p className="text-slate-600 leading-relaxed mb-6 max-w-3xl">
              {request.description}
            </p>

            {/* INFO GRID */}
            <div className="grid md:grid-cols-3 gap-6">
              <InfoBox label="Category" value={request.category} />
              <InfoBox label="Landmark" value={request.landmark} />
              <InfoBox
                label="Location"
                value={
                  request.city && request.state
                    ? `${request.city}, ${request.state}`
                    : "Not Available"
                }
              />
              <InfoBox label="Service Date" value={request.serviceDate} />
              <InfoBox label="Service Time" value={request.serviceStartTime 
              && request.serviceEndTime ?
                `${request.serviceStartTime} - ${request.serviceEndTime}` : "Not Available"
              } />
              <InfoBox label="Registered Count" value={request.registeredCount} />
              <InfoBox
                label="Volunteers Needed"
                value={`${request.registeredCount} - ${request.maxVolunteers}`}
              />
              <InfoBox label="Approved Volunteers" value={request.approvedCount} />
              <InfoBox label="Request Type" value={request.requestType} />
            </div>
          </div>
        )}

        {/* ---------- PARTICIPANTS SECTION ---------- */}
        <h2 className="text-2xl font-bold text-[#1e40af] mb-6">
          Volunteer Applications
        </h2>

        <div className="bg-white rounded-2xl shadow-md border border-slate-100">
          {participants.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No volunteers applied yet
            </div>
          ) : (
            <div className="divide-y">
               {participants.map((p) => (
<div
  key={p.id}
  className="p-5 flex flex-col gap-3 hover:bg-blue-50 transition"
>
          {/* LEFT SIDE */}
         <div className="flex justify-between items-center">
          <div>
            <p className="text-lg font-bold text-slate-800">
              {p.participantName}
            </p>
          <div className="flex gap-3 items-center">
                      <p className="text-lg font-bold text-slate-400">
                        {p.participantType}
                      </p>
                      {p.participantType === "ORGANIZATION" && (
                        <p className="text-sm text-slate-500">
                          Members : {p.memberCount}
                        </p>
                      )}
                    </div>
            <p className="text-sm text-slate-500 mt-1">
              Status :
              <span className="ml-2 font-semibold text-[#1e40af]">
                {p.status}
              </span>
            </p>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">
          {p.status === "REQUESTED" && (
           <>
          
              <button
                onClick={() => approve(p)}
                className="px-4 py-1.5 rounded-xl bg-green-100 text-green-700 font-semibold hover:bg-green-200 transition"
              >
                Accept
              </button>
              <button
                onClick={() => reject(p)}
                className="px-4 py-1.5 rounded-xl bg-red-100 text-red-600 font-semibold hover:bg-red-200 transition"
              >
                Reject
              </button>
        </>
          )}

     {/* ATTENDANCE */}
            {request.status === "COMPLETED"&&
   p.status === "APPROVED" && (
    <>
      <button
        onClick={() => markAttendance(p, true)}
        className="px-3 py-1 rounded-lg bg-blue-600 text-white font-semibold"
      >
        Present
      </button>

      <button
        onClick={() => markAttendance(p, false)}
        className="px-3 py-1 rounded-lg bg-gray-500 text-white font-semibold"
      >
        Absent
      </button>
    </>
  )}
  {/* AFTER MARKING */}

  {p.status === "NO_SHOW" && (
    <span className="text-red-600 font-bold">✖ No Show</span>
  )}

  {p.status === "ATTENDED" && (
  <div className="flex gap-4 items-center">
    <span className="text-green-600 font-bold">✔ Attended</span>

    {!feedbackMap[p.id] && (
      <button
        onClick={() => setOpenFeedbackFormId(p.id)}
        className="bg-indigo-700 text-white px-3 py-1 rounded-lg"
      >
        Give Feedback
      </button>
    )}

    {feedbackMap[p.id] && (
      <button
        onClick={() =>
          setOpenViewFeedbackId(prev => prev === p.id ? null : p.id)
        }
        className="text-gray-700 hover:text-indigo-700"
      >
        <Eye size={18} />
      </button>
    )}
  </div>
)}

          </div>     
          </div>
           

  {openFeedbackFormId === p.id && (
  <div className="mt-3 p-4 bg-blue-50 rounded-xl flex flex-col gap-3">
    <h3 className="font-bold">Feedback</h3>

    <select
      value={rating}
      onChange={(e) => setRating(Number(e.target.value))}
      className="border p-2 rounded"
    >
      {[1,2,3,4,5].map(r => (
        <option key={r} value={r}>{r} star</option>
      ))}
    </select>

    <textarea
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      className="border p-2 rounded"
      placeholder="Write feedback..."
    />

    <div className="flex gap-2">
      <button
        onClick={() => submitFeedback(p)}
        className="bg-green-600 text-white px-3 py-1 rounded"
      >
        Submit
      </button>

      <button
        onClick={() => setOpenFeedbackFormId(null)}
        className="bg-gray-300 px-3 py-1 rounded"
      >
        Cancel
      </button>
    </div>
  </div>
)}

{openViewFeedbackId === p.id && feedbackMap[p.id] && (
  <div className="mt-3 p-4 bg-gray-100 rounded-xl">
    <p className="font-semibold">
      ⭐ {feedbackMap[p.id].rating}/5
    </p>
    <p className="text-gray-600">
      {feedbackMap[p.id].comment}
    </p>
  </div>
)}

        </div>
        
      ))}
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
    <p className="font-semibold text-slate-800">{value || "--"}</p>
  </div>
);

export default OrganizationRequestDetails;
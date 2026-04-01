import React, { useState, useEffect, useContext } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Eye,
  CheckCircle2,
  Clock,
  Inbox,
  AlertCircle,
  UserPlus,
  UserMinus,
  User,
  ArrowLeftRight,
  LayoutDashboard,
  ChevronLeft, // Added for pagination
  ChevronRight // Added for pagination
} from "lucide-react";
import AppNavbar from "../components/AppNavbar";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { MessageSquareText } from "lucide-react";
import { showError,showWarning } from "../utils/alertService";

const ROLE_TABS = {
  USER: ["all", "OPEN", "IN_PROGRESS", "FULL", "COMPLETED", "CANCELLED"],
  VOLUNTEER: ["all", "REQUESTED", "APPROVED", "REJECTED", "WITHDRAWN", "ATTENDED", "NO_SHOW", "COMPLETED", "CANCELLED"],
  ORGANIZATION_MEMBER: ["all", "REQUESTED", "APPROVED", "REJECTED", "WITHDRAWN", "ATTENDED", "NO_SHOW", "COMPLETED", "CANCELLED"]
};

const History = () => {
  const { user } = useContext(AuthContext);
  const role = user?.role;
  const [feedbackData, setFeedbackData] = useState([]);
const [feedbackOpen, setFeedbackOpen] = useState(false);

  const [viewMode, setViewMode] = useState(() => {
    if (role === "USER" || role === "BOTH") return "requests";
    if (role === "ORGANIZATION_MEMBER") return "participation";
    return "participation";
  });
  
  const tabs = viewMode === "requests"
    ? ROLE_TABS.USER 
    : (role === "ORGANIZATION_MEMBER" ? ROLE_TABS.ORGANIZATION_MEMBER : ROLE_TABS.VOLUNTEER);

  const [activeTab, setActiveTab] = useState("all");
  const [openRow, setOpenRow] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.userId) return;
      try {
        setLoading(true);
        const response = await api.get(`/history/user/${user.userId}`);
        const finalArray = response?.data?.data?.content || response?.data?.data || response?.data || [];
        setHistoryData(finalArray);
      } catch (error) {
        showError("Error", "Failed to load history");
        setHistoryData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.userId]);

  const filteredData = historyData.filter((item) => {
    const isPostedRequest = !!item.requestStatus;
    const isJoinedService = !!item.participationStatus;

    if (viewMode === "requests" && !isPostedRequest) return false;
    if (viewMode === "participation" && !isJoinedService) return false;

    if (activeTab === "all") return true;
    const statusToCompare = viewMode === "requests" ? item.requestStatus : item.participationStatus;
    return statusToCompare === activeTab;
  });

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setOpenRow(null); // Close any expanded rows when changing pages
  };
const loadFeedback = async (participationId) => {
  if (!participationId) return; // extra safety

  try {
    const res = await api.get(
      `/feedbacks/user-participation/${participationId}`
    );
    console.log("Feedback",res);
    console.log(res.data[0].comment)
    console.log(res.data.createdAt)
    setFeedbackData(res.data?.[0] || []);
    setFeedbackOpen(true);
  } catch (e) {
    // showError("Error", "Failed to load feedback");
    setFeedbackData([]);
    setFeedbackOpen(true);
  }
};
const getParticipationId = (req, userId) => {
  const participant = req.participants?.find(
    (p) => p.participantId === userId
  );

  return participant?.id || null;
};

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <AppNavbar />
      <div className="px-4 sm:px-6 md:px-8 pt-20 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1e40af]">History</h1>
          {role === "BOTH" && (
            <button
              onClick={() => {
                setViewMode(viewMode === "requests" ? "participation" : "requests");
                setActiveTab("all");
                setOpenRow(null);
                setCurrentPage(1); // Reset page on view switch
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-[#1e40af] text-[#1e40af] rounded-xl font-bold hover:bg-[#1e40af] hover:text-white transition-all shadow-sm"
            >
              <ArrowLeftRight size={18} />
              Switch to {viewMode === "requests" ? "Volunteer View" : "Requester View"}
            </button>
          )}
        </div>

        <p className="text-slate-700 mb-8 leading-relaxed max-w-2xl font-medium">
          {viewMode === "requests" 
            ? "Track your posted service requests and monitor volunteer participation."
            : "Track all the service requests you have joined or applied for."}
        </p>

        <div className="flex gap-2 sm:gap-3 mb-8 flex-wrap pt-2 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setOpenRow(null); setCurrentPage(1); }}
              className={`px-4 sm:px-6 py-2 text-[12px] sm:text-[14px] rounded-xl font-bold transition-all uppercase tracking-wider ${
                activeTab === tab ? "bg-[#1e40af] text-white shadow-m scale-105" : "bg-white text-slate-500 border border-slate-300 hover:bg-slate-50 hover:text-[#1e40af]"
              }`}
            >
              {tab === "all" ? "All" : tab.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-300 overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-[#1e40af] rounded-full animate-spin"></div>
              <p className="text-slate-500 mt-4 font-semibold">Loading your history...</p>
            </div>
          ) : currentItems.length > 0 ? (
            <>
             <div className="overflow-x-auto">
  <table className="min-w-[800px] w-full text-left border-collapse">
                <thead className="bg-[#f8fafc]">
                  <tr className="text-slate-600 text-[14px] uppercase tracking-[0.15em] font-extrabold border-b border-slate-400">
                    <th className="px-10 py-5 w-[30%] pl-10">Service Details</th>
                    <th className="py-5 text-left w-[20%] pl-15">Status</th>
                    <th className="px-4 py-5 w-[35%] pl-10">Location & Date</th>
                    <th className="px-8 py-5 text-center w-[15%]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((req) => {
                    const id = req.serviceId || req.id;
                    const status = viewMode === "requests" ? req.requestStatus : req.participationStatus;

                    return (
                      <React.Fragment key={id}>
                        <tr className={`group transition-all duration-200 border-b border-slate-300 ${openRow === id ? "bg-blue-50/60" : "hover:bg-slate-200 hover:shadow-md hover:-translate-y-2 cursor-pointer"}`}>
                          <td className="px-4 sm:px-6 py-4 sm:py-7" onClick={() => setOpenRow(openRow === id ? null : id)}>
                            <div className="flex flex-col">
                              <span className="text-[20px] font-semibold text-slate-800">{req.title}</span>
                              <span className="text-[13px] text-[#1e40af] font-semibold mt-1 uppercase tracking-wider">{req.category?.replace("_", " ")}</span>
                            </div>
                          </td>
                          <td className="py-7 pl-10" onClick={() => setOpenRow(openRow === id ? null : id)}>
                            <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[14px] font-semibold border ${
                              status === "COMPLETED" || status === "APPROVED" || status === "ATTENDED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                              status === "CANCELLED" || status === "REJECTED" || status === "NO_SHOW" || status === "WITHDRAWN" ? "bg-rose-50 text-rose-700 border-rose-100" :
                              "bg-blue-50 text-blue-700 border-blue-100"
                            }`}>
                              {(status === "COMPLETED" || status === "APPROVED" || status === "ATTENDED") && <CheckCircle2 size={12} />}
                              {status?.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-4 py-7 font-semibold text-slate-500" onClick={() => setOpenRow(openRow === id ? null : id)}>
                            <div className="flex items-center gap-2"><MapPin size={18} className="text-slate-400" />{req.location}</div>
                            <div className="flex items-center gap-2"><Calendar size={18} className="text-slate-400" />{new Date(req.serviceDate || req.createdAt).toLocaleDateString()}</div>
                          </td>
                    <td className="px-8 py-7 text-center">
  <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                            <button onClick={() => setOpenRow(openRow === id ? null : id)} className={`p-3 rounded-xl transition-all border ${openRow === id ? "bg-[#1e40af] text-white shadow-md scale-110" : "bg-white text-slate-400 border-slate-200 hover:text-[#1e40af]"}`}>
                              <Eye size={20} />
                            </button>
{role !== "USER" && !(role === "BOTH" && viewMode === "requests") && (
  <button
    onClick={() => {
      const participationId = getParticipationId(req, user?.userId);

      if (!participationId) {
       showWarning("Warning", "No participation found for this request");
return;
      }

      loadFeedback(participationId);
    }}
    className="p-3 rounded-xl border bg-white text-slate-400 hover:text-[#1e40af] ml-2"
  >
    <MessageSquareText size={20} />
  </button>
)}
</div>
                          </td>
                        </tr>
                        {openRow === id && (
                          <tr className="bg-slate-50/80">
                            <td colSpan="4" className="px-4 sm:px-6 md:px-10 py-6 sm:py-10 border-b border-slate-200 shadow-inner">
                              {viewMode === "participation" ? (
                                <div className="flex flex-col">
                                  <h3 className="text-[18px] font-bold text-slate-700 mb-4">Service Description</h3>
                                  <div className="bg-white p-8 rounded-2xl border border-slate-300 shadow-sm relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1e40af]" />
                                    <p className="text-slate-600 text-[16px] leading-relaxed font-medium">{req.description || "No additional details provided."}</p>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2 mb-6">
                                    <div className="p-1.5 bg-blue-100 rounded-lg text-[#1e40af]"><Users size={16} /></div>
                                    <h3 className="text-[18px] font-bold text-slate-700">Participated Volunteers</h3>
                                  </div>
                                  <div className="flex flex-wrap gap-5">
                                    {req.participants?.length > 0 ? (
                                      req.participants.map((p, i) => (
                                        <div key={i} className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 w-full sm:min-w-[240px]">
                                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-[#1e40af] border">
                                            {p.participantType === "ORGANIZATION" ? <LayoutDashboard size={24}/> : <User size={24} />}
                                          </div>
                                          <div>
                                            <p className="font-bold text-slate-800 text-[15px]">{p.participantName}</p>
                                            <p className="text-[12px] text-[#1e40af] font-bold uppercase">{p.participantType}</p>
                                          </div>
                                        </div>
                                      ))
                                    ) : <EmptyState status={status} />}
                                  </div>
                                </>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
              </div>
              {feedbackOpen && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
    <div className="bg-white max-w-lg w-full p-4 sm:p-6 rounded-2xl flex flex-col gap-3">

      <h2 className="text-xl font-bold mb-4 text-[#1e40af]">
        Feedback Received
      </h2>

      {feedbackData.length === 0 ? (
        <p className="text-gray-500">No feedback available</p>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {/* {feedbackData.map((f) => (
            <div
              key={f.id}
              className="border rounded-xl p-4 bg-slate-50"
            >
              <p className="font-bold text-slate-700">
                {f.givenBy}
              </p>
              <p className="text-yellow-500">
                ⭐ {f.rating} / 5
              </p>
              <p className="text-slate-600 mt-2">
                {f.comment}
              </p>
            </div>
          ))} */}
<div className="border-0 rounded-2xl p-6 bg-slate-50 min-h-[180px] flex flex-col gap-4 justify-between shadow-sm">

  <div>
    <p className="font-bold text-lg text-slate-800">
      {feedbackData.givenBy}
    </p>

    <p className="text-yellow-500 font-semibold">
      ⭐ {feedbackData.rating} / 5
    </p>

    <p className="text-slate-600 leading-relaxed">
      {feedbackData.comment}
    </p>
  </div>

  <p className="text-xs text-slate-400 mt-4">
    {new Date(feedbackData.createdAt).toLocaleString()}
  </p>

</div>
        </div>
      )}

      <div className="text-right mt-4">
        <button
          onClick={() => setFeedbackOpen(false)}
          className="px-4 py-2 bg-[#1e40af] text-white rounded-lg"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center px-4 sm:px-6 md:px-10 py-4 sm:py-6 bg-slate-50 border-t border-slate-200">
                  <span className="text-sm font-bold text-slate-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-3">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                      className="p-2 border rounded-xl bg-white disabled:opacity-30 hover:bg-blue-50 transition-all shadow-sm border-slate-300"
                    >
                      <ChevronLeft size={22} className="text-[#1e40af]" />
                    </button>
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="p-2 border rounded-xl bg-white disabled:opacity-30 hover:bg-blue-50 transition-all shadow-sm border-slate-300"
                    >
                      <ChevronRight size={22} className="text-[#1e40af]" />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Inbox size={40} className="text-slate-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-700">No records found</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ status }) => (
  <div className="flex flex-col items-center justify-center w-full py-10 border-2 border-dashed border-slate-300 rounded-[2rem] bg-slate-100/80 shadow-inner">
    <div className="p-4 bg-white/50 rounded-full mb-3 text-slate-400"><UserMinus size={32} /></div>
    <p className="font-bold text-slate-700">No participants yet</p>
    <p className="text-[13px] text-slate-500">Members will appear once they are approved for this status: {status}</p>
  </div>
);

export default History;
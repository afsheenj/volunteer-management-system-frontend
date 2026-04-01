import React, { useState, useEffect, useContext } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Eye,
  CheckCircle2,
  Inbox,
  User,
  LayoutDashboard,
  ArrowLeftRight,
  ShieldCheck,
  UserMinus,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import AppNavbar from "../components/AppNavbar";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { MessageSquareText } from "lucide-react";

const ROLE_CONFIG = {
  VOLUNTEER: { icon: <User size={24} />, color: "text-blue-600" },
  ORGANIZATION_MEMBER: { icon: <LayoutDashboard size={24} />, color: "text-purple-600" },
  ADMIN: { icon: <ShieldCheck size={24} />, color: "text-red-600" },
  USER: { icon: <User size={24} />, color: "text-slate-600" },
  BOTH: { icon: <User size={24} />, color: "text-emerald-600" }
};

const ROLE_TABS = {
  ORGANIZATION: ["all", "OPEN", "IN_PROGRESS", "FULL", "COMPLETED", "CANCELLED"],
  PARTICIPATION: ["all", "REQUESTED", "APPROVED", "REJECTED", "WITHDRAWN", "ATTENDED", "NO_SHOW", "COMPLETED", "CANCELLED"]
};

const OrganizationHistory = () => {
  const { user } = useContext(AuthContext);
  const [viewMode, setViewMode] = useState("posts");
  const [activeTab, setActiveTab] = useState("all");
  const [openRow, setOpenRow] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [feedbackData, setFeedbackData] = useState([]);
const [feedbackOpen, setFeedbackOpen] = useState(false);


  const tabs = viewMode === "posts" ? ROLE_TABS.ORGANIZATION : ROLE_TABS.PARTICIPATION;

  useEffect(() => {
    const fetchOrgHistory = async () => {
      if (!user?.orgId) return;
      try {
        setLoading(true);
        const response = await api.get(`/history/organization/${user.orgId}`);
        const data = response?.data?.data?.content || response?.data?.data || response?.data || [];
        setHistoryData(data);
      } catch (error) {
        console.error("Error fetching org history:", error);
        setHistoryData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrgHistory();
  }, [user?.orgId]);

  // STRENGHTENED FILTER LOGIC
  const filteredData = historyData.filter((item) => {
    const isPostedByMe = !item.participationStatus && !!item.requestStatus;
    const isJoinedByMe = !!item.participationStatus;

    if (viewMode === "posts") {
      if (!isPostedByMe) return false;
      if (activeTab !== "all" && item.requestStatus !== activeTab) return false;
    } else {
      if (!isJoinedByMe) return false;
      if (activeTab !== "all" && item.participationStatus !== activeTab) return false;
    }
    return true;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setOpenRow(null);
    setCurrentPage(1);
  };

  const handleViewModeSwitch = () => {
    setViewMode(viewMode === "posts" ? "participation" : "posts");
    setActiveTab("all");
    setOpenRow(null);
    setCurrentPage(1);
  };

const loadFeedback = async (participationId) => {
  if (!participationId) return;

  try {
    const res = await api.get(
      `/feedbacks/organization-participation/${participationId}`
    );
    console.log("Feedback Data",res)

    setFeedbackData(res.data?.[0] || {});
    setFeedbackOpen(true);
  } catch (e) {
    console.log("Feedback error", e);
    setFeedbackData({});
    setFeedbackOpen(true);
  }
};

const getParticipationId = (item, orgId) => {
  const participant = item.participants?.find(
    (p) => p.participantId === orgId
  );

  return participant?.id || null;
};

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      <AppNavbar />
      <div className="px-4 md:px-8 pt-20 max-w-[1600px] mx-auto flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-2">
          <h1 className="text-2xl md:text-4xl font-bold text-[#1e40af] flex items-center gap-3">
            <LayoutDashboard size={36} />
            {viewMode === "posts" ? "Posting History" : "Participation History"}
          </h1>
          <button
            onClick={handleViewModeSwitch}
            className="w-full md:w-auto flex items-center gap-2 px-4 py-2 bg-white border border-[#1e40af] text-[#1e40af] rounded-xl font-bold hover:bg-[#1e40af] hover:text-white transition-all shadow-sm"
          >
            <ArrowLeftRight size={18} /> 
            Switch to {viewMode === "posts" ? "Participation View" : "Organization View"}
          </button>
        </div>

        <p className="text-slate-700 mb-8 font-medium leading-relaxed max-w-2xl">
          {viewMode === "posts" 
            ? "Monitor and manage service requests posted by your organization." 
            : "Track service requests your organization has joined as a participant."}
        </p>

        <div className="flex gap-3 mb-6 overflow-x-auto whitespace-nowrap pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-6 py-2 rounded-xl text-[15px] font-bold transition-all uppercase tracking-wider ${
                activeTab === tab 
                ? "bg-[#1e40af] text-white shadow-md scale-105" 
                : "bg-white text-slate-500 border border-slate-300 hover:bg-slate-50 hover:text-[#1e40af]"
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
              <p className="text-slate-500 mt-4 font-semibold">Fetching records...</p>
            </div>
          ) : currentItems.length > 0 ? (
            <>
            <div className="hidden md:block">
              <table className="w-full text-left table-fixed border-collapse">
                <thead className="bg-[#f8fafc]">
                  <tr className="text-slate-600 text-[14px] uppercase tracking-[0.15em] font-extrabold border-b border-slate-400">
                    <th className="px-10 py-5 w-[35%]">Campaign Details</th>
                    <th className="py-5 w-[20%] pl-10">Status</th>
                    <th className="px-4 py-5 w-[30%] pl-10">Schedule & Venue</th>
                    <th className="px-8 py-5 text-center w-[15%]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => {
                    const id = item.serviceId || item.id;
                    const status = viewMode === "posts" ? item.requestStatus : item.participationStatus;
                    
                    return (
                      <React.Fragment key={id}>
                        <tr className={`group border-b border-slate-300 transition-all duration-200 ${
                          openRow === id ? "bg-blue-50/60" : "hover:bg-slate-100 cursor-pointer"
                        }`}>
                          <td className="px-10 py-7" onClick={() => setOpenRow(openRow === id ? null : id)}>
                            <div className="flex flex-col">
                              <span className="font-semibold text-[16px] md:text-[20px] text-slate-800">{item.title}</span>
                              <span className="text-[13px] text-[#1e40af] font-semibold mt-1 uppercase tracking-wider">
                                {item.category?.replace("_", " ")}
                              </span>
                            </div>
                          </td>
                          <td className="py-7 pl-10" onClick={() => setOpenRow(openRow === id ? null : id)}>
                            <StatusBadge status={status} />
                          </td>
                          <td className="px-4 py-7 font-semibold text-slate-500" onClick={() => setOpenRow(openRow === id ? null : id)}>
                             <div className="flex items-center gap-2 mb-1">
                               <MapPin size={18} className="text-slate-400"/> {item.location}
                             </div>
                             <div className="flex items-center gap-2">
                               <Calendar size={18} className="text-slate-400"/> {new Date(item.serviceDate || item.createdAt).toLocaleDateString()}
                             </div>
                          </td>
                          <td className="px-8 py-7 text-center">
 <div className="flex justify-center gap-3">
  <button 
    onClick={() => setOpenRow(openRow === id ? null : id)} 
    className={`p-3 rounded-xl transition-all border ${
      openRow === id ? "bg-[#1e40af] text-white shadow-md" : "bg-white text-slate-400 border-slate-200 hover:text-[#1e40af]"
    }`}
  >
    <Eye size={20} />
  </button>

  {viewMode === "participation" && (
    <button
      onClick={() => {
        const participationId = getParticipationId(item, user?.orgId);

        if (!participationId) {
          console.warn("No participation found", item);
          return;
        }

        loadFeedback(participationId);
      }}
      className="p-3 rounded-xl border bg-white text-slate-400 hover:text-[#1e40af]"
    >
      <MessageSquareText size={20} />
    </button>
  )}
</div>
                            
                          </td>
                        </tr>

                        {openRow === id && (
                          <tr className="bg-slate-50/80">
                            <td colSpan="4" className="px-10 py-10 border-b border-slate-200 shadow-inner">
                              {viewMode === "participation" ? (
                                <div className="flex flex-col">
                                  <h3 className="text-[18px] font-bold text-slate-700 mb-4">Service Description</h3>
                                  <div className="bg-white p-8 rounded-2xl border border-slate-300 shadow-sm relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#1e40af]" />
                                    <p className="text-slate-600 text-[16px] leading-relaxed font-medium">
                                      {item.description || "No description provided."}
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="flex items-center gap-2 mb-6">
                                    <div className="p-1.5 bg-blue-100 rounded-lg text-[#1e40af]"><Users size={16} /></div>
                                    <h3 className="text-[18px] font-bold text-slate-700">Signed Up Participants</h3>
                                  </div>
                                  <div className="flex flex-wrap gap-5">
                                    {item.participants?.length > 0 ? (
                                      item.participants.map((p, i) => {
                                        const config = ROLE_CONFIG[p.participantType] || ROLE_CONFIG.USER;
                                        return (
                                          <div key={i} className="bg-white px-5 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 min-w-[260px]">
                                            <div className={`w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border ${config.color}`}>
                                              {config.icon}
                                            </div>
                                            <div>
                                              <p className="font-bold text-slate-800 text-[15px]">{p.participantName}</p>
                                              <p className={`text-[12px] font-bold uppercase ${config.color}`}>
                                                {p.participantType?.replace("_", " ")}
                                              </p>
                                            </div>
                                            
                                          </div>
                                        );
                                      })
                                    ) : (
                                      <EmptyParticipantsState status={status} />
                                    )}
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
            <div className="md:hidden flex flex-col gap-4 p-4">
  {currentItems.map((item) => {
    const id = item.serviceId || item.id;
    const status = viewMode === "posts"
      ? item.requestStatus
      : item.participationStatus;

    return (
      <div
        key={id}
        className="bg-white rounded-2xl shadow-sm border p-4 flex flex-col gap-3"
      >
        {/* Title */}
        <div>
          <p className="font-bold text-lg text-slate-800">
            {item.title}
          </p>
          <p className="text-xs text-[#1e40af] font-semibold uppercase">
            {item.category?.replace("_", " ")}
          </p>
        </div>

        {/* Status */}
        <StatusBadge status={status} />

        {/* Location + Date */}
        <div className="text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <MapPin size={16} /> {item.location}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            {new Date(item.serviceDate || item.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => setOpenRow(openRow === id ? null : id)}
            className="flex-1 p-2 rounded-lg border text-sm"
          >
            View
          </button>

          {viewMode === "participation" && (
            <button
              onClick={() => {
                const participationId = getParticipationId(item, user?.orgId);
                if (participationId) loadFeedback(participationId);
              }}
              className="flex-1 p-2 rounded-lg border text-sm"
            >
              Feedback
            </button>
          )}
        </div>

        {/* Expand section */}
        {openRow === id && (
          <div className="mt-3 text-sm text-slate-600 border-t pt-3">
            {item.description || "No description"}
          </div>
        )}
      </div>
    );
  })}
</div>
              {feedbackOpen && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
    <div className="bg-white w-full max-w-lg rounded-2xl p-4 md:p-6 flex flex-col gap-3 max-h-[90vh] overflow-y-auto">

      <h2 className="text-xl font-bold mb-4 text-[#1e40af]">
        Feedback Received
      </h2>

      {!feedbackData || Object.keys(feedbackData).length === 0 ? (
        <p className="text-gray-500">No feedback available</p>
      ) : (
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

              {totalPages > 1 && (
                <div className="flex justify-between items-center px-10 py-6 bg-slate-50 border-t border-slate-200">
                  <span className="text-sm font-bold text-slate-500">
                    Page {currentPage} of {totalPages}
                  </span>
                  <div className="flex gap-3">
                    <button 
                      disabled={currentPage === 1}
                      onClick={() => { setCurrentPage(prev => prev - 1); setOpenRow(null); }}
                      className="p-2 border rounded-xl bg-white disabled:opacity-30 hover:bg-blue-50 transition-all shadow-sm border-slate-300"
                    >
                      <ChevronLeft size={22} className="text-[#1e40af]" />
                    </button>
                    <button 
                      disabled={currentPage === totalPages}
                      onClick={() => { setCurrentPage(prev => prev + 1); setOpenRow(null); }}
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
              <Inbox size={56} className="text-slate-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-700">No history found</h3>
              <p className="text-slate-500">Records will appear here once service requests are active.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const isPositive = ["COMPLETED", "APPROVED", "ATTENDED", "OPEN"].includes(status);
  const isNegative = ["CANCELLED", "REJECTED", "NO_SHOW", "WITHDRAWN"].includes(status);
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-bold border uppercase tracking-wide ${
      isPositive ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
      isNegative ? "bg-rose-50 text-rose-700 border-rose-100" :
      "bg-blue-50 text-blue-700 border-blue-100"
    }`}>
      {isPositive && <CheckCircle2 size={12} />}
      {status?.replace("_", " ")}
    </span>
  );
};

const EmptyParticipantsState = ({ status }) => (
  <div className="flex flex-col items-center justify-center w-full py-10 border-2 border-dashed border-slate-300 rounded-[2rem] bg-slate-100/80">
    <div className="p-4 bg-white/50 rounded-full mb-3 text-slate-400"><UserMinus size={32} /></div>
    <p className="font-bold text-slate-700">No participants yet</p>
    <p className="text-[13px] text-slate-500">Volunteers will appear here once they join your "{status}" campaign.</p>
  </div>
);

export default OrganizationHistory;
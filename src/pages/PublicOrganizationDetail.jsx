import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Building2, Mail, Phone, MapPin, 
  ArrowLeft, LayoutList, Handshake,
  Eye, CheckCircle2, Clock, AlertCircle, Inbox, Calendar,
  ChevronLeft, ChevronRight 
} from "lucide-react";
import AppNavbar from "../components/AppNavbar";
import LoadingSpinner from "../components/LoadingSpinner";
import api from "../services/api";

const PublicOrganizationDetail = () => {
  const { id } = useParams(); // This ID represents the Organization being viewed
  const navigate = useNavigate();
  
  const [data, setData] = useState({ profile: null, address: null });
  const [history, setHistory] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posted");
  const [openRow, setOpenRow] = useState(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  useEffect(() => {
    if (id) {
      fetchAllDetails();
    }
  }, [id]);

  const fetchAllDetails = async () => {
    try {
      setLoading(true);
      // Ensure these endpoints are accessible to all roles in your Backend
      const [profileRes, addressRes, historyRes] = await Promise.all([
        api.get(`/organizations/profile/${id}`),
        api.get(`/organizations/profile/${id}/address`).catch(() => ({ data: null })),
        api.get(`/history/organization/${id}`) 
      ]);
      
      setData({
        profile: profileRes.data?.data || profileRes.data,
        address: addressRes.data?.data || addressRes.data
      });
      
      // Extract history content
      const historyList = historyRes?.data?.data?.content || 
                         historyRes?.data?.data || 
                         historyRes?.data || [];
      
      setHistory(Array.isArray(historyList) ? historyList : []);
    } catch (err) {
      console.error("Error loading details", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };


  const filteredHistory = history.filter(item => {
  // item.participationStatus is null for POSTED services 
  // item.participationStatus has a value for JOINED services
  
  if (activeTab === "posted") {
    // Show only what they created
    
    // return !item.participationStatus;

    return !item.participationStatus && (item.roleInService === "ORGANIZER" || !!item.requestStatus);

  } else {
    // Show only what they joined as a partner
    return !!item.participationStatus;
  }
});

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setOpenRow(null);
    setCurrentPage(1);
  };

  if (loading) return <LoadingSpinner text="Fetching Organization Data..." />;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <AppNavbar />

      <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-10 xl:px-16 w-full flex flex-col gap-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-[#1e40af] transition-colors font-semibold w-fit"
        >
          <ArrowLeft size={20} /> Back to Directory
        </button>

        {/* Profile Card */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-24 h-24 bg-blue-50 rounded-2xl flex items-center justify-center text-[#1e40af] border border-blue-100 shrink-0">
            <Building2 size={48} />
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{data.profile?.organizationName || data.profile?.name}</h1>
            <p className="text-slate-500 font-medium leading-relaxed max-w-3xl mb-6 pt-2">
              {data.profile?.description || "Dedicated to social service and community growth."}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-center gap-3 text-slate-700 bg-slate-100 p-4 rounded-xl border border-slate-300 shadow-sm">
                <Mail size={18} className="text-[#1e40af]" />
                <span className="text-sm font-semibold">{data.profile?.email || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 bg-slate-100 p-4 rounded-xl border border-slate-300 shadow-sm">
                <Phone size={18} className="text-[#1e40af]" />
                <span className="text-sm font-semibold">{data.profile?.phone || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700 bg-slate-100 p-4 rounded-xl border border-slate-300 shadow-sm">
                <MapPin size={18} className="text-[#1e40af]" />
                <span className="text-sm font-semibold">
                  {data.address ? `${data.address.city}, ${data.address.state}` : "Location N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and History Table */}
        <div className="flex flex-col gap-6">
          <div className="flex gap-4 border-b border-slate-200">
            <button 
              onClick={() => handleTabChange("posted")}
              className={`pb-4 px-2 flex items-center gap-2 font-bold transition-all border-b-2 ${
                activeTab === "posted" ? "border-[#1e40af] text-[#1e40af]" : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <LayoutList size={20} /> Service Requests
            </button>
            <button 
              onClick={() => handleTabChange("joined")}
              className={`pb-4 px-2 flex items-center gap-2 font-bold transition-all border-b-2 ${
                activeTab === "joined" ? "border-[#1e40af] text-[#1e40af]" : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              <Handshake size={20} /> Joined Initiatives
            </button>
          </div>

          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden">
            {currentItems.length > 0 ? (
              <>
                <div className="hidden md:block">
  <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-300">
                    <tr className="text-slate-600 text-[13px] uppercase tracking-widest font-bold">
                      <th className="px-8 py-5">Service Title</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5">Date</th>
                      <th className="px-8 py-5 text-center">View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map((item) => {
                      const rowId = item.id || item.serviceId;
                      const status = activeTab === "posted" ? item.requestStatus : item.participationStatus;
                      
                      return (
                        <React.Fragment key={rowId}>
                          <tr 
                            className={`border-b border-slate-100 transition-all duration-200 cursor-pointer
                              ${openRow === rowId ? 'bg-slate-100' : 'hover:bg-slate-200 hover:shadow-md hover:-translate-y-2'} 
                            `}
                            onClick={() => setOpenRow(openRow === rowId ? null : rowId)}
                          >
                            <td className="px-8 py-6">
                              <div className="flex flex-col">
                                <span className="font-bold text-slate-800 text-lg">{item.title || item.serviceName}</span>
                                <span className="text-xs text-[#1e40af] font-bold uppercase tracking-tight">{item.category}</span>
                              </div>
                            </td>
                            <td className="px-8 py-6">
                              <StatusBadge status={status} />
                            </td>
                            <td className="px-8 py-6 text-slate-500 font-medium">
                              <div className="flex items-center gap-2">
                                <Calendar size={16} />
                                {new Date(item.serviceDate || item.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-8 py-6 text-center">
                              <button 
                                className={`p-2 rounded-lg transition-all ${openRow === rowId ? 'bg-[#1e40af] text-white' : 'bg-slate-100 text-slate-400 hover:text-[#1e40af]'}`}
                              >
                                <Eye size={20} />
                              </button>
                            </td>
                          </tr>
                          {openRow === rowId && (
                            <tr className="bg-slate-50/50">
                              <td colSpan="4" className="px-8 py-6">
                                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                                  <h4 className="font-bold text-slate-700 mb-2">Description</h4>
                                  <p className="text-slate-600 leading-relaxed">{item.description || "No detailed description provided."}</p>
                                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                                    <MapPin size={16} /> {item.location || "Location not specified"}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
</div>
{/* Mobile & Tablet Card View */}
<div className="block md:hidden space-y-4 p-4">
  {currentItems.map((item) => {
    const rowId = item.id || item.serviceId;
    const status =
      activeTab === "posted"
        ? item.requestStatus
        : item.participationStatus;

    return (
      <div
        key={rowId}
        className="bg-white rounded-2xl p-5 shadow border border-slate-200"
      >
        {/* Title */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg text-slate-800">
              {item.title || item.serviceName}
            </h3>
            <p className="text-xs text-[#1e40af] font-semibold">
              {item.category}
            </p>
          </div>

          <StatusBadge status={status} />
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mt-3">
          <Calendar size={14} />
          {new Date(
            item.serviceDate || item.createdAt
          ).toLocaleDateString()}
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mt-2">
          <MapPin size={14} />
          {item.location || "Location not specified"}
        </div>

        {/* Expand button */}
        <button
          onClick={() =>
            setOpenRow(openRow === rowId ? null : rowId)
          }
          className="mt-4 text-sm text-[#1e40af] font-semibold"
        >
          {openRow === rowId ? "Hide Details" : "View Details"}
        </button>

        {/* Expand content */}
        {openRow === rowId && (
          <div className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
            {item.description ||
              "No detailed description provided."}
          </div>
        )}
      </div>
    );
  })}
</div>
                {totalPages > 1 && (
                  <div className="flex justify-between items-center px-8 py-5 bg-slate-50 border-t border-slate-200">
                    <span className="text-sm font-bold text-slate-500">Page {currentPage} of {totalPages}</span>
                    <div className="flex gap-2">
                      <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="p-2 border rounded-xl bg-white disabled:opacity-30 hover:bg-blue-50 transition-all shadow-sm"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="p-2 border rounded-xl bg-white disabled:opacity-30 hover:bg-blue-50 transition-all shadow-sm"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 flex flex-col items-center text-center">
                <div className="bg-slate-50 p-6 rounded-full mb-4">
                  <Inbox size={48} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-700">No records found</h3>
                <p className="text-slate-500 max-w-xs mx-auto">This organization hasn't {activeTab === "posted" ? "posted any requests" : "joined any initiatives"} yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const isPositive = ["COMPLETED", "OPEN", "FULL", "APPROVED", "ATTENDED", "ACTIVE"].includes(status);
  const isNegative = ["CANCELLED", "REJECTED", "WITHDRAWN", "NO_SHOW"].includes(status);
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold border 
      ${isPositive ? "bg-emerald-50 text-emerald-700 border-emerald-100" : 
        isNegative ? "bg-rose-50 text-rose-700 border-rose-100" : 
        "bg-blue-50 text-blue-700 border-blue-100"}`}>
      {isPositive ? <CheckCircle2 size={12} /> : isNegative ? <AlertCircle size={12} /> : <Clock size={12} />}
      {status?.replace("_", " ")}
    </span>
  );
};

export default PublicOrganizationDetail;
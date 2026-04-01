import React, { useState, useEffect } from "react";
import { 
  Search, Users, Inbox, ChevronLeft, ChevronRight, 
  ShieldCheck, Mail, Building2, PlusCircle 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import AppNavbar from "../components/AppNavbar";
import Spinner from "../components/LoadingSpinner";
import api from "../services/api";

const Organizations = () => {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchInput, setSearchInput] = useState(""); // Immediate state for input field
  const [searchTerm, setSearchTerm] = useState("");   // Debounced state for API calls

  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const [totalPages, setTotalPages] = useState(0);

  // DEBOUNCE LOGIC: 
  // Updates searchTerm only after user stops typing for 300ms
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(0); // Reset to first page on new search
      setSearchTerm(searchInput);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  // API TRIGGER:
  // Watches for page changes or debounced searchTerm changes
  useEffect(() => {
    fetchOrganizations();
  }, [page, searchTerm]);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/public/organizations/list", {
        params: {
          page,
          size,
          search: searchTerm,
          sortBy: "orgName",
          order: "asc"
        }
      });

      const result = response.data.data || response.data;
      setOrganizations(result.content || []);
      setTotalPages(result.totalPages || 0);
    } catch (err) {
      console.error("Error fetching organizations", err);
    } finally {
      setLoading(false);
    }
  };

  // Keep manual search for the button click if needed
  const handleSearchClick = () => {
    setPage(0);
    setSearchTerm(searchInput);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      <AppNavbar />

      <div className="px-4 sm:px-6 md:px-8 pt-24 max-w-full mx-auto flex flex-col gap-6">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[#1e40af] mb-1">
              Partner Organizations
            </h1>
            <p className="text-slate-500 font-medium">
              Discover and connect with our global network of service partners.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 sm:w-80">
              <input
                type="text"
                placeholder="Search organizations..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-4 pr-12 py-2.5 rounded-lg border border-slate-300 outline-none shadow-sm focus:ring-2 focus:ring-blue-100"
              />
              <div
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-[#1e40af] cursor-pointer"
                onClick={handleSearchClick}
                // className="absolute right-0 top-0 bottom-0 px-4 bg-[#1e40af] text-white rounded-r-lg hover:bg-[#1a369d]"
              >
                <Search size={18} />
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : organizations.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              {organizations.map((org) => (
                <OrganizationRow key={org.id} org={org} />
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 pt-8 border-t border-slate-100 mt-6">
               <span className="text-sm font-semibold text-slate-500">Page {page + 1} of {totalPages}</span>
               <div className="flex gap-1">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((prev) => prev - 1)}
                  className="p-1.5 border rounded-lg bg-slate-50 disabled:opacity-30 hover:bg-white transition-colors shadow-sm"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  disabled={page === totalPages - 1}
                  onClick={() => setPage((prev) => prev + 1)}
                  className="p-1.5 border rounded-lg bg-slate-50 disabled:opacity-30 hover:bg-white transition-colors shadow-sm"
                >
                  <ChevronRight size={18} />
                </button>
               </div>
            </div>
          </div>
        ) : (
          <EmptyState clearSearch={() => { setSearchInput(""); setSearchTerm(""); }} />
        )}
      </div>
    </div>
  );
};

const OrganizationRow = ({ org }) => {
  const navigate = useNavigate();
  
  const formatStatus = (status) => {
    if (!status) return "Unknown";
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const getStatusStyles = (status) => {
    switch(status) {
      case 'ACTIVE': return 'bg-green-50 text-green-600 border-green-100';
      case 'PENDING':
      case 'PENDING_VERIFICATION': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'REJECTED': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
   <div className="flex flex-col sm:flex-row sm:items-center justify-between py-5 px-4 sm:px-6 border border-transparent rounded-2xl transition-all duration-300 hover:bg-slate-50 sm:hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/25 hover:border-slate-200 group">
      <div className="flex gap-4 sm:gap-6 flex-1">
        <div className="w-14 h-14 bg-[#1e40af] rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-100 transition-transform group-hover:scale-110">
          <Building2 size={28} />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
             <h3 className="font-bold text-slate-700 text-lg sm:text-xl md:text-[22px] tracking-tight">
               {org.organizationName}
             </h3>
          </div>
          <div className="flex items-center gap-1.5 text-[15px] text-slate-500 mb-1">
            <Mail size={14} />
            {org.email}
          </div>
          <button 
            onClick={() => navigate(`/organization/${org.id}`)}
            className="text-[#1e40af] font-black text-[11px] uppercase tracking-widest mt-2 hover:underline text-left w-fit flex items-center gap-1 pt-2"
          >
            View Profile
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mt-4 sm:mt-0">
        <div className="flex flex-wrap sm:flex hidden lg:flex items-center gap-3 text-slate-500 font-bold text-sm">
            <button className="flex items-center gap-2 border border-slate-200 px-4 py-2.5 rounded-xl bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-[#1e40af] transition-all shadow-sm group/btn">
              <Users size={16} className="text-slate-400 group-hover/btn:text-[#1e40af]" /> 
              {org.totalMembers || 0} Members
            </button>
            <div className={`flex items-center gap-2 border px-4 py-2.5 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-sm ${getStatusStyles(org.status)}`}>
              <ShieldCheck size={16} /> 
              {formatStatus(org.status)}
            </div>
        </div>
        <button className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-[#1e40af] text-white rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-[#1a369d] shadow-lg shadow-blue-100 min-w-[120px] active:scale-95 transition-all">
          <a
            href={`mailto:${org.email}?subject=Contact Request&body=Hello, I would like to know more about your services.`}
          >
            Contact
          </a>
        </button>
      </div>
    </div>
  );
};

const EmptyState = ({ clearSearch }) => (
  <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4 bg-white border-2 border-dashed border-slate-200 rounded-3xl text-center">
    <Inbox size={64} className="text-slate-200 mb-4" />
    <h2 className="text-xl font-black text-slate-800 tracking-tight pb-4">No organizations found</h2>
    <button onClick={clearSearch} className="mt-6 px-8 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-[#1e40af] transition-all">
      Clear all filters
    </button>
  </div>
);

export default Organizations;
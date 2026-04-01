import {
  Calendar,
  MapPin,
  Users,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import { useContext, useEffect, useState } from "react";
import AppNavbar from "../components/AppNavbar";
import Spinner from "../components/LoadingSpinner";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api"
import { showConfirm, showError, showNumberInput, showSuccess, showWarning } from "../utils/alertService";
import { aiSearchRequests } from "../services/requestService";
import { useLocation} from "react-router-dom";



const PostedRequests = () => {
  
  const location = useLocation();
  const [page, setPage] = useState(0);
  const [size] = useState(6);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const userId = user?.userId;
  const role = user?.role;
  const orgId = user?.orgId;
  const [requests, setRequests] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [joinedRequests, setJoinedRequests] = useState([]);

  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const [selectedServiceType, setSelectedServiceType] = useState("ALL");

  // ADD THESE STATES
const [stateList, setStateList] = useState([]);
const [citiesList, setCitiesList] = useState([]);
const [selectedState, setSelectedState] = useState("ALL");
const [serviceTypes, setServiceTypes] = useState([]);

  useEffect(() => {
    fetchRequests();
  if (userId || orgId) {
    fetchJoinedRequests();
  }
  }, [page, userId, orgId, selectedState, selectedLocation, selectedServiceType, selectedDate, stateList]);

const fetchRequests = async () => {
  if (selectedState !== "ALL" && stateList.length === 0) return;
  try {
    setLoading(true);

    const stateObj = stateList?.find(s => s.iso2 === selectedState);
    const stateName = stateObj ? stateObj.name : "";

    const locationParam =
      selectedLocation !== "ALL"
        ? selectedLocation
        : selectedState !== "ALL"
        ? stateName
        : "";

    const res = await aiSearchRequests({
      page,
      size,
      query: search.trim(), // "" allowed
      location: locationParam, // "" means ALL
      serviceType: selectedServiceType === "ALL" ? "" : selectedServiceType,
      date: selectedDate || null,
    });

    const data = res;

    setRequests(data.content || []);
    setTotalPages(data.totalPages || 0);

  } catch (err) {
    console.error("Failed to fetch requests", err);
  } finally {
    setLoading(false);
  }
};

  const fetchJoinedRequests = async () => {
    
  try {
    let res;
    if (!userId && !orgId) return;
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
    // const ids = res.data.content.map(p => p.serviceId);
        console.log("Joined requests",res);
    const joinedData = res?.data?.content || [];
    const ids = joinedData.map(p => p.serviceId);
    setJoinedRequests(ids);

  } catch (err) {
    console.error("Error fetching joined requests", err);
    setJoinedRequests([]);
  }
};

  const handleSearch = () => {
  setPage(0); // reset pagination
  fetchRequests();
};

const fetchState = async () => {
  try {
    const res = await api.get("/countries/IN/states");

    console.log("STATE API RESPONSE:", res);

    // FIX: use res directly (same as working page)
    setStateList(Array.isArray(res) ? res : []);

  } catch (e) {
    console.log(e);
  }
};

const fetchCities = async (stateIso) => {
  try {
    if (stateIso === "ALL") {
      setCitiesList([]);
      return;
    }

    const res = await api.get(`/countries/IN/states/${stateIso}/cities`);

    console.log("Cities received:", res);

    // FIX
    setCitiesList(Array.isArray(res) ? res : []);

  } catch (e) {
    console.log("Failed to fetch cities", e);
  }
};

const fetchServiceTypes = async () => {
  try {
    const res = await api.get("enums/categories"); // your enum API
    setServiceTypes(Array.isArray(res) ? res : []);
  } catch (e) {
    console.log(e);
  }
};

// Load states on page load
useEffect(() => {
  fetchState();
  fetchServiceTypes();
}, []);


// Load cities when state changes
useEffect(() => {
  if (selectedState !== "ALL") {
    fetchCities(selectedState);
  } else {
    setCitiesList([]);
  }
}, [selectedState]);

// UPDATE the category useEffect to handle subsequent navigation changes
  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedServiceType(location.state.selectedCategory);
      setPage(0);

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.selectedCategory, navigate, location.pathname]);

  const getPageNumbers = () => {
  const pages = [];
  const maxVisible = 5; // how many buttons you want

  let start = Math.max(0, page - Math.floor(maxVisible / 2));
  let end = start + maxVisible;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(0, end - maxVisible);
  }

  // Add first page + dots
  if (start > 0) {
    pages.push(0);
    if (start > 1) pages.push("...");
  }

  // Middle pages
  for (let i = start; i < end; i++) {
    pages.push(i);
  }

  // Add last page + dots
  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("...");
    pages.push(totalPages - 1);
  }

  return pages;
};
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">
      <AppNavbar />

      <div className="p-4 sm:p-6 md:p-8 pt-20 flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-[#1e40af] mb-2">
          Posted Requests
        </h1>

        {/* Filters & Search */}

       <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
            <select 
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedLocation("ALL"); // reset city
            }}
            className="w-full sm:w-44 px-4 py-2 rounded-lg border border-slate-300">
              {/* <option>All Locations</option> */}
              <option value="ALL">All States</option>
              {stateList.map((state) => (
              <option key={state.iso2} value={state.iso2}>
              {state.name}
              </option>
              ))}
            </select>

            {/* CITY DROPDOWN */}
            <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300"
            >
            <option value="ALL">All Cities</option>
              {citiesList.map((city) => (
              <option key={city.name} value={city.name}>
              {city.name}
            </option>
            ))}
          </select>

          <select
            value={selectedServiceType}
            onChange={(e) => setSelectedServiceType(e.target.value)}
           className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300"
          >
            <option value="ALL">All Categories</option>

            {serviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
             className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-300"
            />
          </div>

          <div className="w-full md:w-96 flex flex-col sm:flex-row gap-2">
            <div className="flex flex-col md:flex-row w-full md:w-96 mt-2 md:mt-0">
              <input
                type="text"
                placeholder="Search requests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 rounded-lg md:rounded-r-none border border-slate-300 outline-none"
              />

              <button 
onClick={handleSearch}
className="mt-2 md:mt-0 md:ml-0 px-4 sm:px-6 py-2 bg-[#1e40af] text-white rounded-lg md:rounded-l-none font-semibold hover:bg-[#1a369d] whitespace-nowrap">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Loading */}

        {loading ? (
          <Spinner />
        ) : (
          <>
            {/* Cards */}

            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-8 pt-4 auto-rows-fr items-stretch">
              {requests.length > 0 ? (
                requests.map((req) => (
                <RequestCard
                  key={req.id}
                  id={req.id}
                  title={req.title}
                  date={req.serviceDate}
                  location={req.location}
                  state={req.state}
                  city={req.city}
                  maxVolunteers={req.maxVolunteers}
                  minVolunteers={req.minVolunteers}
                  status={req.status}
                  description={req.description}
                  postedBy={req.postedBy}
                  createdByType={req.createdByType}
                  registeredCount={req.registeredCount}
                  joinedRequests={joinedRequests}
                  setJoinedRequests={setJoinedRequests}
                />
                
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-2 mt-10">
                  {search && !selectedDate
                    ? `No requests found for "${search}"`
                    : selectedDate && !search
                    ? `No requests found for ${selectedDate}`
                    : "No requests found."}
                </p>
            )}
            </div>

            {/* Pagination */}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 pt-2">
              <p className="text-sm text-slate-600">
                Page {page + 1} of {totalPages}
              </p>

              <div className="flex items-center gap-2 text-sm">
                <button
                  className="p-2 rounded-lg border border-slate-300"
                  disabled={page === 0}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  <ChevronLeft size={16} />
                </button>

{getPageNumbers().map((p, i) =>
  p === "..." ? (
    <span key={i} className="px-2 text-gray-500">...</span>
  ) : (
    <button
      key={i}
      className={`px-3 py-1 rounded-lg ${
        p === page
          ? "bg-[#1e40af] text-white"
          : "bg-white border border-slate-300"
      }`}
      onClick={() => setPage(p)}
    >
      {p + 1}
    </button>
  )
)}

                <button
                  className="p-2 rounded-lg border border-slate-300"
                  disabled={page === totalPages - 1}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ---------- CARD ---------- */

        const RequestCard = ({
          id,
          title,
          date,
          location,
          state,
          city,
          maxVolunteers,
          minVolunteers,
          status,
          createdByType,
          postedBy,
          registeredCount,
          description,
          joinedRequests,
          setJoinedRequests
        }) => {
          const {user} = useContext(AuthContext);
          const alreadyJoined = joinedRequests?.includes(id);
          const role = user?.role;
          const organizationId = user?.orgId;
          const userId = user?.userId;

          const [currentRegistered, setCurrentRegistered] = useState(registeredCount);


          const participate = async () => {
          try {
            if (!role){
              await showWarning("Login Required", "Please login first");
              return;
            }

            const confirm = await showConfirm("Join this request?","Do you want to participate in this service?");
            if (!confirm.isConfirmed) return;

            if (role === "VOLUNTEER" || role === "BOTH" || role === "ORGANIZATION_MEMBER") {
              if (currentRegistered >= maxVolunteers){
                await showError("Cannot Join","This request has reached the maximum number of volunteers.");
                return;
              }

              const res = await api.post("user/participations/register", {
                serviceId: id , userId
              });

              // if(res.status == false){
                 if (res?.status == false) {
                // alert(res.message);
                await showError("Failed", res?.message || "Registration failed");
                return;
              }
              else{
                // alert("Successfully registered for the request");
                await showSuccess("Joined","Successfully registered for the request");
                setJoinedRequests(prev => [...prev, id]);
                setCurrentRegistered((prev) => prev + 1);
              }

              

            }

            else if (role === "ORGANIZATION") {
              const confirm = await showConfirm("Register organization?","Do you want to join this request as an organization?");
              if (!confirm.isConfirmed) 
                return;
              // const memberCount = prompt("Enter number of members participating:");

               const { value: memberCount } = await showNumberInput({
                title: "Enter number of members",
                label: "Members participating",
                placeholder: "Enter count",
                maxVolunteers,
                registeredCount,
              });
              if (!memberCount) return;

              const res = await api.post("organization/participations/register", {
                serviceId: id,organizationId,
                memberCount : Number(memberCount)
              });
              
              // if(res.status == false){
              if (res?.status == false) {
                await showError( "Failed", res?.message || "Registration failed");
                // alert(res.message);
                return;
              }
              else{
                // alert("Organization registered successfully");
                await showSuccess("Registered","Organization registered successfully");
                setJoinedRequests(prev => [...prev, id]);
                setCurrentRegistered((prev) => prev + Number(memberCount)); // UPDATE the registered count
              }

            }

          } catch (e) {
            console.log(e);
            // alert("Registration failed");
            await showError("Error", e?.response?.data?.message || "Registration failed");
          }
        };

        // if (!role) {
        //   alert("Please login first");
        //   return;
        // }

      //  const isUser = role === "USER" || registeredCount >= maxVolunteers || alreadyJoined;
       const isUser =role === "USER" ||alreadyJoined ||status === "COMPLETED" ||status === "CANCELLED" ||status === "FULL" ||registeredCount >= maxVolunteers ;

          const statusStyles = {
            OPEN: "bg-green-100 text-green-700",
            ACCEPTED: "bg-blue-100 text-blue-700",
            IN_PROGRESS: "bg-yellow-100 text-yellow-700",
            COMPLETED: "bg-blue-200 text-blue-700",
            CANCELLED: "bg-red-100 text-red-600",
            FULL: "bg-orange-100 text-orange-700"
          };




          return (
          <div className="relative flex flex-col gap-2 h-full bg-gradient-to-br from-white to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1">
              <span
                className={`absolute top-5 right-5 px-4 py-1 rounded-full text-sm font-medium ${
                  statusStyles[status] || "bg-gray-100"
                }`}
              >
                {status}
              </span>

              <h3 className="text-xl font-bold text-[#1e40af] mb-1">{title}</h3>

              <p className="text-sm text-slate-500 mb-5">
                Posted by <span className="font-medium">{postedBy}</span> • {createdByType}
              </p>

              <div className="flex flex-wrap gap-3 mb-5 pt-2">
                <InfoChip icon={<Calendar size={16} />} text={date} />
                <InfoChip icon={<MapPin size={16} />} text={location} />
                <InfoChip
                  icon={<Users size={16} />}
                  // text={`${registeredCount}/${maxVolunteers} Joined`}
                  text={`${currentRegistered}/${maxVolunteers} Joined`} // UPDATED
                />
              </div>

              <p className="text-slate-600 mb-6 leading-relaxed pt-2 flex-grow line-clamp-3">
                {description}
              </p>

            <div className="flex justify-between items-center mt-auto">
                <Link to={`/view-post/${id}`}> <p className="text-blue-600 font-bold ">View Details</p></Link>
                <button
                  disabled={isUser}
                  className={`px-6 py-2.5 pt-3 rounded-xl font-semibold shadow transition
                  ${
                    isUser
                      ? "bg-gray-300 cursor-not-allowed text-gray-500"
                      : "bg-[#1e40af] text-white hover:bg-[#1a369d]"
                  }`}

                  onClick={participate}
                >
                 {alreadyJoined ? "Joined" : "Join Request"}
                </button>
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

export default PostedRequests;
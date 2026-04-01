import AppNavbar from "../components/AppNavbar";
import verified from "../assets/verified.png";
import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { createUserRequest } from "../services/serviceRequestService";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const OrganizationEditRequest = () => {

  const { user } = useContext(AuthContext);
  const { id }= useParams();
  const [loading,setLoading] = useState(false);
  const [citiesList,setCitiesList] =useState([]);
  const [stateList,setStateList] = useState([]);
  const  navigate =useNavigate();
    const [form,setForm] = useState({
        title:"",
        description:"",
        category:"",
        requestType:"",
        landmark:"",
        state:"",
        city:"",
        serviceDate:"",
        serviceStartTime:"",
        serviceEndTime:"",
        minVolunteers:"",
        maxVolunteers:""
  });

  const [categories, setCategories] = useState([]);

useEffect(() => {
  const init = async () => {
    await fetchState();   // load states first
    await fetchCategories();
    if (id) {
      await loadRequest(); // then load request
    }
  };

  init();
}, [id]);

useEffect(() => {
  if (form.state && stateList.length > 0) {
    const selectedState = stateList.find(
      (s) => s.name === form.state
    );

    if (selectedState) {
      fetchCities(selectedState.iso2);
    }
  }
}, [form.state, stateList]);
const loadRequest = async () => {
  try {
    const res = await api.get(
      `/requests/organizations/${user.orgId}/${id}`
    );
    console.log(res);
    const data = res; 

    const updatedForm = {
      title: data?.title || "",
      description: data?.description || "",
      category: data?.category || "",
      requestType: data?.requestType || "",
      landmark: data?.landmark || "",
      state: data?.state || "",
      city: data?.city || "",
      serviceDate: data?.serviceDate || "",
      serviceStartTime: data?.serviceStartTime || "",
      serviceEndTime: data?.serviceEndTime || "",
      minVolunteers: data?.minVolunteers || "",
      maxVolunteers: data?.maxVolunteers || ""
    };

    setForm(updatedForm);
  } catch (e) {
    console.log("Failed to load request", e);
  }
};

  const fetchState=async ()=>{
        try{
            const res = await api.get("/countries/IN/states")
            setStateList(res)
        }
        catch(e){
          console.log(e)
        }
    }
  const fetchCities = async (stateIso) => {
      try{
        const res = await api.get(`/countries/IN/states/${stateIso}/cities`)
        setCitiesList(res)
      }
      catch(e){
        console.log("Failed to fetch cities",e)
      }
  }

const handleSetState = (e) => {

  const selectedStateName = e.target.value

  const selectedState = stateList.find(
    (state) => state.name === selectedStateName
  )

  if(!selectedState) return

  setForm(prev => ({
    ...prev,
    state: selectedStateName,
    city:""
  }))

  fetchCities(selectedState.iso2)
}

const handleChange = (e) => {
  const {name,value} = e.target;

  setForm(prev => ({
    ...prev,
    [name]:value
  }));
};

const fetchCategories = async () => {
  try {
    const res = await api.get("/enums/categories");
    setCategories(Array.isArray(res) ? res : []);
  } catch (e) {
    console.error("Failed to fetch categories", e);
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();

  try{

    if(!form.title || !form.description){
      // alert("Title and description required");
      Swal.fire({
  icon: "warning",
  title: "Missing Fields",
  text: "Title and description are required",
  confirmButtonColor: "#1e40af"
});
      return;
    }

    if(form.minVolunteers > form.maxVolunteers){
      // alert("Min volunteers cannot exceed max volunteers");
      Swal.fire({
  icon: "warning",
  title: "Invalid Input",
  text: "Min volunteers cannot exceed max volunteers",
  confirmButtonColor: "#1e40af"
});
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      minVolunteers:Number(form.minVolunteers),
      maxVolunteers:Number(form.maxVolunteers)
    };

    console.log("Form data",payload);

   await api.put(
  `/requests/organizations/${user.orgId}/${id}`,
  payload
);
// alert("Request updated successfully");
Swal.fire({
  icon: "success",
  title: "Success",
  text: "Request updated successfully",
  confirmButtonColor: "#1e40af"
});

navigate(`/organization/request/details/${id}`);
    setForm({
      title:"",
      description:"",
      category:"",
      requestType:"",
      landmark:"",
      state:"",
      city:"",
      serviceDate:"",
      serviceStartTime:"",
      serviceEndTime:"",
      minVolunteers:"",
      maxVolunteers:""
    });

  }
  catch(err){
    console.error(err);
    // alert("Failed to create request");
    Swal.fire({
  icon: "error",
  title: "Error",
  text: err?.response?.data?.message || "Failed to update request",
  confirmButtonColor: "#1e40af"
});
  }
  finally{
    setLoading(false);
  }
};

return (
<div className="bg-slate-50 ">
<AppNavbar />

<div className="pt-24 px-4 md:px-10 max-w-screen mx-auto min-h-screen bg-indigo-50 flex flex-col gap-4">

<h1 className="text-2xl md:text-3xl font-bold text-[#1e40af]">
Edit Service Request
</h1>

<p className="text-slate-500">
Post your service needs and connect with volunteers from the community.
</p>

{/* SAME UI BELOW — NO CHANGES */}
{/* MAIN GRID */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-7">

          {/* FORM CARD */}
          <form onSubmit={handleSubmit}
            className="lg:col-span-2 bg-white rounded-xl shadow p-6 flex flex-col gap-5"
          >

            {/* ROW 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1">
                  <label>Title of the Request</label>
                  <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full mt-1 border border-slate-300 rounded-lg px-4 py-3
                    focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                  />
                </div>
            <div className="flex flex-col gap-1">
            <label> Service Date </label>
            <input
              type="date"
              name="serviceDate"
              value={form.serviceDate}
              onChange={handleChange}
              className="w-full mt-1 border border-slate-300 rounded-lg px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            />
            </div>
            </div>


            {/* ROW 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5" >
            <div className="flex flex-col gap-1">
              <label>Service Category</label>
<select
  name="category"
  value={form.category}
  onChange={handleChange}
  className="w-full mt-1 border border-slate-300 rounded-lg px-4 py-3
  focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
>
  <option value="">Select Category</option>

  {categories.map((cat) => (
    <option key={cat} value={cat}>
      {cat.replace(/_/g, " ")
          .toLowerCase()
          .replace(/\b\w/g, (l) => l.toUpperCase())}
    </option>
  ))}
</select>
            </div>

            <div className="flex flex-col gap-1">
                  <label>Request Type</label>
                  <input
                    type="text"
                    name="requestType"
                    value={form.requestType}
                    onChange={handleChange}
                    placeholder="e.g. Specific work "
                    className="w-full mt-1 border border-slate-300 rounded-lg px-4 py-3
                    focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                  />
                </div>
                </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5" >
              <div className="flex flex-col gap-1">
              <label>Start Time</label>
            <input
              type="time"
              name="serviceStartTime"
              value={form.serviceStartTime}
              onChange={handleChange}
              className="w-full mt-1 border border-slate-300 rounded-lg px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            />
            </div>
            <div className="flex flex-col gap-1">
              <label> End Time</label>
            <input
              type="time"
              name="serviceEndTime"
              value={form.serviceEndTime}
              onChange={handleChange}
              className="w-full mt-1 border border-slate-300 rounded-lg px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            />
            </div>
            </div>

            {/* DESCRIPTION */}
            <div className="flex flex-col gap-1">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full mt-1 border border-slate-300 rounded-lg px-4 py-3 min-h-25
              focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            />
            </div>
            {/* VOLUNTEERS + landmark */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label >Volunteers Needed</label>
                <div className="flex gap-4 mt-1">
                    <input
                      type="number"
                      name="minVolunteers"
                      value={form.minVolunteers}
                      onChange={handleChange}
                      placeholder="Min"
                      className="w-full border border-slate-300 rounded-lg px-4 py-3"
                    />
                    <input
                      type="number"
                      name="maxVolunteers"
                      value={form.maxVolunteers}
                      onChange={handleChange}
                      placeholder="Max"
                      className="w-full border border-slate-300 rounded-lg px-4 py-3"
                    />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label>landmark</label>
                  <input
                    type="text"
                    name="landmark"
                    value={form.landmark}
                    onChange={handleChange}
                    placeholder=" "
                    className="w-full mt-1 border border-slate-300 rounded-lg px-4 py-3
                    focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                  />
                
              </div>
            </div>

            {/* State + City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label>State</label>
                    <select
                      name="state"
                      value={form.state}
                      onChange={handleSetState}
                      className="w-full mt-1 border border-slate-300 rounded-lg px-4 py-3
                      focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                    >
                      <option value="" >Select</option>
                      {
                        stateList.map((value)=>(
  <option key={value.iso2} value={value.name}>
    {value.name}
  </option>
))
                      }
                    </select>
                
              </div>

              <div className="flex flex-col gap-2">
                <label>City</label>
                    <select
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full mt-1 border border-slate-300 rounded-lg px-4 py-3
                      focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                    >
                      <option value="">Select</option>
                      {
                        citiesList.map((value)=>{
  return (
    <option key={value.id || value.name} value={value.name}>
      {value.name}
    </option>
  )
})
                      }
                    </select>
                
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-[#1e40af] text-white font-semibold hover:bg-[#1e3a8a] transition"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </form>

          {/* INFO CARD */}
          <div className="bg-white rounded-xl shadow p-6 space-y-5 flex flex-col gap-4  justify-center">
            <div className="flex flex-col items-center justify-center gap-5">
            <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#2854C5"><path d="M51-404q-26-43-38.5-86.5T0-576q0-110 77-187t187-77q63 0 119.5 26t96.5 71q40-45 96.5-71T696-840q110 0 187 77t77 187q0 42-12.5 85T909-405q-10-12-22.5-20.5T860-440q20-35 30-69t10-67q0-85-59.5-144.5T696-780q-55 0-108.5 32.5T480-649q-54-66-107.5-98.5T264-780q-85 0-144.5 59.5T60-576q0 33 10 67t30 69q-14 6-26.5 15T51-404ZM0-80v-53q0-39 42-63t108-24q13 0 24 .5t22 2.5q-8 17-12 34.5t-4 37.5v65H0Zm240 0v-65q0-65 66.5-105T480-290q108 0 174 40t66 105v65H240Zm540 0v-65q0-20-3.5-37.5T765-217q11-2 22-2.5t23-.5q67 0 108.5 24t41.5 63v53H780ZM480-230q-80 0-130 24t-50 61v5h360v-6q0-36-49.5-60T480-230Zm-330-20q-29 0-49.5-20.5T80-320q0-29 20.5-49.5T150-390q29 0 49.5 20.5T220-320q0 29-20.5 49.5T150-250Zm660 0q-29 0-49.5-20.5T740-320q0-29 20.5-49.5T810-390q29 0 49.5 20.5T880-320q0 29-20.5 49.5T810-250Zm-330-70q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-440q0 50-34.5 85T480-320Zm0-180q-25 0-42.5 17T420-440q0 25 17.5 42.5T480-380q26 0 43-17.5t17-42.5q0-26-17-43t-43-17Zm0 60Zm0 300Z"/></svg>
            <h3 className="text-2xl text-center font-bold text-slate-800">
              Verified Volunteer Requests
            </h3>
            </div>
            <ul className="list-disc pl-5 text-slate-600 space-y-2 flex flex-col gap-3">
              <li>Your requests will be visible to our network of verified volunteers.</li>
              <li>Requests are from trusted and verified organizations.</li>
              <li>Increase your chances of finding dedicated and reliable volunteers</li>
            </ul>

            <div className="border rounded-lg p-5 bg-slate-50 flex flex-col gap-4">
              <div className="flex flex-row gap-4 items-center mb-4 justify-center">
                <img src={verified} alt="Verified" className="w-12 h-12 mx-auto" />
              <h4 className="font-bold text-[#1e40af] text-xl">
                Verified Organization
              </h4>
              </div>
              <ul className="space-y-2 text-slate-600 flex flex-col gap-3">
                <div className="flex flex-row gap-2"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#75FB4C"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                <li>Clear and detailed descriptions</li>
                </div>
                <div className="flex flex-row gap-2"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#75FB4C"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                <li>Specify dates and volunteers count</li>
                </div>
                <div className="flex flex-row gap-2"> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#75FB4C"><path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                <li>Follow up & gather feedback</li>
                </div>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const Input = ({ label, placeholder }) => (
  <div className="flex flex-col gap-2">
    <label className="font-semibold">{label}</label>
    <input
      placeholder={placeholder}
      className="w-full mt-1 border border-slate-300 rounded-lg px-4 py-3
      focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
    />
  </div>
);
export default OrganizationEditRequest;
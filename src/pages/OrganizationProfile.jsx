import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import AppNavbar from "../components/AppNavbar";
import { Pencil,LucideTrophy } from "lucide-react";
import OrganizationFloatingMenu from "../components/OrganizationFloatingMenu"
import api from "../services/api";

import {
  getOrganizationProfile,
  getOrganizationAddress,
  registerOrganizationAddress,
  updateOrganizationAddress,
  updateOrganizationProfile
} from "../services/organizationService";
import LoadingSpinner from "../components/LoadingSpinner";
import { showLogoutConfirm,showSuccess,showError } from "../utils/alertService";

const OrganizationProfile = () => {

  const { user, logout } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [address, setAddress] = useState(null);
  const [editing, setEditing] = useState(false);


  const [profileForm, setProfileForm] = useState({
    organizationName: "",
    email: "",
    phone: "",
    memberCount:"",
    description: ""
  });

  const [addressForm, setAddressForm] = useState({
    state: "",
    city: ""
  });

  const [loading, setLoading] = useState(true);
  const [postedRequests, setPostedRequests] = useState([]);
  const [participatedRequests, setParticipatedRequests] = useState([]);

  const orgId = user?.orgId;


useEffect(() => {
  if (!orgId) return;

  loadProfile();
  loadAddress();
  loadRequests();
  loadParticipations();   

}, [orgId]);

  async function loadProfile() {

    try {
     
      const res = await getOrganizationProfile(orgId);
      const data = res.data || null;

      setProfile(data);

      setProfileForm({
        organizationName: data?.name || "",
        email: data?.email || "",
        phone: data?.phone || "",
        memberCount: data?.memberCount || "",
        description: data?.description || ""
      });


    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);

    }

  }

  async function loadAddress() {

    try {

      const res = await getOrganizationAddress(orgId);
      const addr = res.data;

      if (addr) {

        setAddress(addr);

        setAddressForm({
          state: addr.state || "",
          city: addr.city || ""
        });

      }

    } catch {

      setAddress(null);

    }

  }

  async function loadRequests() {

  try {

    const res = await api.get(`/requests/organizations/${orgId}`, {
      params: { page: 0, size: 10 }
    });

    setPostedRequests(res.content || res.data.content || []);

  } catch (err) {

    console.error("Failed to load organization requests", err);

  }

}

async function loadParticipations() {

  try {

    const res = await api.get(`/organization/participations/${orgId}`, {
      params: { page: 0, size: 10 }
    });

    setParticipatedRequests(res.content || res.data.content || []);

  } catch (err) {

    console.error("Failed to load participations", err);

  }

}

  function handleProfileChange(e) {

    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value
    });

  }

  function handleAddressChange(e) {

    setAddressForm({
      ...addressForm,
      [e.target.name]: e.target.value
    });

  }

  async function handleEditClick() {

    if (!editing) {

      setEditing(true);
      return;

    }

    try {

      let res;
      await updateOrganizationProfile(orgId, profileForm);

      const payload = {
        organization_Id: orgId,
        state: addressForm.state,
        city: addressForm.city
      };

      if (!address) {

      res=  await registerOrganizationAddress(payload);

      } else {

       res= await updateOrganizationAddress(payload);

      }

      await loadProfile();
      await loadAddress();

      setEditing(false);
      if(res.status === false){
        showError("Error","Failed to update profile");
        return;
      }
      showSuccess("Success","Profile saved successfully!");

    } catch (err) {

      console.error("Update failed", err);
      showError("Error","Failed to update profile");
    }

  }

  if (loading) return <LoadingSpinner text="loading"/>;

  const handleLogout = async () => {
    const confirmed = await showLogoutConfirm();

  if (confirmed) {
    logout();
  }
};

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 ">

      <AppNavbar />

     <div className="pt-28 px-6 md:px-10 max-w-full mx-auto w-full flex flex-col gap-8">

        {/* HEADER */}

        <div className="flex justify-between items-center w-full">

          <div className="flex flex-col gap-1">

            <h2 className="text-3xl font-bold text-[#1e40af]">
              {profile.name}
            </h2>

            <p className="font-medium text-slate-500">
              {user?.role?.toLowerCase()}
            </p>

          </div>

          <button
            onClick={handleEditClick}
            className="flex items-center gap-2 px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1a369d]"
          >
            {!editing ? <div className="flex gap-1 items-center"><Pencil size={16}/> Edit profile </div> : "Save Profile"}
          </button>

        </div>


        {/* PROFILE CARD */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white rounded-2xl shadow p-8 w-full flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-[#1e40af] mb-6">
            Organization Profile 
          </h2>

          {!editing ? (
            <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Info label="Organization Name" value={profile?.name}/>
              <Info label="Email" value={profile?.email}/>
              <Info label="Phone" value={profile?.phone}/>
              <Info label="Member Count" value={profile?.memberCount}/>
              <Info label="Score" value={profile?.score}/>
            </div>
              <Info label="Description" value={profile?.description}/>
            </div>

          ) : (
            <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Input name="organizationName" label="Organization Name" value={profileForm.organizationName} onChange={handleProfileChange}/>
              <Input name="email" label="Email" value={profileForm.email} onChange={handleProfileChange}/>
              <Input name="phone" label="Phone" value={profileForm.phone} onChange={handleProfileChange}/>
              <Info label="Member Count" value={profile?.memberCount}/>
              <Info label="Score" value={profile?.score}/>
            </div>
            <TextArea name="description" label="Description" value={profileForm.description} onChange={handleProfileChange}/>
            </div>
          )}

        </div>


        {/* ADDRESS CARD */}

        <div className="bg-white rounded-2xl shadow p-8 w-full flex flex-col gap-2">

          <h2 className="text-2xl font-bold text-[#1e40af] mb-6">
            Organization Address
          </h2>

          {!editing && address && (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Info label="State" value={address.state}/>
              <Info label="City" value={address.city}/>

            </div>

          )}

          {!editing && !address && (

            <p className="text-slate-500">Address not added</p>

          )}

          {editing && (

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <Input name="state" label="State" value={addressForm.state} onChange={handleAddressChange}/>
              <Input name="city" label="City" value={addressForm.city} onChange={handleAddressChange}/>

            </div>

          )}

        </div>
        </div>
        {postedRequests.length > 0 && (
  <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition mt-6 flex flex-col gap-4">

    <h2 className="text-2xl font-bold text-[#1e40af] mb-6">
      Organization Service Requests
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

      {postedRequests.map((req) => (
        <RequestCard key={req.id} req={req} />
      ))}

    </div>

  </div>
)}

{participatedRequests.length > 0 && (
  <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition mt-8 flex flex-col gap-4">

    <h2 className="text-2xl font-bold text-[#1e40af] mb-6">
      Participated Service Requests
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

      {participatedRequests.map((req) => (
        <div
          key={req.id}
          className="border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col gap-2"
        >

          <h3 className="text-lg font-bold text-slate-800 mb-3">
            {req.serviceTitle}
          </h3>

          <p className="text-sm text-slate-500 mb-1">
            Applied Date: {new Date(req.appliedAt).toLocaleDateString()}
          </p>

          <p className="text-sm text-slate-500 mb-3">
            Completed Date: {req.completedAt
              ? new Date(req.completedAt).toLocaleDateString()
              : "Not Completed"}
          </p>
        <div>
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full
              ${
                req.status === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : req.status === "REQUESTED"
                  ? "bg-yellow-100 text-yellow-700"
                  : req.status === "COMPLETED"
                  ? "bg-blue-100 text-blue-700"
                  : req.status === "CANCELLED"
                  ? "bg-grey-100 text-grey-700"
                  : "bg-red-100 text-red-700"
              }`}
          >
            {req.status}
          </span>
        </div>
        </div>
      ))}

    </div>
  </div>
)}


        {/* LOGOUT */}

        <div className="flex justify-center mt-4 pb-4">

          <button
            onClick={handleLogout}
            className="px-8 py-3 bg-[#1e40af] text-white rounded-xl shadow hover:bg-blue-600 transition"
          >
            Logout
          </button>

        </div>

      </div>
          <OrganizationFloatingMenu/>
    </div>

  );

};


/* INFO COMPONENT */

const Info = ({ label, value }) => (

  <div className="flex flex-col gap-1">

    <span className="text-sm font-semibold text-slate-800">{label}</span>

    <span className=" text-slate-500">
      {value || "-"}
    </span>

  </div>

);


/* INPUT COMPONENT */

const Input = ({ name, label, value, onChange }) => (

  <div className="flex flex-col gap-1">

    <label className="text-sm font-semibold text-slate-600">{label}</label>

    <input
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full mt-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#1e40af]"
    />

  </div>

);

const TextArea = ({ name, label, value, onChange }) => (

  <div className="flex flex-col gap-1">

    <label className="text-sm font-semibold text-slate-600">{label}</label>

    <textarea
      name={name}
      value={value}
      onChange={onChange}
      required
      className="w-full mt-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#1e40af]"
    />

  </div>

);

const RequestCard = ({ req }) => {
  const statusStyles = {
    OPEN: "bg-green-100 text-green-700",
    CLOSED: "bg-red-100 text-red-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-slate-100 text-slate-500",
  };

  return (
    <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow hover:shadow-lg transition-all hover:-translate-y-1">

      <span className={`absolute top-5 right-5 px-4 py-1 rounded-full text-sm font-medium ${statusStyles[req.status]}`}>
        {req.status}
      </span>

      <h3 className="text-xl font-bold text-[#1e40af] mb-1">{req.title}</h3>

      <p className="text-slate-600 mb-2">{req.description}</p>

    </div>
  );
};

export default OrganizationProfile;
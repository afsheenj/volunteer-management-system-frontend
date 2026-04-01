import { useState, useContext } from "react";
import AppNavbar from "../components/AppNavbar";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { addOrganizationMembers } from "../services/organizationService";
import OrganizationFloatingMenu from "../components/OrganizationFloatingMenu"
import Swal from "sweetalert2";
import { showError,showWarning,showSuccess } from "../utils/alertservice";

const OrganizationMember = () => {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const orgId = user?.orgId;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    console.log("Form Data Updated:", {
    ...formData,
    [e.target.name]: e.target.value
  });

  };

  const validateForm = () => {

  if (!formData.username.trim()) {
    showError("Error", "Username is required");
    return false;
  }

  if (!formData.email.trim()) {
    showError("Error", "Email is required");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    showError("Error", "Enter valid email");
    return false;
  }

  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(formData.phone)) {
    showError("Error", "Phone number must be exactly 10 digits");
    return false;
  }

  return true;
};
  
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!orgId) {
    showError("Error", "Organization not found");
    return;
  }

  if (!validateForm()) return;

  try {
    setLoading(true);

    const payload = {
      organizationId: orgId,
      username: formData.username,
      email: formData.email,
      phone: formData.phone
    };

    console.log("Sending payload:", payload);

    const res = await addOrganizationMembers(orgId, payload);

    console.log("Response:", res);

  if (!res.status) {
      showError("Error", "Failed to add member");
      return;
    }

showSuccess("Success", res.message || "Member added successfully");

    setFormData({
      username: "",
      email: "",
      phone: ""
    });

  } catch (err) {
    console.error("Catch Error:", err);

showError("Error", err?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (

   <div className="min-h-screen  bg-gradient-to-br from-slate-100 to-blue-100">

  <AppNavbar />

  <div className="pt-28 px-6 pb-10 md:px-10 max-w-full mx-auto w-full flex flex-col gap-8">

    {/* TITLE */}
    <div className="mb-10 flex flex-col gap-2">
      <h1 className="text-3xl font-bold text-[#1e40af]">
        Add Organization Member
      </h1>
      <p className="text-slate-500 mt-1">
        Create a new member for your organization
      </p>
    </div>

    {/* GRID */}
    <div className="grid md:grid-cols-2 gap-10 items-stretch ">

      {/* FORM */}
      <div className="bg-white shadow-lg rounded-2xl p-8 h-full ">

        <form onSubmit={handleSubmit} className="flex flex-col justify-center h-full gap-2 space-y-6 ">
            
          {/* USERNAME */}
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-semibold text-slate-600">
              Username
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full mt-2 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#1e40af]"
            />
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-semibold text-slate-600">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-2 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#1e40af]"
            />
          </div>

          {/* PHONE */}
          <div className="flex flex-col gap-1">
            <label className="block text-sm font-semibold text-slate-600">
              Phone Number
            </label>

<input
  type="tel"
  name="phone"
  value={formData.phone}
  maxLength={10}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, ""); 
    setFormData({ ...formData, phone: value });
  }}
  required
  className="w-full mt-2 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#1e40af]"
/>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 pt-4 mt-auto">

            <button
              type="submit"
              disabled={loading}
              className="bg-[#1e40af] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1a369d] transition disabled:opacity-60"
            >
              {loading ? "Adding..." : "Add Member"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-slate-300 rounded-lg font-semibold hover:bg-slate-100"
            >
              Cancel
            </button>

          </div>

        </form>
      </div>

      {/* INFO PANEL */}
      <div className="bg-white rounded-2xl shadow p-8 h-full flex flex-col justify-between gap-4">

        <div className="flex flex-col items-center text-center gap-4">

        <svg xmlns="http://www.w3.org/2000/svg" height="60px" viewBox="0 -960 960 960" width="60px" fill="#2854C5">
        <path d="M40-160v-160q0-34 23.5-57t56.5-23h131q20 0 38 10t29 27q29 39 71.5 61t90.5 22q49 0 91.5-22t70.5-61q13-17 30.5-27t36.5-10h131q34 0 57 23t23 57v160H640v-91q-35 25-75.5 38T480-200q-43 0-84-13.5T320-252v92H40Zm440-160q-38 0-72-17.5T351-386q-17-25-42.5-39.5T253-440q22-37 93-58.5T480-520q63 0 134 21.5t93 58.5q-29 0-55 14.5T609-386q-22 32-56 49t-73 17ZM160-440q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T280-560q0 50-34.5 85T160-440Zm640 0q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T920-560q0 50-34.5 85T800-440ZM480-560q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-680q0 50-34.5 85T480-560Z"/></svg>

          <h3 className="text-2xl font-bold text-slate-800">
            Why Add Members?
          </h3>

          <p className="text-slate-600">
            Organization members can manage requests, coordinate volunteers,
            and help operate events efficiently.
          </p>

        </div>

        <ul className="space-y-3 text-slate-600 mt-6 flex flex-col gap-1">
          <li>✔ Assign responsibilities to your team</li>
          <li>✔ Manage volunteer requests faster</li>
          <li>✔ Coordinate events efficiently</li>
          <li>✔ Track volunteer participation</li>
        </ul>

        <div className="bg-blue-50 border rounded-lg p-5 text-sm text-slate-700 mt-6 flex flex-row gap-1">

          <strong className="text-[#1e40af]">Tip:</strong>  
          Add members who will help manage volunteers and respond quickly.

        </div>

      </div>

    </div>

  </div>
    <OrganizationFloatingMenu/>
</div>

  );

};

export default OrganizationMember;
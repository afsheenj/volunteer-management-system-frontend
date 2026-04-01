import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { APP_CONFIG } from "../config/config";
import { showSuccess } from "../utils/alertService";

const API_BASE = APP_CONFIG.BASE_URL;

const Register = () => {
  const [accountType, setAccountType] = useState("volunteer");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  
  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [orgForm, setOrgForm] = useState({
    orgName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const roleHelp = {
    volunteer: "You can apply for service requests.",
    user: "You can only create volunteer requests.",
    both: "You can volunteer and also request help.",
  };

  const handleVolunteerChange = (e) => {
    setVolunteerForm({ ...volunteerForm, [e.target.name]: e.target.value });
  };

  const handleOrgChange = (e) => {
    setOrgForm({ ...orgForm, [e.target.name]: e.target.value });
  };

  
  const validate = () => {
    const newErrors = {};
    const data = accountType === "volunteer" ? volunteerForm : orgForm;

    if (accountType === "volunteer" && !volunteerForm.name.trim())
      newErrors.name = "Username required";

    if (accountType === "organization" && !orgForm.orgName.trim())
      newErrors.orgName = "Organization name required";

    if (!data.email.match(/^\S+@\S+\.\S+$/))
      newErrors.email = "Invalid email";

    if (!data.mobile.match(/^[0-9]{10}$/))
      newErrors.mobile = "Mobile must be 10 digits";

    if (data.password.length < 6)
      newErrors.password = "Min 6 characters";

    if (data.password !== data.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (accountType === "volunteer" && !role)
      newErrors.role = "Select role";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) return;

  try {

    if (accountType === "volunteer") {

      const payload = {
        username: volunteerForm.name,
        email: volunteerForm.email,
        phone: volunteerForm.mobile,
        password: volunteerForm.password,
        confirmPassword: volunteerForm.confirmPassword,
        role: role.toUpperCase()
      };

      const response = await axios.post(
        `${API_BASE}/public/users/register`,
        payload
      );

      // console.log(response);

      // alert(response.data.message || "Volunteer Registered Successfully");
      if(response.status === true )
      await showSuccess(
        "Registration Successful",
        response.data.message || "Your volunteer account has been created."
      );

      navigate("/login");



    } else {

      const payload = {
        organizationName: orgForm.orgName,
        email: orgForm.email,
        phone: orgForm.mobile,
        password: orgForm.password,
        confirmPassword: orgForm.confirmPassword
      };

      const response = await axios.post(
        `${API_BASE}/public/organizations/register`,
        payload
      );

      // alert(response.data.message || "Organization Registered Successfully");
      if(response.status === true)
      await showSuccess(
        "Organization Registered",
        response.data.message || "Your organization account is ready for login."
      );

      
      console.log(navigate("/login"));

    }

  } catch (error) {

    // if (error.response) {
    //   alert(error.response.data.message || "Registration failed");
    // } else {
    //   alert("Server error");
    // }

    // Handle specific error messages from backend
    const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
    
    // Using alert service for error
    showError("Registration Failed", errorMessage);
    
    console.error(error);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-blue-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2 ">

      
        <div className="hidden md:flex flex-col justify-center p-10 bg-linear-to-br from-[#1e40af] via-[#3b82f6] to-[#d624e7] text-white gap-4">
          <h1 className="text-5xl font-bold" style={{ fontFamily: "Orbitron" }}>V-Serve</h1>
          <p className="text-xl opacity-90">Join the community of volunteers and changemakers.</p>
          <p className="text-sm opacity-80 leading-relaxed"> Help others. Request help. Build impact. A smarter platform for social service coordination. </p>
        </div>

      
        <div className=" p-4 flex flex-col justify-center gap-4 h-150">

          <h2 className="text-2xl font-bold text-[#1e40af] mb-4">Create Account</h2>

         
          <div className="flex bg-slate-100 p-1 rounded-lg mb-4">
            <button
              onClick={() => setAccountType("volunteer")}
              className={`flex-1 py-2 rounded-md font-semibold ${
                accountType === "volunteer" ? "bg-white shadow text-[#1e40af]" : "text-slate-500"
              }`}
            >
              Volunteer
            </button>
            <button
              onClick={() => setAccountType("organization")}
              className={`flex-1 py-2 rounded-md font-semibold ${
                accountType === "organization" ? "bg-white shadow text-[#1e40af]" : "text-slate-500"
              }`}
            >
              Organization
            </button>
          </div>


          <div >

            <form onSubmit={handleSubmit} className="space-y-4 flex flex-col gap-4 text-base font-semibold text-slate-600 mb-1">

           
              {accountType === "volunteer" && (
                <>
                  <div className="grid grid-cols-2 gap-4 ">
                    <Input label="Username " name="name"  value={volunteerForm.name} onChange={handleVolunteerChange} error={errors.name} />
                     <div className="flex flex-col gap-1">
                        <label className="font-semibold">Mobile Number <span className="text-red-500">*</span></label>
                        <input type="number" name="mobile" value={volunteerForm.mobile} onChange={handleVolunteerChange} placeholder="Enter mobile" className="w-full px-2 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#1e40af]" />
                        {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
                      </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 ">
                  <Input label="Email" name="email" value={volunteerForm.email} onChange={handleVolunteerChange} error={errors.email} className="block text-base font-semibold text-slate-600 mb-1" />

                  <div className="flex flex-col gap-1">
                    <label >Select Role <span className="text-red-500">*</span></label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-2 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#1e40af]">
                      <option value="">Choose your role</option>
                      <option value="volunteer">Volunteer</option>
                      <option value="user">User</option>
                      <option value="both">Both</option>
                    </select>
                    {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
                  </div>
                  </div>
                    {role && <div className="text-sm bg-blue-50 border border-slate-300 p-3 rounded ">{roleHelp[role]}</div>}
                </>
              )}

         
              {accountType === "organization" && (
                <>
                  <Input label="Organization Name" name="orgName" value={orgForm.orgName} onChange={handleOrgChange} error={errors.orgName} />
                  <div className="grid grid-cols-2 gap-4">
                  <Input label="Email"  name="email" value={orgForm.email} onChange={handleOrgChange} error={errors.email} />
                  <div className="flex flex-col gap-1">
                        <label className="font-semibold">Mobile Number <span className="text-red-500">*</span></label>
                        <input type="number" name="mobile" value={orgForm.mobile} onChange={handleOrgChange} placeholder="Enter mobile" className="w-full px-2 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#1e40af]" />
                        {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
                      </div>
                      </div>
                </>
              )}



              <div className="grid grid-cols-2 gap-4 ">
                <PasswordInput label="Password" name="password"
                  value={accountType === "volunteer" ? volunteerForm.password : orgForm.password}
                  onChange={accountType === "volunteer" ? handleVolunteerChange : handleOrgChange}
                  error={errors.password} show={showPass} setShow={setShowPass}
                />

                <PasswordInput label="Confirm Password" name="confirmPassword"
                  value={accountType === "volunteer" ? volunteerForm.confirmPassword : orgForm.confirmPassword}
                  onChange={accountType === "volunteer" ? handleVolunteerChange : handleOrgChange}
                  error={errors.confirmPassword} show={showConfirm} setShow={setShowConfirm}
                />
              </div>

              <button className="w-full mt-4 py-3 rounded-lg bg-[#1e40af] text-white font-semibold hover:bg-[#1e3a8a] transition">
                Create Account
              </button>
                 {/* <p className="text-center text-sm mt-4">
            Already have an account? <Link to="/login" className="text-[#1e40af] font-semibold">Login</Link>
          </p> */}
            </form>
          </div>

          <p className="text-center text-sm mt-4">
            Already have an account? <Link to="/login" className="text-[#1e40af] font-semibold">Login</Link>
          </p>

        </div>
      </div>
    </div>
  );
};


const Input = ({ label, name, value, onChange, error, placeholder}) => (
  <div className="flex flex-col gap-1">
    <label className="font-semibold ">{label} <span className="text-red-500">*</span></label>
    <input  name={name} value={value} onChange={onChange} placeholder={placeholder || `Enter ${label.toLowerCase()}`} className="w-full px-2 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-[#1e40af]" />
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);


const PasswordInput = ({ label, name, value, onChange, error, show, setShow }) => (
  <div className="flex flex-col gap-1">
    <label className="font-semibold">{label} <span className="text-red-500">*</span></label>
    <div className="relative">
      <input type={show ? "text" : "password"} name={name} value={value} onChange={onChange}
        className="w-full px-2 py-2 rounded-lg border border-slate-300 pr-12 focus:outline-none focus:border-[#1e40af]" />
      <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2">
        {show ? <EyeOff size={20}/> : <Eye size={20}/>}
      </button>
    </div>
    {error && <p className="text-sm text-red-500">{error}</p>}
  </div>
);

export default Register;


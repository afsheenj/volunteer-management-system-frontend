import { useContext, useEffect, useState } from "react";
import api from "../services/api";
import AdminNavbar from "../components/AdminNavbar";
import AdminSidebar from "../components/AdminSidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { showConfirm,showSuccess, showError } from "../utils/alertservice";
import { AuthContext } from "../context/AuthContext";

const AdminProfile = () => {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [profile, setProfile] = useState(null);
  const [admins, setAdmins] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [showReset, setShowReset] = useState(false);

  const [step, setStep] = useState(1); 

  const [otpVerified, setOtpVerified] = useState(false);
const [timer, setTimer] = useState(120); // 2 minutes


  const [resetForm, setResetForm] = useState({
    email: "",
    otp: "",
    newPassword: ""
  });

  

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone:""
  });

const [editMode, setEditMode] = useState(false);
const [editForm, setEditForm] = useState({
  username: "",
  email: "",
  phone:"",
});

const {user} = useContext(AuthContext);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [meRes, adminsRes] = await Promise.all([
        api.get("/admin/me",{
          params:{
            id : user?.userId
          }
        }
        ),
        api.get("/admin/admins")
      ]);
      console.log("me Res",meRes);
            console.log("admin Res",adminsRes);

      setProfile(meRes.data);
      setAdmins(adminsRes.data);
      setEditForm({
  username: meRes.data.username,
  email: meRes.data.email,
  phone: meRes.data.phone
});

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

// FETCH DATA (ONLY ON LOAD)
useEffect(() => {
  fetchData();
}, []);

// TIMER LOGIC
useEffect(() => {
  let interval;

  if (step === 2 && timer > 0) {
    interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  }

  if (timer === 0 && step === 2) {
    setStep(4);
  }

  return () => clearInterval(interval);
}, [step, timer]);

  // CREATE ADMIN
  const handleCreateAdmin = async () => {
    try {
const res = await api.post("/admin/create-admin", form);
if(res.status === true)
showSuccess("Success", "Admin created successfully");
else
   showError("Error", "Failed to create admin");
      setShowForm(false);
      setForm({ username: "", email: "" });
      fetchData();
    } catch (err) {
  showError("Error", "Failed to create admin");
}
  };

  const handleUpdateProfile = async () => {
  try {
await api.put(`/users/update/${profile.id}`, editForm);

showSuccess("Success", "Profile updated successfully");

    setEditMode(false);
    fetchData();
  } catch (err) {
    console.error(err);
   showError("Error", "Update failed");
  }
};

// SEND OTP
const handleSendOtp = async () => {
  try {
await api.post(`public/user/otp/send?email=${resetForm.email}`);
showSuccess("Success", "OTP sent to email");
    setOtpVerified(false);
    setStep(2);
    setTimer(120); // reset timer
  } catch (err) {
    console.error(err);
    showError("Error","Failed to send OTP");
  }
};

// VERIFY OTP
const handleVerifyOtp = async () => {
  try {
   const res =  await api.post(
      `public/user/otp/verify?email=${resetForm.email}&otp=${resetForm.otp}`
    );
    if(res.status===true){
    showSuccess("Success","OTP verified");
        setStep(3);
    }
    else
      showError("Error","Invalid OTP");

    setOtpVerified(true); 

  } catch (err) {
    console.error(err);
    showError("Error","Invalid OTP");
  }
};

// UPDATE PASSWORD
const handleUpdatePassword = async () => {
  try {
  const res=  await api.put("public/password/update", {
      email: resetForm.email,
      newPassword: resetForm.newPassword
    });
if(res.status === true)
    showSuccess("Success","Password updated successfully");
else
  showError("Error","Password update failed");

    setShowReset(false);
    setStep(1);

  } catch (err) {
    console.error(err);
    showError("Error","Password update failed");
  }
};

  return (
    <div>
      <AdminNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <AdminSidebar sidebarOpen={sidebarOpen} />

      <div className="ml-0 md:pl-[20rem] pt-20 px-4 md:px-8 flex flex-col gap-3">

        <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="space-y-6 flex flex-col gap-4">

            {/*  PROFILE */}
<div className="bg-white p-6 rounded-xl shadow-sm flex flex-col gap-1">
  <div className="flex justify-between items-center mb-3">
    <h2 className="font-semibold">My Details</h2>

    <button
      onClick={() => setEditMode(!editMode)}
      className="text-blue-500 text-sm"
    >
      {editMode ? "Cancel" : "Edit"}
    </button>
  </div>

  {!editMode ? (
    <div className="flex flex-col gap-1">
<p><span className="text-gray-500">Username:</span> <span className="font-medium">{profile?.username}</span></p>
<p><span className="text-gray-500">Email:</span> <span className="font-medium">{profile?.email}</span></p>
<p><span className="text-gray-500">Phone:</span> <span className="font-medium">{profile?.phone}</span></p>
<button
  onClick={() => {
    setShowReset(true);
    setStep(1);
    setOtpVerified(false);
    setResetForm({
      email: profile?.email,
      otp: "",
      newPassword: ""
    });
  }}
  className="mt-4 bg-[#1e40af] hover:bg-blue-800 transition text-white px-5 py-2 rounded-lg shadow-sm w-fit"
>
  Reset Password
</button>
    </div>
  ) : (
    <div className="space-y-3">
      <input
        type="text"
        value={editForm.username}
        onChange={(e) =>
          setEditForm({ ...editForm, username: e.target.value })
        }
        className="border p-2 rounded w-full"
      />

      <input
        type="email"
        value={editForm.email}
        onChange={(e) =>
          setEditForm({ ...editForm, email: e.target.value })
        }
        className="border p-2 rounded w-full"
      />

          <input
        type="text"
        value={editForm.phone}
        onChange={(e) =>
          setEditForm({ ...editForm, phone: e.target.value })
        }
        className="border p-2 rounded w-full"
      />
      <button
        onClick={handleUpdateProfile}
        className="bg-green-500 text-white px-4 py-2 rounded-lg"
      >
        Save
      </button>
    </div>
  )}
</div>

{showReset && (
  <div className="mt-4 bg-white border border-gray-100 rounded-2xl shadow-md p-5 flex flex-col gap-2 space-y-4">

    <h3 className="text-lg font-semibold text-[#1e40af]">
      Reset Password
    </h3>

    {/* STEP 1 */}
    {step === 1 && (
      <>
        <input
          type="email"
          value={resetForm.email}
          onChange={(e) =>
            setResetForm({ ...resetForm, email: e.target.value })
          }
          className="border border-gray-200 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#1e40af] outline-none"
        />

        <button
          onClick={handleSendOtp}
          className="bg-[#1e40af] hover:bg-blue-800 text-white px-4 py-2 rounded-lg w-fit "
        >
          Send OTP
        </button>
      </>
    )}

    {/* STEP 2 */}
    {step === 2 && (
      <>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter OTP"
            value={resetForm.otp}
            onChange={(e) =>
              setResetForm({ ...resetForm, otp: e.target.value })
            }
            className="border border-gray-200 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#1e40af] outline-none"
          />

          {otpVerified && (
            <span className="text-green-500 text-xl"></span>
          )}
        </div>

        {/* TIMER */}
{step === 2 && timer > 0 && (
  <p className="text-sm text-gray-500">
    OTP expires in:{" "}
    <span className="font-medium text-red-500">
      {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
    </span>
  </p>
)}

        <button
          onClick={handleVerifyOtp}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg w-fit"
        >
          Verify OTP
        </button>
      </>
    )}

    {/* STEP 3 */}
    {step === 3 && (
      <>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="New Password"
          value={resetForm.newPassword}
          onChange={(e) =>
            setResetForm({ ...resetForm, newPassword: e.target.value })
          }
          className="border border-gray-200 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#1e40af] outline-none pr-10"
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1e40af]"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      <p className="text-xs text-gray-400">
  Minimum 6 characters required
</p>
        <button
          onClick={handleUpdatePassword}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-fit"
        >
          Update Password
        </button>
      </>
    )}

    {/* STEP 4: RESEND */}
{step === 4 && (
  <div className="flex flex-col gap-3">
    <p className="text-sm text-red-500">OTP expired</p>

    <button
      onClick={handleSendOtp}
      className="bg-[#1e40af] hover:bg-blue-800 text-white px-4 py-2 rounded-lg w-fit"
    >
      Resend OTP
    </button>
  </div>
)}
  </div>
)}

            {/*  OTHER ADMINS */}
{/*  OTHER ADMINS */}
<div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">

  <div className="flex justify-between items-center mb-4">
    <h2 className="font-semibold text-lg">Other Admins</h2>

    <button
      onClick={() => setShowForm(true)}
      className="bg-[#1e40af] hover:bg-blue-800 text-white px-4 py-2 rounded-lg shadow-sm"
    >
      + Add Admin
    </button>
  </div>

{admins
  .filter((a) => a.id !== profile?.id)
  .map((a) => (
    <div
      key={a.id}
      className="py-3 border-b last:border-none flex justify-between items-center"
    >
      <div>
        <p className="font-medium">{a.username}</p>
        <p className="text-sm text-gray-500">{a.email}</p>
        <p className="text-sm text-gray-500">{a.phone}</p>
      </div>
    </div>
))}

          
</div>

    {/* FORM */}
{showForm && (
  <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 mt-4 flex flex-col gap-4">

    <h3 className="text-lg font-semibold text-[#1e40af]">
      Create New Admin
    </h3>

    <div className="grid md:grid-cols-2 gap-4">
      <input
        type="text"
        placeholder="Username"
        className="border border-gray-200 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#1e40af]"
        value={form.username}
        onChange={(e) =>
          setForm({ ...form, username: e.target.value })
        }
      />

      <input
        type="email"
        placeholder="Email"
        className="border border-gray-200 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#1e40af]"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="text"
        placeholder="Phone"
        className="border border-gray-200 p-2 rounded-lg w-full focus:ring-2 focus:ring-[#1e40af]"
        value={form.phone || ""}
        onChange={(e) =>
          setForm({ ...form, phone: e.target.value })
        }
      />
    </div>

    <div className="flex justify-end gap-3">
      <button
        onClick={() => setShowForm(false)}
        className="px-4 py-2 rounded-lg border"
      >
        Cancel
      </button>

      <button
        onClick={handleCreateAdmin}
        className="bg-[#1e40af] hover:bg-blue-800 text-white px-5 py-2 rounded-lg"
      >
        Create Admin
      </button>
    </div>
  </div>
)}

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProfile;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Eye, EyeOff } from "lucide-react";
import { showError,showSuccess,showWarning } from "../utils/alertservice";

const ForgotPassword = () => {

  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(120);
  const [otpVerified, setOtpVerified] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    type:""
  });

  

  // TIMER
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

  // SEND OTP
  const handleSendOtp = async () => {
    if (!form.type) {
 showWarning("Warning", "Please select account type");
  return;
}

    if (!form.email) {
 showWarning("Warning", "Please enter mail id");
  return;
}
    try {
        
        const endpoint =
  form.type === "organization"
    ? "/public/organization/otp/send"
    : "/public/user/otp/send";

const res =await api.post(`${endpoint}?email=${form.email}`);
if(res.status === true){
showSuccess("Success", "OTP sent successfully");
      setStep(2);
      setTimer(120);
      setOtpVerified(false);
}
else
  showError("Error", res.message);
    } catch {
      showError("Error", "Failed to send OTP");
    }
  };

  // VERIFY OTP
  const handleVerifyOtp = async () => {

    if(!form.otp){
      showWarning("Warning","Enter otp")
    }

    try {
const endpoint =
  form.type === "organization"
    ? "/public/organization/otp/verify"
    : "/public/user/otp/verify";

const res = await api.post(
  `${endpoint}?email=${form.email}&otp=${form.otp}`
);
if(res.status === true){
  showSuccess("Success","OTP verified")
      setOtpVerified(true);
      setStep(3);
}
    } catch {
      showError("Error", "Invalid OTP");
    }
  };

  // UPDATE PASSWORD
  const handleResetPassword = async () => {
    if(!form.newPassword){
      showWarning("Warning","Enter new password");
    }
    try {
     const res=  await api.put("public/password/update", {
        email: form.email,
        newPassword: form.newPassword
      });
      if(res.status === true)
     showSuccess("Success", "Password reset successful");
    else
      showError("Error", "Reset failed");

      navigate("/login");
    } catch {
      showError("Error", "Reset failed");
    }
  };

return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-100 px-4">

    <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

      {/* LEFT PANEL */}
      <div className="hidden md:flex flex-col justify-center p-10 bg-gradient-to-br from-[#1e40af] via-[#3b82f6] to-[#d624e7] text-white gap-4">
        <h1 className="text-5xl font-bold" style={{ fontFamily: "Orbitron" }}>
          V-Serve
        </h1>

        <p className="text-xl opacity-90">
          Secure your account
        </p>

        <p className="text-sm opacity-80 leading-relaxed">
          Reset your password safely using OTP verification.
        </p>
      </div>

      {/* RIGHT PANEL */}
      <div className="p-8 md:p-10 flex flex-col gap-4 justify-center">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#1e40af]">
            Reset Password
          </h2>

          <button
            onClick={() => navigate("/login")}
            className="text-sm text-gray-500 hover:text-black"
          >
            Back
          </button>
        </div>
        <select
  value={form.type}
  onChange={(e) =>
    setForm({ ...form, type: e.target.value })
  }
  className="w-full px-4 py-3 rounded-lg border border-slate-300"
>
  <option value="">Select Account Type</option>
  <option value="user">User</option>
  <option value="organization">Organization</option>
</select>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#1e40af]"
            />

            <button
              onClick={handleSendOtp}
              className="bg-[#1e40af] hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
            >
              Send OTP
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="flex flex-col gap-4">

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter OTP"
                value={form.otp}
                onChange={(e) =>
                  setForm({ ...form, otp: e.target.value })
                }
                className="border border-gray-300 px-4 py-3 rounded-lg w-full focus:ring-2 focus:ring-[#1e40af]"
              />

              {otpVerified && (
                <span className="text-green-500 text-2xl">✔</span>
              )}
            </div>

            {timer > 0 && (
              <p className="text-sm text-gray-500">
                OTP expires in{" "}
                <span className="text-red-500 font-semibold">
                  {Math.floor(timer / 60)}:
                  {String(timer % 60).padStart(2, "0")}
                </span>
              </p>
            )}

            <button
              onClick={handleVerifyOtp}
              className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold"
            >
              Verify OTP
            </button>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="flex flex-col gap-4">
<div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter new password"
    value={form.newPassword}
    onChange={(e) =>
      setForm({ ...form, newPassword: e.target.value })
    }
    className="border border-gray-300 px-4 py-3 rounded-lg w-full focus:ring-2 focus:ring-[#1e40af] pr-12"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1e40af]"
  >
    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
  </button>
</div>
<p className="text-xs text-gray-500">
  Password must be at least 6 characters
</p>

            <button
              onClick={handleResetPassword}
              className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold"
            >
              Update Password
            </button>
          </div>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <div className="flex flex-col gap-4">

            <p className="text-red-500 text-sm font-medium">
              OTP expired. Please request a new one.
            </p>

            <button
              onClick={handleSendOtp}
              className="bg-[#1e40af] hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
            >
              Resend OTP
            </button>
          </div>
        )}

      </div>
    </div>
  </div>
);
};

export default ForgotPassword;
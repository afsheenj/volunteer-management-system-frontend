import { useState, useEffect, useContext } from "react";
import AppNavbar from "../components/AppNavbar";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";
import { Edit3, Calendar, MapPin, Users } from "lucide-react";
import Swal from "sweetalert2";

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.userId;
  const role = user?.role;

  const [profile, setProfile] = useState({});
  const [address, setAddress] = useState({});
  const [postedRequests, setRequests] = useState([]);
  const [participatedRequests, setParticipatedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [visiblePostedCount, setVisiblePostedCount] = useState(3);
    // ------------------ DOCUMENT VERIFICATION ------------------
  const [documentType, setDocumentType] = useState("");
  const [documentUrl, setDocumentUrl] = useState("");
  const [documentStatus, setDocumentStatus] = useState(null);

  // ------------------ SKILL STATE ------------------
  const [skills, setSkills] = useState([]);
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [level, setLevel] = useState("BEGINNER");
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState("");

  // ------------------ PROFILE & ADDRESS FIELDS ------------------
  const profileFields = [
    { label: "Username", field: "username", type: "text" },
    { label: "Email", field: "email", type: "text" },
    { label: "Phone", field: "phone", type: "text" },
    { label: "Gender", field: "gender", type: "select", options: ["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_DISCLOSE"] },
    { label: "Availability", field: "availability", type: "select", options: ["WEEKDAYS", "WEEKENDS", "ANYTIME"] },
    { label: "DOB", field: "dateOfBirth", type: "date" },

  ];

  const addressFields = [
    { label: "State", field: "state", type: "text" },
    { label: "District", field: "district", type: "text" },
    { label: "City", field: "city", type: "text" },
    { label: "Street", field: "street", type: "text" },
    { label: "Door No", field: "doorNo", type: "text" },
    { label: "Pincode", field: "pincode", type: "text" },
  ];

  // ------------------ FETCH SKILLS ------------------
  const fetchSkills = async () => {
    try {
      const res = await api.get(`/skills/user-id/${user.userId}`);
      setSkills(res || []);
    } catch (err) {
      console.error("Error fetching user skills", err);
      setSkills([]);
    }
  };

  const fetchAllSkills = async () => {
    try {
      const res = await api.get("/skills/search?keyword=a");
      setAllSkills(res || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
      setAllSkills([]);
    }
  };

  // ------------------ ADD / DELETE SKILL ------------------
  const addSkill = async () => {
    // if (!selectedSkillId) return;
    if (!selectedSkillId) {
    Swal.fire({
      icon: "warning",
      title: "Select Skill",
      text: "Please select a skill first"
    });
    return;
  }

    try {
      await api.post(`/skills/add`, null, {
        params: {
          userId: user.userId,
          skillIds: selectedSkillId,
          proficiencyLevel: level,
        },
      });
      await Swal.fire({
      icon: "success",
      title: "Added",
      text: "Skill added successfully"
    });
      fetchSkills();
      setShowSkillInput(false);
      setSelectedSkillId("");
    } catch (err) {
      console.error("Failed to add skill", err);
      Swal.fire({
      icon: "error",
      title: "Error",
      text: err.response?.data?.message || "Failed to add skill"
    });
    }
  };

  const handleDeleteSkill = async (skillId) => {
    const confirm = await Swal.fire({
    title: "Are you sure?",
    text: "This skill will be removed",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it"
  });

  if (!confirm.isConfirmed) return;
    try {
      await api.delete(`/skills/user-id/${userId}/skill-id/${skillId}`);
      Swal.fire({
      icon: "success",
      title: "Deleted",
      text: "Skill removed successfully"
    });
      fetchSkills();
    } catch (err) {
      console.error("Error deleting skill:", err);
      Swal.fire({
      icon: "error",
      title: "Error",
      text: err.response?.data?.message || "Failed to delete skill"
    });
    }
  };

  // ------------------ FETCH PROFILE & REQUESTS ------------------
  useEffect(() => {
    if (!userId) return;

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const profileRes = await api.get(`/profile/user/me/${userId}`);
        const addressRes = await api.get(`/users/address/${userId}`);
        console.log("profile",profileRes)

        let requests = [];
        let participated = [];

        if (role === "USER") {
          const res = await api.get(`/requests/users/${userId}`, { params: { page: 0, size: 10 } });
          requests = res.content || [];
        } else if (role === "VOLUNTEER") {
          const res = await api.get(`/user/participations/user/${userId}`, { params: { page: 0, size: 10 } });
          console.log("participated response",res);
          participated = res.content || res.data.content || [];
        } else if (role === "BOTH") {
          const userRes = await api.get(`/requests/users/${userId}`, { params: { page: 0, size: 10 } });
          const volRes = await api.get(`/user/participations/user/${userId}`, { params: { page: 0, size: 10 } });
          requests = userRes.content || [];
          participated = volRes.content || volRes.data.content ||[];
        }

        setProfile(profileRes.data || {});
        setAddress(addressRes.data || {});
        setRequests(requests);
        setParticipatedRequests(participated);

        // FETCH DOCUMENT STATUS
try {
  const res = await api.get(`/user/documents/${userId}`);
  console.log("Doc status",res);
  if (res.data) {
    setDocumentStatus(res.data.documentStatus);
    setDocumentType(res.data.documentType);
    setDocumentUrl(res.data.documentUrl);
    console.log(res);
  } else {
    setDocumentStatus(null);
  }

} catch (err) {
  console.log("No document uploaded yet");
  setDocumentStatus(null);
}
        // FETCH SKILLS IF VOLUNTEER/BOTH
        if (role === "VOLUNTEER" || role === "BOTH") {
          fetchSkills();
          fetchAllSkills();
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        Swal.fire({
  icon: "error",
  title: "Error",
  text: "Failed to load profile data"
});
        
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userId, role]);

  // ------------------ UPDATE PROFILE ------------------
  const updateProfile = async () => {
    try {
      await api.put(`/profile/user/update/${userId}`, profile);
      await api.put(`/users/address`, {
        userId,
        state: address.state,
        district: address.district,
        city: address.city,
        street: address.street,
        doorNo: address.doorNo,
        pincode: address.pincode,
      });
      // alert("Profile updated successfully");
      await Swal.fire({
      icon: "success",
      title: "Success",
      text: "Profile updated successfully",
      confirmButtonColor: "#1e40af"
    });
      setEditMode(false);
    } catch (error) {
      console.error("Update error:", error);
      // alert("Profile update failed");
      Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "Profile update failed"
    });
    }
  };

  if (!userId)
    return <div className="p-20 text-center text-lg">Please login to view your profile</div>;

if (loading)
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="w-10 h-10 border-4 border-blue-200 border-t-[#1e40af] rounded-full animate-spin"></div>

      <p className="mt-4 text-slate-600 font-medium">
        Loading...
      </p>
    </div>
  );

  const uploadDocument = async () => {
    if (documentStatus === "SUBMITTED" || documentStatus === "APPROVED") {
      await Swal.fire({
      icon: "info",
      title: "Already Submitted",
      text: "Document already submitted for verification"
    });
  // alert("Document already submitted for verification");
  return;
}
  try {
   const res= await api.post("/user/upload-documents", {
      userId,
      documentType,
      documentUrl
    });

    
if(res.status === true)
    // alert("Document uploaded successfully");
    // alert("Document uploaded successfully");
    await Swal.fire({
      icon: "success",
      title: "Uploaded",
      text: "Document uploaded successfully"
    });
setDocumentStatus("SUBMITTED");
setDocumentType("");
setDocumentUrl("");
  } catch (err) {
    console.error("Upload failed", err);
    // alert("Document upload failed");
    Swal.fire({
      icon: "error",
      title: "Upload Failed",
      text: err.response?.data?.message || "Document upload failed"
    });
  }
};

const isDocumentLocked =
  ["SUBMITTED","UNDER_REVIEW", "APPROVED"].includes(documentStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100 pb-20">
      <AppNavbar />
      <div className="pt-28 px-6 md:px-10 max-w-full mx-auto w-full flex flex-col gap-8">
        {/* HEADER */}
        <div className="flex justify-between items-center w-full">
            <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-bold text-[#1e40af]">
              {profile.username || "User"}
            </h2>

            {documentStatus === "APPROVED" && (
              <span className="text-green-600 text-lg">✔</span>
            )}
          </div>

    <p className="font-medium text-slate-500">
  {role === "BOTH"
    ? "User & Volunteer"
    : role === "VOLUNTEER"
    ? "Volunteer"
    : "User"}
</p>

{!editMode ? (
  <p className="text-slate-600 mt-1 max-w-xl">
    {profile.bio || "Add a short bio about yourself"}
  </p>
) : (
  <textarea
    rows={2}
    value={profile.bio || ""}
    onChange={(e) =>
      setProfile({ ...profile, bio: e.target.value })
    }
    placeholder="Write a short bio..."
    className={`mt-2 w-full md:w-[500px] p-2 rounded-lg outline-none transition ${
  editMode
    ? "border-1 border-[#1e40af] bg-white"
    : "border border-slate-200 bg-slate-50"
}`}
  />
)}
  </div>

  <button
    onClick={() => (editMode ? updateProfile() : setEditMode(true))}
    className="flex items-center gap-2 px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1a369d]"
  >
    <Edit3 size={16}/>
    {!editMode ? "Edit Profile" : "Save Profile"}
  </button>
</div>
        {/* DETAILS GRID */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* USER DETAILS */}
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-6">User Details</h2>
            
            <div className="space-y-5">
              {profileFields.map((item, index) => (
                <div key={index}>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">{item.label}</label>
                  {!editMode ? (
                  <div
  className={`p-3 rounded-lg text-slate-800 ${
    editMode
      ? "border-2 border-[#1e40af] bg-white"
      : "border border-slate-200 bg-slate-50"
  }`}
>
  {profile?.[item.field] || "—"}
</div>
 
) : item.type === "select" ? (
                    <select
                      value={profile?.[item.field] || ""}
                      onChange={(e) => setProfile({ ...profile, [item.field]: e.target.value })}
                      className={`w-full p-3 rounded-lg outline-none transition ${
  editMode
    ? "border-1 border-[#1e40af] bg-white"
    : "border border-slate-100 bg-slate-50"
}`}
                    >
                      <option value="">Select</option>
                      {item.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={item.type}
                      value={profile?.[item.field] || ""}
                      onChange={(e) => setProfile({ ...profile, [item.field]: e.target.value })}
                      className={`w-full p-3 rounded-lg outline-none transition ${
  editMode
    ? "border-1 border-[#1e40af] bg-white"
    : "border border-slate-100 bg-slate-50"
}`}
                    />
                  )}
                </div>
              ))}
            </div>
{role !== "USER" && (
  <div>
    <label className="block text-sm font-semibold text-slate-600 mb-1">
      Score
    </label>
    <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
      {profile?.score || "—"}
    </div>
  </div>
)}
          </div>

          {/* ADDRESS */}
          <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-2xl font-bold text-[#1e40af] mb-6">User Address</h2>
            <div className="space-y-5">
              {addressFields.map((item, index) => (
                <div key={index}>
                  <label className="block text-sm font-semibold text-slate-600 mb-1">{item.label}</label>
                  {!editMode ? (
                    <div className={`w-full p-3 rounded-lg outline-none transition ${
  editMode
    ? "border-2 border-[#1e40af] bg-white"
    : "border border-slate-200 bg-slate-50"
}`}>
                      {address?.[item.field] || "—"}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={address?.[item.field] || ""}
                      onChange={(e) => setAddress({ ...address, [item.field]: e.target.value })}
                      className={`w-full p-3 rounded-lg outline-none transition ${
  editMode
    ? "border-1 border-[#1e40af] bg-white"
    : "border border-slate-100 bg-slate-50"
}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        

        {/* SKILLS SECTION */}
        {(role === "VOLUNTEER" || role === "BOTH") && (
          <section className="bg-white p-8 rounded-3xl shadow-sm mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Skills</h2>
              <button
                onClick={() => setShowSkillInput(!showSkillInput)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
              >
                Add
              </button>
            </div>

            {/* Display Skills */}
            <div className="flex flex-wrap gap-3 items-center">
              {skills?.map((s) => (
                <div key={s.id} className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                  {s.skill.skillName} ({s.proficiencyLevel})
                  <button  onClick={() => {console.log("Deleting skill:", s.skill.skillId);handleDeleteSkill(s.skill.skillId);
  }} className="text-red-500 hover:text-red-700 font-bold">X</button>
                </div>
              ))}
            </div>

            {/* Add Skill */}
            {showSkillInput && (
              <div className="flex gap-3 mt-4">
                <select
                  value={selectedSkillId}
                  onChange={(e) => setSelectedSkillId(e.target.value)}
                  className="border rounded-lg p-2"
                >
                  <option value="">Select Skill</option>
                  {allSkills.map((skill) => (
                    <option key={skill.skillId} value={skill.skillId}>
                      {skill.skillName}
                    </option>
                  ))}
                </select>

                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="border px-3 py-1 rounded"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>

                <button onClick={addSkill} className="bg-green-600 text-white px-3 py-1 rounded">Save</button>
              </div>
            )}
          </section>
        )}

        {/* DOCUMENT VERIFICATION */}
{/* DOCUMENT VERIFICATION */}
<section className="bg-white p-8 rounded-2xl shadow mt-6 flex flex-col gap-4">
  <h2 className="text-xl font-semibold mb-4">Document Verification</h2>

  {/* NO DOCUMENT → SHOW FORM */}
  {!documentStatus && (
    <div className="flex flex-col md:flex-row gap-4 w-full">

      <select
        value={documentType}
        onChange={(e) => setDocumentType(e.target.value)}
        className="border border-slate-200 p-3 rounded-lg w-full md:w-auto flex-1"
      >
        <option value="">Select Document Type</option>
        <option value="AADHAAR">AADHAAR</option>
        <option value="PAN">PAN</option>
        <option value="DRIVING_LICENSE">DRIVING_LICENSE</option>
        <option value="VOTER_ID">VOTER_ID</option>
      </select>

      <input
        type="text"
        placeholder="Paste document link"
        value={documentUrl}
        onChange={(e) => setDocumentUrl(e.target.value)}
        className="border border-slate-200 p-3 rounded-lg w-full flex-1"
      />

      <button
        onClick={uploadDocument}
        disabled={!documentType || !documentUrl}
        className="bg-[#1e40af] text-white px-5 py-3 rounded-lg w-full md:w-auto disabled:opacity-50"
      >
        Upload
      </button>

    </div>
  )}

  {/* SUBMITTED */}
  {documentStatus === "SUBMITTED" && (
    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg text-sm">
      Your document has been submitted successfully and is waiting for admin verification.
    </div>
  )}

  {/* UNDER REVIEW */}
  {documentStatus === "UNDER_REVIEW" && (
    <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg text-sm">
      Your document is currently being reviewed by the admin.
    </div>
  )}

  {/* APPROVED */}
  {documentStatus === "APPROVED" && (
    <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg text-sm">
      Your identity has been verified successfully. ✔
    </div>
  )}

  {/* REJECTED */}
  {documentStatus === "REJECTED" && (
    <div className="flex flex-col gap-4">

      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-sm">
        Your document was rejected. Please upload a valid document.
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full">

        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="border border-slate-200 p-3 rounded-lg w-full md:w-auto flex-1"
        >
          <option value="">Select Document Type</option>
          <option value="AADHAAR">AADHAAR</option>
          <option value="PAN">PAN</option>
          <option value="DRIVING_LICENSE">DRIVING_LICENSE</option>
          <option value="VOTER_ID">VOTER_ID</option>
        </select>

        <input
          type="text"
          placeholder="Paste document link"
          value={documentUrl}
          onChange={(e) => setDocumentUrl(e.target.value)}
          className="border border-slate-200 p-3 rounded-lg w-full flex-1"
        />

        <button
          onClick={uploadDocument}
          disabled={!documentType || !documentUrl}
          className="bg-[#1e40af] text-white px-5 py-3 rounded-lg w-full md:w-auto disabled:opacity-50"
        >
          Reupload
        </button>

      </div>
    </div>
  )}
</section>

        {/* POSTED REQUESTS */}
    {(role === "USER" || role === "BOTH") && postedRequests.length > 0 && (
  <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition mt-6">
    <h2 className="text-2xl font-bold text-[#1e40af] mb-6">
      My Posted Service Requests
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {postedRequests.slice(0, visiblePostedCount).map((req) => (
  <RequestCard key={req.id} req={req} />
))}
    </div>
 {postedRequests.length > 3 && (
  <div className="flex justify-center mt-8">
    <button
      onClick={() =>
        visiblePostedCount < postedRequests.length
          ? setVisiblePostedCount(postedRequests.length)
          : setVisiblePostedCount(3)
      }
      className="px-4 py-1 border-1 border-[#1e40af] 
               text-[#1e40af] font-semibold rounded-xl
               hover:bg-[#1e40af] hover:text-white 
               transition"
    >
      {visiblePostedCount < postedRequests.length
        ? "Show More"
        : "Show Less"}
    </button>
  </div>
)}
  </div>
)}
 {/* PARTICIPATED REQUESTS */}
   {(role === "VOLUNTEER" || role === "BOTH") && participatedRequests.length > 0 && (
  <div className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition mt-8">
    <h2 className="text-2xl font-bold text-[#1e40af] mb-6">
      Participated Service Requests
    </h2>

    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {participatedRequests.map((req) => (
       <div
  key={req.id}
  className="border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition"
>
  <h3 className="text-lg font-bold text-slate-800 mb-3">
    {req.serviceTitle}
  </h3>

  <p className="text-sm text-slate-500 mb-1">
    Applied Date: {new Date(req.appliedAt).toLocaleDateString()}
  </p>

  <span
    className={`px-3 py-1 text-xs font-semibold rounded-full
      ${
        req.status === "APPROVED"
          ? "bg-green-100 text-green-700"
          : req.status === "REQUESTED"
          ? "bg-yellow-100 text-yellow-700"
          : req.status === "COMPLETED"
          ? "bg-blue-100 text-blue-700"
          : "bg-red-100 text-red-700"
      }`}
  >
    {req.status}
  </span>
</div>
      ))}
    </div>
  </div>
)}
      </div>
    </div>
  );
};
// ------------------ REQUEST CARD & INFO CHIP ------------------
const RequestCard = ({ req }) => {
  const statusStyles = {
    OPEN: "bg-green-100 text-green-700",
    CLOSED: "bg-red-100 text-red-700",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700",
    COMPLETED: "bg-slate-100 text-slate-500",
  };
  return (
    <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow hover:shadow-lg transition-all hover:-translate-y-1">
      <span className={`absolute top-5 right-5 px-4 py-1 rounded-full text-sm font-medium ${statusStyles[req.status] || "bg-slate-100 text-slate-500"}`}>
        {req.status}
      </span>

      <h3 className="text-xl font-bold text-[#1e40af] mb-1">{req.title}</h3>

      <div className="flex flex-wrap gap-3 mb-4 pt-2">
        <InfoChip icon={<Calendar size={16} />} text={new Date(req.serviceDate).toLocaleDateString()} />
        <InfoChip
  icon={<MapPin size={16} />}
  text={`${req.city || ""} ${req.state || ""}`}
/>
        {req.joinedVolunteers !== undefined && (
          <InfoChip icon={<Users size={16} />} text={`${req.joinedVolunteers || `${req.minVolunteers}/${req.maxVolunteers}`} Joined`} />
        )}
      </div>

      <p className="text-slate-600 mb-2 leading-relaxed">{req.description}</p>
    </div>
  );
};

const InfoChip = ({ icon, text }) => (
  <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl text-sm text-slate-700 transition hover:bg-blue-100">
    <span className="text-[#1e40af]">{icon}</span>
    <span>{text}</span>
  </div>
);

export default UserProfile;
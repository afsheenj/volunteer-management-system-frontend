import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Users, Briefcase, Trophy } from "lucide-react";
import axios from "axios";
import api from "../services/api";
import AppNavbar from "../components/AppNavbar";
import LoadingSpinner from "../components/LoadingSpinner";

export default function PublicProfile() {

  const { name } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading,setLoading] = useState(false);

  useEffect(() => {
        fetchProfile(name)
  }, [name]);


  const fetchProfile = async (name) =>{
    try{
        setLoading(true)
       const res = await api.get(`/public/profile/${name}`);
       console.log(res);
       setProfile(res.data);

    }
    catch(e){
        console.log(e);
    }
    finally{
        setLoading(false);
    }
  }

if(loading)
    return <LoadingSpinner/>
const statusStyles = {
  OPEN: "bg-green-100 text-green-700",
  CLOSED: "bg-red-100 text-red-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-blue-100 text-blue-700"
};

const participationStyles = {
  REQUESTED: "bg-yellow-100 text-yellow-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700"
};
  if (!profile) return <p className="p-6">Loading...</p>;

const showSkills =
  profile.type === "USER" ||
  profile.type === "VOLUNTEER" ||
  profile.type === "BOTH" ||
  profile.type === "ORGANIZATION_MEMBER";

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">
  <AppNavbar />

  <div className="pt-24 max-w-full mx-auto p-6 flex flex-col gap-4">

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-sm rounded-xl p-6 mb-6 flex flex-col gap-2">
        <div className="flex items-center gap-3 flex-wrap">
  <h1 className="text-3xl font-bold text-[#1e40af] tracking-wide">
    {profile.name}
  </h1>

  {/* SCORE BADGE */}

  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 border border-yellow-200 text-sm font-semibold">
    <Trophy size={16} /> Score {profile.score ?? 0}
  </span>

</div>
       <div className="flex gap-6 text-gray-600 mt-3 text-sm font-medium">
          <span className="flex items-center gap-1">
            <MapPin size={16} /> {profile.city}, {profile.state}
          </span>

          <span className="flex items-center gap-1">
            <Users size={16} /> {profile.type}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className={`grid ${showSkills ? "grid-cols-3" : "grid-cols-2"} gap-4 mb-6`}>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50  border-slate-200 shadow-sm rounded-xl p-5 text-center hover:shadow-md transition">
          <p className="text-3xl font-bold text-[#1e40af]">
            {profile.postedRequests.length}
          </p>
         <p className="text-gray-500 text-sm font-medium mt-1 break-words text-center leading-tight">
  Requests Posted
</p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50  border-slate-200 shadow-sm rounded-xl p-5 text-center hover:shadow-md transition">
          <p className="text-3xl font-bold text-[#1e40af]">
            {profile.participations.length}
          </p>
       <p className="text-gray-500 text-sm font-medium mt-1 break-words text-center leading-tight">
  Participations
</p>
        </div>
        {(profile.type === "USER" || 
        profile.type === "VOLUNTEER" || 
        profile.type === "BOTH" || 
        profile.type === "ORGANIZATION_MEMBER") && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50  border-slate-200 shadow-sm rounded-xl p-5 text-center hover:shadow-md transition">
            <p className="text-3xl font-bold text-[#1e40af]">
            {profile.skills?.length || 0}
            </p>
            <p className="text-gray-500 text-sm font-medium mt-1 break-words text-center leading-tight">
  Skills
</p>
        </div>
        )}
      </div>

      {/* Skills */}
        {(profile.type === "USER" || 
        profile.type === "VOLUNTEER" || 
        profile.type === "BOTH" || 
        profile.type === "ORGANIZATION_MEMBER") &&
        profile.skills &&
        profile.skills.length > 0 && (        
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 shadow-sm rounded-xl p-6 mb-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-[#1e40af] mb-4 flex items-center gap-2">
            <Briefcase size={18} /> Skills
            </h2>

          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span
                key={skill.id}
                className="px-3 py-3 bg-blue-100 text-blue-800 border border-blue-200 rounded-full text-sm font-medium hover:bg-blue-200 transition"
              >
                {skill.skillName} ({skill.proficiencyLevel})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Requests Posted */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 shadow-sm rounded-xl p-6 mb-6 flex flex-col gap-4">
       <h2 className="text-xl font-bold text-green-700 flex items-center gap-2">
        <Users size={18} /> Requests Posted
        </h2>
        
        {profile.postedRequests.length === 0 ? (
          <p className="text-gray-400">No requests posted</p>
        ) : (
          <div className="space-y-3 flex flex-col gap-3">
            {profile.postedRequests.map((req) => (
              <div
                key={req.id}
               className="border border-green-300 p-4 rounded-lg bg-gradient-to-r from-green-50 hover:bg-green-50 transition flex justify-between items-center"
              > 
                <div>
                <h3 className="font-semibold">{req.title}</h3>

                <p className="text-sm text-gray-500">
                  {req.category} • {req.city}, {req.State}
                </p>
                </div>
                    <span
                    className={`text-xs px-2 py-1 rounded ${
                        statusStyles[req.status] || "bg-gray-100 text-gray-600"
                    }`}
                    >
                    {req.status}
                    </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Participations */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-100 shadow-sm rounded-xl p-6 flex flex-col gap-4">
       <h2 className="text-xl font-bold text-purple-700 flex items-center gap-2">
        <MapPin size={18} /> Participations
        </h2>

        {profile.participations.length === 0 ? (
          <p className="text-gray-400">No participations</p>
        ) : (
          <div className="space-y-3 flex flex-col gap-3">
            {profile.participations.map((p) => (
              <div
                key={p.requestId}
                className="bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-300 p-4 rounded-lg bg-white hover:bg-purple-50 transition flex justify-between"
              >
                <h3 className="font-semibold">{p.requestTitle}</h3>

                <span
                className={`text-xs px-2 py-1 rounded ${
                    participationStyles[p.participationStatus] || "bg-gray-100 text-gray-600"
                }`}
                >
                {p.participationStatus}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
    </div>
  );
}
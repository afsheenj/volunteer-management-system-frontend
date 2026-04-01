import { useEffect, useState } from "react";
import { Users, Trophy, ClipboardList, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";

const UHome = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Example: getting username from localStorage after login
    const storedUser = localStorage.getItem("username");
    if (storedUser) {
      setUsername(storedUser);
    } else {
      setUsername("Volunteer");
    }
  }, []);

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">
      <AppNavbar />

      <div className="pt-24 px-6 pb-8 md:px-12 flex flex-col gap-4">

        {/* Welcome Section */}
        <section className="mb-14 flex flex-col gap-4">
          <h1 className="text-4xl font-bold text-[#1e40af] mb-3">
            Welcome {username} 
          </h1>

          <p className="text-slate-600 text-lg max-w-2xl">
            Make a difference in your community. Explore requests,
            participate in meaningful activities, and earn points for your
            contributions.
          </p>

          <Link to="/posts">
            <button className="mt-6 px-6 py-3 bg-[#1e40af] text-white rounded-xl font-semibold shadow hover:bg-[#1a369d] transition flex items-center gap-2">
              Explore Posts
              <ArrowRight size={18} />
            </button>
          </Link>
        </section>

        {/* Stats Section */}
        <section className="grid md:grid-cols-3 gap-6 mb-14">

          <StatCard
            icon={<ClipboardList size={28} />}
            title="Requests Participated"
            value="12"
          />

          <StatCard
            icon={<Users size={28} />}
            title="Organizations"
            value="450+"
          />

          <StatCard
            icon={<Trophy size={28} />}
            title="Your Volunteer Score"
            value="320"
          />

        </section>

        {/* How It Works */}
        <section className="mb-14 flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-[#1e40af] mb-6">
            How V-Serve Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <StepCard
              step="1"
              title="Explore Requests"
              desc="Browse volunteer opportunities posted by organizations and individuals in your area."
            />

            <StepCard
              step="2"
              title="Join Activities"
              desc="Participate in activities like community service, environmental work, and social initiatives."
            />

            <StepCard
              step="3"
              title="Earn Score"
              desc="Every activity you complete increases your volunteer score and community impact."
            />

          </div>
        </section>

        {/* Motivation Section */}
        <section className="bg-white rounded-2xl p-8 shadow-md mb-16 flex flex-col gap-2">
          <h2 className="text-xl font-bold text-[#1e40af] mb-3">
            Make an Impact Today 
          </h2>

          <p className="text-slate-600 mb-5">
            Thousands of volunteers are making a difference every day.
            Join a request, support a cause, and help build a better community.
          </p>

          <Link to="/posts">
            <button className="px-6 py-2.5 bg-[#1e40af] text-white rounded-xl font-semibold hover:bg-[#1a369d] transition">
              Find a Request
            </button>
          </Link>
        </section>

      </div>
    </div>
  );
};

/* ---------- COMPONENTS ---------- */

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition flex items-center gap-4">

    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-[#1e40af]">
      {icon}
    </div>

    <div>
      <p className="text-slate-500 text-sm">{title}</p>
      <h3 className="text-xl font-bold text-slate-800">{value}</h3>
    </div>

  </div>
);


const StepCard = ({ step, title, desc }) => (
  <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition flex flex-col gap-1.2">

    <div className="w-10 h-10 bg-[#1e40af] text-white rounded-full flex items-center justify-center font-bold mb-4">
      {step}
    </div>

    <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>

    <p className="text-slate-600 text-sm leading-relaxed">
      {desc}
    </p>

  </div>
);

export default UHome;
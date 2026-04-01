import { useContext } from "react";
import { Users, Trophy, ClipboardList, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import { AuthContext } from "../context/AuthContext";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500">
        Loading user info...
      </div>
    );
  }

  const { role, userId, accountType } = user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">
      <AppNavbar />

      <div className="pt-24 px-6 pb-8 md:px-12 flex flex-col gap-6">
        {/* Welcome Section */}
        <section className="mb-10">
          <h1 className="text-4xl font-bold text-[#1e40af] mb-3">
            Welcome {accountType} (ID: {userId})
          </h1>

          <p className="text-slate-600 text-lg max-w-2xl">
            Role: <span className="font-semibold">{role}</span>
          </p>

          <p className="text-slate-600 text-lg max-w-2xl mt-2">
            This is your dashboard where you can track your activity,
            explore volunteer opportunities, and see the impact you are
            making in your community.
          </p>

          <Link to="/posts">
            <button className="mt-6 px-6 py-3 bg-[#1e40af] text-white rounded-xl font-semibold shadow hover:bg-[#1a369d] transition flex items-center gap-2">
              Explore Volunteer Requests
              <ArrowRight size={18} />
            </button>
          </Link>
        </section>

        {/* Dashboard Stats */}
        <section className="grid md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<ClipboardList size={28} />}
            title="Requests Joined"
            value="12"
          />
          <StatCard
            icon={<Users size={28} />}
            title="Organizations Helped"
            value="5"
          />
          <StatCard
            icon={<Trophy size={28} />}
            title="Volunteer Score"
            value="320"
          />
        </section>

        {/* How It Works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1e40af] mb-6">
            How V-Serve Works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              step="1"
              title="Find Requests"
              desc="Browse requests posted by organizations or individuals who need volunteers."
            />
            <StepCard
              step="2"
              title="Participate"
              desc="Join meaningful activities and contribute your time and skills."
            />
            <StepCard
              step="3"
              title="Earn Points"
              desc="Gain volunteer points and recognition for helping the community."
            />
          </div>
        </section>

        {/* Motivation Section */}
        <section className="bg-white rounded-2xl p-8 shadow-md mb-16">
          <h2 className="text-xl font-bold text-[#1e40af] mb-3">
            Your Contribution Matters
          </h2>

          <p className="text-slate-600 mb-5">
            Every request you participate in helps build a stronger community.
            Explore new opportunities and make an impact today.
          </p>

          <Link to="/posts">
            <button className="px-6 py-2.5 bg-[#1e40af] text-white rounded-xl font-semibold hover:bg-[#1a369d] transition">
              Find Volunteer Requests
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
  <div className="bg-white rounded-2xl p-6 shadow hover:shadow-lg transition">
    <div className="w-10 h-10 bg-[#1e40af] text-white rounded-full flex items-center justify-center font-bold mb-4">
      {step}
    </div>
    <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default UserDashboard;
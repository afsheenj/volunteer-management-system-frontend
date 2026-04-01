import { useContext, useEffect, useState } from "react";
import { Users, ClipboardList, Building2, ArrowRight } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import OrganizationFloatingMenu from "../components/OrganizationFloatingMenu";
import api from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import { AuthContext } from "../context/AuthContext";

const OrganizationDashboard = () => {

  const [orgName, setOrgName] = useState("");
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);
  const [stats, setStats] = useState({
  activeRequests: 0,
  upcomingRequests: 0,
  totalVolunteersNeeded: 0
});

const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedOrg = localStorage.getItem("organizationName");

    if (storedOrg) {
      setOrgName(storedOrg);
    } else {
      setOrgName("Organization");
    }
  }, []);

useEffect(() => {
  fetchStats();
}, []);

const fetchStats = async () => {
  try {
    setLoading(true);
    const orgId = user?.orgId;
    const res = await api.get(`/organizations/${orgId}/dashboard/stats`);
    console.log(res);

    setStats(res.data || res);

  } catch (err) {
    console.error("Failed to fetch stats", err);
  } finally {
    setLoading(false);
  }
};

if (loading) {
  return <LoadingSpinner text="Loading dashboard..." />;
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-100">

      <AppNavbar />
     

      <div className="pt-24 px-6 pb-8 md:px-12 flex flex-col gap-4">

        {/* Welcome */}
        <section className="mb-14 flex flex-col gap-4">

          <h1 className="text-4xl font-bold text-[#1e40af]">
            Welcome
          </h1>

          <p className="text-slate-600 text-lg max-w-2xl">
            Manage volunteer activities, create requests, and engage with the
            community through V-Serve.
          </p>

          <Link to="/organization/create-request">
            <button className="mt-6 px-6 py-3 bg-[#1e40af] text-white rounded-xl font-semibold shadow hover:bg-[#1a369d] transition flex items-center gap-2">
              Create New Request
              <ArrowRight size={18} />
            </button>
          </Link>

        </section>

        {/* Stats */}
        <section className="grid md:grid-cols-3 gap-6 mb-14">

            <StatCard
              icon={<ClipboardList size={28} />}
              title="Active Requests"
              value={stats.activeRequests}
            />

            <StatCard
              icon={<Users size={28} />}
              title="Volunteers Needed"
              value={stats.totalVolunteersNeeded}
            />

            <StatCard
              icon={<Building2 size={28} />}
              title="Upcoming Requests"
              value={stats.upcomingRequests}
            />

        </section>

        {/* How It Works */}
        <section className="mb-14 flex flex-col gap-4">

          <h2 className="text-2xl font-bold text-[#1e40af] mb-6">
            Organization Tools
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            <StepCard
              step="1"
              title="Create Requests"
              desc="Post volunteering opportunities and community initiatives."
            />

            <StepCard
              step="2"
              title="Manage Volunteers"
              desc="Track volunteer participation and communicate with them."
            />

            <StepCard
              step="3"
              title="Track Impact"
              desc="Monitor your organization’s social impact through analytics."
            />

          </div>

        </section>

        {/* Motivation */}
        <section className="bg-white rounded-2xl p-8 shadow-md mb-16 flex flex-col gap-2">

          <h2 className="text-xl font-bold text-[#1e40af] mb-3">
            Grow Your Community Impact
          </h2>

          <p className="text-slate-600 mb-5">
            Connect with volunteers, organize campaigns, and build a stronger
            community through V-Serve.
          </p>

          <Link to="/posts">
            <button  className="px-6 py-2.5 bg-[#1e40af] text-white rounded-xl font-semibold hover:bg-[#1a369d] transition">
              View Requests
            </button>
          </Link>

        </section>

         <OrganizationFloatingMenu/>

      </div>
    </div>
  );
};

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

    <p className="text-slate-600 text-sm leading-relaxed">
      {desc}
    </p>
  </div>
);

export default OrganizationDashboard;
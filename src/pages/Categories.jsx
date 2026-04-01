import React from 'react';
import { useNavigate } from "react-router-dom";
import { 
  Users, ShieldCheck, FlameKindling, AlertCircle, 
  BookOpen, Megaphone, MoreHorizontal, ArrowRight,
  TrendingUp, Activity, HeartPulse, Sprout,Utensils, Trash2, Calendar, Truck, Camera, Laptop, 
  Database, DollarSign, HandHelping, Palette, 
  HeartHandshake, Baby, Venus, Dog, Landmark, Hammer, Briefcase
} from "lucide-react";
import AppNavbar from '../components/AppNavbar';
import { useState, useEffect } from 'react';
import api from '../services/api';
import { showError } from '../utils/alertservice';

const CATEGORY_MAP = {
  OLD_AGE_HOME: {
    title: "Old Age Home",
    desc: "Support and spend quality time with seniors in community living centers.",
    icon: Users,
    gradient: "from-orange-200 to-orange-100/90", 
    iconBg: "bg-orange-500",
    impact: "850+ Hours Served",
    status: "High Need"
  },
  PUBLIC_SERVICE: {
    title: "Public Service",
    desc: "Engage in initiatives that improve public infrastructure and community well-being.",
    icon: ShieldCheck,
    gradient: "from-emerald-200 to-emerald-100/90",
    iconBg: "bg-emerald-500",
    impact: "12 Projects Completed",
    status: "Active"
  },
  DISASTER_MANAGEMENT: {
    title: "Disaster Management",
    desc: "Help communities prepare for and recover from natural calamities effectively.",
    icon: FlameKindling,
    gradient: "from-rose-200 to-purple-300/80",
    iconBg: "bg-rose-500",
    impact: "Rapid Response Ready",
    status: "Critical"
  },
  EMERGENCY: {
    title: "Emergency",
    desc: "Provide immediate assistance and critical support during urgent situations.",
    icon: AlertCircle,
    gradient: "from-violet-200 to-red-300/30",
    iconBg: "bg-red-500",
    impact: "24/7 Dispatch",
    status: "Urgent"
  },
  TEACHING: {
    title: "Teaching",
    desc: "Share knowledge and tutor students in various subjects and essential skills.",
    icon: BookOpen,
    gradient: "from-blue-200 to-blue-100/90",
    iconBg: "bg-blue-500",
    impact: "200+ Students Mentored",
    status: "Open"
  },
  AWARENESS: {
    title: "Awareness",
    desc: "Spread information on health, safety, and social rights within the community.",
    icon: Megaphone,
    gradient: "from-purple-200 to-purple-300/60",
    iconBg: "bg-purple-500",
    impact: "5k+ People Reached",
    status: "Ongoing"
  },
  HEALTHCARE: { // Added for the new backend enum
    title: "Healthcare",
    desc: "Support health clinics and medical camps for community wellness.",
    icon: HeartPulse,
    gradient: "from-cyan-200 to-blue-100/90",
    iconBg: "bg-cyan-500",
    impact: "1k+ Patients Helped",
    status: "Active"
  },
  ENVIRONMENT: { // Added for the new backend enum
    title: "Environment",
    desc: "Participate in green initiatives, plantation drives, and eco-conservation.",
    icon: Sprout,
    gradient: "from-green-200 to-emerald-100/90",
    iconBg: "bg-emerald-600",
    impact: "2k+ Trees Planted",
    status: "Active"
  },
  // --- NEWLY MAPPED CATEGORIES ---
  FOOD_SERVICES: {
    title: "Food Services",
    desc: "Help manage community kitchens and distribute meals to those in need.",
    icon: Utensils, // Import Utensils from lucide-react
    gradient: "from-orange-200 to-orange-100/90",
    iconBg: "bg-orange-500",
    impact: "10k+ Meals Served",
    status: "Active"
  },
  CLEANLINESS_DRIVE: {
    title: "Cleanliness Drive",
    desc: "Join local sanitation efforts and waste management awareness programs.",
    icon: Trash2, // Import Trash2 from lucide-react
    gradient: "from-emerald-200 to-emerald-100/90",
    iconBg: "bg-emerald-500",
    impact: "50+ Areas Cleaned",
    status: "Open"
  },
  EVENT_MANAGEMENT: {
    title: "Event Management",
    desc: "Coordinate and organize community events, workshops, and gatherings.",
    icon: Calendar, // Import Calendar from lucide-react
    gradient: "from-blue-200 to-blue-100/90",
    iconBg: "bg-blue-500",
    impact: "30+ Events Hosted",
    status: "Active"
  },
  LOGISTICS: {
    title: "Logistics",
    desc: "Manage the transportation and supply chain of essential goods.",
    icon: Truck, // Import Truck from lucide-react
    gradient: "from-rose-200 to-rose-400/60",
    iconBg: "bg-rose-500",
    impact: "Efficient Delivery",
    status: "Ongoing"
  },
  MEDIA_AND_CONTENT: {
    title: "Media & Content",
    desc: "Create digital content and manage social media to tell our story.",
    icon: Camera, // Import Camera from lucide-react
    gradient: "from-purple-200 to-purple-300/60",
    iconBg: "bg-purple-500",
    impact: "High Engagement",
    status: "Creative"
  },
  IT_SUPPORT: {
    title: "IT Support",
    desc: "Provide technical assistance and digital solutions for social causes.",
    icon: Laptop, // Import Laptop from lucide-react
    gradient: "from-indigo-200 to-indigo-100/90",
    iconBg: "bg-indigo-500",
    impact: "Systems Secured",
    status: "Expert"
  },
  DATA_MANAGEMENT: {
    title: "Data Management",
    desc: "Help organize and analyze community data for better decision making.",
    icon: Database, // Import Database from lucide-react
    gradient: "from-cyan-200 to-blue-100/90",
    iconBg: "bg-cyan-500",
    impact: "Data-Driven Impact",
    status: "Active"
  },
  FUNDRAISING: {
    title: "Fundraising",
    desc: "Initiate and manage campaigns to raise resources for social impact.",
    icon: DollarSign, // Import DollarSign from lucide-react
    gradient: "from-rose-200 to-purple-300/80",
    iconBg: "bg-rose-500",
    impact: "Funds Secured",
    status: "Essential"
  },
  COMMUNITY_SUPPORT: {
    title: "Community Support",
    desc: "Strengthen local ties through direct engagement and aid programs.",
    icon: HandHelping, // Import HandHelping from lucide-react
    gradient: "from-orange-200 to-orange-100/90",
    iconBg: "bg-orange-500",
    impact: "Stronger Bonds",
    status: "High Need"
  },
  ARTS_AND_CULTURE: {
    title: "Arts & Culture",
    desc: "Promote community heritage through music, art, and cultural festivals.",
    icon: Palette, // Import Palette from lucide-react
    gradient: "from-violet-200 to-red-300/30",
    iconBg: "bg-violet-500",
    impact: "Cultural Growth",
    status: "Creative"
  },
  SOCIAL_WORK: {
    title: "Social Work",
    desc: "Offer counseling and direct support services to vulnerable individuals.",
    icon: HeartHandshake, // Import HeartHandshake from lucide-react
    gradient: "from-rose-200 to-orange-100/90",
    iconBg: "bg-rose-500",
    impact: "Lives Transformed",
    status: "Critical"
  },
  CHILD_CARE: {
    title: "Child Care",
    desc: "Support children’s development and safety in early education centers.",
    icon: Baby, // Import Baby from lucide-react
    gradient: "from-blue-200 to-blue-100/90",
    iconBg: "bg-blue-500",
    impact: "Safe Spaces Created",
    status: "High Need"
  },
  WOMEN_EMPOWERMENT: {
    title: "Women Empowerment",
    desc: "Promote gender equality and support women’s leadership programs.",
    icon: Venus, // Using a placeholder for woman-related icon or Shield
    gradient: "from-purple-200 to-purple-300/60",
    iconBg: "bg-purple-600",
    impact: "Leaders Empowered",
    status: "Active"
  },
  ANIMAL_WELFARE: {
    title: "Animal Welfare",
    desc: "Care for stray animals and support wildlife conservation efforts.",
    icon: Dog, // Import Dog from lucide-react
    gradient: "from-orange-200 to-orange-100/90",
    iconBg: "bg-orange-600",
    impact: "Lives Saved",
    status: "Active"
  },
  RURAL_DEVELOPMENT: {
    title: "Rural Development",
    desc: "Work on infrastructure and economic growth in rural communities.",
    icon: Landmark, // Import Landmark from lucide-react
    gradient: "from-emerald-200 to-emerald-100/90",
    iconBg: "bg-emerald-600",
    impact: "Villages Supported",
    status: "Ongoing"
  },
  SKILL_DEVELOPMENT: {
    title: "Skill Development",
    desc: "Conduct vocational training and professional skill workshops.",
    icon: Hammer, // Import Hammer from lucide-react
    gradient: "from-blue-200 to-rose-400/60",
    iconBg: "bg-slate-600",
    impact: "Jobs Facilitated",
    status: "Open"
  },
  ADMIN_SUPPORT: {
    title: "Admin Support",
    desc: "Help with documentation, office management, and planning.",
    icon: Briefcase, // Import Briefcase from lucide-react
    gradient: "from-green-200 to-green-100/90",
    iconBg: "bg-indigo-600",
    impact: "Efficiency Boosted",
    status: "Active"
  },
  OTHER: {
    title: "Other",
    desc: "Find various unique ways to contribute based on diverse community needs.",
    icon: MoreHorizontal,
    gradient: "from-slate-200 to-slate-400/60",
    iconBg: "bg-slate-500",
    impact: "Diverse Contributions",
    status: "Flexible"
  }
};

const Categories = () => {
  const navigate = useNavigate();
  const [categoriesFromBackend, setCategoriesFromBackend] = React.useState([]);
  // const categoriesFromEnum = Object.keys(CATEGORY_MAP);

  const handleExplore = (enumKey) => {
    // Navigates to posts and passes the specific category in the state
    navigate('/posts', { state: { selectedCategory: enumKey } });
  };

  useEffect(() => {
    const fetchEnums = async () => {
      try {
        const res = await api.get("/enums/categories");
        setCategoriesFromBackend(res); // Expected: ["OLD_AGE_HOME", "PUBLIC_SERVICE", ...]
      } catch (e) {
       showError("Error", "Failed to load categories");
        // Fallback to locally defined keys if API fails
        setCategoriesFromBackend(Object.keys(CATEGORY_MAP).filter(k => k !== 'OTHER'));
      }
    };
    fetchEnums();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20 overflow-x-hidden">
      <AppNavbar />
      <div className="pt-20 sm:pt-24 px-4 sm:px-6 md:px-12 w-full flex flex-col items-center">
        <div className="max-w-5xl w-full">
          <div className="flex flex-col items-center text-center mb-16 w-full">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#2e47a5] mb-4 pt-2">Explore Categories</h1>
            <p className="text-slate-700 text-base max-w-2xl leading-relaxed font-medium pt-2">
              Find ways to serve. Explore diverse categories & discover initiatives that match your passion.
            </p>
          </div>

          <div className="flex flex-col gap-8 w-full items-center pt-4">
            {/* {categoriesFromEnum.map((enumKey) => { */}
            {categoriesFromBackend.map((enumKey) => {
              const isDefined = !!CATEGORY_MAP[enumKey];
              const cat = CATEGORY_MAP[enumKey] || CATEGORY_MAP.OTHER;

              // 2. Generate a "Human Readable" title (e.g., CHILD_CARE -> Child Care)
  const displayTitle = isDefined 
    ? cat.title 
    : enumKey.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // 3. Generate a dynamic description if it's a fallback
  const displayDesc = isDefined 
    ? cat.desc 
    : `Join our ${displayTitle} initiatives to make a meaningful impact in the community.`;

              return (
                <div key={enumKey} className={`relative overflow-hidden rounded-[2.5rem] p-5 sm:p-6 md:p-10 bg-gradient-to-br ${cat.gradient} border border-white/40 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-slate-300 group flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-stretch gap-8 w-full shadow-lg`}>
                  <div className="flex flex-col items-center md:items-start text-center md:text-left min-w-[200px]">
                    <div className={`${cat.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md transform group-hover:-translate-y-1 transition-transform duration-300`}>
                      <cat.icon size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      {displayTitle}
                      {/* {CATEGORY_MAP[enumKey] ? cat.title : enumKey.replace(/_/g, ' ')} */}
                    </h2>
                    <span className="px-3 py-1 bg-white/50 rounded-full text-[11px] font-bold text-slate-700 uppercase tracking-widest border border-white/60">{cat.status}</span>
                  </div>

                  <div className="flex-1 flex flex-col justify-center border-y md:border-y-0 md:border-x border-black/5 py-6 md:py-0 md:px-10">
                    <p className="text-slate-800 text-[16px] font-semibold leading-relaxed mb-6 pb-5">
                      {/* {cat.desc} */}
                      {displayDesc}
                      </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <TrendingUp size={16} className="text-slate-500" />
                        <span className="text-xs font-bold">{cat.impact}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Activity size={16} className="text-slate-500" />
                        <span className="text-xs font-bold">12+ Active Now</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center items-center md:items-end min-w-[150px] gap-4">
                    <span className="text-slate-700 font-black uppercase tracking-tighter text-[24px]">12</span>
                    <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] -mt-4 mb-2">Initiatives</span>
                    <button 
                      onClick={() => handleExplore(enumKey)}
                      className="w-full md:w-auto bg-white text-slate-900 text-sm font-bold px-8 py-3 rounded-2xl shadow-md border border-slate-100 hover:bg-[#1e40af] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      Explore <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
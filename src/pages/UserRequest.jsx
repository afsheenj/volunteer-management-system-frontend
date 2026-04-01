
import AppNavbar from "../components/AppNavbar";
import verified from "../assets/verified.png";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

const UserRequest = () => {

  const { user } = useContext(AuthContext);
  const userId = user?.userId;

  const [request, setRequest] = useState({
    title: "",
    description: "",
    category: "",
    requestType: "",
    location: "",
    serviceDate: "",
    serviceStartTime: "",
    serviceEndTime: "",
    minVolunteers: "",
    maxVolunteers: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setRequest({
      ...request,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {

      console.log("Submitting request:", request);

      const response = await api.post(
        `/requests/users/${userId}`,
        request
      );

      alert("Request created successfully");

      console.log(response);

      setRequest({
        title: "",
        description: "",
        category: "",
        requestType: "",
        location: "",
        serviceDate: "",
        serviceStartTime: "",
        serviceEndTime: "",
        minVolunteers: "",
        maxVolunteers: ""
      });

    } catch (error) {
      console.error("Error creating request", error);
      alert("Failed to create request");
    }
  };

  return (
    <div className="bg-slate-50">

      <AppNavbar />

      <div className="pt-24 px-6 max-w-7xl mx-auto min-h-screen bg-indigo-50">

        <h1 className="text-3xl font-bold text-slate-800">
          Request Volunteers
        </h1>

        <p className="text-slate-500 mt-2">
          Create a volunteer request and get help from available volunteers.
        </p>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* FORM */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow p-6 space-y-6">

            {/* DATE */}
            <div>
              <label className="font-semibold">Service Date</label>
              <input
                type="date"
                name="serviceDate"
                value={request.serviceDate}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 mt-2"
              />
            </div>

            {/* START TIME */}
            <div>
              <label className="font-semibold">Start Time</label>
              <input
                type="time"
                name="serviceStartTime"
                value={request.serviceStartTime}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 mt-2"
              />
            </div>

            {/* END TIME */}
            <div>
              <label className="font-semibold">End Time</label>
              <input
                type="time"
                name="serviceEndTime"
                value={request.serviceEndTime}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 mt-2"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="font-semibold">Category</label>

              <select
                name="category"
                value={request.category}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 mt-2"
              >
                <option value="">Select Category</option>
                <option value="OLD_AGE_HOME">Old Age Home</option>
                <option value="PUBLIC_SERVICE">Public Service</option>
                <option value="DISASTER_MANAGEMENT">Disaster Management</option>
                <option value="EMERGENCY">Emergency</option>
                <option value="TEACHING">Teaching</option>
                <option value="AWARENESS">Awareness</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* REQUEST TYPE */}
            <div>
              <label className="font-semibold">Request Type</label>

              <input
                type="text"
                name="requestType"
                value={request.requestType}
                onChange={handleChange}
                placeholder="Example: Community Service"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 mt-2"
              />
            </div>

            {/* TITLE */}
            <div>
              <label className="font-semibold">Title</label>

              <input
                type="text"
                name="title"
                value={request.title}
                onChange={handleChange}
                placeholder="Example: Help at Old Age Home"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 mt-2"
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="font-semibold">Description</label>

              <textarea
                name="description"
                value={request.description}
                onChange={handleChange}
                placeholder="Describe what volunteers should do..."
                className="w-full border border-slate-300 rounded-lg px-4 py-3 mt-2 min-h-[120px]"
              />
            </div>

            {/* VOLUNTEERS */}
            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="font-semibold">Min Volunteers</label>
                <input
                  type="number"
                  name="minVolunteers"
                  value={request.minVolunteers}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 mt-2"
                />
              </div>

              <div>
                <label className="font-semibold">Max Volunteers</label>
                <input
                  type="number"
                  name="maxVolunteers"
                  value={request.maxVolunteers}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 mt-2"
                />
              </div>

            </div>

            {/* LOCATION */}
            <div>
              <label className="font-semibold">Location</label>

              <select
                name="location"
                value={request.location}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded-lg px-4 py-3 mt-2"
              >
                <option value="">Select</option>
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Madurai">Madurai</option>
              </select>
            </div>

            {/* SUBMIT */}
            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-lg bg-[#1e40af] text-white font-semibold hover:bg-[#1e3a8a]"
            >
              Submit Request
            </button>

          </div>


          {/* INFO CARD */}
          <div className="bg-white rounded-xl shadow p-6 space-y-6">

            <div className="flex flex-col items-center text-center space-y-4">

              <img src={verified} className="w-16" />

              <h3 className="text-xl font-bold text-[#1e40af]">
                Verified Volunteer Requests
              </h3>

              <p className="text-slate-600">
                Your request will be shared with verified volunteers
                who are ready to help communities.
              </p>

            </div>

            <ul className="list-disc pl-6 space-y-2 text-slate-600">

              <li>Provide clear descriptions</li>
              <li>Specify service date and time</li>
              <li>Set accurate volunteer count</li>
              <li>Choose correct category</li>

            </ul>

          </div>

        </div>

      </div>

    </div>
  );
};

export default UserRequest;
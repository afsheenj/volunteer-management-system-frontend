import { Routes, Route, BrowserRouter, Navigate, Outlet } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import OrganizationRequest from "./pages/OrganizationCreateRequest.jsx";
import UserRequest from "./pages/UserCreateRequest.jsx";
import PostedRequests from "./pages/PostedRequests.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import AppHome from "./pages/UHome.jsx";
import UserRequests from "./pages/UserRequests.jsx";
import MyActivity from "./pages/MyActivity.jsx";
import UserRequestDetails from "./pages/UserRequestDetails.jsx";


import "./App.css";
import { AuthContext, AuthProvider } from "./context/AuthContext.jsx";
import { useContext, useEffect } from "react";
import UnAuthorized from "./pages/UnAuthorized.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import  AdminDashboard  from "./pages/AdminDashboard.jsx";
import VolunteerDashboard from "./pages/VolunteerDashboard.jsx";
import History from "./pages/History.jsx";
import Categories from "./pages/Categories.jsx";
import UHome from "./pages/UHome.jsx";
import OrganizationDashboard from "./pages/OrganizationDashboard.jsx";
import OrganizationProfile from "./pages/OrganizationProfile.jsx";
import OrganizationMember from "./pages/OrganizationMember.jsx";
import ManageMembers from "./pages/ManageMembers.jsx";
import OrganizationCreateRequest from "./pages/OrganizationCreateRequest.jsx";
import OrganizationMyRequests from "./pages/OrganizationMyRequests.jsx";
import OrganizationHistory from "./pages/OrganizationHistory.jsx";
import Organizations from "./pages/Organizations.jsx";
import ViewPost from "./pages/ViewPost.jsx";
import UserEditRequest from "./pages/UserEditRequest.jsx";
import PublicOrganizationDetail from "./pages/PublicOrganizationDetail.jsx";
import  PublicProfile from "./pages/PublicProfile.jsx";
import OrganizationRequestDetails from "./pages/OrganizationRequestDetails.jsx";
import OrganizationEditRequest from "./pages/OrganizationEditRequest.jsx";
import AdminDocumentVerification from "./pages/AdminDocumentVerification.jsx";
import MyActivityDetails from "./pages/MyActivityDetails.jsx";
import AdminViewOrganizations from "./pages/AdminViewOrganizations.jsx";
import AdminRequestDetails from "./pages/AdminRequestDetails.jsx";
import AdminViewRequests from "./pages/AdminViewRequests.jsx";
import AdminViewUsers from "./pages/AdminViewUsers.jsx";
import AdminProfile from "./pages/AdminProfile.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import OrganizationActivity from "./pages/OrganizationActivity.jsx";
import OrganizationActivityDetails from "./pages/OrganizationActivityDetails.jsx";

const ProtectedRoute=({allowedRoles})=>{
  const {user,loading} = useContext(AuthContext);
   if (loading) {
    return <div>Loading...</div>;
  }
  if(!user) return <Navigate to="/login"/>

  if(user && user?.role && ! allowedRoles.includes(user?.role)) return <Navigate to="/unauthorized"/>

  return <Outlet/>
  
}



function App() {
const {user,logout} = useContext(AuthContext);
 

// console.log("user role",user?.role);



console.log("user", user);

 // Replace your old ProtectedRoute with this in App.jsx
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  // 1. Prevents redirecting to login while checking the token
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-[#1e40af] rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. Redirect if not logged in
  if (!user) return <Navigate to="/login" />;

  // 3. Redirect if the user doesn't have the right permissions
  if (user?.role && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  // 4. Important: This renders the nested route (like History)
  return <Outlet />;
};

  return (

    <Routes>

      {/* ---------- PUBLIC ROUTES ---------- */}

      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/unauthorized" element={<UnAuthorized/>}/>

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/user/request" element={<UserRequest/>}/>

       <Route path="/organizations" element={<Organizations />}  />

      <Route path="/posts" element={<PostedRequests />} />
      {/* <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} /> */}
      {/* <Route path="/history" element={<History/>} /> */}
      <Route path="/categories" element={<Categories />} />
      <Route path="/organization/:id" element={<PublicOrganizationDetail />} />
      <Route path="/organization/history" element={<OrganizationHistory />} />
      <Route path="/profile/:name" element={<PublicProfile/>}/>
      <Route path="/forgot-password" element={<ForgotPassword/>}/>

      <Route path="/user" element={<ProtectedRoute allowedRoles={["USER","VOLUNTEER","BOTH","ORGANIZATION_MEMBER"]}/>}>
        <Route path="dashboard" element={<UserDashboard/>}/>
      </Route>


<Route path="/user" element={<ProtectedRoute allowedRoles={["USER", "VOLUNTEER", "BOTH","ORGANIZATION_MEMBER"]}/>}>
    <Route path="dashboard" element={<UserDashboard/>}/>
    <Route path="profile" element={<UserProfile />} />
    <Route path="create-request" element={<UserRequest/>}/>
    <Route path="my-requests" element={<UserRequests />} />
    <Route path="/user/request/:id"element={<UserRequestDetails />}/>
    <Route path="/user/request/edit/:id" element={<UserEditRequest />} />
    <Route path="my-activity" element={<MyActivity />} />
    <Route path="my-activity/:id"element={<MyActivityDetails />}/>
    {/* <Route path="/organization/:id" element={<PublicOrganizationDetail />} /> */}
</Route>
      <Route path="/user" element={<ProtectedRoute allowedRoles={["USER"]}/>} />
      
      <Route path="/organization/history" element={<OrganizationHistory />} />

      <Route path="/user" element={<ProtectedRoute allowedRoles={["USER", "VOLUNTEER", "BOTH", "ORGANIZATION_MEMBER"]}/>}/> 
      <Route path="/view-post/:id" element={<ViewPost/>}/>

     
     <Route path="/admin" element={<ProtectedRoute allowedRoles={["ADMIN"]}/>}>
        <Route path="dashboard" element={<AdminDashboard/>}/>
        <Route path="/admin/document-verification" element={<AdminDocumentVerification/>}></Route>
        <Route path="organizations" element={<AdminViewOrganizations/>}/>
        <Route path="requests" element={<AdminViewRequests/>}></Route>
        <Route path="requests/:id" element={<AdminRequestDetails/>}/>
        <Route path="users" element={<AdminViewUsers/>}/>
        <Route path="profile" element={<AdminProfile />} />
     </Route>

     <Route element={<ProtectedRoute allowedRoles={["USER", "VOLUNTEER", "ORGANIZATION_MEMBER", "BOTH"]} />}>
     <Route path="/history" element={<History />} />
     </Route>


     {/* <Route path="/volunteer" element={<ProtectedRoute allowedRoles={["VOLUNTEER"]}/>}>
        <Route path="dashboard" element={<VolunteerDashboard />} />
    </Route> */}

      <Route path="/organization" element={<ProtectedRoute allowedRoles={["ORGANIZATION"]}/>}>
        <Route path="dashboard" element={<OrganizationDashboard/>}/>
        <Route path="profile" element={<OrganizationProfile/>}/>
        <Route path="add-members" element={<OrganizationMember/>}/>
        <Route path="manage-members" element={<ManageMembers/>}/>
        <Route path="create-request" element={<OrganizationCreateRequest />} />
        <Route path="my-requests" element={<OrganizationMyRequests/>}/>
        <Route path="history" element={<OrganizationHistory />} />
        <Route path="request/edit/:id"element={<OrganizationEditRequest />}/>
        <Route path="request/details/:id"element={<OrganizationRequestDetails />}
/>
        <Route path="my-activities" element={<OrganizationActivity/>}/>
        <Route path="activity/:id" element={<OrganizationActivityDetails/>}/>
     </Route>

      {/* <Route path="/organization/history" element={<OrganizationHistory />} /> */}

    </Routes>
 
  
  );
}

export default App;

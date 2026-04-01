// import { Navigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function ProtectedRoute({ children, allowedRoles }) {
//   const { user } = useAuth();

//   if (!user) return <Navigate to="/" />;

//   const userRoles = user.roles || [];

//   const hasAccess = allowedRoles.some(role =>
//     userRoles.includes(`ROLE_${role}`)
//   );

//   if (!hasAccess) return <Navigate to="/unauthorized" />;

//   return children;
// }

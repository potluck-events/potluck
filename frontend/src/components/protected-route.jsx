import { useContext } from "react";
import { AuthContext } from "../context/authcontext";
import { Outlet, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";

//This component protects a route by redirecting to the landing page (or a propped other route) if there is no token (obtained through context). 
//It may be used as a wrapper of multiple sibling routes(providing outlet) or as a parent element.
export default function ProtectedRoute ({redirectPath = '/sign-up', children,}) {
  const token = useContext(AuthContext)
  const location = useLocation()

  if (!token) {
    return <Navigate to={redirectPath} replace state={{ from: location }}/>;
  }

  return children ? children : <Outlet />;
};
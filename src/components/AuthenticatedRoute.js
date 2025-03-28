import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

const AuthenticatedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // Ensure authentication check completes before rendering
  useEffect(() => {
    if (!loading) {
      setIsAuthChecked(true);
    }
  }, [loading]);

  // Show a loading state while checking authentication
  if (!isAuthChecked) {
    return <p>Loading...</p>; // Replace with a proper loading spinner if needed
  }

  const authPaths = ["/login", "/signup", "/forgot-password"];

  // If user is logged in and tries to access auth pages, redirect to home
  if (user && authPaths.includes(location.pathname)) {
    return <Navigate to="/" replace />;
  }

  // If user is NOT logged in and tries to access a protected route, redirect to login
  if (!user && !authPaths.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthenticatedRoute;

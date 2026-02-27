import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

    // If user is authenticated, render the child components
    return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
};



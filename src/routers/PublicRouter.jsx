// src/components/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // ajusta la ruta si es diferente

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return "";

  return user ? <Navigate to="/home" /> : children;
};

export default PublicRoute;

import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.rol !== "admin") {
    return <Navigate to="/inicio" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;

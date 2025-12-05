import { Navigate, Outlet } from "react-router-dom";

const VendedorRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || (user.rol !== "vendedor" && user.rol !== "admin")) {
    return <Navigate to="/inicio" replace />;
  }

  return <Outlet />;
};

export default VendedorRoute;

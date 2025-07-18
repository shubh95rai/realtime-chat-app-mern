import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function PrivateRoute() {
  const authUser = useAuthStore((state) => state.authUser);

  return authUser ? <Outlet /> : <Navigate to="/login" />;
}

import { Navigate, useLocation } from "react-router-dom";
import { isAdminLoggedIn } from "@/lib/adminAuth";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const location = useLocation();

  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

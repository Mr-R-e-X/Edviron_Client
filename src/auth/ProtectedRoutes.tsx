import React from "react";
import { Navigate, Outlet } from "react-router-dom";

type ProtectedRoutesProps = {
  children?: JSX.Element;
  userExists: boolean;
  redirect?: string;
};

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({
  children,
  userExists,
  redirect = "/signin",
}) => {
  if (!userExists) {
    return <Navigate to={redirect} />;
  }

  return children || <Outlet />;
};

export default ProtectedRoutes;

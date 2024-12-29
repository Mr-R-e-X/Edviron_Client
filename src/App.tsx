import React, { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./auth/ProtectedRoutes";
import { useAppSelector } from "./hooks/hooks";
import ShimmerUi from "./Layouts/ShimmerUi";

const SignIn = lazy(() => import("./pages/SignIn"));
const SignUpAdmin = lazy(() => import("./pages/SignUpAdmin"));
const SignUpSchoolAdmin = lazy(() => import("./pages/SignUpSchoolAdmin"));
const Dashboard = lazy(() => import("./pages/Dashboard"));

function App() {
  const { userExists } = useAppSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Suspense fallback={<ShimmerUi />}>
        <Routes>
          <Route element={<ProtectedRoutes userExists={userExists} />}>
            <Route path="/" element={<Dashboard />} />
          </Route>

          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup/admin" element={<SignUpAdmin />} />
          <Route path="/signup/school-admin" element={<SignUpSchoolAdmin />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

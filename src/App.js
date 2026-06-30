// import React, { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Toaster, toast } from 'sonner'
import { AuthProvider, useAuth } from "./components/contexts/AuthContext";
import MainLayout from "./components/Layout/MainLayout";
import LoginPage from "./components/Screen/Login/Login";
import DashboardPage from "./components/Screen/Dashboard/Dashboard";
import BatteryPage from "./components/Screen/Battery/Battery";
import PCSPage from "./components/Screen/PCS/PCS";
import EnergyReportPage from "./components/Screen/EnergyReport/EnergyReport";
import UserManagementPage from "./components/Screen/UserManagement/UserManagement";
import SystemSettingsPage from "./components/Screen/SystemSettings/SystemSettings";
import RolePage from "./components/Screen/Role/Role";
import UserInfoPage from "./components/Screen/UserInfo/UserInfo";
import AlarmPage from "./components/Screen/Alarm/Alarm";
import UserRecovery from "./components/Screen/UserRecovery/UserRecovery"
import RoleEdit from "./components/Screen/RoleEdit/RoleEdit"
import { io } from "socket.io-client";
import { signal } from "@preact/signals-react";
import { useEffect } from "react";
import { useState } from "react";
// import { callApi } from "./components/Api/Api";
export const socket = signal(io.connect(process.env.REACT_APP_API));

export function toInt16(raw) {
  const value = Number(raw) & 0xffff;
  return value >= 0x8000 ? value - 0x10000 : value;
}

export const convertToDoublewordAndFloat = (cal, type, scale) => {
  let word = ["0", "0"];

  word[0] = cal[0];
  word[1] = cal[1];

  var doubleword = (word[1] << 16) | word[0];
  var buffer = new ArrayBuffer(4);
  var intView = new Int32Array(buffer);
  var floatView = new Float32Array(buffer);
  intView[0] = doubleword;
  var float_value = floatView[0];

  return type === "float"
    ? parseFloat(float_value * (scale || 1)).toFixed(1) || 0
    : parseFloat(doubleword * (scale || 1)).toFixed(1);
};

const ProtectedRoute = ({ permission }) => {
  const { isAuthenticated, authLoading } = useAuth();
  const location = useLocation();
  if (authLoading) {
    return null;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

const ProtectedPermission = (props) => {
  const { currentUser } = useAuth();

  const permissions = currentUser.permissions;
  const permisisonArray = permissions[props.permission] || [];
  const hasPermission = permisisonArray.includes('view') || permisisonArray.includes('read');

  if (hasPermission) {
    return <Outlet />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
}
function AppRoutes() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <LoginPage />
            </PublicOnlyRoute>
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />

            <Route element={<ProtectedPermission permission="dashboard" />}>
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>

            <Route element={<ProtectedPermission permission="battery" />}>
              <Route path="/battery" element={<BatteryPage />} />
            </Route>

            <Route element={<ProtectedPermission permission="pcs" />}>
              <Route path="/pcs" element={<PCSPage />} />
            </Route>

            <Route element={<ProtectedPermission permission="alarm" />}>
              <Route path="/alarm" element={<AlarmPage />} />
            </Route>

            <Route element={<ProtectedPermission permission="energy-report" />}>
              <Route path="/energy-report" element={<EnergyReportPage />} />
            </Route>

            <Route element={<ProtectedPermission permission="settings" />}>
              <Route path="/settings" element={<SystemSettingsPage />} />
            </Route>

            <Route element={<ProtectedPermission permission="roles" />}>
              <Route path="/roles" element={<RolePage />} />
              <Route path="/roles/:id" element={<RoleEdit />} />
            </Route>

            <Route element={<ProtectedPermission permission="users" />}>
              <Route path="/users" element={<UserManagementPage />} />
              <Route path="/user-recovery" element={<UserRecovery />} />
            </Route>

            <Route path="/user-info" element={<UserInfoPage />} />

          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
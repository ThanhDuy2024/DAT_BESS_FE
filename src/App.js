// import React, { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { Toaster, toast } from 'sonner'
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
import BmsEdit from "./components/Screen/BmsEdit/BmsEdit"
import { io } from "socket.io-client";
import { signal } from "@preact/signals-react";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { SystemContext } from "./components/contexts/SystemContext";
import { callApi } from "./components/Api/Api";
import BmsManagement from "./components/Screen/BmsManagement/BmsManagement";
import BmsEditRack from "./components/Screen/BmsEditRack/BmsEditRack";
//import { listenForegroundNotification, requestNotificationPermission } from "./firebase/notification";
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

const ProtectedRoute = () => {
  const navigate = useNavigate();
  const { status, systemDispatch } = useContext(SystemContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (status && status.status === true) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await callApi("post", `${process.env.REACT_APP_API}/data/getUser`, {});
        if (res.status === true) {
          systemDispatch({
            type: "LOAD_USR",
            payload: {
              userId: res.data[0].id_,
              username: res.data[0].username_,
              name: res.data[0].full_name_,
              email: res.data[0].email_,
              phone: res.data[0].phone_ || "",
              address: res.data[0].address_ || "",
              roleName: res.data[0].rolename_,
              image: res.data[0].avatar_,
              permissions: res.data[0].permission_,
              status: true
            }
          });
        } else {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [status, systemDispatch, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
};

const PublicOnlyRoute = ({ children }) => {
  const { status } = useContext(SystemContext);
  return status ? <Navigate to="/dashboard" replace /> : children;
}

const ProtectedPermission = (props) => {
  const { permissions } = useContext(SystemContext);
  if (!permissions) {
    return <Navigate to="/login" replace />
  }
  const permissionsRaw = permissions;
  const permisisonArray = permissionsRaw[props.permission] || [];
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

            <Route element={<ProtectedPermission permission="bms" />}>
              <Route path="/bms" element={<BmsManagement />} />
              <Route path="/bms/:id" element={<BmsEdit />} />
              <Route path="/bms/rack/edit/:id" element={<BmsEditRack />} />
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
  // useEffect(() => {
  //   async function init() {
  //     const token = await requestNotificationPermission();

  //     if (token) {
  //       // Gửi token lên backend
  //       // await axios.post("/api/fcm-token", { token });
  //     }

  //     listenForegroundNotification();
  //   }

  //   init();
  // }, []);
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
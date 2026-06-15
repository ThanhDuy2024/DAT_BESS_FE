import React, { useEffect, createContext, useCallback, useContext, useState } from "react";
import { callApi } from "../Api/Api";

const AuthContext = createContext(null);

const permissionMap = {
  view_dashboard: ["dashboard", "view"],
  view_battery: ["battery", "view"],
  view_pcs: ["pcs", "view"],
  view_alarm: ["alarm", "view"],
  view_report: ["report", "view"],
  manage_users: ["userManagement", "view"],
  system_settings: ["systemSetting", "view"],
  view_user_info: ["userInfo", "view"],
  update_user_info: ["userInfo", "update"],
  create_user: ["userManagement", "create"],
  update_user: ["userManagement", "update"],
  delete_user: ["userManagement", "delete"],
  create_system_setting: ["systemSetting", "create"],
  update_system_setting: ["systemSetting", "update"],
  delete_system_setting: ["systemSetting", "delete"],
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const hasStoredToken = () =>
    !!localStorage.getItem("token") || !!sessionStorage.getItem("token");

  const getTokenStorage = (remember) => (remember ? localStorage : sessionStorage);

  const clearStoredToken = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  };

  const setStoredToken = (token, remember) => {
    const storage = getTokenStorage(remember);
    clearStoredToken();
    storage.setItem("token", JSON.stringify(token));
  };

  const formatUser = (apiUser = {}) => {
    const normalizedRole = String(apiUser.role_ || apiUser.role || "").trim().toLowerCase();

    return {
      id: apiUser.id_ || apiUser.id,
      name: apiUser.full_name_ || apiUser.name_ || apiUser.name || apiUser.username_ || apiUser.username || "",
      username: apiUser.username_ || apiUser.username || "",
      email: apiUser.email_ || apiUser.email || "",
      role: normalizedRole,
      phone: apiUser.phone_ || "",
      address: apiUser.address_ || "",
      avatar: apiUser.avatar_ || null,
      status: apiUser.status_,
      permissions: apiUser.data_ || apiUser.permissions || {},
    };
  };

  const loadUser = useCallback(async () => {
    try {
      if (!hasStoredToken()) {
        setCurrentUser(null);
        return;
      }

      const res = await callApi("post", `${process.env.REACT_APP_APIDEV}/data/getUser`, {});

      if (res?.status && res.data?.length) {
        setCurrentUser(formatUser(res.data[0]));
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.log(err);
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (identifier, password, remember) => {
    try {
      const res = await callApi("post", `${process.env.REACT_APP_APIDEV}/data/login`, {
        account: identifier.trim(),
        password,
      });

      if (!res?.status) return { success: false, error: res?.mess || "Login failed" };

      const userData = formatUser(res.data || {});
      setCurrentUser(userData);

      setStoredToken(res.accessToken || res.token || "", remember);

      return { success: true };
    } catch {
      return { success: false, error: "System Err" };
    }
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    clearStoredToken();
  }, []);

  const hasPermission = useCallback((permission) => {
    if (!currentUser) return false;

    const mappedPermission = permissionMap[permission];
    if (!mappedPermission) return false;

    const [moduleKey, actionKey] = mappedPermission;
    return !!currentUser.permissions?.[moduleKey]?.[actionKey];
  }, [currentUser]);

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    authLoading,
    login,
    logout,
    hasPermission,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

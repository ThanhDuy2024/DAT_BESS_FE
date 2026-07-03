import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useIntl } from "react-intl";
import { isMobile } from "react-device-detect";

import {
  LuBatteryCharging,
  LuChartNoAxesCombined,
  LuCpu,
  LuLayoutDashboard,
  LuSettings,
  LuUsers,
  LuBell,
  LuUserPen
} from "react-icons/lu";
import { GoLaw } from "react-icons/go";
import "./Sidebar.scss";
import { SystemContext } from "../contexts/SystemContext";

const menuGroups = [
  {
    labelId: "sidebar_group_overview",
    mobileLabel: "sidebar_group_overview_label",
    mobileIcon: <LuLayoutDashboard />,
    path: "/dashboard",
    items: [
      {
        path: "/dashboard",
        icon: <LuLayoutDashboard />,
        labelId: "sidebar_item_dashboard_overview",
      },
    ],
  },
  {
    labelId: "sidebar_group_monitoring",
    mobileLabel: "sidebar_group_monitoring_label",
    mobileIcon: <LuCpu />,
    items: [
      {
        path: "/pcs",
        icon: <LuCpu />,
        labelId: "sidebar_item_pcs_detail",
      },
      {
        path: "/battery",
        icon: <LuBatteryCharging />,
        labelId: "sidebar_item_battery_detail",
      },
    ],
  },
  {
    labelId: "sidebar_group_operation",
    mobileLabel: "sidebar_group_operation_label",
    mobileIcon: <LuChartNoAxesCombined />,
    items: [
      {
        path: "/alarm",
        icon: <LuBell />,
        labelId: "sidebar_item_alarm",
      },
      {
        path: "/energy-report",
        icon: <LuChartNoAxesCombined />,
        labelId: "sidebar_item_energy_report",
      },
    ],
  },
  {
    labelId: "sidebar_group_management",
    mobileLabel: "sidebar_group_management_label",
    mobileIcon: <LuSettings />,
    items: [
      {
        path: "/users",
        icon: <LuUsers />,
        labelId: "sidebar_item_user_management",
      },
      {
        path: "/roles",
        icon: <GoLaw />,
        labelId: "sidebar_item_role_management",
      },
      {
        path: "/settings",
        icon: <LuSettings />,
        labelId: "sidebar_item_system_settings",
      },
      {
        path: "/user-info",
        icon: <LuUserPen />,
        labelId: "sidebar_item_user_info",
      },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle }) {
  const lang = useIntl();
  const { roleName, permissions } = useContext(SystemContext);

  const [activeMobileGroup, setActiveMobileGroup] = useState(null);

  // Hàm helper lọc các items được phép xem dựa vào quyền của currentUser
  const filterAllowedItems = (items) => {
    return items.filter((item) => {
      // 1. Nếu là admin tối cao, luôn luôn hiển thị tất cả menu
      if (roleName === "administrator") return true;

      // 2. Ngoại lệ: Trang thông tin cá nhân ai đăng nhập cũng có quyền xem công khai
      if (item.path === "/user-info") return true;

      // 3. Xử lý bóc tách moduleKey từ path (ví dụ: "/pcs" -> "pcs", "/energy-report" -> "energy-report")
      const moduleKey = item.path.replace("/", ""); 
      const userPermissions = permissions?.[moduleKey] || [];

      // 4. Kiểm tra quyền xem từ mảng API gửi về
      return userPermissions.includes("read") || userPermissions.includes("view");
    });
  };

  // --- GIAO DIỆN MOBILE ---
  if (isMobile) {
    return (
      <>
        {activeMobileGroup !== null && (
          <div
            className="DAT_SidebarMobile_Backdrop"
            onClick={() => setActiveMobileGroup(null)}
          />
        )}

        <div className="DAT_SidebarMobile">
          {menuGroups.map((group, index) => {
            // Lọc danh sách items được phép hiển thị trên Mobile
            const allowedMobileItems = filterAllowedItems(group.items);
            if (allowedMobileItems.length === 0) return null;

            const hasSingleItem = allowedMobileItems.length === 1;

            return (
              <div key={group.labelId} className="DAT_SidebarMobile_Group">
                {!hasSingleItem && activeMobileGroup === index && (
                  <div className="DAT_SidebarMobile_Group_Popup">
                    {allowedMobileItems.map((item) => (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          isActive
                            ? "DAT_SidebarMobile_Group_Popup_Item_Active"
                            : "DAT_SidebarMobile_Group_Popup_Item"
                        }
                        onClick={() => setActiveMobileGroup(null)}
                      >
                        <span className="DAT_SidebarMobile_Group_Popup_Item_Icon">
                          {item.icon}
                        </span>

                        <span className="DAT_SidebarMobile_Group_Popup_Item_Label">
                          {lang.formatMessage({ id: item.labelId })}
                        </span>
                      </NavLink>
                    ))}
                  </div>
                )}

                {hasSingleItem ? (
                  <NavLink
                    to={allowedMobileItems[0].path}
                    className={({ isActive }) =>
                      isActive
                        ? "DAT_SidebarMobile_Group_Button_Active"
                        : "DAT_SidebarMobile_Group_Button"
                    }
                    onClick={() => setActiveMobileGroup(null)}
                  >
                    <span className="DAT_SidebarMobile_Group_Button_Icon">
                      {group.mobileIcon}
                    </span>

                    <span className="DAT_SidebarMobile_Group_Button_Label">
                      {lang.formatMessage({ id: group.mobileLabel })}
                    </span>
                  </NavLink>
                ) : (
                  <button
                    type="button"
                    className={
                      activeMobileGroup === index
                        ? "DAT_SidebarMobile_Group_Button_Active"
                        : "DAT_SidebarMobile_Group_Button"
                    }
                    onClick={() =>
                      setActiveMobileGroup(
                        activeMobileGroup === index ? null : index,
                      )
                    }
                  >
                    <span className="DAT_SidebarMobile_Group_Button_Icon">
                      {group.mobileIcon}
                    </span>

                    <span className="DAT_SidebarMobile_Group_Button_Label">
                      {lang.formatMessage({ id: group.mobileLabel })}
                    </span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  // --- GIAO DIỆN DESKTOP ---
  return (
    <aside
      className={
        collapsed
          ? "DAT_Sidebar DAT_Sidebar_Collapsed"
          : "DAT_Sidebar"
      }
    >
      <div
        className={
          collapsed
            ? "DAT_Sidebar_Logo DAT_Sidebar_Logo_Collapsed"
            : "DAT_Sidebar_Logo"
        }
        onClick={onToggle}
      >
        <img
          className={
            collapsed
              ? "DAT_Sidebar_Logo_Image_Small"
              : "DAT_Sidebar_Logo_Image_Large"
          }
          src={collapsed ? "/img/logoNho.png" : "/img/logoTo.png"}
          alt="BESS Monitor"
        />
      </div>

      <nav className="DAT_Sidebar_Nav">
        {menuGroups.map((group) => {
          // Lọc danh sách items được phép hiển thị trên Desktop
          const allowedItems = filterAllowedItems(group.items);

          // Nếu nhóm menu này không có item nào được phép hiển thị, ẩn luôn cả nhóm
          if (allowedItems.length === 0) return null;

          return (
            <div key={group.labelId} className="DAT_Sidebar_Nav_Group">
              {!collapsed && (
                <div className="DAT_Sidebar_Nav_Group_Label">
                  {lang.formatMessage({ id: group.labelId })}
                </div>
              )}

              {allowedItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    collapsed
                      ? isActive
                        ? "DAT_Sidebar_Nav_Group_Item_Collapsed_Active"
                        : "DAT_Sidebar_Nav_Group_Item_Collapsed"
                      : isActive
                        ? "DAT_Sidebar_Nav_Group_Item_Active"
                        : "DAT_Sidebar_Nav_Group_Item"
                  }
                  title={
                    collapsed
                      ? lang.formatMessage({ id: item.labelId })
                      : undefined
                  }
                >
                  <span className="DAT_Sidebar_Nav_Group_Item_Icon">
                    {item.icon}
                  </span>

                  {!collapsed && (
                    <span className="DAT_Sidebar_Nav_Group_Item_Label">
                      {lang.formatMessage({ id: item.labelId })}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
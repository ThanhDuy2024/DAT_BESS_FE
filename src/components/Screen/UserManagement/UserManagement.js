import React, { useMemo, useState, useEffect } from "react";
import Modal from "../../Modal/Modal";
import StatusBadge from "../../Modal/StatusBadge";
import "./UserManagement.scss";
import "./UserManagementMobile.scss";

import { useIntl } from "react-intl";
import { LuUsers, LuUserPlus, LuMenu, LuUser } from "react-icons/lu";
import { callApi, From } from "../../Api/Api";
import { isMobile } from "react-device-detect";

const emptyUser = {
  name: "",
  userName: "",
  email: "",
  password: "",
  role: "engineer",
  status: "active",
};

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [status, setStatus] = useState("All");
  const [form, setForm] = useState(emptyUser);
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const lang = useIntl();
  const normalizeValue = (value) =>
    String(value || "")
      .trim()
      .toLowerCase();

  const loadUser = async () => {
    let res = await callApi(
      "post",
      process.env.REACT_APP_APIDEV + "/data/getAllUser",
      {},
    );

    if (res.status === true) {
      const list = res.data.map((item) => ({
        id: item.id_,
        name: item.full_name_,
        userName: item.username_,
        email: item.email_,
        role: normalizeValue(item.role_),
        status: normalizeValue(item.status_),
        lastLogin: item.last_login_,
        created: item.created_at_,
      }));

      setUsers(list);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const userInfo = [
    {
      label: lang.formatMessage({ id: "user_name_table" }),
      value: selectedUser?.name,
    },
    { label: "Email", value: selectedUser?.email },
    {
      label: lang.formatMessage({ id: "user_role_table" }),
      value: selectedUser?.role,
    },
    {
      label: lang.formatMessage({ id: "user_status_table" }),
      value: selectedUser?.status,
    },
    {
      label: lang.formatMessage({ id: "user_last_login_table" }),
      value: selectedUser?.lastLogin
        ? new Date(selectedUser?.lastLogin).toLocaleString("vi-VN")
        : "-",
    },
    {
      label: lang.formatMessage({ id: "user_create_at_table" }),
      value: selectedUser?.created
        ? new Date(selectedUser?.created).toLocaleString("vi-VN")
        : "-",
    },
  ];

  const filtered = useMemo(
    () =>
      users.filter((user) => {
        if (
          role !== "All" &&
          normalizeValue(user.role) !== normalizeValue(role)
        ) {
          return false;
        }
        if (
          status !== "All" &&
          normalizeValue(user.status) !== normalizeValue(status)
        ) {
          return false;
        }
        if (search) {
          const keyword = search.toLowerCase();
          return (
            user.name.toLowerCase().includes(keyword) ||
            user.email.toLowerCase().includes(keyword) ||
            String(user.userName).toLowerCase().includes(keyword)
          );
        }
        return true;
      }),
    [role, status, search, users],
  );

  const openNew = () => {
    setEditing(null);
    setForm(emptyUser);
    setShowModal(true);
  };

  const openEdit = (user) => {
    setEditing(user);
    setForm({ ...emptyUser, ...user, password: "" });
    setShowModal(true);
  };

  const saveUser = async () => {
    if (!form.name || !form.userName || !form.email) return;

    try {
      const res = await callApi(
        "post",
        process.env.REACT_APP_APIDEV + "/data/updateUser",
        {
          action: editing ? "update" : "insert",
          id: editing ? editing.id : 0,
          name: form.name,
          username: form.userName,
          email: form.email,
          password: form.password || "",
          role: form.role.toLowerCase(),
          status: form.status.toLowerCase(),
        }
      );

      if (res.status) {
        setShowModal(false);
        loadUser();
      } else {
        alert(res.mess || "Operation failed");
      }
    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("RESPONSE:", error.response);
      console.log("DATA:", error.response?.data);

      alert(JSON.stringify(error.response?.data.mess));
    }
  };

  const handleAction = async (id, status) => {
    try {
      console.log(id, status)
      const res = await callApi(
        "post",
        process.env.REACT_APP_APIDEV + "/data/updateUser",
        {
          action: "updateStatus",
          id: id,
          status: status
        }
      );

      if(res.status) {
        loadUser();
        setIsModalOpen(false)
      } else {
        console.log("error database")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = async (userId) => {
    try {

      const res = await callApi(
        "post",
        process.env.REACT_APP_APIDEV + "/data/updateUser",
        {
          action: "delete",
          id: userId,
        }
      );

      if(res.status) {
        loadUser();
      } else {
        console.log("error database")
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <>
      {isMobile ? (
        <div className="DAT_UserManagementMobile">
          <div className="DAT_UserManagementMobile_Card">
            <div className="DAT_UserManagementMobile_Card_Info">
              <div className="DAT_UserManagementMobile_Card_Info_Icon">
                <LuUsers size={25} />
              </div>
              <div className="DAT_UserManagementMobile_Card_Info_Title">
                {lang.formatMessage({ id: "user_management" })}
              </div>
            </div>
            <div className="DAT_UserManagementMobile_Card_Actions">
              <input
                className="DAT_UserManagementMobile_Card_Actions_FilterInput"
                style={{ width: 220 }}
                placeholder={lang.formatMessage({ id: "user_search" })}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="DAT_UserManagementMobile_Card_Actions_Button_Primary"
                onClick={openNew}
              >
                <LuUserPlus />
              </button>
              <select
                className="DAT_UserManagementMobile_Card_Actions_FilterSelect"
                style={{ width: 140 }}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="All">
                  {lang.formatMessage({ id: "all_role" })}
                </option>
                <option value="Admin">
                  {lang.formatMessage({ id: "admin_role" })}
                </option>
                <option value="Engineer">
                  {lang.formatMessage({ id: "engineer_role" })}
                </option>
              </select>
              <select
                className="DAT_UserManagementMobile_Card_Actions_FilterSelect"
                style={{ width: 140 }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="All">
                  {lang.formatMessage({ id: "all_status_role" })}
                </option>
                <option value="Active">
                  {lang.formatMessage({ id: "statusActive_role" })}
                </option>
                <option value="Inactive">
                  {lang.formatMessage({ id: "statusInactive_role" })}
                </option>
                <option value="Locked">
                  {lang.formatMessage({ id: "statusLocked_role" })}
                </option>
              </select>
            </div>
          </div>

          <div className="DAT_UserManagementMobile_Container">
            {filtered.map((user) => (
              <div
                key={user.id}
                className="DAT_UserManagementMobile_Container_Card"
              >
                <div className="DAT_UserManagementMobile_Container_Card_Avt">
                  <LuUser />
                </div>
                <div className="DAT_UserManagementMobile_Container_Card_Info">
                  <div className="DAT_UserManagementMobile_Container_Card_Info_Title">
                    {user.name}
                  </div>
                  <div className="DAT_UserManagementMobile_Container_Card_Info_Text">
                    {user.email}
                  </div>
                </div>
                <button
                  type="button"
                  className="DAT_UserManagementMobile_Container_Card_Button"
                  onClick={() => {
                    setSelectedUser(user);
                    setIsModalOpen(true);
                  }}
                >
                  Xem chi tiết
                </button>
              </div>
            ))}
            {/* <div className="DAT_UserManagementMobile_Container_Table">
              <table className="DAT_UserManagementMobile_Container_Table_Main">
                <thead>
                  <tr>
                    <th>{lang.formatMessage({ id: "user_id_table" })}</th>
                    <th>{lang.formatMessage({ id: "user_name_table" })}</th>
                    <th>{lang.formatMessage({ id: "user_email_table" })}</th>

                  </tr>
                </thead>
                <tbody className="DAT_UserManagementMobile_Container_Table_Main_Body">
                  {filtered.map((user) => (
                    <tr key={user.id} className="DAT_UserManagementMobile_Container_Table_Main_Row"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedUser(user);
                        setIsModalOpen(true);
                      }}>
                      <td className="DAT_UserManagementMobile_Container_Table_Main_Cell">
                        USR-{String(user.id).padStart(3, "0")}
                      </td>
                      <td className="DAT_UserManagementMobile_Container_Table_Main_Cell">{user.name}</td>
                      <td className="DAT_UserManagementMobile_Container_Table_Main_Cell">{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}
          </div>
          {isModalOpen && selectedUser && (
            <div className="DAT_UserManagementMobile_Modal">
              <div className="DAT_UserManagementMobile_Modal_Container">
                <div className="DAT_UserManagementMobile_Modal_Container_Header">
                  <div className="DAT_UserManagementMobile_Modal_Container_Header_Title">
                    {lang.formatMessage({ id: "user_information" })} USR-
                    {String(selectedUser.id).padStart(3, "0")}
                  </div>
                  <div className="DAT_UserManagementMobile_Modal_Container_Header_Close">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 512 512"
                      height="25"
                      width="25"
                      xmlns="http://www.w3.org/2000/svg"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"></path>
                    </svg>
                  </div>
                </div>


                <div className="DAT_UserManagementMobile_Modal_Container_Main">
                  {userInfo.map((item, index) => (
                    <div
                      key={index}
                      className="DAT_UserManagementMobile_Modal_Container_Main_Row"
                    >
                      <div className="DAT_UserManagementMobile_Modal_Container_Main_Row_Label">
                        {item.label}
                      </div>

                      <div className="DAT_UserManagementMobile_Modal_Container_Main_Row_Value">
                        {item.value || "-"}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="DAT_UserManagementMobile_Modal_Container_Foot">
                  <button
                    className="DAT_UserManagementMobile_Modal_Container_Foot_Button_GhostSm"
                    style={{
                      color: "var(--text-primary)",
                      backgroundColor: "var(--primary-light)",
                    }}
                    onClick={() => openEdit(selectedUser)}
                  >
                    {lang.formatMessage({ id: "user_edit_button" })}
                  </button>
                  <button
                    className={
                      selectedUser.status === "locked"
                        ? "DAT_UserManagementMobile_Modal_Container_Foot_Button_Active"
                        : "DAT_UserManagementMobile_Modal_Container_Foot_Button_Locked"
                    }
                    onClick={() => handleAction(selectedUser.id, selectedUser.status)}
                  >
                    {selectedUser.status === "true"
                      ? lang.formatMessage({ id: "user_locked_button" })
                      : lang.formatMessage({ id: "user_unlock_button" }) 
                    }
                  </button>
                  <div
                    className="DAT_UserManagementMobile_Pop_MenuItem_Delete"
                    onClick={() => setDeleteUser(selectedUser)}
                  >
                    {lang.formatMessage({ id: "user_delete_button" })}
                  </div>
                  {deleteUser && (
                    <div className="DAT_UserManagementMobile_Modal">
                      <div className="DAT_UserManagementMobile_Modal_Container">
                        <div className="DAT_UserManagementMobile_Modal_Container_Header">
                          <div className="DAT_UserManagementMobile_Modal_Container_Header_Title">
                            {lang.formatMessage({ id: "confirm_delete" })}{" "}
                          </div>
                          <div className="DAT_UserManagementMobile_Modal_Container_Header_Close">
                            <svg
                              stroke="currentColor"
                              fill="currentColor"
                              strokeWidth="0"
                              viewBox="0 0 512 512"
                              height="25"
                              width="25"
                              xmlns="http://www.w3.org/2000/svg"
                              onClick={() => setDeleteUser(false)}
                            >
                              <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"></path>
                            </svg>
                          </div>
                        </div>

                        <div className="DAT_UserManagementMobile_Modal_Container_Main">
                          {lang.formatMessage({ id: "description_delete" })}
                        </div>

                        <div className="DAT_UserManagementMobile_Modal_Container_Foot">
                          <button
                            className="DAT_UserManagementMobile_Modal_Container_Foot_Btn_Cancel"
                            onClick={() => setDeleteUser(null)}
                          >
                            {lang.formatMessage({ id: "cancel" })}
                          </button>

                          <button
                            className="DAT_UserManagementMobile_Modal_Container_Foot_Btn_Delete"
                            onClick={async () => {
                              let res = await callApi(
                                "post",
                                process.env.REACT_APP_APIDEV +
                                "/data/updateUser",
                                {
                                  action: "delete",
                                  id: selectedUser.id,
                                  name: "",
                                  username: "",
                                  email: "",
                                  password: "",
                                  role: "",
                                  status: "",
                                },
                              );

                              if (res.status) {
                                setDeleteUser(null);
                                loadUser();
                              } else {
                                alert(res.mes);
                              }
                            }}
                          >
                            {lang.formatMessage({ id: "user_delete_button" })}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={
              editing
                ? lang.formatMessage({ id: "user_modal_edit_title" })
                : lang.formatMessage({ id: "user_modal_add_title" })
            }
            footer={
              <>
                <button
                  className="DAT_UserManagement_Modal_Footer_Button_Secondary"
                  onClick={() => setShowModal(false)}
                >
                  {lang.formatMessage({ id: "modal_cancel" })}
                </button>
                <button
                  className="DAT_UserManagement_Modal_Footer_Button_Primary"
                  onClick={saveUser}
                >
                  {lang.formatMessage({ id: "user_modal_save_user" })}
                </button>
              </>
            }
          >
            <div className="DAT_UserManagement_Form_Grid">
              <div className="DAT_UserManagement_Form_Grid_Group">
                <label className="DAT_UserManagement_Form_Grid_Group_Label">
                  {lang.formatMessage({ id: "user_modal_full_name" })}
                </label>
                <input
                  className="DAT_UserManagement_Form_Grid_Group_Input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="DAT_UserManagement_Form_Grid_Group">
                <label className="DAT_UserManagement_Form_Grid_Group_Label">
                  {lang.formatMessage({ id: "user_modal_email" })}
                </label>
                <input
                  className="DAT_UserManagement_Form_Grid_Group_Input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="DAT_UserManagement_Form_Grid_Group">
                <label className="DAT_UserManagement_Form_Grid_Group_Label">
                  {lang.formatMessage({ id: "user_modal_password" })}
                </label>
                <input
                  className="DAT_UserManagement_Form_Grid_Group_Input"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
              <div className="DAT_UserManagement_Form_Grid_Group">
                <label className="DAT_UserManagement_Form_Grid_Group_Label">
                  {lang.formatMessage({ id: "user_modal_confirm_password" })}
                </label>
                <input
                  className="DAT_UserManagement_Form_Grid_Group_Input"
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                />
              </div>
              <div className="DAT_UserManagement_Form_Grid_Group">
                <label className="DAT_UserManagement_Form_Grid_Group_Label">
                  {lang.formatMessage({ id: "user_modal_role" })}
                </label>
                <select
                  className="DAT_UserManagement_Form_Grid_Group_Select"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option>Viewer</option>
                  <option>Operator</option>
                  <option>Admin</option>
                  <option>Engineer</option>
                </select>
              </div>
              <div className="DAT_UserManagement_Form_Grid_Group">
                <label className="DAT_UserManagement_Form_Grid_Group_Label">
                  {lang.formatMessage({ id: "user_modal_status" })}
                </label>
                <select
                  className="DAT_UserManagement_Form_Grid_Group_Select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Locked</option>
                </select>
              </div>
            </div>
          </Modal>
        </div>
      ) : (
        <div className="DAT_UserManagement">
          <div className="DAT_UserManagement_Card">
            <div className="DAT_UserManagement_Card_Info">
              <div className="DAT_UserManagement_Card_Info_Icon">
                <LuUsers size={25} />
              </div>
              <div className="DAT_UserManagement_Card_Info_Title">
                {lang.formatMessage({ id: "user_management" })}
              </div>
            </div>
            <div className="DAT_UserManagement_Card_Actions">
              <input
                className="DAT_UserManagement_Card_Actions_FilterInput"
                style={{ width: 220 }}
                placeholder={lang.formatMessage({ id: "user_search" })}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="DAT_UserManagement_Card_Actions_FilterSelect"
                style={{ width: 140 }}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="All">
                  {lang.formatMessage({ id: "all_role" })}
                </option>
                <option value="admin">
                  {lang.formatMessage({ id: "admin_role" })}
                </option>
                <option value="engineer">
                  {lang.formatMessage({ id: "engineer_role" })}
                </option>
              </select>
              <select
                className="DAT_UserManagement_Card_Actions_FilterSelect"
                style={{ width: 140 }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="All">
                  {lang.formatMessage({ id: "all_status_role" })}
                </option>
                <option value="active">
                  {lang.formatMessage({ id: "statusActive_role" })}
                </option>
                <option value="locked">
                  {lang.formatMessage({ id: "statusLocked_role" })}
                </option>
              </select>
              <button
                className="DAT_UserManagement_Card_Actions_Button_Primary"
                onClick={openNew}
              >
                {lang.formatMessage({ id: "add_user" })}
              </button>
            </div>
          </div>

          <div className="DAT_UserManagement_Container">
            <div className="DAT_UserManagement_Container_Table">
              <table className="DAT_UserManagement_Container_Table_Main">
                <thead>
                  <tr>
                    <th>{lang.formatMessage({ id: "user_id_table" })}</th>
                    <th>{lang.formatMessage({ id: "user_name_table" })}</th>
                    <th>Username</th>
                    <th>{lang.formatMessage({ id: "user_email_table" })}</th>
                    <th>{lang.formatMessage({ id: "user_role_table" })}</th>
                    <th>{lang.formatMessage({ id: "user_status_table" })}</th>
                    <th>
                      {lang.formatMessage({ id: "user_last_login_table" })}
                    </th>
                    <th>
                      {lang.formatMessage({ id: "user_create_at_table" })}
                    </th>
                    <th>{lang.formatMessage({ id: "user_action_table" })}</th>
                  </tr>
                </thead>
                <tbody className="DAT_UserManagement_Container_Table_Main_Body">
                  {filtered.map((user) => (
                    <tr
                      key={user.id}
                      className="DAT_UserManagement_Container_Table_Main_Row"
                    >
                      <td className="DAT_UserManagement_Container_Table_Main_Cell">
                        USR-{String(user.id).padStart(3, "0")}
                      </td>
                      <td className="DAT_UserManagement_Container_Table_Main_Cell">
                        {user.name}
                      </td>
                      <td className="DAT_UserManagement_Container_Table_Main_Cell">
                        {user.userName}
                      </td>
                      <td className="DAT_UserManagement_Container_Table_Main_Cell">
                        {user.email}
                      </td>
                      <td className="DAT_UserManagement_Container_Table_Main_Cell">
                        {user.role}
                      </td>
                      <td className="DAT_UserManagement_Container_Table_Main_Cell">
                        {user.status == 'true' ? "Active" : "Locked"}
                      </td>
                      <td className="DAT_UserManagement_Container_Table_Main_Cell">
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleString("vi-VN")
                          : "-"}
                      </td>
                      <td className="DAT_UserManagement_Container_Table_Main_Cell">
                        {user.created
                          ? new Date(user.created).toLocaleString("vi-VN")
                          : "-"}
                      </td>
                      <td className="DAT_UserManagement_Container_Table_Main_Cell">
                        <div className="DAT_UserManagement_Container_Table_Actions">
                          <button
                            className="DAT_UserManagement_Container_Table_Actions_Button_GhostSm"
                            onClick={() =>
                              setOpenMenu(openMenu === user.id ? null : user.id)
                            }
                          >
                            <LuMenu />
                          </button>

                          {openMenu === user.id && (
                            <div className="DAT_UserManagement_Pop_Menu">
                              <div
                                className="DAT_UserManagement_Pop_MenuItem"
                                onClick={() => {
                                  openEdit(user);
                                  setOpenMenu(null);
                                }}
                              >
                                {lang.formatMessage({ id: "user_edit_button" })}
                              </div>

                              <div
                                className="DAT_UserManagement_Pop_MenuItem"
                                onClick={() => handleAction(user.id, user.status)}
                              >
                                {user.status === 'true'
                                  ? lang.formatMessage({
                                    id: "user_locked_button",  
                                  })
                                  : lang.formatMessage({
                                    id: "user_unlock_button",
                                  })}
                              </div>
                              <div
                                className="DAT_UserManagement_Pop_MenuItem DAT_UserManagement_Pop_MenuItem_Delete"
                                onClick={() => handleDelete(user.id)}
                              >
                                {lang.formatMessage({
                                  id: "user_delete_button",
                                })}
                              </div>
                            </div>
                          )}
                          {deleteUser && (
                            <div className="DAT_UserManagement_Modal">
                              <div className="DAT_UserManagement_Modal_Container">
                                <div className="DAT_UserManagement_Modal_Container_Header">
                                  <div className="DAT_UserManagement_Modal_Container_Header_Title">
                                    {lang.formatMessage({
                                      id: "confirm_delete",
                                    })}{" "}
                                  </div>
                                  <div className="DAT_UserManagement_Modal_Container_Header_Close">
                                    <svg
                                      stroke="currentColor"
                                      fill="currentColor"
                                      strokeWidth="0"
                                      viewBox="0 0 512 512"
                                      height="25"
                                      width="25"
                                      xmlns="http://www.w3.org/2000/svg"
                                      onClick={() => setDeleteUser(false)}
                                    >
                                      <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"></path>
                                    </svg>
                                  </div>
                                </div>

                                <div className="DAT_UserManagement_Modal_Container_Main">
                                  {lang.formatMessage({
                                    id: "description_delete",
                                  })}
                                </div>

                                <div className="DAT_UserManagement_Modal_Container_Foot">
                                  <button
                                    className="DAT_UserManagement_Modal_Container_Foot_Btn_Cancel"
                                    onClick={() => setDeleteUser(null)}
                                  >
                                    {lang.formatMessage({ id: "cancel" })}
                                  </button>

                                  <button
                                    className="DAT_UserManagement_Modal_Container_Foot_Btn_Delete"
                                    onClick={async () => {
                                      let res = await callApi(
                                        "post",
                                        process.env.REACT_APP_APIDEV +
                                        "/data/updateUser",
                                        {
                                          action: "delete",
                                          id: user.id,
                                          name: "",
                                          username: "",
                                          email: "",
                                          password: "",
                                          role: "",
                                          status: "",
                                        },
                                      );

                                      if (res.status) {
                                        setDeleteUser(null);
                                        loadUser();
                                      } else {
                                        alert(res.mes);
                                      }
                                    }}
                                  >
                                    {lang.formatMessage({
                                      id: "user_delete_button",
                                    })}
                                  </button>
                                  {/* <button onClick={handleSave}>
                  {lang.formatMessage({ id: "save" })}
                </button> */}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={
              editing
                ? lang.formatMessage({ id: "user_modal_edit_title" })
                : lang.formatMessage({ id: "user_modal_add_title" })
            }
            footer={
              <>
                <button
                  className="DAT_UserManagement_Modal_Footer_Button_Secondary"
                  onClick={() => setShowModal(false)}
                >
                  {lang.formatMessage({ id: "modal_cancel" })}
                </button>
                <button
                  className="DAT_UserManagement_Modal_Footer_Button_Primary"
                  onClick={saveUser}
                >
                  {lang.formatMessage({ id: "user_modal_save_user" })}
                </button>
              </>
            }
          >
            <div className="DAT_UserManagement_Form_Grid">
              <div className="DAT_UserManagement_Form_Grid_Group">
                <label className="DAT_UserManagement_Form_Grid_Group_Label">
                  {lang.formatMessage({ id: "user_modal_full_name" })}
                </label>
                <input
                  className="DAT_UserManagement_Form_Grid_Group_Input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="DAT_UserManagement_Form_Grid_Group">
                <label className="DAT_UserManagement_Form_Grid_Group_Label">
                  {lang.formatMessage({ id: "user_modal_email" })}
                </label>
                <input
                  className="DAT_UserManagement_Form_Grid_Group_Input"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="DAT_UserManagement_Form_Grid_Group">
                <label className="DAT_UserManagement_Form_Grid_Group_Label">
                  {lang.formatMessage({ id: "user_modal_password" })}
                </label>
                <input
                  className="DAT_UserManagement_Form_Grid_Group_Input"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
              </div>
              <div className="DAT_UserManagement_Form_Grid_Group">
                <label className="DAT_UserManagement_Form_Grid_Group_Label">
                  Username
                </label>
                <input
                  className="DAT_UserManagement_Form_Grid_Group_Input"
                  value={form.userName}
                  onChange={(e) =>
                    setForm({ ...form, userName: e.target.value })
                  }
                />
              </div>
              <div className="DAT_UserManagement_Form_Grid_Group">
                <label className="DAT_UserManagement_Form_Grid_Group_Label">
                  {lang.formatMessage({ id: "user_modal_role" })}
                </label>
                <select
                  className="DAT_UserManagement_Form_Grid_Group_Select"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="admin">Admin</option>
                  <option value="engineer">Engineer</option>
                </select>
              </div>
              <div className="DAT_UserManagement_Form_Grid_Group">
                <label className="DAT_UserManagement_Form_Grid_Group_Label">
                  {lang.formatMessage({ id: "user_modal_status" })}
                </label>
                <select
                  className="DAT_UserManagement_Form_Grid_Group_Select"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="locked">Locked</option>
                </select>
              </div>
            </div>
          </Modal>
        </div>
      )}
    </>
  );
}

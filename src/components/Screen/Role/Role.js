import React, { useContext, useEffect, useState } from 'react'
import './Role.scss'
import './RoleMobile.scss'
import { useIntl } from 'react-intl';
import { LuSettings, LuEye } from 'react-icons/lu';
import { TbBrandOnlyfans, TbRvTruck } from 'react-icons/tb';
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { CiEdit } from "react-icons/ci";
import Modal from '../../Modal/Modal';
import { callApi } from '../../Api/Api';
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { useAuth } from '../../contexts/AuthContext';
import { isMobile } from "react-device-detect";
import { SystemContext } from '../../contexts/SystemContext';

const defaultPermissions = {
  read: 'read',
  update: "update",
  create: "create",
  delete: "delete",
}

export default function Role() {
  const lang = useIntl();
  const { permissions } = useContext(SystemContext);
  const [addRoleModal, setAddRoleModal] = useState(false);
  const [roleName, setRoleName] = useState();
  const [status, setStatus] = useState("active");
  const [roles, setRoles] = useState([]);
  const [totalPage, setTotalPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("id");
  const [deleteRole, setDeleteRole] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [modalType, setModalType] = useState(null);

  const navigate = useNavigate();

  const openNew = () => {
    setAddRoleModal(true);
  };

  const roleInfo = [
    {
      label: lang.formatMessage({ id: "role_id_table" }),
      value: `ROLE-${selectedRole?.id >= 10 ? `0${selectedRole?.id}` : `00${selectedRole?.id}`}`,
    },
    {
      label: lang.formatMessage({ id: "role_name_table" }),
      value: selectedRole?.roleName,
    },
    {
      label: lang.formatMessage({ id: "role_status_tabel" }),
      value: selectedRole?.status,
    },
    {
      label: lang.formatMessage({ id: "role_create_at_table" }),
      value: selectedRole?.createdAt,
    },
    {
      label: lang.formatMessage({ id: "role_create_by_table" }),
      value: selectedRole?.createdBy,
    },
    {
      label: lang.formatMessage({ id: "number_of_user" }),
      value: `${selectedRole?.numberOfUser} ${lang.formatMessage({ id: "users" })}`,
    },
  ];

  const handleCreateRole = async () => {
    try {
      const response = await callApi("post", `${process.env.REACT_APP_API}/data/createRole`, {
        roleName: roleName,
        status: status,
      });

      if (response.status === false) {
        toast.error(lang.formatMessage({ id: "toast_existed_role" }))
        console.log(response.msg);
      } else {
        toast.success(lang.formatMessage({ id: "toast_created" }))
        setAddRoleModal(false);
      };
    } catch (error) {
      console.log(error);
    }
  }

  const getAllRole = async (current, search, filterStatus) => {
    try {
      const response = await callApi("get", `${process.env.REACT_APP_API}/data/getAllRoles?search=${search}&status=${filterStatus}&sort=${sort}&page=${current}`);
      if (response.status === false) {
        console.log(response.msg);
      } else {
        setRoles(response.data);
        setTotalPage(response.totalPage);
      };
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllRole(currentPage, search, filterStatus);
  }, [addRoleModal, currentPage, search, filterStatus, sort])

  const handleDelete = async () => {
    if (!deleteRole) return;
    try {
      const res = await callApi(
        "post",
        `${process.env.REACT_APP_API}/data/deleteRole`,
        {
          roleId: deleteRoleId,
        }
      );

      if (res.status) {
        toast.success(lang.formatMessage({ id: "toast_deleted" }))
        getAllRole(currentPage, search, filterStatus);
        setDeleteRole(null); // Đóng modal sau khi xóa thành công
      } else {
        toast.error(lang.formatMessage({ id: "toast_error" }))
      }
    } catch (error) {
      console.log(error);
      alert("Có lỗi xảy ra khi xóa!");
    }
  };
  const renderTitle = () => {
    switch (modalType) {
      case "add":
        return lang.formatMessage({ id: "role_modal_create_title" });
      case "view":
        return lang.formatMessage({ id: "role_modal_view_title" });
      case "delete":
        return lang.formatMessage({ id: "confirm_delete" });
      default:
        return "";
    }
  };
  const renderModalAddRole = () => {
    return (
      <div className="DAT_RoleSetting_Form_Grid">
        <div className="DAT_RoleSetting_Form_Grid_Group">
          <label className="DAT_RoleSetting_Form_Grid_Group_Label">
            {lang.formatMessage({ id: "role_modal_full_name" })}
          </label>
          <input
            className="DAT_RoleSetting_Form_Grid_Group_Input"
            onChange={(e) => setRoleName(e.target.value)}
          />
        </div>
        <div className="DAT_RoleSetting_Form_Grid_Group">
          <label className="DAT_RoleSetting_Form_Grid_Group_Label">
            {lang.formatMessage({ id: "role_modal_status" })}
          </label>
          <select
            className="DAT_RoleSetting_Form_Grid_Group_Select"
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="active">{lang.formatMessage({ id: "statusActive_role" })}</option>
            <option value="inactive">{lang.formatMessage({ id: "statusInactive_role" })}</option>
          </select>
        </div>
      </div>
    )
  };
  const renderModalViewRole = () => {
    return (
      <div className="DAT_RoleSettingMobile_Modal">
        {roleInfo.map((item, index) => (
          <div key={index} className="DAT_RoleSettingMobile_Modal_Row">
            <div className="DAT_RoleSettingMobile_Modal_Row_Label">{item.label}</div>
            <div className="DAT_RoleSettingMobile_Modal_Row_Value">{item.value || "-"}</div>
          </div>
        ))}
      </div>
    )
  };
  const renderBody = () => {
    switch (modalType) {
      case "add":
        return renderModalAddRole();
      case "view":
        return renderModalViewRole();
      case "delete":
        return lang.formatMessage({ id: "description_delete_role" })
      default:
        return null;
    }
  };
  const renderFooter = () => {
    switch (modalType) {
      case "add":
        return (
          <>
            <button
              className="DAT_RoleSetting_Modal_Footer_Button_Secondary"
              onClick={() => setModalType(null)}
            >
              {lang.formatMessage({ id: "modal_cancel" })}
            </button>
            <button
              className="DAT_RoleSetting_Modal_Footer_Button_Primary"
              onClick={handleCreateRole}
            >
              {lang.formatMessage({ id: "role_modal_save" })}
            </button>
          </>
        );
      case "view":
        return (
          <div className="DAT_RoleSettingMobile_Modal_Foot">
            <button
              className="DAT_RoleSettingMobile_Modal_Foot_Button_GhostSm"
              style={{ color: "var(--text-primary)", backgroundColor: "var(--primary-light)" }}
              onClick={() => navigate(`/roles/${selectedRole?.id}`)}
            >
              {lang.formatMessage({ id: "user_edit_button" })}
            </button>
            <div className="DAT_RoleSettingMobile_Modal_Foot_Btn_Delete" onClick={() => { setModalType("delete"); setDeleteRoleId(selectedRole?.id); }}>
              {lang.formatMessage({ id: "user_delete_button" })}
            </div>
          </div>
        );
      case "delete":
        return (
          <>
            <button
              className="DAT_RoleSetting_Modal_Container_Foot_Btn_Cancel"
              onClick={() => setModalType(null)}
            >
              {lang.formatMessage({ id: "cancel" })}
            </button>

            <button
              className="DAT_RoleSetting_Modal_Container_Foot_Btn_Delete"
              onClick={() => {
                handleDelete()
              }}
            >
              {lang.formatMessage({
                id: "user_delete_button",
              })}
            </button>
          </>
        )


      default:
        return null;
    }
  };

  return (
    <>
      {isMobile ? (
        <div className="DAT_RoleSettingMobile">
          <div className="DAT_RoleSettingMobile_Card">
            <div className="DAT_RoleSettingMobile_Card_Info">
              <div className="DAT_RoleSettingMobile_Card_Info_Icon">
                <LuSettings size={25} />
              </div>
              <div className="DAT_RoleSettingMobile_Card_Info_Title">
                {lang.formatMessage({ id: "role_management" })}
              </div>
            </div>
            <div className="DAT_RoleSettingMobile_Card_Actions">
              <input
                className="DAT_RoleSettingMobile_Card_Actions_FilterInput"
                style={{ width: 220 }}
                placeholder={lang.formatMessage({ id: "role_search" })}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="DAT_RoleSettingMobile_Card_Actions_Button_Primary"
                onClick={() => setModalType("add")}
              >
                <AiOutlineUsergroupAdd size={22} />
              </button>
              <select
                className="DAT_RoleSettingMobile_Card_Actions_FilterSelect"
                style={{ width: 140 }}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">
                  {lang.formatMessage({ id: "all_role" })}
                </option>
                <option value="active">
                  {lang.formatMessage({ id: "statusActive_role" })}
                </option>
                <option value="inactive">
                  {lang.formatMessage({ id: "statusInactive_role" })}
                </option>
              </select>
              <select
                className="DAT_RoleSettingMobile_Card_Actions_FilterSelect"
                style={{ width: 100 }}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="" disabled selected>{lang.formatMessage({ id: "sort_default" })}</option>
                <option value="id">{lang.formatMessage({ id: "sort_id" })}</option>
                <option value="asc">{lang.formatMessage({ id: "sort_asc" })}</option>
                <option value="desc">{lang.formatMessage({ id: "sort_desc" })}</option>
              </select>
            </div>
          </div>

          <div className="DAT_RoleSettingMobile_Container">
            {roles.map((item) => {
              return (
                <div className="DAT_RoleSettingMobile_Container_Card">
                  <div className="DAT_RoleSettingMobile_Container_Card_Left">ROLE-{item.id >= 10 ? `0${item.id}` : `00${item.id}`}</div>
                  <div className="DAT_RoleSettingMobile_Container_Card_Mid1">
                    <div className="DAT_RoleSettingMobile_Container_Card_Mid1_Title">{item.roleName}</div>
                    <div className="DAT_RoleSettingMobile_Container_Card_Mid1_Subtitle">{item.numberOfUser} {lang.formatMessage({ id: "users" })}</div>
                  </div>
                  <div className="DAT_RoleSettingMobile_Container_Card_Mid2">
                    <div className="DAT_RoleSettingMobile_Container_Card_Mid2_Date">{item.createdAt}</div>
                    <div className="DAT_RoleSettingMobile_Container_Card_Mid2_Status"
                      style={{ color: item.status === "active" ? "green" : "red" }}
                    >
                      {item.status == "active" ? lang.formatMessage({ id: "statusActive_role" }) : lang.formatMessage({ id: "statusInactive_role" })}</div>
                  </div>
                  <div className="DAT_RoleSettingMobile_Container_Card_Right">
                    <button
                      className="DAT_RoleSettingMobile_Container_Card_Right_Button"
                      aria-label="View alarm detail"
                      onClick={() => { setModalType("view"); setSelectedRole(item) }}
                    >
                      <LuEye />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          <Modal
            isOpen={modalType !== null}
            onClose={() => setModalType(null)}
            title={renderTitle()}
            footer={renderFooter()}
          >
            {renderBody()}
          </Modal>
        </div>
      ) : (
        <div className="DAT_RoleSetting">
          <div className="DAT_RoleSetting_HeaderCard">
            <div className="DAT_RoleSetting_HeaderCard_Main">
              <div className="DAT_RoleSetting_HeaderCard_Main_Icon">
                <LuSettings size={25} />
              </div>
              <div className="DAT_RoleSetting_HeaderCard_Main_Title">
                {lang.formatMessage({ id: "role_management" })}
              </div>
            </div>
            <div className="DAT_RoleSetting_Card_Actions">
              <input
                className="DAT_RoleSetting_Card_Actions_FilterInput"
                style={{ width: 220 }}
                placeholder={lang.formatMessage({ id: "role_search" })}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select
                className="DAT_RoleSetting_Card_Actions_FilterSelect"
                style={{ width: 140 }}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">
                  {lang.formatMessage({ id: "all_role" })}
                </option>
                <option value="active">
                  {lang.formatMessage({ id: "statusActive_role" })}
                </option>
                <option value="inactive">
                  {lang.formatMessage({ id: "statusInactive_role" })}
                </option>
              </select>
              <select
                className="DAT_RoleSetting_Card_Actions_FilterSelect"
                style={{ width: 100 }}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="" disabled selected>{lang.formatMessage({ id: "sort_default" })}</option>
                <option value="id">{lang.formatMessage({ id: "sort_id" })}</option>
                <option value="asc">{lang.formatMessage({ id: "sort_asc" })}</option>
                <option value="desc">{lang.formatMessage({ id: "sort_desc" })}</option>
              </select>
              {permissions["roles"].includes(defaultPermissions.create) && (
                <button
                  className="DAT_RoleSetting_Card_Actions_Button_Primary"
                  onClick={() => setModalType("add")}
                >
                  {lang.formatMessage({ id: "add_role" })}
                </button>
              )}
            </div>
          </div>

          <div className="DAT_RoleSetting_Container">
            <div className="DAT_RoleSetting_Container_Table">
              <table className="DAT_RoleSetting_Container_Table_Main">
                <thead>
                  <tr style={{ textAlign: "center" }}>
                    <th>{lang.formatMessage({ id: "role_id_table" })}</th>
                    <th>{lang.formatMessage({ id: "role_name_table" })}</th>
                    <th>{lang.formatMessage({ id: "role_status_tabel" })}</th>
                    <th>{lang.formatMessage({ id: "role_create_at_table" })}</th>
                    <th>{lang.formatMessage({ id: "role_create_by_table" })}</th>
                    <th>{lang.formatMessage({ id: "number_of_user" })}</th>
                    {(permissions["roles"].includes(defaultPermissions.update) || permissions["roles"].includes(defaultPermissions.delete)) && (
                      <th>{lang.formatMessage({ id: "role_action_table" })}</th>
                    )}
                  </tr>
                </thead>
                <tbody className="DAT_RoleSetting_Container_Table_Main_Body">
                  {roles.map((item) => {
                    return (
                      <tr className='DAT_RoleSetting_Container_Table_Main_Row' key={item.id}>
                        <td className="DAT_RoleSetting_Container_Table_Main_Cell">ROLE-{item.id >= 10 ? `0${item.id}` : `00${item.id}`}</td>
                        <td className="DAT_RoleSetting_Container_Table_Main_Cell">{item.roleName}</td>
                        <td className={`DAT_RoleSetting_Container_Table_Main_Cell--${item.status}`}>{item.status == "active" ? lang.formatMessage({ id: "statusActive_role" }) : lang.formatMessage({ id: "statusInactive_role" })}</td>
                        <td className="DAT_RoleSetting_Container_Table_Main_Cell">{item.createdAt}</td>
                        <td className="DAT_RoleSetting_Container_Table_Main_Cell">{item.createdBy}</td>
                        <td className="DAT_RoleSetting_Container_Table_Main_Cell">{item.numberOfUser} {lang.formatMessage({ id: "users" })}</td>
                        {(permissions["roles"].includes(defaultPermissions.update) || permissions["roles"].includes(defaultPermissions.dele)) && (
                          <td className="DAT_RoleSetting_Container_Table_Main_Cell">
                            <div className='DAT_RoleSetting_Container_Table_Main_Cell_Action'>
                              {permissions["roles"].includes(defaultPermissions.update) && (
                                <button className='DAT_RoleSetting_Container_Table_Main_Cell_Action_Button'
                                  onClick={() => navigate(`/roles/${item.id}`)}>
                                  {lang.formatMessage({ id: "role_edit_button" })}
                                </button>
                              )}
                              {permissions["roles"].includes(defaultPermissions.delete) && (
                                <button className='DAT_RoleSetting_Container_Table_Main_Cell_Action_Button'
                                  onClick={() => { setModalType("delete"); setDeleteRoleId(item.id) }}
                                >
                                  {lang.formatMessage({ id: "role_delete_button" })}
                                </button>
                              )}
                            </div>
                          </td>
                        )}

                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {totalPage > 1 && (
              <div className="DAT_RoleSetting_Container_Pagination">
                <button
                  className="DAT_RoleSetting_Container_Pagination_Btn DAT_RoleSetting_Container_Pagination_Btn--prev"
                  onClick={() => setCurrentPage(currentPage === 1 ? totalPage : currentPage - 1)}
                >
                  &lt;
                </button>
                {Array.from({ length: totalPage }, (_, index) => (
                  <button
                    key={index}
                    className={`DAT_RoleSetting_Container_Pagination_Btn${(index + 1) === currentPage ? " DAT_RoleSetting_Container_Pagination_Btn--active" : ""}`}

                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="DAT_RoleSetting_Container_Pagination_Btn DAT_RoleSetting_Container_Pagination_Btn--next"
                  onClick={() => setCurrentPage(currentPage == totalPage ? 1 : currentPage + 1)}
                >
                  &gt;
                </button>
              </div>
            )}
          </div>

          <Modal
            isOpen={modalType !== null}
            onClose={() => setModalType(null)}
            title={renderTitle()}
            footer={renderFooter()}
          >
            {renderBody()}
          </Modal>
        </div>
      )}
    </>
  )
}
import React, { useEffect, useState } from 'react'
import './Role.scss'
import { useIntl } from 'react-intl';
import { LuSettings } from 'react-icons/lu';
import { TbBrandOnlyfans, TbRvTruck } from 'react-icons/tb';
import { CiEdit } from "react-icons/ci";
import Modal from '../../Modal/Modal';
import { callApi } from '../../Api/Api';
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';

export default function Role() {
  const lang = useIntl();
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
  const navigate = useNavigate();

  const openNew = () => {
    setAddRoleModal(true);
  };

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
        toast.success(lang.formatMessage({ id: "toast_created"}))
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
          toast.error(lang.formatMessage({ id: "toast_error"}))
        }
      } catch (error) {
        console.log(error);
        alert("Có lỗi xảy ra khi xóa!");
      }
    };

  return (
    <>
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
            <button
              className="DAT_RoleSetting_Card_Actions_Button_Primary"
              onClick={openNew}
            >
              {lang.formatMessage({ id: "add_role" })}
            </button>
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
                  <th>{lang.formatMessage({ id: "role_action_table" })}</th>
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
                      <td className="DAT_RoleSetting_Container_Table_Main_Cell">
                        <div className='DAT_RoleSetting_Container_Table_Main_Cell_Action'>
                          <button className='DAT_RoleSetting_Container_Table_Main_Cell_Action_Button'
                            onClick={() => navigate(`/roles/${item.id}`)}>
                            {lang.formatMessage({ id: "role_edit_button" })}
                          </button>
                          <button className='DAT_RoleSetting_Container_Table_Main_Cell_Action_Button'
                            onClick={() => {setDeleteRole(true); setDeleteRoleId(item.id)}}
                          >
                            {lang.formatMessage({ id: "role_delete_button" })}
                          </button>
                        </div>
                        {deleteRole && (
                          <div className="DAT_RoleSetting_Modal" onClick={() => { setDeleteRole(false) }}>
                            <div className="DAT_RoleSetting_Modal_Container">
                              <div className="DAT_RoleSetting_Modal_Container_Header">
                                <div className="DAT_RoleSetting_Modal_Container_Header_Title">
                                  {lang.formatMessage({
                                    id: "confirm_delete",
                                  })}{" "}
                                </div>
                                <div className="DAT_RoleSetting_Modal_Container_Header_Close">
                                  <svg
                                    stroke="currentColor"
                                    fill="currentColor"
                                    strokeWidth="0"
                                    viewBox="0 0 512 512"
                                    height="25"
                                    width="25"
                                    xmlns="http://www.w3.org/2000/svg"
                                    onClick={() => setDeleteRole(false)}
                                  >
                                    <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"></path>
                                  </svg>
                                </div>
                              </div>

                              <div className="DAT_RoleSetting_Modal_Container_Main">
                                {lang.formatMessage({
                                  id: "description_delete_role",
                                })}
                              </div>

                              <div className="DAT_RoleSetting_Modal_Container_Foot">
                                <button
                                  className="DAT_RoleSetting_Modal_Container_Foot_Btn_Cancel"
                                  onClick={() => setDeleteRole(null)}
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
                              </div>
                            </div>
                          </div>
                        )}
                      </td>
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
          isOpen={addRoleModal}
          onClose={() => setAddRoleModal(false)}
          title={lang.formatMessage({ id: "role_modal_create_title" })}
          footer={
            <>
              <button
                className="DAT_RoleSetting_Modal_Footer_Button_Secondary"
                onClick={() => setAddRoleModal(false)}
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
          }
        >
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
        </Modal>
      </div>
    </>
  )
}
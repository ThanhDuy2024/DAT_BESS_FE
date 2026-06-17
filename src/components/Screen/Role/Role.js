import React, { useEffect, useState } from 'react'
import './Role.scss'
import { useIntl } from 'react-intl';
import { LuSettings } from 'react-icons/lu';
import { TbRvTruck } from 'react-icons/tb';
import { CiEdit } from "react-icons/ci";
import Modal from '../../Modal/Modal';
import { callApi } from '../../Api/Api';
import { useNavigate } from "react-router-dom";

export default function Role() {
  const lang = useIntl();
  const [addRoleModal, setAddRoleModal] = useState(false);
  const [roleName, setRoleName] = useState();
  const [status, setStatus] = useState("active");
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  const openNew = () => {
    setAddRoleModal(true);
  };

  const handleCreateRole = async () => {
    try {
      const response = await callApi("post", `${process.env.REACT_APP_APIDEV}/data/createRole`, {
        roleName: roleName,
        status: status,
      });

      if (response.status === false) {
        console.log(response.msg);
      } else {
        setAddRoleModal(false);
      };
    } catch (error) {
      console.log(error);
    }
  }

  const getAllRole = async () => {
    try {
      const response = await callApi("post", `${process.env.REACT_APP_APIDEV}/data/getAllRoles`);
      if (response.status === false) {
        console.log(response.msg);
      } else {
        setRoles(response.data);
      };
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllRole();
  }, [addRoleModal])
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
            />
            <select
              className="DAT_RoleSetting_Card_Actions_FilterSelect"
              style={{ width: 140 }}
            >
              <option value="active">
                {lang.formatMessage({ id: "statusActive_role" })}
              </option>
              <option value="inactive">
                {lang.formatMessage({ id: "statusInactive_role" })}
              </option>
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
                      <td className="DAT_RoleSetting_Container_Table_Main_Cell">
                        <div className='DAT_RoleSetting_Container_Table_Main_Cell_Action'>
                          <button className='DAT_RoleSetting_Container_Table_Main_Cell_Action_Button'
                            onClick={() => navigate(`/roles/${item.id}`)}>
                            {lang.formatMessage({ id: "role_edit_button" })}
                          </button>
                          <button className='DAT_RoleSetting_Container_Table_Main_Cell_Action_Button'>
                            {lang.formatMessage({ id: "role_delete_button" })}
                          </button>
                        </div>

                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
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
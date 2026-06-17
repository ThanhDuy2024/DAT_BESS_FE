import React, { useEffect, useState } from 'react'
import './UserRecovery.scss'
import { useIntl } from 'react-intl';
import { LuSettings } from 'react-icons/lu';
import { TbRvTruck } from 'react-icons/tb';
import { CiEdit } from "react-icons/ci";
import Modal from '../../Modal/Modal';
import { callApi } from '../../Api/Api';
import { LuUsers, LuUserPlus, LuMenu, LuUser } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function UserRecovery() {
    const lang = useIntl();
    const [addRoleModal, setAddRoleModal] = useState(false);
    const [roleName, setRoleName] = useState();
    const [status, setStatus] = useState("active");
    const [roles, setRoles] = useState([]);
    const [openMenu, setOpenMenu] = useState(false);
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
            <div className="DAT_UserRecovery">
                <div className="DAT_UserRecovery_HeaderCard">
                    <div className="DAT_UserRecovery_HeaderCard_Main">
                        <div className="DAT_UserRecovery_HeaderCard_Main_Icon">
                            <LuSettings size={25} />
                        </div>
                        <div className="DAT_UserRecovery_HeaderCard_Main_Title">
                            Khôi phục người dùng
                        </div>
                    </div>
                    <div className="DAT_UserRecovery_Card_Actions">
                        <input
                            className="DAT_UserRecovery_Card_Actions_FilterInput"
                            style={{ width: 220 }}
                            placeholder="Tìm kiếm tên người dùng"
                        />

                        <button
                            className="DAT_UserRecovery_Card_Actions_Button_Primary"
                            onClick={() => navigate("/users")}
                        >
                            Quay lại trang quản lý
                        </button>
                    </div>
                </div>

                <div className="DAT_UserRecovery_Container">
                    <div className="DAT_UserRecovery_Container_Table">
                        <table className="DAT_UserRecovery_Container_Table_Main">
                            <thead>
                                <tr style={{ textAlign: "center" }}>
                                    <th>{lang.formatMessage({ id: "user_id_table" })}</th>
                                    <th>{lang.formatMessage({ id: "user_name_table" })}</th>
                                    <th>Username</th>
                                    <th>{lang.formatMessage({ id: "user_email_table" })}</th>
                                    <th>{lang.formatMessage({ id: "user_role_table" })}</th>
                                    <th>{lang.formatMessage({ id: "user_status_table" })}</th>
                                    <th>
                                        {lang.formatMessage({ id: "user_create_at_table" })}
                                    </th>
                                    <th>{lang.formatMessage({ id: "user_action_table" })}</th>
                                </tr>
                            </thead>
                            <tbody className="DAT_UserRecovery_Container_Table_Main_Body">
                                <tr
                                    className="DAT_UserRecovery_Container_Table_Main_Row"
                                >
                                    <td className="DAT_UserRecovery_Container_Table_Main_Cell">
                                        USR-01
                                    </td>
                                    <td className="DAT_UserRecovery_Container_Table_Main_Cell">
                                        Như Trúc
                                    </td>
                                    <td className="DAT_UserRecovery_Container_Table_Main_Cell">
                                        NhuTruc
                                    </td>
                                    <td className="DAT_UserRecovery_Container_Table_Main_Cell">
                                        nhutruc@gmail.com
                                    </td>
                                    <td className="DAT_UserRecovery_Container_Table_Main_Cell">
                                        administrator
                                    </td>
                                    <td className="DAT_UserRecovery_Container_Table_Main_Cell">
                                        Active
                                    </td>

                                    <td className="DAT_UserRecovery_Container_Table_Main_Cell">
                                        11:56:25 5/6/2026
                                    </td>
                                    <td className="DAT_UserRecovery_Container_Table_Main_Cell">
                                        <div className="DAT_UserRecovery_Container_Table_Main_Cell_Action" >
                                            <button
                                                className="DAT_UserRecovery_Container_Table_Main_Cell_Action_Button_GhostSm"
                                            // onClick={() =>
                                            //     setOpenMenu(true)
                                            // }
                                            >
                                                <LuMenu />
                                            </button>

                                            {/* {openMenu && (
                                                <div className={`DAT_UserManagement_Pop_Menu 
                                                    
                                                    `}
                                                    onMouseDown={(e) => e.stopPropagation()}>
                                                    <div
                                                        className="DAT_UserManagement_Pop_MenuItem"
                                                        onClick={() => {
                                                            // openEdit(user);
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
                                                        // onClick={() => { setDeleteUser(true); setOpenMenu(null); }}
                                                    >
                                                        {lang.formatMessage({
                                                            id: "user_delete_button",
                                                        })}
                                                    </div>
                                                </div>
                                            )} */}
                                            {/* {deleteUser && (
                                                <div className="DAT_UserManagement_Modal" onClick={() => { setDeleteUser(false) }}>
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
                                                        </div>
                                                    </div>
                                                </div>
                                            )} */}
                                        </div>
                                    </td>
                                </tr>
                                {/* {roles.map((item) => {
                                    return (
                                        <tr className='DAT_UserRecovery_Container_Table_Main_Row' key={item.id}>
                                            <td className="DAT_UserRecovery_Container_Table_Main_Cell">ROLE-{item.id >= 10 ? `0${item.id}` : `00${item.id}`}</td>
                                            <td className="DAT_UserRecovery_Container_Table_Main_Cell">{item.roleName}</td>
                                            <td className={`DAT_UserRecovery_Container_Table_Main_Cell--${item.status}`}>{item.status == "active" ? lang.formatMessage({ id: "statusActive_role" }) : lang.formatMessage({ id: "statusInactive_role" })}</td>
                                            <td className="DAT_UserRecovery_Container_Table_Main_Cell">{item.createdAt}</td>
                                            <td className="DAT_UserRecovery_Container_Table_Main_Cell">{item.createdBy}</td>
                                            <td className="DAT_UserRecovery_Container_Table_Main_Cell">
                                                <div className='DAT_UserRecovery_Container_Table_Main_Cell_Action'>
                                                    <button className='DAT_UserRecovery_Container_Table_Main_Cell_Action_Button'>
                                                        {lang.formatMessage({ id: "role_edit_button" })}
                                                    </button>
                                                    <button className='DAT_UserRecovery_Container_Table_Main_Cell_Action_Button'>
                                                        {lang.formatMessage({ id: "role_delete_button" })}
                                                    </button>
                                                </div>

                                            </td>
                                        </tr>
                                    )
                                })} */}
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

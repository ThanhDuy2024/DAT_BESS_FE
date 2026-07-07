import React, { useContext, useEffect, useState } from 'react'
import './UserRecovery.scss'
import './UserRecoveryMobile.scss'
import { useIntl } from 'react-intl';
import { LuSettings } from 'react-icons/lu';
import { TbRvTruck } from 'react-icons/tb';
import { IoIosArrowBack } from "react-icons/io";

import { CiEdit } from "react-icons/ci";
import Modal from '../../Modal/Modal';
import { callApi } from '../../Api/Api';
import { LuUsers, LuUserPlus, LuMenu, LuUser } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { isMobile } from "react-device-detect";
import { SystemContext } from '../../contexts/SystemContext';

export default function UserRecovery() {
    const lang = useIntl();
    const { permissions } = useContext(SystemContext);
    const [userRecoveryList, setUserRecoveryList] = useState([]);
    const [openRecoveryModal, setOpenRecoveryModal] = useState();
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [showPagination, setShowPagination] = useState(1);
    const [totalPage, setTotalPage] = useState(2);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState(null);

    const navigate = useNavigate();

    const loadUserRecovery = async (search, sort, currentPage) => {
        try {
            const permission = permissions["users"].includes("recovery");
            if (!permission) {
                return navigate("/dashboard");
            }
            const response = await callApi(
                "get",
                `${process.env.REACT_APP_API}/data/recoveryList?search=${search}&sort=${sort}&page=${currentPage ? currentPage : 1}`
            );
            if (response.status === true) {
                setUserRecoveryList(response.data);
                setTotalPage(response.totalPage);
                setShowPagination(response.totalPage);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleRecovery = async (userId) => {
        console.log("Delete API called");
        try {
            const response = await callApi(
                "post",
                `${process.env.REACT_APP_API}/data/recovery`,
                {
                    userId: userId
                }
            );
            if (response.status === true) {
                toast.success(lang.formatMessage({ id: "toast_recovery" }))
                setModalType(null)
                loadUserRecovery(search, sort, currentPage);
            }
        } catch (error) {
            toast.success(lang.formatMessage({ id: "toast_error" }))
            console.log(error);

        }
    }

    const handleDelete = async (userId) => {
        try {
            const response = await callApi(
                "post",
                `${process.env.REACT_APP_APIDEV}/data/deleteUserRecovery`,
                {
                    userId: userId
                }
            );
            if (response.status === true) {
                toast.success(lang.formatMessage({ id: "toast_deleted" }))
                setModalType(null)
                loadUserRecovery(search, sort, currentPage);
            }
        } catch (error) {
            toast.error(lang.formatMessage({ id: "toast_error" }))
            console.log(error);
            console.log(error.response);
            console.log(error.response?.data);
            console.log(error.response?.status);
        }
    }

    const userInfo = [
        {
            label: lang.formatMessage({ id: "user_name_table" }),
            value: selectedUser?.fullName,
        },
        { label: "Email", value: selectedUser?.email },
        {
            label: lang.formatMessage({ id: "user_role_table" }),
            value: selectedUser?.roleName,
        },
        {
            label: lang.formatMessage({ id: "user_status_table" }),
            value: selectedUser?.status,
        },
        {
            label: lang.formatMessage({ id: "user_deleted_at_table" }),
            value: selectedUser?.deletedAt

        },
    ];

    useEffect(() => {
        loadUserRecovery(search, sort, currentPage);
    }, [search, sort, currentPage]);


    const renderTitle = () => {
        switch (modalType) {
            case "view":
                return `${lang.formatMessage({ id: "user_information" })} USR-${String(selectedUser.id).padStart(3, "0")}`
            case "delete":
                return lang.formatMessage({ id: "confirm_delete", })
            case "recovery":
                return lang.formatMessage({ id: "confirm_recovery", })
        }
    }
    const renderBody = () => {
        switch (modalType) {
            case "view":
                return (
                    <div className="DAT_UserRecoveryMobile_Modal">
                        {userInfo.map((item, index) => (
                            <div key={index} className="DAT_UserRecoveryMobile_Modal_Row">
                                <div className="DAT_UserRecoveryMobile_Modal_Row_Label">{item.label}</div>
                                <div className="DAT_UserRecoveryMobile_Modal_Row_Value">{item.value || "-"}</div>
                            </div>
                        ))}
                    </div>
                )
            case "delete":
                return lang.formatMessage({ id: "description_delete", })
            case "recovery":
                return lang.formatMessage({ id: "description_recovery", })
        }
    }
    const renderFooter = () => {
        switch (modalType) {
            case "view":
                return (

                    <div className="DAT_UserRecoveryMobile_Modal_Foot">
                        <div className="DAT_UserRecoveryMobile_Modal_Foot_Btn_Cancel" onClick={() => setModalType(null)}>
                            {lang.formatMessage({ id: "cancel" })}
                        </div>
                        <div className="DAT_UserRecoveryMobile_Modal_Foot_Btn_Delete" onClick={() => { setModalType("recovery") }}>
                            {lang.formatMessage({ id: "recovery" })}
                        </div>
                        <div className="DAT_UserRecoveryMobile_Modal_Foot_Btn_Delete" onClick={() => { setModalType("delete") }}>
                            {lang.formatMessage({ id: "delete" })}
                        </div>
                    </div>
                )
            case "delete":
                return (
                    <>
                        <button
                            className="DAT_UserManagement_Modal_Container_Foot_Btn_Cancel"
                            onClick={() => setModalType(null)}
                        >
                            {lang.formatMessage({ id: "cancel" })}
                        </button>

                        <button
                            className="DAT_UserManagement_Modal_Container_Foot_Btn_Delete"
                            onClick={() => handleDelete(selectedUser.id)}
                        >
                            {lang.formatMessage({
                                id: "user_button_delete",
                            })}
                        </button>
                    </>
                )
            case "recovery":
                return (
                    <>
                        <button
                            className="DAT_UserManagement_Modal_Container_Foot_Btn_Cancel"
                            onClick={() => setModalType(null)}
                        >
                            {lang.formatMessage({ id: "cancel" })}
                        </button>

                        <button
                            className="DAT_UserManagement_Modal_Container_Foot_Btn_Delete"
                            onClick={() => handleRecovery(selectedUser.id)}
                        >
                            {lang.formatMessage({
                                id: "user_button_recovery",
                            })}
                        </button>
                    </>
                )
        }
    }
    return (
        <>
            {isMobile ? (
                <div className="DAT_UserRecoveryMobile">
                    <div className="DAT_UserRecoveryMobile_Card">
                        <div className="DAT_UserRecoveryMobile_Card_Back" onClick={() => navigate("/users")}>
                            <div className="DAT_UserRecoveryMobile_Card_Back_Icon">
                                <IoIosArrowBack size={16} />
                            </div>
                            <div className="DAT_UserRecoveryMobile_Card_Back_Title">
                                {lang.formatMessage({ id: "go_back" })}
                            </div>
                        </div>
                        <div className="DAT_UserRecoveryMobile_Card_Info">
                            <div className="DAT_UserRecoveryMobile_Card_Info_Title">
                                {lang.formatMessage({ id: "user_recovery_title" })}
                            </div>
                        </div>
                        <div className="DAT_UserRecoveryMobile_Card_Actions">
                            <input
                                className="DAT_UserRecoveryMobile_Card_Actions_FilterInput"
                                style={{ width: 220 }}
                                placeholder={lang.formatMessage({ id: "user_search" })}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <select
                                className="DAT_UserRecoveryMobile_Card_Actions_FilterSelect"
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
                    <div className="DAT_UserRecoveryMobile_Container">
                        {userRecoveryList.map((user) => (
                            <div key={user.id} className="DAT_UserRecoveryMobile_Container_Card">
                                <div className="DAT_UserRecoveryMobile_Container_Card_Avt">
                                    <LuUser />
                                </div>
                                <div className="DAT_UserRecoveryMobile_Container_Card_Info">
                                    <div className="DAT_UserRecoveryMobile_Container_Card_Info_Title">{user.fullName}</div>
                                    <div className="DAT_UserRecoveryMobile_Container_Card_Info_Text">{user.email}</div>
                                </div>
                                <div
                                    className="DAT_UserRecoveryMobile_Container_Card_Button"
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setModalType("view");
                                    }}
                                >
                                    {lang.formatMessage({ id: "view_details" })}
                                </div>
                            </div>
                        ))}
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
                <div className="DAT_UserRecovery">
                    <div className="DAT_UserRecovery_HeaderCard">
                        <div className="DAT_UserRecovery_HeaderCard_Main">
                            <div className="DAT_UserRecovery_HeaderCard_Main_Icon">
                                <LuSettings size={25} />
                            </div>
                            <div className="DAT_UserRecovery_HeaderCard_Main_Title">
                                {lang.formatMessage({ id: "user_recovery_title" })}
                            </div>
                        </div>
                        <div className="DAT_UserRecovery_Card_Actions">
                            <input
                                className="DAT_UserRecovery_Card_Actions_FilterInput"
                                style={{ width: 220 }}
                                placeholder={lang.formatMessage({ id: "user_search" })}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <select
                                className="DAT_UserRecovery_Card_Actions_FilterSelect"
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
                                className="DAT_UserRecovery_Card_Actions_Button_Primary"
                                onClick={() => navigate("/users")}
                            >
                                {lang.formatMessage({ id: "return_user_management" })}
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
                                            {lang.formatMessage({ id: "user_deleted_at_table" })}
                                        </th>
                                        <th>{lang.formatMessage({ id: "user_action_table" })}</th>
                                    </tr>
                                </thead>
                                <tbody className="DAT_UserRecovery_Container_Table_Main_Body">
                                    {userRecoveryList.map((item) => {
                                        return (
                                            <tr className="DAT_UserRecovery_Container_Table_Main_Row">
                                                <td className="DAT_UserRecovery_Container_Table_Main_Cell">
                                                    USR-{String(item.id).padStart(3, "0")}
                                                </td>
                                                <td className="DAT_UserRecovery_Container_Table_Main_Cell">
                                                    {item.fullName}
                                                </td>
                                                <td className="DAT_UserRecovery_Container_Table_Main_Cell">
                                                    {item.username}
                                                </td>
                                                <td className="DAT_UserRecovery_Container_Table_Main_Cell">
                                                    {item.email}
                                                </td>
                                                <td className="DAT_UserRecovery_Container_Table_Main_Cell">
                                                    {item.roleName}
                                                </td>
                                                <td className="DAT_UserRecovery_Container_Table_Main_Cell">
                                                    {item.status === 'deleted' ? "Deleted" : ""}
                                                </td>

                                                <td className="DAT_UserRecovery_Container_Table_Main_Cell">
                                                    {item.deletedAt}
                                                </td>
                                                <td className="DAT_UserRecovery_Container_Table_Main_Cell">
                                                    <div className='DAT_UserRecovery_Container_Table_Main_Cell_Action'>
                                                        <button
                                                            className='DAT_UserRecovery_Container_Table_Main_Cell_Action_Button'
                                                            onClick={() => { setModalType("recovery"); setSelectedUser(item) }}
                                                        >
                                                            {lang.formatMessage({ id: "user_button_recovery" })}
                                                        </button>
                                                        <button
                                                            className='DAT_UserRecovery_Container_Table_Main_Cell_Action_Button'
                                                            onClick={() => { setModalType("delete"); setSelectedUser(item) }}
                                                        >
                                                            {lang.formatMessage({ id: "delete" })}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        {showPagination > 1 && (
                            <div className="DAT_UserRecovery_Container_Pagination">
                                <button
                                    className="DAT_UserRecovery_Container_Pagination_Btn DAT_UserRecovery_Container_Pagination_Btn--prev"
                                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : totalPage)}
                                >
                                    &lt;
                                </button>
                                {Array.from({ length: totalPage }, (_, index) => (
                                    <button
                                        key={index}
                                        className={`DAT_UserRecovery_Container_Pagination_Btn${(index + 1) === currentPage ? " DAT_UserRecovery_Container_Pagination_Btn--active" : ""}`}
                                        onClick={() => setCurrentPage(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                                <button
                                    className="DAT_UserRecovery_Container_Pagination_Btn DAT_UserRecovery_Container_Pagination_Btn--next"
                                    onClick={() => setCurrentPage(currentPage < showPagination ? currentPage + 1 : 1)}
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
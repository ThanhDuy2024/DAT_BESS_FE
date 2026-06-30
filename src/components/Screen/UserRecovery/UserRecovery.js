import React, { useEffect, useState } from 'react'
import './UserRecovery.scss'
import { useIntl } from 'react-intl';
import { LuSettings } from 'react-icons/lu';
import { TbRvTruck } from 'react-icons/tb';
import { CiEdit } from "react-icons/ci";
import Modal from '../../Modal/Modal';
import { callApi } from '../../Api/Api';
import { LuUsers, LuUserPlus, LuMenu, LuUser } from "react-icons/lu";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

export default function UserRecovery() {
    const lang = useIntl();
    const { currentUser } = useAuth();
    const [userRecoveryList, setUserRecoveryList] = useState([]);
    const [openRecoveryModal, setOpenRecoveryModal] = useState();
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [showPagination, setShowPagination] = useState(1);
    const [totalPage, setTotalPage] = useState(2);
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    const loadUserRecovery = async (search, sort, currentPage) => {
        try {
            const permission = currentUser.permissions["users"].includes("recovery");
            if(!permission) {
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
                setOpenRecoveryModal(-1)
                loadUserRecovery(search, sort, currentPage);
            }
        } catch (error) {
            toast.success(lang.formatMessage({ id: "toast_error" }))
            console.log(error);
        }
    }

    useEffect(() => {
        loadUserRecovery(search, sort, currentPage);
    }, [search, sort, currentPage]);

    return (
        <>
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
                                                        onClick={() => setOpenRecoveryModal(item.id)}
                                                    >
                                                        {lang.formatMessage({ id: "user_button_recovery" })}
                                                    </button>
                                                    {openRecoveryModal == item.id && (
                                                        <div className="DAT_UserManagement_Modal">
                                                            <div className="DAT_UserManagement_Modal_Container">
                                                                <div className="DAT_UserManagement_Modal_Container_Header">
                                                                    <div className="DAT_UserManagement_Modal_Container_Header_Title">
                                                                        {lang.formatMessage({
                                                                            id: "confirm_recovery",
                                                                        })}{" "}
                                                                    </div>
                                                                    <div className="DAT_UserManagement_Modal_Container_Header_Close" onClick={() => setOpenRecoveryModal(-1)}>
                                                                        <svg
                                                                            stroke="currentColor"
                                                                            fill="currentColor"
                                                                            strokeWidth="0"
                                                                            viewBox="0 0 512 512"
                                                                            height="25"
                                                                            width="25"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <path d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z"></path>
                                                                        </svg>
                                                                    </div>
                                                                </div>

                                                                <div className="DAT_UserManagement_Modal_Container_Main">
                                                                    {lang.formatMessage({
                                                                        id: "description_recovery",
                                                                    })}
                                                                </div>

                                                                <div className="DAT_UserManagement_Modal_Container_Foot">
                                                                    <button
                                                                        className="DAT_UserManagement_Modal_Container_Foot_Btn_Cancel"
                                                                        onClick={() => setOpenRecoveryModal(-1)}
                                                                    >
                                                                        {lang.formatMessage({ id: "cancel" })}
                                                                    </button>

                                                                    <button
                                                                        className="DAT_UserManagement_Modal_Container_Foot_Btn_Delete"
                                                                        onClick={() => handleRecovery(item.id)}
                                                                    >
                                                                        {lang.formatMessage({
                                                                            id: "user_button_recovery",
                                                                        })}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
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
            </div>
        </>
    )
}

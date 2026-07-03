import { LuSettings } from "react-icons/lu";
import { useIntl } from "react-intl"
import './RoleEdit.scss'
import './RoleEditMobile.scss'
import { IoIosArrowBack } from "react-icons/io";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { callApi } from "../../Api/Api";
import { toast } from "sonner";
import { isMobile } from "react-device-detect";
import { useNavigate } from "react-router-dom";

const permissions = {
    dashboard: ["View", "Create", "Update", "Delete"],
    users: ["View", "Create", "Update", "Delete", "Recovery"],
    pcs: ["View", "Create", "Update", "Delete"],
    battery: ["View", "Create", "Update", "Delete"],
    alarm: ["View", "Create", "Update", "Delete"],
    "energy-report": ["View", "Create", "Update", "Delete"],
    roles: ["View", "Create", "Update", "Delete"],
    settings: ["View", "Create", "Update", "Delete"],
};

export default function RoleEdit() {
    const lang = useIntl();
    const { id } = useParams();
    const [selected, setSelected] = useState({});
    const [roleName, setRoleName] = useState("");
    const [status, setStatus] = useState("active");
    const navigate = useNavigate();

    const loadRoleDetail = async (id) => {
        try {
            const res = await callApi('get', `${process.env.REACT_APP_APIDEV}/data/roleDetail/${id}`, {});
            if (res && res.status === true) {
                setRoleName(res.data.roleName || "");
                setStatus(res.data.status || "active");

                setSelected(res.data.permission || {});
            }
        } catch (error) {
            console.log("Error loading role detail:", error);
        }
    }

    const togglePermission = (module, action) => {
        let apiAction = action.toLowerCase();
        if (apiAction === 'view') {
            apiAction = 'read';
        }

        setSelected((prev) => {
            // Đảm bảo prev luôn là một object để tránh lỗi sập trang
            const safePrev = prev || {};
            const current = safePrev[module] || [];

            const updatedActions = current.includes(apiAction)
                ? current.filter((p) => p !== apiAction) // Bỏ chọn nếu đã có
                : [...current, apiAction];              // Thêm vào nếu chưa có

            return {
                ...safePrev,
                [module]: updatedActions,
            };
        });
    };

    const handleSubmit = async () => {
        // Xóa các module rỗng không có quyền nào
        const cleanPermissions = Object.fromEntries(
            Object.entries(selected || {}).filter(
                ([_, value]) => value && value.length
            )
        );

        const payload = {
            id: id,
            roleName: roleName,
            status: status,
            permission: cleanPermissions
        };

        try {
            const res = await callApi('post', `${process.env.REACT_APP_APIDEV}/data/roleUpdate`, payload);
            if (res && res.status === true) {
                toast.success(lang.formatMessage({ id: "toast_updated" }))
                loadRoleDetail(id);
            } else {
                toast.error(lang.formatMessage({ id: "toast_error" }))
            }
        } catch (error) {
            console.log("Error saving permission:", error);
            alert("An error occurred while saving.");
        }
    };

    useEffect(() => {
        if (id) {
            loadRoleDetail(id);
        }
    }, [id]);

    return (
        <>
            {isMobile ? (
                <>
                    <div className="DAT_RoleEditMobile">
                        <div className="DAT_RoleEditMobile_HeaderCard">
                            <div className="DAT_RoleEditMobile_HeaderCard_Back" onClick={() => navigate("/roles")}>
                                <div className="DAT_RoleEditMobile_HeaderCard_Back_Icon">
                                    <IoIosArrowBack size={18} />
                                </div>
                                <div className="DAT_RoleEditMobile_HeaderCard_Back_Title">
                                    {lang.formatMessage({ id: "go_back" })}
                                </div>
                            </div>
                            <div className="DAT_RoleEditMobile_HeaderCard_Main">
                                <div className="DAT_RoleEditMobile_HeaderCard_Main_Title">
                                    {lang.formatMessage({ id: "role_edit_title" })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="DAT_RoleEditMobile_Permission">
                        {/* ROLE INFO */}
                        <div className="DAT_RoleEditMobile_Permission_Role-Info">
                            <h2 className="DAT_RoleEditMobile_Permission_Role-Info_Section-Title">
                                {lang.formatMessage({ id: "role_information" })}
                            </h2>

                            <div className="DAT_RoleEditMobile_Permission_Role-Info_Role-Form">
                                <div className="DAT_RoleEditMobile_Permission_Role-Info_Role-Form_Form-Group">
                                    <label>{lang.formatMessage({ id: "role_name" })}</label>
                                    <input
                                        type="text"
                                        placeholder="Enter role name"
                                        value={roleName}
                                        onChange={(e) => setRoleName(e.target.value)}
                                    />
                                </div>

                                <div className="DAT_RoleEditMobile_Permission_Role-Info_Role-Form_Form-Group">
                                    <label>{lang.formatMessage({ id: "status" })}</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="active">{lang.formatMessage({ id: "active" })}</option>
                                        <option value="inactive">{lang.formatMessage({ id: "status_inactive" })}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <h2 className="DAT_RoleEditMobile_Permission_Title">
                            {lang.formatMessage({ id: "permission_management" })}
                        </h2>

                        <div className="DAT_RoleEditMobile_Permission_List">
                            {Object.entries(permissions).map(([module, actions]) => (
                                <div className="DAT_RoleEditMobile_Permission_List_Group" key={module}>
                                    <div className="DAT_RoleEditMobile_Permission_List_Group_Name">
                                        {lang.formatMessage({ id: `${module.replace("-", "_")}_permission` })}
                                    </div>

                                    <div className="DAT_RoleEditMobile_Permission_List_Group_Actions">
                                        {actions.map((action) => (
                                            <label
                                                className="DAT_RoleEditMobile_Permission_List_Group_Actions_Item"
                                                key={action}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        (() => {
                                                            const savedActions = selected?.[module] || [];
                                                            let currentAction = action.toLowerCase();
                                                            if (currentAction === 'view') {
                                                                currentAction = 'read';
                                                            }

                                                            return savedActions.includes(currentAction);
                                                        })()
                                                    }
                                                    onChange={() => togglePermission(module, action)}
                                                />
                                                <span className="checkbox" />   
                                                <span>{lang.formatMessage({ id: `${action.toLowerCase()}` })}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="DAT_RoleEditMobile_Permission_Footer">
                            <button
                                className="DAT_RoleEditMobile_Permission_Footer_Save"
                                onClick={handleSubmit}
                            >
                                {lang.formatMessage({ id: "save_permission" })}
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="DAT_RoleEdit">
                        <div className="DAT_RoleEdit_HeaderCard">
                            <div className="DAT_RoleEdit_HeaderCard_Main">
                                <div className="DAT_RoleEdit_HeaderCard_Main_Icon">
                                    <LuSettings size={25} />
                                </div>
                                <div className="DAT_RoleEdit_HeaderCard_Main_Title">
                                    {lang.formatMessage({ id: "role_edit_title" })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="DAT_RoleEdit_Permission">
                        {/* ROLE INFO */}
                        <div className="DAT_RoleEdit_Permission_Role-Info">
                            <h2 className="DAT_RoleEdit_Permission_Role-Info_Section-Title">
                                Role Information
                            </h2>

                            <div className="DAT_RoleEdit_Permission_Role-Info_Role-Form">
                                <div className="DAT_RoleEdit_Permission_Role-Info_Role-Form_Form-Group">
                                    <label>Role Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter role name"
                                        value={roleName}
                                        onChange={(e) => setRoleName(e.target.value)}
                                    />
                                </div>

                                <div className="DAT_RoleEdit_Permission_Role-Info_Role-Form_Form-Group">
                                    <label>Status</label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <h2 className="DAT_RoleEdit_Permission_Title">
                            Permission Management
                        </h2>

                        <div className="DAT_RoleEdit_Permission_List">
                            {Object.entries(permissions).map(([module, actions]) => (
                                <div className="DAT_RoleEdit_Permission_List_Group" key={module}>
                                    <div className="DAT_RoleEdit_Permission_List_Group_Name">
                                        {module.toUpperCase()} PERMISSION
                                    </div>

                                    <div className="DAT_RoleEdit_Permission_List_Group_Actions">
                                        {actions.map((action) => (
                                            <label
                                                className="DAT_RoleEdit_Permission_List_Group_Actions_Item"
                                                key={action}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={
                                                        (() => {
                                                            const savedActions = selected?.[module] || [];
                                                            let currentAction = action.toLowerCase();
                                                            if (currentAction === 'view') {
                                                                currentAction = 'read';
                                                            }

                                                            return savedActions.includes(currentAction);
                                                        })()
                                                    }
                                                    onChange={() => togglePermission(module, action)}
                                                />
                                                <span className="checkbox" />
                                                <span>{action}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="DAT_RoleEdit_Permission_Footer">
                            <button
                                className="DAT_RoleEdit_Permission_Footer_Save"
                                onClick={handleSubmit}
                            >
                                Save Permission
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
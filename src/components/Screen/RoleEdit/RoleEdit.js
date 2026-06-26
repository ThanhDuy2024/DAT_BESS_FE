import { LuSettings } from "react-icons/lu";
import { useIntl } from "react-intl"
import './RoleEdit.scss'
import { useState } from "react";

const permissions = {
    Dashboard: ["View", "Create", "Update", "Delete"],
    User: ["View", "Create", "Update", "Delete"],
    PCS: ["View", "Create", "Update", "Delete"],
    Battery: ["View", "Create", "Update", "Delete"],
    Alarm: ["View", "Create", "Update", "Delete"],
    Report: ["View", "Create", "Update", "Delete"],
    Role: ["View", "Create", "Update", "Delete"],
    System: ["View", "Create", "Update", "Delete"],
};

export default function RoleEdit() {
    const lang = useIntl();
    const [selected, setSelected] = useState({});
    const [roleName, setRoleName] = useState("");
    const [status, setStatus] = useState("active");

    //AI generate
    const togglePermission = (module, action) => {
        setSelected((prev) => {
            const current = prev[module] || [];

            return {
                ...prev,
                [module]: current.includes(action) ? current.filter((p) => p !== action) : [...current, action],
            };
        });
    };

    const handleSubmit = () => {
        // Xóa module rỗng
        const result = Object.fromEntries(
            Object.entries(selected).filter(
                ([_, value]) => value.length
            )
        );

        console.log(result);

        alert(JSON.stringify(result, null, 2));
    };
    //AI generate
    return (

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
                            <label>
                                Role Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter role name"
                                value={roleName}
                                onChange={(e) =>
                                    setRoleName(
                                        e.target.value
                                    )
                                }
                            />
                        </div>

                        <div className="DAT_RoleEdit_Permission_Role-Info_Role-Form_Form-Group">
                            <label>Status</label>

                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(
                                        e.target.value
                                    )
                                }
                            >
                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>
                            </select>
                        </div>

                    </div>
                </div>

                <h2 className="DAT_RoleEdit_Permission_Title">
                    Permission Management
                </h2>

                <div className="DAT_RoleEdit_Permission_List">
                    {Object.entries(permissions).map(
                        ([module, actions]) => (
                            <div
                                className="DAT_RoleEdit_Permission_List_Group"
                                key={module}
                            >
                                <div className="DAT_RoleEdit_Permission_List_Group_Name">
                                    {module} Permission
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
                                                    selected[module]?.includes(
                                                        action
                                                    ) || false
                                                }
                                                onChange={() =>
                                                    togglePermission(
                                                        module,
                                                        action
                                                    )
                                                }
                                            />

                                            <span className="checkbox" />

                                            <span>{action}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )
                    )}
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
    )
}

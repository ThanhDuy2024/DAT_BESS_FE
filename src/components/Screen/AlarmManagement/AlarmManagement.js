import './AlarmManagement.scss'
import { useContext, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { callApi } from "../../Api/Api";
import { MdOutlineCircleNotifications } from "react-icons/md";
import StatusBadge from '../../Modal/StatusBadge';
import { toast } from 'sonner';
import Modal from '../../Modal/Modal';
import { SystemContext } from '../../contexts/SystemContext';

const AlarmManagement = () => {
    const lang = useIntl();
    const { permissions } = useContext(SystemContext);
    const [alarms, setAlarms] = useState([]);
    const [createdAtFilter, setCreatedAtFilter] = useState("id");
    const [levelFilter, setLevelFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [modalType, setModalType] = useState(null);
    const [reloadTrigger, setReloadTrigger] = useState(false);
    const [createAlarm, setCreateAlarm] = useState({
        level: "Slight",
        address: "",
        message: ""
    });
    const [alarmDetail, setAlarmDetail] = useState(null);
    const [editAlarmData, setEditAlarmData] = useState({});
    const [totalPage, setTotalPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        (async () => {
            const res = await callApi("get", `${process.env.REACT_APP_APIDEV}/data/v2/getAllAlarmManagement?createdAtFillter=${createdAtFilter}&search=${search}&levelFilter=${levelFilter}&page=${currentPage}`, {});
            if (res.status === false) {
                console.log("Failed to get data");
            } else {
                setAlarms(res.data);
                setTotalPage(res.totalPage);
            }
        })();
    }, [createdAtFilter, search, reloadTrigger, currentPage, levelFilter]);

    const handleActions = () => {
        toast.warning("Tính năng đang được phát triển");
    };

    const renderTitle = () => {
        switch (modalType) {
            case "add":
                return lang.formatMessage({ id: "alarm_modal_create_title" });
            case "edit":
                return lang.formatMessage({ id: "alarm_modal_edit_title" });
            case "delete":
                return lang.formatMessage({ id: "confirm_delete" });
            default:
                return "";
        }
    };

    const handleCreateAlarm = async () => {
        try {
            const res = await callApi("post", `${process.env.REACT_APP_APIDEV}/data/createAlarm`, {
                alarmLevel: createAlarm.level,
                alarmMessage: createAlarm.message,
                alarmAddress: createAlarm.address
            });
            if (res.status === false) {
                toast.error(lang.formatMessage({ id: "toast_existed_alarm" }));
            } else {
                toast.success(lang.formatMessage({ id: "toast_created" }));
                setReloadTrigger(prev => !prev);
                setModalType(null);
            }
        } catch (error) {
            console.log(error);
            toast.error(lang.formatMessage({ id: "toast_error" }));
        }
    };

    const handleEditAlarm = async () => {
        try {
            const res = await callApi("post", `${process.env.REACT_APP_APIDEV}/data/editAlarm`, {
                alarmId: editAlarmData.id_,
                alarmLevel: editAlarmData.level_,
                alarmMessage: editAlarmData.message_
            });

            if (res.status === false) {
                toast.error(lang.formatMessage({ id: "toast_notFound_alarm" }));
            } else {
                toast.success(lang.formatMessage({ id: "toast_updated" }));
                setReloadTrigger(prev => !prev);
                setModalType(null);
            }
        } catch (error) {
            console.log(error);
            toast.error(lang.formatMessage({ id: "toast_error" }));
        }
    };

    const renderModalAdd = () => (
        <div className="DAT_AlarmManagement_Form_Grid">
            <div className="DAT_AlarmManagement_Form_Grid_Group">
                <label className="DAT_AlarmManagement_Form_Grid_Group_Label">
                    {lang.formatMessage({ id: "alarm_address" })}
                </label>
                <input
                    className="DAT_AlarmManagement_Form_Grid_Group_Input"
                    type='number'
                    required
                    onChange={(e) => setCreateAlarm({
                        ...createAlarm,
                        address: e.target.value
                    })}
                />
            </div>
            <div className="DAT_AlarmManagement_Form_Grid_Group">
                <label className="DAT_AlarmManagement_Form_Grid_Group_Label">
                    {lang.formatMessage({ id: "alarm_level" })}
                </label>
                <select
                    className="DAT_AlarmManagement_Form_Grid_Group_Select"
                    defaultValue="Slight"
                    onChange={(e) => setCreateAlarm({
                        ...createAlarm,
                        level: e.target.value
                    })}
                >
                    <option value="Slight">{lang.formatMessage({ id: "status_slight" })}</option>
                    <option value="Medium">{lang.formatMessage({ id: "status_medium" })}</option>
                    <option value="Serious">{lang.formatMessage({ id: "status_serious" })}</option>
                </select>
            </div>
            <div className="DAT_AlarmManagement_Form_Grid_Group">
                <label className="DAT_AlarmManagement_Form_Grid_Group_Label">
                    {lang.formatMessage({ id: "alarm_message" })}
                </label>
                <textarea
                    className="DAT_AlarmManagement_Form_Grid_Group_TextArea" required
                    onChange={(e) => setCreateAlarm({
                        ...createAlarm,
                        message: e.target.value
                    })}
                />
            </div>
        </div>
    );

    const renderModalEdit = () => (
        <div className="DAT_AlarmManagement_Form_Grid">
            <div className="DAT_AlarmManagement_Form_Grid_Group">
                <label className="DAT_AlarmManagement_Form_Grid_Group_Label">
                    {lang.formatMessage({ id: "alarm_address" })}
                </label>
                <input
                    className="DAT_AlarmManagement_Form_Grid_Group_Input"
                    type='number'
                    value={editAlarmData.address_ || ''}
                    disabled
                />
            </div>
            <div className="DAT_AlarmManagement_Form_Grid_Group">
                <label className="DAT_AlarmManagement_Form_Grid_Group_Label">
                    {lang.formatMessage({ id: "alarm_level" })}
                </label>
                <select
                    className="DAT_AlarmManagement_Form_Grid_Group_Select"
                    value={editAlarmData.level_ || 'Slight'}
                    onChange={(e) => setEditAlarmData({
                        ...editAlarmData,
                        level_: e.target.value
                    })}
                >
                    <option value="Slight">{lang.formatMessage({ id: "status_slight" })}</option>
                    <option value="Medium">{lang.formatMessage({ id: "status_medium" })}</option>
                    <option value="Serious">{lang.formatMessage({ id: "status_serious" })}</option>
                </select>
            </div>
            <div className="DAT_AlarmManagement_Form_Grid_Group">
                <label className="DAT_AlarmManagement_Form_Grid_Group_Label">
                    {lang.formatMessage({ id: "alarm_message" })}
                </label>
                <textarea
                    className="DAT_AlarmManagement_Form_Grid_Group_TextArea" required
                    value={editAlarmData.message_ || ''}
                    onChange={(e) => setEditAlarmData({
                        ...editAlarmData,
                        message_: e.target.value
                    })}
                />
            </div>
        </div>
    );

    const renderBody = () => {
        switch (modalType) {
            case "add": return renderModalAdd();
            case "edit": return renderModalEdit();
            case "delete": return lang.formatMessage({ id: "description_delete_role" });
            default: return null;
        }
    };

    const renderFooter = () => {
        switch (modalType) {
            case "add":
                return (
                    <>
                        <button className="DAT_AlarmManagement_Modal_Footer_Button_Secondary" onClick={() => setModalType(null)}>
                            {lang.formatMessage({ id: "modal_cancel" })}
                        </button>
                        <button className="DAT_AlarmManagement_Modal_Footer_Button_Primary" onClick={handleCreateAlarm}>
                            {lang.formatMessage({ id: "alarm_modal_save" })}
                        </button>
                    </>
                );
            case "edit":
                return (
                    <>
                        <button className="DAT_AlarmManagement_Modal_Footer_Button_Secondary" onClick={() => setModalType(null)}>
                            {lang.formatMessage({ id: "modal_cancel" })}
                        </button>
                        <button className="DAT_AlarmManagement_Modal_Footer_Button_Primary" onClick={handleEditAlarm}>
                            {lang.formatMessage({ id: "alarm_modal_edit" })}
                        </button>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="DAT_AlarmManagement">
            <div className="DAT_AlarmManagement_HeaderCard">
                <div className="DAT_AlarmManagement_HeaderCard_Main">
                    <div className="DAT_AlarmManagement_HeaderCard_Main_Icon">
                        <MdOutlineCircleNotifications size={28} />
                    </div>
                    <div className="DAT_AlarmManagement_HeaderCard_Main_Title">
                        {lang.formatMessage({ id: "sidebar_item_alarm_management2" })}
                    </div>
                </div>
                <div className="DAT_AlarmManagement_Card_Actions">
                    <input
                        className="DAT_AlarmManagement_Card_Actions_FilterInput"
                        placeholder={lang.formatMessage({ id: "alarm_search" })}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: 250 }}
                    />
                    <select
                        className="DAT_Bms_Card_Actions_FilterSelect"
                        style={{ width: 200 }}
                        value={levelFilter != 'id' ? createdAtFilter : ''}
                        onChange={(e) => setLevelFilter(e.target.value)}
                    >
                        <option value="">{lang.formatMessage({ id: "alarm_level_filter" })}</option>
                        <option value="all">{lang.formatMessage({ id: "all_levels" })}</option>
                        <option value="Slight">{lang.formatMessage({ id: "status_slight" })}</option>
                        <option value="Medium">{lang.formatMessage({ id: "status_medium" })}</option>
                        <option value="Serious">{lang.formatMessage({ id: "status_serious" })}</option>
                    </select>
                    <select
                        className="DAT_Bms_Card_Actions_FilterSelect"
                        style={{ width: 200 }}
                        value={createdAtFilter != 'id' ? createdAtFilter : ''}
                        onChange={(e) => setCreatedAtFilter(e.target.value)}
                    >
                        <option value="" disabled>{lang.formatMessage({ id: "sort_created_at" })}</option>
                        <option value="id">{lang.formatMessage({ id: "sort_id" })}</option>
                        <option value="asc">{lang.formatMessage({ id: "sort_created_oldest" })}</option>
                        <option value="desc">{lang.formatMessage({ id: "sort_created_newest" })}</option>
                    </select>
                    {permissions['alarm-management'].includes("create") && (
                        <button
                            className="DAT_AlarmManagement_Card_Actions_Button--Primary"
                            onClick={() => setModalType('add')}
                        >
                            {lang.formatMessage({ id: "add_alarm" })}
                        </button>
                    )}
                </div>
            </div>

            <div className="DAT_AlarmManagement_Container">
                <div className="DAT_AlarmManagement_Container_Table">
                    <table className="DAT_AlarmManagement_Container_Table_Main">
                        <thead>
                            <tr style={{ textAlign: "center" }}>
                                <th>{lang.formatMessage({ id: "role_id_table" })}</th>
                                <th>{lang.formatMessage({ id: "alarm_level" })}</th>
                                <th>{lang.formatMessage({ id: "alarm_message" })}</th>
                                <th>{lang.formatMessage({ id: "alarm_address" })}</th>
                                <th>{lang.formatMessage({ id: "created_at" })}</th>
                                {permissions['alarm-management'].includes("update") && (
                                    <th>{lang.formatMessage({ id: "alarm_actions" })}</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="DAT_AlarmManagement_Container_Table_Main_Body">
                            {alarms.map(item => (
                                <tr key={item.id_} className='DAT_AlarmManagement_Container_Table_Main_Row'>
                                    <td className="DAT_AlarmManagement_Container_Table_Main_Cell">ALARM-{item.id_ >= 10 ? `0${item.id_}` : `00${item.id_}`}</td>
                                    <td className="DAT_AlarmManagement_Container_Table_Main_Cell">
                                        <StatusBadge status={item.level_} />
                                    </td>
                                    <td className="DAT_AlarmManagement_Container_Table_Main_Cell">{item.message_}</td>
                                    <td className="DAT_AlarmManagement_Container_Table_Main_Cell">{item.address_}</td>
                                    <td className="DAT_AlarmManagement_Container_Table_Main_Cell">{item.created_at_}</td>
                                    {(permissions["alarm-management"].includes("update") || permissions["alarm-management"].includes("delete")) && (
                                        <td className="DAT_AlarmManagement_Container_Table_Main_Cell">
                                            <div className='DAT_AlarmManagement_Container_Table_Main_Cell_Action'>
                                                {permissions['alarm-management'].includes("update") && (
                                                    <button
                                                        className='DAT_AlarmManagement_Container_Table_Main_Cell_Action_Button'
                                                        onClick={() => {
                                                            setModalType("edit");
                                                            setAlarmDetail(item);
                                                            setEditAlarmData(item);
                                                        }}
                                                    >
                                                        {lang.formatMessage({ id: "alarm_edit_button" })}
                                                    </button>
                                                )}
                                                {permissions['alarm-management'].includes("delete") && (
                                                    <button className='DAT_AlarmManagement_Container_Table_Main_Cell_Action_Button' onClick={handleActions}>
                                                        {lang.formatMessage({ id: "alarm_delete_button" })}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
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
    );
};

export default AlarmManagement;
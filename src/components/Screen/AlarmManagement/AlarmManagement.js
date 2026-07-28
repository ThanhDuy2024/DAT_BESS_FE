import './AlarmManagement.scss'
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { callApi } from "../../Api/Api";
import { MdOutlineCircleNotifications } from "react-icons/md";
import StatusBadge from '../../Modal/StatusBadge';
import { toast } from 'sonner';

const AlarmManagement = () => {
    const lang = useIntl();
    const [alarms, setAlarms] = useState([]);
    const [createdAtFilter, setCreatedAtFilter] = useState("id");
    const [search, setSearch] = useState("");
    
    useEffect(() => {
        (async () => {
            const res = await callApi("get", `${process.env.REACT_APP_APIDEV}/data/getAllAlarmManagement?createdAtFillter=${createdAtFilter}&search=${search}`, {});
            if (res.status === false) {
                console.log("Failed to get data")
            } else {
                setAlarms(res.data);
            }
        })();
    }, [createdAtFilter, search]);

    const handleActions = () => {
        toast.warning("Tính năng đang được phát triển")
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
                        className="DAT_RoleSettingMobile_Card_Actions_FilterInput"
                        placeholder={lang.formatMessage({ id: "alarm_search" })}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: 220 }}
                    />
                    <select
                        className="DAT_Bms_Card_Actions_FilterSelect"
                        style={{ width: 200 }}
                        defaultValue={createdAtFilter !== 'id' ? createdAtFilter : ''}
                        onChange={(e) => {
                            setCreatedAtFilter(e.target.value);
                        }}
                    >
                        <option value="" disabled selected>{lang.formatMessage({ id: "sort_created_at" })}</option>
                        <option value="id">{lang.formatMessage({ id: "sort_id" })}</option>
                        <option value="asc">{lang.formatMessage({ id: "sort_created_oldest" })}</option>
                        <option value="desc">{lang.formatMessage({ id: "sort_created_newest" })}</option>
                    </select>
                    <button
                        className="DAT_AlarmManagement_Card_Actions_Button--Primary"
                    >
                        {lang.formatMessage({ id: "add_alarm" })}
                    </button>
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
                                <th>{lang.formatMessage({ id: "alarm_actions" })}</th>
                            </tr>
                        </thead>
                        <tbody className="DAT_AlarmManagement_Container_Table_Main_Body">
                            {alarms.map(item => (
                                <tr className='DAT_AlarmManagement_Container_Table_Main_Row'>
                                    <td className="DAT_AlarmManagement_Container_Table_Main_Cell">ALARM-{item.id_ >= 10 ? `0${item.id_}` : `00${item.id_}`}</td>
                                    <td className="DAT_AlarmManagement_Container_Table_Main_Cell">
                                        <StatusBadge status={item.level_} />
                                    </td>
                                    <td className="DAT_AlarmManagement_Container_Table_Main_Cell">{item.message_}</td>
                                    <td className="DAT_AlarmManagement_Container_Table_Main_Cell">{item.address_}</td>
                                    <td className="DAT_AlarmManagement_Container_Table_Main_Cell">{item.created_at_}</td>
                                    <td className="DAT_RoleSetting_Container_Table_Main_Cell">
                                        <div className='DAT_RoleSetting_Container_Table_Main_Cell_Action'>
                                            <button className='DAT_RoleSetting_Container_Table_Main_Cell_Action_Button' onClick={handleActions}>
                                                {lang.formatMessage({ id: "alarm_edit_button" })}
                                            </button>
                                            <button className='DAT_RoleSetting_Container_Table_Main_Cell_Action_Button' onClick={handleActions}>
                                                {lang.formatMessage({ id: "alarm_delete_button" })}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AlarmManagement;
import './AlarmManagement.scss'
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { callApi } from "../../Api/Api";
import { MdOutlineCircleNotifications } from "react-icons/md";
import StatusBadge from '../../Modal/StatusBadge';

const AlarmManagement = () => {
    const lang = useIntl();

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
                <button
                    className="DAT_AlarmManagement_Card_Actions_Button_Primary"
                >
                    {lang.formatMessage({ id: "add_alarm" })}
                </button>
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
                                <th>{lang.formatMessage({ id: "alarm_actions" })}</th>
                            </tr>
                        </thead>
                        <tbody className="DAT_AlarmManagement_Container_Table_Main_Body">
                            <tr className='DAT_AlarmManagement_Container_Table_Main_Row'>
                                <td className="DAT_AlarmManagement_Container_Table_Main_Cell">ALARM-{1 >= 10 ? `01` : `001`}</td>
                                <td className="DAT_AlarmManagement_Container_Table_Main_Cell">
                                    <StatusBadge status={"Serious"} />
                                </td>
                                <td className="DAT_AlarmManagement_Container_Table_Main_Cell">Rack 01 CBMU lost communication</td>
                                <td className="DAT_AlarmManagement_Container_Table_Main_Cell">200</td>
                                <td className="DAT_RoleSetting_Container_Table_Main_Cell">
                                    <div className='DAT_RoleSetting_Container_Table_Main_Cell_Action'>
                                        <button className='DAT_RoleSetting_Container_Table_Main_Cell_Action_Button'>
                                            {lang.formatMessage({ id: "alarm_edit_button" })}
                                        </button>
                                        <button className='DAT_RoleSetting_Container_Table_Main_Cell_Action_Button'>
                                            {lang.formatMessage({ id: "alarm_delete_button" })}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AlarmManagement;
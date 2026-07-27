import React, { useState } from "react";
import {
  LuChevronLeft,
  LuChevronRight,
  LuEye,
  LuSearch,
  LuBell,
  LuMessageSquare,
} from "react-icons/lu";
import Modal from "../../Modal/Modal";
import StatusBadge from "../../Modal/StatusBadge";
import { mockAlarms } from "../../data/mockData";
import "./Alarm.scss";
import { useIntl } from "react-intl";
import { isMobile } from "react-device-detect";
import { CiFilter } from "react-icons/ci";

export default function Alarm() {
  const lang = useIntl();
  const [selectedAlarm, setSelectedAlarm] = useState(null);

  return (
    <>
      {isMobile ? (
        <div className="DAT_AlarmMobile">
          <div className="DAT_AlarmMobile_Overview">
            <div className="DAT_AlarmMobile_Overview_OverviewTitle">
              <LuBell />
              <div className="DAT_AlarmMobile_Overview_OverviewTitle_Text">
                {lang.formatMessage({ id: "alarms_title" })}
              </div>
            </div>
          </div>

          <div className="DAT_AlarmMobile_Main">
          </div>
        </div>
      ) : (
        <div className="DAT_Alarm">
          <div className="DAT_Alarm_Overview">
            <div className="DAT_Alarm_Overview_OverviewTitle">
              <LuBell />
              <div className="DAT_Alarm_Overview_OverviewTitle_Text">
                {lang.formatMessage({ id: "alarms_title" })}
              </div>
            </div>
          </div>
          <div className="DAT_Alarm_Main">
            <table className="DAT_Alarm_Main_Table">
              <thead>
                <tr>
                  <th className="DAT_Alarm_Main_Table_Header">{lang.formatMessage({ id: "alarm_id" })}</th>
                  <th className="DAT_Alarm_Main_Table_Header">{lang.formatMessage({ id: "level" })}</th>
                  <th className="DAT_Alarm_Main_Table_Header">{lang.formatMessage({ id: "message" })}</th>
                  <th className="DAT_Alarm_Main_Table_Header">{lang.formatMessage({ id: "date" })}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="DAT_Alarm_Main_Table_Content">Alarm-001</td>
                  <td className="DAT_Alarm_Main_Table_Content">
                    <StatusBadge status={"Serious"} />
                  </td>
                  <td className="DAT_Alarm_Main_Table_Content">Nhiệt độ của thiết bị vượt mức</td>
                  <td className="DAT_Alarm_Main_Table_Content">21:00 23/07/2026</td>
                </tr>
                <tr>
                  <td className="DAT_Alarm_Main_Table_Content">Alarm-002</td>
                  <td className="DAT_Alarm_Main_Table_Content">
                    <StatusBadge status={"Medium"} />
                  </td>
                  <td className="DAT_Alarm_Main_Table_Content">SOC low medium</td>
                  <td className="DAT_Alarm_Main_Table_Content">17:00 25/07/2026</td>
                </tr>
                <tr>
                  <td className="DAT_Alarm_Main_Table_Content">Alarm-003</td>
                  <td className="DAT_Alarm_Main_Table_Content">
                    <StatusBadge status={"Slight"} />
                  </td>
                  <td className="DAT_Alarm_Main_Table_Content">Summary of Cell low temperature slight alarm in the system </td>
                  <td className="DAT_Alarm_Main_Table_Content">7:00 25/07/2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
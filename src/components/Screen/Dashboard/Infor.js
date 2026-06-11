import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { isMobile } from "react-device-detect";
import { convertToDoublewordAndFloat } from "../../../App";
import StatusBadge from "../../Modal/StatusBadge";

export const formatPower = (value) => {
  const absValue = Math.abs(value);

  if (absValue < 1000) {
    return parseFloat(absValue).toFixed(2);
  }

  return parseFloat(absValue / 1000).toFixed(2);
};

export const formatUnit = (value, type) => {
  const absValue = Math.abs(value);

  if (absValue < 1000) {
    return `k${type}`;
  }

  return `M${type}`;
};

const batteryStatus = {
  0: "Off",
  1: "Pending",
  2: "Fault",
  3: "Charging",
  4: "Discharging",
  5: "Charge",
  6: "Discharge",
};

const Infor = (props) => {
  const lang = useIntl();
  const [dataInf, setDataInf] = useState({});

  useEffect(() => {
    setDataInf(props.data);
  }, [props.data]);

  const socValue = parseFloat(dataInf?.["8203-1"] * 0.1).toFixed(0) || 0;
  const sohValue = parseFloat(dataInf?.["8204-1"] * 0.1).toFixed(0) || 0;
  const socProgress = Math.min(100, Math.max(0, socValue));
  const sohProgress = Math.min(100, Math.max(0, sohValue));
  const currentBatteryStatus = batteryStatus[dataInf?.["7000-1"] ?? 0];
  const powerValue =
    formatPower(
      convertToDoublewordAndFloat(
        [dataInf?.["7004-1"], dataInf?.["7003-1"]],
        "dw",
        0.001,
      ) || 0,
    );
  const powerUnit =
    formatUnit(
      convertToDoublewordAndFloat(
        [dataInf?.["7004-1"], dataInf?.["7003-1"]],
        "dw",
        0.001,
      ) || 0,
      "Wh",
    );

  return (
    <>
      {isMobile ? (
        <div className="DAT_InforMobile">
          <div className="DAT_InforMobile_Card">
            <div className="DAT_InforMobile_Card_Item">
              <div className="DAT_InforMobile_Card_Item_Label DAT_InforMobile_Card_Item_Label_SOC">
                SOC
              </div>

              <div className="DAT_InforMobile_Card_Item_Body">
                <div
                  className="DAT_InforMobile_Card_Item_Body_Circle"
                  style={{
                    background: `conic-gradient(#18b95d ${socValue}%,#e2e8f0 0)`,
                  }}
                >
                  <div className="DAT_InforMobile_Card_Item_Body_Circle_Inner">
                    {socValue}%
                  </div>
                </div>

                <div className="DAT_InforMobile_Card_Item_Body_Title">
                  {lang.formatMessage({ id: "dashboard_kpi_battery_status" })}
                </div>

                <div className="DAT_InforMobile_Card_Item_Body_Status">
                  <StatusBadge status={currentBatteryStatus} />
                </div>
              </div>
            </div>

            <div className="DAT_InforMobile_Card_Item">
              <div className="DAT_InforMobile_Card_Item_Label DAT_InforMobile_Card_Item_Label_SOH">
                SOH
              </div>

              <div className="DAT_InforMobile_Card_Item_Body">
                <div
                  className="DAT_InforMobile_Card_Item_Body_Circle"
                  style={{
                    background: `conic-gradient(#2563eb ${sohValue}%,#e2e8f0 0)`,
                  }}
                >
                  <div className="DAT_InforMobile_Card_Item_Body_Circle_Inner">
                    {sohValue}%
                  </div>
                </div>

                <div className="DAT_InforMobile_Card_Item_Body_Title">
                  {lang.formatMessage({ id: "dashboard_kpi_battery_health" })}
                </div>
              </div>
            </div>

            <div className="DAT_InforMobile_Card_Item">
              <div className="DAT_InforMobile_Card_Item_Label DAT_InforMobile_Card_Item_Label_Power">
                P
              </div>

              <div className="DAT_InforMobile_Card_Item_Body">
                <div
                  className="DAT_InforMobile_Card_Item_Body_Circle"
                  style={{
                    background: "conic-gradient(#d64200 100%, #e2e8f0 0)",
                  }}
                >
                  <div className="DAT_InforMobile_Card_Item_Body_Circle_Inner">
                    {powerValue}
                  </div>
                </div>

                <div className="DAT_InforMobile_Card_Item_Body_Title">
                  {lang.formatMessage({ id: "dashboard_kpi_power" })}
                </div>

                <div className="DAT_InforMobile_Card_Item_Body_Status">kWh</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="DAT_Infor">
          <div className="DAT_Infor_Card_SOC">
            <div className="DAT_Infor_Card_SOC_Label">
              {lang.formatMessage({
                id: "dashboard_kpi_soc_short",
                defaultMessage: "SOC",
              })}
            </div>
            <div className="DAT_Infor_Card_SOC_Body">
              <div className="DAT_Infor_Card_SOC_Body_Header">
                <div className="DAT_Infor_Card_SOC_Body_Header_Title">
                  {lang.formatMessage({ id: "dashboard_kpi_battery_status" })}
                </div>
              </div>
              <div className="DAT_Infor_Card_SOC_Body_Value">
                <div className="DAT_Infor_Card_SOC_Body_Value_Val">{socValue}%</div>
                <div className="DAT_Infor_Card_SOC_Body_Value_Status">
                  <StatusBadge status={currentBatteryStatus} />
                </div>
              </div>
              <div className="DAT_Infor_Card_SOC_Body_Progress">
                <div className="DAT_Infor_Card_SOC_Body_Progress_Bar">
                  <div
                    className="DAT_Infor_Card_SOC_Body_Progress_Bar_Fill"
                    style={{ width: `${socProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="DAT_Infor_Card_SOH">
            <div className="DAT_Infor_Card_SOH_Label">
              {lang.formatMessage({
                id: "dashboard_kpi_soh_short",
                defaultMessage: "SOH",
              })}
            </div>
            <div className="DAT_Infor_Card_SOH_Body">
              <div className="DAT_Infor_Card_SOH_Body_Header">
                <div className="DAT_Infor_Card_SOH_Body_Header_Title">
                  {lang.formatMessage({ id: "dashboard_kpi_battery_health" })}
                </div>
              </div>
              <div className="DAT_Infor_Card_SOH_Body_Value">
                <div className="DAT_Infor_Card_SOH_Body_Value_Val">{sohValue}%</div>
              </div>
              <div className="DAT_Infor_Card_SOH_Body_Progress">
                <div className="DAT_Infor_Card_SOH_Body_Progress_Bar">
                  <div
                    className="DAT_Infor_Card_SOH_Body_Progress_Bar_Fill"
                    style={{ width: `${sohProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="DAT_Infor_Card_PowerOutput">
            <div className="DAT_Infor_Card_PowerOutput_Label">
              {lang.formatMessage({
                id: "dashboard_kpi_power_short",
                defaultMessage: "P",
              })}
            </div>
            <div className="DAT_Infor_Card_PowerOutput_Body">
              <div className="DAT_Infor_Card_PowerOutput_Body_Header">
                <div className="DAT_Infor_Card_PowerOutput_Body_Header_Title">
                  {lang.formatMessage({ id: "dashboard_kpi_power" })}
                </div>
              </div>
              <div className="DAT_Infor_Card_PowerOutput_Body_Value">
                <div className="DAT_Infor_Card_PowerOutput_Body_Value_Val">{powerValue}</div>
                <div className="DAT_Infor_Card_PowerOutput_Body_Value_Unit">{powerUnit}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Infor;

import React, { useEffect, useState } from "react";
import "./SystemSettings.scss";
import { useIntl } from "react-intl";
import { LuSettings } from "react-icons/lu";
import { callApi } from "../../Api/Api";
import Modal from 'react-modal';
import { MdAdd } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";

const tabs = ["shedule", "solar", 'system'];
const tabLabels = {
  shedule: "shedule",
  solar: "solar",
  system: "system_settings"
};

const SYS_GROUPS = [
  {
    key: 'pcs', title: 'PCS — Vận hành',
    params: [
      { key: 'pcs_onoff', addr: '7800', name: 'On/Off', type: 'select', options: [{ v: '0', l: 'Off' }, { v: '1', l: 'On' }] },
      { key: 'pcs_hvrt', addr: '7803', name: 'Chế độ HVRT/LVRT', type: 'select', options: [{ v: '0', l: 'Disable' }, { v: '1', l: 'Hỗ trợ CS phản kháng' }, { v: '2', l: 'Dòng điện zero' }, { v: '3', l: 'Ưu tiên CS tác dụng' }] },
      { key: 'pcs_activeIsland', addr: '7804', name: 'Active Island', type: 'select', options: [{ v: '0', l: 'Disable' }, { v: '1', l: 'Enable' }] },
      { key: 'pcs_reactivePowerMode', addr: '7808', name: 'Chế độ CS phản kháng', type: 'select', options: [{ v: '0', l: 'CS phản kháng hằng' }, { v: '1', l: 'Hệ số CS hằng' }] },
      { key: 'pcs_activePower', addr: '7811', name: 'Công suất tác dụng', type: 'number', unit: 'kW' },
      { key: 'pcs_reactivePower', addr: '7812', name: 'Công suất phản kháng', type: 'number', unit: 'kvar' },
      { key: 'pcs_powerPrestartRate', addr: '7815', name: 'Tốc độ prestart CS', type: 'number', unit: '%/s', step: 0.01 },
      { key: 'pcs_onoffPrestartRate', addr: '7817', name: 'Tốc độ prestart bật/tắt', type: 'number', unit: '%/s', step: 0.01 },
      { key: 'pcs_faultRecoveryTime', addr: '7824', name: 'Thời gian phục hồi lỗi', type: 'number', unit: 's', min: 1, max: 600 },
      { key: 'pcs_standbyControl', addr: '7828', name: 'Phương thức chờ', type: 'select', options: [{ v: '0', l: 'Pulse off' }, { v: '1', l: 'Running' }, { v: '2', l: 'OFF' }, { v: '3', l: 'Ngắt AC' }] },
      { key: 'pcs_emsChargeLimit', addr: '7834', name: 'Giới hạn dòng sạc EMS', type: 'number', unit: 'A' },
      { key: 'pcs_emsDischargeLimit', addr: '7835', name: 'Giới hạn dòng xả EMS', type: 'number', unit: 'A' },
      { key: 'pcs_powerFactor', addr: '7836', name: 'Hệ số công suất', type: 'number', step: 0.001 },
      { key: 'pcs_commFaultReduction', addr: '7837', name: 'Giảm CS lỗi truyền thông', type: 'number', unit: 's', min: 1, max: 600 },
      { key: 'pcs_faultReset', addr: '7841', name: 'Reset lỗi', type: 'select', options: [{ v: '0', l: 'Invalid' }, { v: '1', l: 'Enable' }] },
      { key: 'pcs_reactivePowerPriority', addr: '7843', name: 'Ưu tiên CS phản kháng', type: 'select', options: [{ v: '0', l: 'Disable' }, { v: '1', l: 'Enable' }] },
      { key: 'pcs_insulationDetection', addr: '7845', name: 'Phát hiện cách điện', type: 'select', options: [{ v: '0', l: 'Disable' }, { v: '1', l: 'Alarm' }, { v: '2', l: 'Protect' }] },
    ],
  },
  {
    key: 'battery', title: 'Battery — Lưu trữ',
    params: [
      { key: 'bat_equalizedChargeVoltage', addr: '8380', name: 'Điện áp sạc bằng', type: 'number', unit: 'V', min: 0, max: 1510 },
      { key: 'bat_floatingChargeVoltage', addr: '8381', name: 'Điện áp sạc nổi', type: 'number', unit: 'V' },
      { key: 'bat_overvoltageProtection', addr: '8384', name: 'Bảo vệ quá áp', type: 'number', unit: 'V', max: 1550 },
      { key: 'bat_dischargeCutoff', addr: '8385', name: 'Ngắt xả (cutoff)', type: 'number', unit: 'V', min: 0, max: 1550 },
      { key: 'bat_undervoltageAlarm', addr: '8386', name: 'Cảnh báo thấp áp', type: 'number', unit: 'V', max: 1550 },
      { key: 'bat_undervoltageProtection', addr: '8387', name: 'Bảo vệ thấp áp', type: 'number', unit: 'V', max: 1550 },
      { key: 'bat_heavyLoadUndervoltage', addr: '8388', name: 'Thấp áp tải nặng', type: 'number', unit: 'V', min: 0 },
      { key: 'bat_overvoltageHysteresis', addr: '8389', name: 'Trễ quá áp', type: 'number', unit: 'V', min: 0, max: 100 },
      { key: 'bat_undervoltageHysteresis', addr: '8390', name: 'Trễ thấp áp', type: 'number', unit: 'V', min: 0, max: 100 },
      { key: 'bat_heavyLoadHysteresis', addr: '8391', name: 'Trễ thấp áp tải nặng', type: 'number', unit: 'V', min: 0, max: 100 },
      { key: 'bat_dischargeCutoffHysteresis', addr: '8393', name: 'Trễ ngắt xả', type: 'number', unit: 'V', min: 0, max: 100 },
    ],
  },
  {
    key: 'bms', title: 'BMS — Quản lý Lưu trữ',
    params: [
      { key: 'bms_function', addr: '8173', name: 'Chức năng giao tiếp BMS', type: 'select', options: [{ v: '0', l: 'Disable' }, { v: '1', l: 'Enable' }] },
      { key: 'bms_dryContact', addr: '8174', name: 'Tiếp điểm khô BMS', type: 'select', options: [{ v: '0', l: 'Thường mở' }, { v: '1', l: 'Thường đóng' }] },
      { key: 'bms_commMode', addr: '8175', name: 'Chế độ giao tiếp BMS', type: 'select', options: [{ v: '0', l: 'RS485' }, { v: '1', l: 'CAN' }] },
      { key: 'bms_canProtocol', addr: '8176', name: 'Giao thức CAN BMS', type: 'select', options: [{ v: '0', l: 'Standard' }, { v: '1', l: 'PN' }, { v: '2', l: 'CATL' }, { v: '3', l: 'CATL3.3' }, { v: '4', l: 'CATL3.4' }, { v: '5', l: 'CATL3.5' }, { v: '6', l: 'Gotion' }, { v: '7', l: 'CRRC' }, { v: '8', l: 'CATL3.9' }, { v: '9', l: 'BMSer' }, { v: '10', l: 'CATL4.9' }, { v: '11', l: 'GaoteV1.3' }, { v: '12', l: 'Industry standard' }, { v: '13', l: 'CRRC 0826' }, { v: '14', l: 'Unstd.' }] },
      { key: 'bms_rs485Protocol', addr: '8177', name: 'Giao thức RS485 BMS', type: 'select', options: [{ v: '0', l: 'Standard' }, { v: '1', l: 'Gotion' }, { v: '2', l: 'BYD' }, { v: '3', l: 'Hyper Strong V1.5' }, { v: '4', l: 'Industry standard' }, { v: '5', l: 'Unstd.' }] },
      { key: 'bms_canBaudRate', addr: '8178', name: 'Tốc độ CAN BMS', type: 'select', options: [{ v: '0', l: '250 kbps' }, { v: '1', l: '500 kbps' }, { v: '2', l: '1 Mbps' }] },
      { key: 'bms_485BaudRate', addr: '8179', name: 'Tốc độ RS485 BMS', type: 'select', options: [{ v: '0', l: '9600 bps' }, { v: '1', l: '19200 bps' }] },
      { key: 'bms_heartbeat', addr: '8194', name: 'Heartbeat register', type: 'number' },
    ],
  },
  {
    key: 'power', title: 'Điều khiển công suất',
    params: [
      { key: 'pow_activePowerPrestart', addr: '8163', name: 'Prestart CS tác dụng', type: 'number', unit: '%/s', min: 0, max: 50000 },
      { key: 'pow_reactivePowerPrestart', addr: '8169', name: 'Prestart CS phản kháng', type: 'number', unit: '%/s', min: 0, max: 50000 },
      { key: 'pow_standbyResponseTime', addr: '8171', name: 'TG phản hồi chế độ chờ', type: 'number', unit: 's' },
    ],
  },
  {
    key: 'sysTime', title: 'Thời gian hệ thống',
    params: [
      { key: 'sys_year', addr: '7850', name: 'Năm', type: 'number', min: 2000, max: 2099 },
      { key: 'sys_month', addr: '7850', name: 'Tháng', type: 'number', min: 1, max: 12 },
      { key: 'sys_day', addr: '7850', name: 'Ngày', type: 'number', min: 1, max: 31 },
      { key: 'sys_hour', addr: '7850', name: 'Giờ', type: 'number', min: 0, max: 23 },
      { key: 'sys_minute', addr: '7850', name: 'Phút', type: 'number', min: 0, max: 59 },
      { key: 'sys_second', addr: '7850', name: 'Giây', type: 'number', min: 0, max: 59 },
      { key: 'sys_timezone', addr: '8000', name: 'Múi giờ', type: 'select', options: [{ v: '1', l: 'UTC-12:00' }, { v: '2', l: 'UTC-11:00' }, { v: '3', l: 'UTC-10:00' }, { v: '4', l: 'UTC-10:00 Hawaii' }, { v: '5', l: 'UTC-09:00' }, { v: '6', l: 'UTC-09:00 Alaska' }, { v: '7', l: 'UTC-08:00' }, { v: '8', l: 'UTC-08:00 Pacific (US)' }, { v: '9', l: 'UTC-07:00' }, { v: '10', l: 'UTC-07:00 Mountain (US)' }, { v: '11', l: 'UTC-06:00' }, { v: '12', l: 'UTC-06:00 Central (US)' }, { v: '13', l: 'UTC-05:00' }, { v: '14', l: 'UTC-05:00 Eastern (US)' }, { v: '15', l: 'UTC-04:00' }, { v: '16', l: 'UTC-03:00' }, { v: '17', l: 'UTC-03:00 Brasilia' }, { v: '18', l: 'UTC-02:00' }, { v: '19', l: 'UTC-01:00' }, { v: '20', l: 'UTC+00:00' }, { v: '21', l: 'UTC+00:00 Dublin/Lisbon' }, { v: '22', l: 'UTC+01:00' }, { v: '23', l: 'UTC+02:00' }, { v: '24', l: 'UTC+03:00' }] },
    ],
  },
];


export default function SystemSettings() {
  const lang = useIntl();
  const [activeTab, setActiveTab] = useState("shedule");
  const [sheduleList, setSheduleList] = useState([]);
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({ id: 0, mod: '', value: '' });

  // Solar mode state
  const [solarEnabled, setSolarEnabled] = useState(false);
  const [solarStartTime, setSolarStartTime] = useState('10:00');
  const [solarEndTime, setSolarEndTime] = useState('14:00');
  const [solarSocUpper, setSolarSocUpper] = useState(90);
  const [solarSocLower, setSolarSocLower] = useState(20);
  const [solarPowerTolerance, setSolarPowerTolerance] = useState(100);
  const [solarChargeEnabled, setSolarChargeEnabled] = useState(false);
  const [solarDischargeEnabled, setSolarDischargeEnabled] = useState(false);
  // Real-time power values (replace with API polling in production)
  const [solarPower] = useState(0);
  const [gridPower] = useState(0);

  // System tab state
  const [sysParams, setSysParams] = useState({
    pcs_onoff: '0', pcs_hvrt: '0', pcs_activeIsland: '0', pcs_reactivePowerMode: '0',
    pcs_activePower: 0, pcs_reactivePower: 0, pcs_powerPrestartRate: 0, pcs_onoffPrestartRate: 0,
    pcs_faultRecoveryTime: 60, pcs_standbyControl: '0', pcs_emsChargeLimit: 0,
    pcs_emsDischargeLimit: 0, pcs_powerFactor: 1, pcs_commFaultReduction: 300,
    pcs_faultReset: '0', pcs_reactivePowerPriority: '0', pcs_insulationDetection: '2',
    bat_equalizedChargeVoltage: 1510, bat_floatingChargeVoltage: 0, bat_overvoltageProtection: 1520,
    bat_dischargeCutoff: 1020, bat_undervoltageAlarm: 1030, bat_undervoltageProtection: 1020,
    bat_heavyLoadUndervoltage: 970, bat_overvoltageHysteresis: 20, bat_undervoltageHysteresis: 25,
    bat_heavyLoadHysteresis: 25, bat_dischargeCutoffHysteresis: 25,
    bms_function: '0', bms_dryContact: '0', bms_commMode: '0', bms_canProtocol: '0',
    bms_rs485Protocol: '0', bms_canBaudRate: '0', bms_485BaudRate: '0', bms_heartbeat: 0,
    pow_activePowerPrestart: 100, pow_reactivePowerPrestart: 100, pow_standbyResponseTime: 0,
    sys_year: new Date().getFullYear(), sys_month: new Date().getMonth() + 1,
    sys_day: new Date().getDate(), sys_hour: new Date().getHours(),
    sys_minute: new Date().getMinutes(), sys_second: new Date().getSeconds(),
    sys_timezone: '21',
  });
  const [openSysGroups, setOpenSysGroups] = useState({ pcs: true, battery: false, bms: false, power: false, sysTime: false });
  const setSysParam = (key, value) => setSysParams(prev => ({ ...prev, [key]: value }));
  const toggleSysGroup = (key) => setOpenSysGroups(prev => ({ ...prev, [key]: !prev[key] }));

  const mod = {
    startTime: "startTime",
    endTime: "endTime",
    controlType: "controlType",
    power: "power",
    socLimit: "socLimit"
  }


  const Month = {
    m01: { id: "01", name: "January" },
    m02: { id: "02", name: "February" },
    m03: { id: "03", name: "March" },
    m04: { id: "04", name: "April" },
    m05: { id: "05", name: "May" },
    m06: { id: "06", name: "June" },
    m07: { id: "07", name: "July" },
    m08: { id: "08", name: "August" },
    m09: { id: "09", name: "September" },
    m10: { id: "10", name: "October" },
    m11: { id: "11", name: "November" },
    m12: { id: "12", name: "December" },
  }

  const handleMonth = async (month) => {
    setMonth(month);
    let data = await callApi("post", process.env.REACT_APP_API + "/data/getShedule", {
      deviceid: "N150FL4L2C072590",
      month: month
    });

    if (data.status === 'true') {
      console.log(data.data.shedule);
      setSheduleList(data.data.shedule);

    } else {
      setSheduleList([]);
      console.log("Failed to get data");
    }
  };

  useEffect(() => {
    handleMonth(month);
  }, []);


  const handleOpen = (event) => {
    event.preventDefault();
    setIsOpen(true);

    let d = document.getElementById(event.currentTarget.id);
    let value = d.innerHTML;

    console.log("edit", event.currentTarget.id, value);
    setSettings({
      id: event.currentTarget.id.split('_')[1],
      mod: event.currentTarget.id.split('_')[0],
      value: value
    })
  };

  const handleChange = async (event) => {
    event.preventDefault();
    console.log("change", settings.id, settings.mod, event.currentTarget.value);

    setSettings({
      ...settings,
      value: event.currentTarget.value
    })

  };

  const handleSave = async () => {


    let data = [...sheduleList];

    let index = data.findIndex(x => Number(x.id) === Number(settings.id));
    if (index !== -1) {
      data[index][settings.mod] = settings.value;
      let sh = await callApi("post", process.env.REACT_APP_API + "/data/updateShedule", {
        deviceid: "N150FL4L2C072590",
        month: month,
        shedule: data
      });
      // console.log(sh);
      if (sh.status === 'true') {
        setSheduleList([...sh.data.shedule]);
      } else {
        console.log("Failed to update data");
      }

    }

    setIsOpen(false);



  };


  const handleAdd = async (event) => {
    event.preventDefault();
    console.log("add", event.currentTarget.id);
    let id = parseInt(event.currentTarget.id) + 1;
    let newItem = {
      id: id,
      startTime: "00:00",
      endTime: "00:00",
      controlType: "Charging",
      socLimit: 0,
      power: 0 
    }

    let data = [...sheduleList, newItem];

     let sh = await callApi("post", process.env.REACT_APP_API + "/data/updateShedule", {
      deviceid: "N150FL4L2C072590",
      month: month,
      shedule: data
    });
    // console.log(sh);
    if (sh.status === 'true') {
      setSheduleList([...sh.data.shedule]);
    } else {
      console.log("Failed to update data");
    }

  };

  const handleDelete = async (event) => {
    event.preventDefault();
    // console.log("delete", event.currentTarget.id);
    let data = [...sheduleList];
    let newData = data.filter(x => Number(x.id) !== Number(event.currentTarget.id));

    let sh = await callApi("post", process.env.REACT_APP_API + "/data/updateShedule", {
      deviceid: "N150FL4L2C072590",
      month: month,
      shedule: newData
    });
    // console.log(sh);
    if (sh.status === 'true') {
      setSheduleList([...sh.data.shedule]);
    } else {
      console.log("Failed to update data");
    }

    // console.log("delete", newData);
  };


  const closeModal = () => {
    setIsOpen(false);
  }



  return (
    <>
      <div className="DAT_SystemSettings">
        <div className="DAT_SystemSettings_HeaderCard">
          <div className="DAT_SystemSettings_HeaderCard_Main">
            <div className="DAT_SystemSettings_HeaderCard_Main_Icon">
              <LuSettings size={25} />
            </div>
            <div className="DAT_SystemSettings_HeaderCard_Main_Title">
              {lang.formatMessage({ id: "system_settings" })}
            </div>
          </div>
          {/* <div className="DAT_SystemSettings_HeaderCard_Actions">
          <button
            className="DAT_SystemSettings_HeaderCard_Actions_ResetButton"
            onClick={() => setSettings(createDefaultSettings())}
          >
            {lang.formatMessage({id: "reset_default"})}
          </button>
          <button className="DAT_SystemSettings_HeaderCard_Actions_SaveButton">
            {lang.formatMessage({id: "save_settings"})}
          </button>
        </div> */}
        </div>

        <div className="DAT_SystemSettings_Tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={
                activeTab === tab
                  ? "DAT_SystemSettings_Tabs_Active"
                  : "DAT_SystemSettings_Tabs_Normal"
              }
              onClick={() => setActiveTab(tab)}
            >
              {lang.formatMessage({ id: tabLabels[tab] })}
            </button>
          ))}
        </div>


        <div className="DAT_SystemSettings_ContentCard">


          {(() => {
            switch (activeTab) {
              case 'shedule':
                return (<>
                  <div className="DAT_SystemSettings_ContentCard_Month">
                    {Object.values(Month).map((m) => (
                      <div
                        key={m.id}
                        className="DAT_SystemSettings_ContentCard_Month_Item"
                        style={{ backgroundColor: month === m.id ? "#1890ff" : "#f0f0f0", color: month === m.id ? "#fff" : "#000" }}
                        onClick={() => handleMonth(m.id)}
                      >
                        {lang.formatMessage({ id: m.name })}
                      </div>
                    ))}
                  </div>
                  <div className="DAT_SystemSettings_ContentCard_Shedule">
                    <div className="DAT_SystemSettings_ContentCard_Shedule_Header">
                      <div className="DAT_SystemSettings_ContentCard_Shedule_Header_d1" >{lang.formatMessage({ id: "no" })}</div>
                      <di className="DAT_SystemSettings_ContentCard_Shedule_Header_d">{lang.formatMessage({ id: "startTime" })}</di>
                      <div className="DAT_SystemSettings_ContentCard_Shedule_Header_d">{lang.formatMessage({ id: "endTime" })}</div>
                      <div className="DAT_SystemSettings_ContentCard_Shedule_Header_d">{lang.formatMessage({ id: "controlType" })}</div>
                      <div className="DAT_SystemSettings_ContentCard_Shedule_Header_d">{lang.formatMessage({ id: "socLimit" })}</div>
                      <div className="DAT_SystemSettings_ContentCard_Shedule_Header_d">{lang.formatMessage({ id: "power" })}</div>
                      <div className="DAT_SystemSettings_ContentCard_Shedule_Header_d">{lang.formatMessage({ id: "edit" })}</div>
                    </div>
                    {sheduleList.length > 0 ?
                      sheduleList.map((shedule, idx) => (
                        <div key={shedule.id} className="DAT_SystemSettings_ContentCard_Shedule_Item">
                          <div className="DAT_SystemSettings_ContentCard_Shedule_Item_d1"  >{idx + 1}</div>
                          <div className="DAT_SystemSettings_ContentCard_Shedule_Item_d" id={`startTime_${shedule.id}`} onClick={(e) => handleOpen(e)} >{shedule.startTime}</div>
                          <div className="DAT_SystemSettings_ContentCard_Shedule_Item_d" id={`endTime_${shedule.id}`} onClick={(e) => handleOpen(e)} >{shedule.endTime}</div>
                          <div className="DAT_SystemSettings_ContentCard_Shedule_Item_d" id={`controlType_${shedule.id}`} onClick={(e) => handleOpen(e)} style={{ color: shedule.controlType === "Charging" ? "green" : "red" }} >{shedule.controlType}</div>
                          <div className="DAT_SystemSettings_ContentCard_Shedule_Item_d" id={`socLimit_${shedule.id}`} onClick={(e) => handleOpen(e)} >{shedule.socLimit}</div>
                          <div className="DAT_SystemSettings_ContentCard_Shedule_Item_d" id={`power_${shedule.id}`} onClick={(e) => handleOpen(e)} >{shedule.power}</div>
                          <div className="DAT_SystemSettings_ContentCard_Shedule_Header_d">
                            <div className="DAT_SystemSettings_ContentCard_Shedule_Item_d_edit1" id={shedule.id} onClick={(e) => handleDelete(e)} ><RiDeleteBin5Line size={16} color="white" /></div>
                            {idx === sheduleList.length - 1 ? <div className="DAT_SystemSettings_ContentCard_Shedule_Item_d_edit2" id={shedule.id} onClick={(e) => handleAdd(e)} ><MdAdd size={16} color="white" /></div> : <div className="DAT_SystemSettings_ContentCard_Shedule_Item_d_edit3" ></div>}
                          </div>
                        </div>
                      ))
                      :
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "20px", gap: "10px" }} key={"empty"} >

                        <div>{lang.formatMessage({ id: "Alert_1" })}</div>
                        <div className="DAT_SystemSettings_ContentCard_Shedule_Item_d_edit2" id={0} onClick={(e) => handleAdd(e)} ><MdAdd size={16} color="white" /></div>


                      </div>



                    }
                  </div>
                </>)
              case 'solar':
                return (
                  <div className="DAT_SystemSettings_Solar">
                    {/* 1. Enable toggle + live power display */}
                    <div className="DAT_SystemSettings_Solar_Section">
                      <div className="DAT_SystemSettings_Solar_Section_Header">
                        <span className="DAT_SystemSettings_Solar_Section_Header_Title">{lang.formatMessage({ id: 'solar_mode_title' })}</span>
                        <label className="DAT_SystemSettings_Solar_Toggle">
                          <input type="checkbox" checked={solarEnabled} onChange={(e) => setSolarEnabled(e.target.checked)} />
                          <span />
                        </label>
                      </div>
                      <div className="DAT_SystemSettings_Solar_PowerDisplay" style={{ opacity: solarEnabled ? 1 : 0.45 }}>
                        <div className="DAT_SystemSettings_Solar_PowerDisplay_Card DAT_SystemSettings_Solar_PowerDisplay_Card--solar">
                          <div className="DAT_SystemSettings_Solar_PowerDisplay_Card_Label">{lang.formatMessage({ id: 'solar_power_label' })}</div>
                          <div className="DAT_SystemSettings_Solar_PowerDisplay_Card_Value">{solarPower}<span>kW</span></div>
                        </div>
                        <div className="DAT_SystemSettings_Solar_PowerDisplay_Card DAT_SystemSettings_Solar_PowerDisplay_Card--grid">
                          <div className="DAT_SystemSettings_Solar_PowerDisplay_Card_Label">{lang.formatMessage({ id: 'solar_grid_label' })}</div>
                          <div className="DAT_SystemSettings_Solar_PowerDisplay_Card_Value">{gridPower}<span>kW</span></div>
                        </div>
                      </div>
                    </div>

                    {/* 2. Time range */}
                    <div className="DAT_SystemSettings_Solar_Section" style={{ opacity: solarEnabled ? 1 : 0.45, pointerEvents: solarEnabled ? 'auto' : 'none' }}>
                      <div className="DAT_SystemSettings_Solar_Section_Label">{lang.formatMessage({ id: 'solar_active_time' })}</div>
                      <div className="DAT_SystemSettings_Solar_TimeRow">
                        <div className="DAT_SystemSettings_Solar_TimeRow_Field">
                          <span>{lang.formatMessage({ id: 'solar_start' })}</span>
                          <input type="time" value={solarStartTime} onChange={(e) => setSolarStartTime(e.target.value)} />
                        </div>
                        <div className="DAT_SystemSettings_Solar_TimeRow_Sep">→</div>
                        <div className="DAT_SystemSettings_Solar_TimeRow_Field">
                          <span>{lang.formatMessage({ id: 'solar_end' })}</span>
                          <input type="time" value={solarEndTime} onChange={(e) => setSolarEndTime(e.target.value)} />
                        </div>
                      </div>
                    </div>

                    {/* 3. SoC limits + power tolerance */}
                    <div className="DAT_SystemSettings_Solar_Section" style={{ opacity: solarEnabled ? 1 : 0.45, pointerEvents: solarEnabled ? 'auto' : 'none' }}>
                      <div className="DAT_SystemSettings_Solar_Section_Label">{lang.formatMessage({ id: 'solar_soc_limits' })}</div>
                      <div className="DAT_SystemSettings_Solar_Row3">
                        <div className="DAT_SystemSettings_Solar_Row3_Field">
                          <label>{lang.formatMessage({ id: 'solar_soc_upper' })}</label>
                          <div className="DAT_SystemSettings_Solar_Row3_Field_Input">
                            <input type="number" min={0} max={100} step={1} value={solarSocUpper} onChange={(e) => setSolarSocUpper(e.target.value)} />
                            <span>%</span>
                          </div>
                        </div>
                        <div className="DAT_SystemSettings_Solar_Row3_Field">
                          <label>{lang.formatMessage({ id: 'solar_soc_lower' })}</label>
                          <div className="DAT_SystemSettings_Solar_Row3_Field_Input">
                            <input type="number" min={0} max={100} step={1} value={solarSocLower} onChange={(e) => setSolarSocLower(e.target.value)} />
                            <span>%</span>
                          </div>
                        </div>
                        <div className="DAT_SystemSettings_Solar_Row3_Field">
                          <label>{lang.formatMessage({ id: 'solar_power_tolerance' })}</label>
                          <div className="DAT_SystemSettings_Solar_Row3_Field_Input">
                            <input type="number" min={0} step={10} value={solarPowerTolerance} onChange={(e) => setSolarPowerTolerance(e.target.value)} />
                            <span>kW</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 4. Solar surplus → charge */}
                    <div className="DAT_SystemSettings_Solar_Section DAT_SystemSettings_Solar_Section--action" style={{ opacity: solarEnabled ? 1 : 0.45, pointerEvents: solarEnabled ? 'auto' : 'none' }}>
                      <div className="DAT_SystemSettings_Solar_ActionRow">
                        <label className="DAT_SystemSettings_Solar_Toggle">
                          <input type="checkbox" checked={solarChargeEnabled} onChange={(e) => setSolarChargeEnabled(e.target.checked)} />
                          <span />
                        </label>
                        <div className="DAT_SystemSettings_Solar_ActionRow_Text">
                          <div className="DAT_SystemSettings_Solar_ActionRow_Text_Title DAT_SystemSettings_Solar_ActionRow_Text_Title--charge">{lang.formatMessage({ id: 'solar_charge_title' })}</div>
                          <div className="DAT_SystemSettings_Solar_ActionRow_Text_Note">{lang.formatMessage({ id: 'solar_charge_note' })}</div>
                        </div>
                      </div>
                    </div>

                    {/* 5. Solar deficit → discharge */}
                    <div className="DAT_SystemSettings_Solar_Section DAT_SystemSettings_Solar_Section--action" style={{ opacity: solarEnabled ? 1 : 0.45, pointerEvents: solarEnabled ? 'auto' : 'none' }}>
                      <div className="DAT_SystemSettings_Solar_ActionRow">
                        <label className="DAT_SystemSettings_Solar_Toggle">
                          <input type="checkbox" checked={solarDischargeEnabled} onChange={(e) => setSolarDischargeEnabled(e.target.checked)} />
                          <span />
                        </label>
                        <div className="DAT_SystemSettings_Solar_ActionRow_Text">
                          <div className="DAT_SystemSettings_Solar_ActionRow_Text_Title DAT_SystemSettings_Solar_ActionRow_Text_Title--discharge">{lang.formatMessage({ id: 'solar_discharge_title' })}</div>
                          <div className="DAT_SystemSettings_Solar_ActionRow_Text_Note">{lang.formatMessage({ id: 'solar_discharge_note' })}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              case 'system':
                return (
                  <div className="DAT_SystemSettings_Sys">
                    <div className="DAT_SystemSettings_Sys_Toolbar">
                      <button className="DAT_SystemSettings_Sys_Toolbar_Btn DAT_SystemSettings_Sys_Toolbar_Btn--read">
                        {lang.formatMessage({ id: 'sys_read_device' })}
                      </button>
                      <button className="DAT_SystemSettings_Sys_Toolbar_Btn DAT_SystemSettings_Sys_Toolbar_Btn--write">
                        {lang.formatMessage({ id: 'sys_write_device' })}
                      </button>
                    </div>
                    {SYS_GROUPS.map(group => (
                      <div key={group.key} className="DAT_SystemSettings_Sys_Group">
                        <div className="DAT_SystemSettings_Sys_Group_Header" onClick={() => toggleSysGroup(group.key)}>
                          <span className="DAT_SystemSettings_Sys_Group_Header_Title">{lang.formatMessage({ id: `sys_group_${group.key}` })}</span>
                          <span className="DAT_SystemSettings_Sys_Group_Header_Badge">{lang.formatMessage({ id: 'sys_params_badge' }, { count: group.params.length })}</span>
                          <span className="DAT_SystemSettings_Sys_Group_Header_Arrow">{openSysGroups[group.key] ? '▲' : '▼'}</span>
                        </div>
                        {openSysGroups[group.key] && (
                          <div className="DAT_SystemSettings_Sys_Group_Body">
                            {group.params.map(param => (
                              <div key={param.key} className="DAT_SystemSettings_Sys_Row">
                                <div className="DAT_SystemSettings_Sys_Row_Label">
                                  <span className="DAT_SystemSettings_Sys_Row_Label_Name">
                                    {lang.formatMessage({ id: param.key })}{param.unit ? ` (${param.unit})` : ''}
                                  </span>
                                </div>
                                <div className="DAT_SystemSettings_Sys_Row_Control">
                                  {param.type === 'select' ? (
                                    <select
                                      value={sysParams[param.key]}
                                      onChange={(e) => setSysParam(param.key, e.target.value)}
                                    >
                                      {param.options.map(opt => (
                                        <option key={opt.v} value={opt.v}>{opt.l}</option>
                                      ))}
                                    </select>
                                  ) : (
                                    <input
                                      type="number"
                                      value={sysParams[param.key]}
                                      min={param.min}
                                      max={param.max}
                                      step={param.step || 1}
                                      onChange={(e) => setSysParam(param.key, e.target.value)}
                                    />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              default:
                return <></>
            }
          })()}

        </div>

      </div>
      <Modal
        isOpen={isOpen}
        // onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
          },
          content: {
            top: "40%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
        ariaHideApp={false}
        contentLabel="Shedule Modal"
      >

        <div className='DAT_Config'>

          <div className='DAT_Config_Title'>{lang.formatMessage({ id:  settings?.mod || "status_pending" })}</div>

          {(() => {
            switch (settings.mod) {
              case 'startTime':
                return <>
                  <input id="startTime_inp" type="time" defaultValue={settings.value} onChange={(e) => handleChange(e)} />
                </>
              case 'endTime':
                return <>
                  <input id="endTime_inp" type="time" defaultValue={settings.value} onChange={(e) => handleChange(e)} />
                </>
              case 'controlType':
                return <>
                  <select id="controlType_inp" defaultValue={settings.value} onChange={(e) => handleChange(e)}>
                    <option value="Charging">Charging</option>
                    <option value="Discharging">Discharging</option>
                  </select>
                </>
              case 'power':
                return <>
                  <input id="power_inp" type="number" defaultValue={settings.value} onChange={(e) => handleChange(e)} />
                </>
              case 'socLimit':
                return <>
                  <input id="socLimit_inp" type="number" defaultValue={settings.value} onChange={(e) => handleChange(e)} />
                </>
              default:
                return <></>
            }
          })()}
          <div className='DAT_Config_Close' onClick={() => handleSave()} >{lang.formatMessage({ id: "saveclose" })}</div>
        </div>
      </Modal >
    </>
  );
}
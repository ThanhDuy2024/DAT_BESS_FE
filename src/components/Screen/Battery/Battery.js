import React, { useContext, useEffect, useState } from "react";
import { LuBadgeCheck, LuSearch, LuBatteryCharging, LuSeBatteryMobile } from "react-icons/lu";
import StatusBadge from "../../Modal/StatusBadge";
import { mockAlarms, mockContainers } from "../../data/mockData";
import "./Battery.scss";
import { FaArrowLeftLong } from "react-icons/fa6";
import { callApi } from "../../Api/Api";
import { socket } from "../../../App";
import { useIntl } from "react-intl";
import { isMobile } from "react-device-detect";
import { RiBatteryChargeLine } from "react-icons/ri";
import { bmsDataTemplate } from "../../data/bmsTemplate";
import { RackContext } from "../../contexts/RackContext";

export default function Battery() {
  const lang = useIntl();
  const { bmsData, rackDispatch } = useContext(RackContext);
  const [selectedContainer, setSelectedContainer] = useState(mockContainers[0]);
  const [selectedRack, setSelectedRack] = useState(null);
  const [selectedModule, setSelectedModule] = useState();
  const [searchRack, setSearchRack] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModelModuleOpen, setIsModalModuleOpen] = useState(false);
  const [moduleName, setModuleName] = useState("");
  const [dataInf, setDataInf] = useState({});
  const [step, setStep] = useState(0);
  const [arrRack, setArrRack] = useState([]);
  const [dataMapping, setDataMapping] = useState([]);
  const [dataTemplate, setDataTemplate] = useState();
  const batteryStatus = {
    0: "Initialization",
    1: "Charging",
    2: "Discharging",
    3: "Ready",
    5: "Charge prohibition",
    6: "Discharge prohibition.",
    7: "Charging and discharging prohibition",
    8: "Fault",
  };

  const rackNStatus = {
    0: "Initial state",
    1: "Charging",
    2: "Discharging",
    3: "Ready",
    4: "Rack maintenance",
    5: "Charge prohibition",
    6: "Discharge prohibition",
    7: "Charging and discharging prohibited",
    8: "Fault"
  }

  const filteredRacks = selectedContainer.racks.filter((r) => {
    const matchSearch = r.id.toLowerCase().includes(searchRack.toLowerCase());
    const matchStatus = filterStatus === "All" || r.status === filterStatus;
    return matchSearch && matchStatus;
  });

  useEffect(() => {
    (async () => {
      let data = await callApi("post", process.env.REACT_APP_API + "/data/readBess", {
        level: "bmslevel",
      });
      console.log(data);
      if (data.status === "true") {
        setDataInf(data.data);
        setStep(1);
      } else {
        console.log("Failed to get data");
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const res = await callApi('get', `${process.env.REACT_APP_APIDEV}/data/getAllRackInfo`, {});
      if (res.status === true) {
        setDataTemplate(res.data);
        rackDispatch({
          type: "LOAD_BMS_DATA",
          payload: {
            bmsData: res.data
          }
        })
      } else {
        console.log("Failed to get data");
      }
    })();
  }, [])

  useEffect(() => {
    if (!step) return;
    console.log('Connecting to Socket.IO server...');
    // socket.value.emit("BESS_SUBSCRIBE", {
    //   level: "bmslevel"
    // });

    const arrLevels = [
      "bmslevel",
      "rack1level_04", "rack2level_04", "rack3level_04", "rack4level_04", "rack5level_04", "rack6level_04",
      "rack1cellvoltagelevel_04", "rack1celltemplevel_04", "rack1cellsoclevel_04", "rack1cellsohlevel_04",
      "rack2cellvoltagelevel_04", "rack2celltemplevel_04", "rack2cellsoclevel_04", "rack2cellsohlevel_04",
      "rack3cellvoltagelevel_04", "rack3celltemplevel_04", "rack3cellsoclevel_04", "rack3cellsohlevel_04",
      "rack4cellvoltagelevel_04", "rack4celltemplevel_04", "rack4cellsoclevel_04", "rack4cellsohlevel_04",
      "rack5cellvoltagelevel_04", "rack5celltemplevel_04", "rack5cellsoclevel_04", "rack5cellsohlevel_04",
      "rack6cellvoltagelevel_04", "rack6celltemplevel_04", "rack6cellsoclevel_04", "rack6cellsohlevel_04"
    ]
    socket.value.emit("BESS_SUBSCRIBE_MANY", {
      levels: arrLevels,
    });

    socket.value.on("BESS_DATA", (payload) => {
      console.log(payload.level, payload.data)
      setDataInf(prev => ({
        ...prev,
        ...payload.data
      }));
    });

    return () => {
      socket.value.emit("BESS_UNSUBSCRIBE", {
        level: "bmslevel",
      });

      socket.value.emit("BESS_UNSUBSCRIBE_MANY", {
        levels: arrLevels
      });
      socket.value.off("BESS_DATA");
    };

  }, [step]);

  useEffect(() => {
    const response = bmsData || [];
    console.log(response);
    for (const item of response) {
      setDataMapping((prev) => {
        const index = prev.findIndex((rack) => rack.rackName === item.rack_name_);

        let cellArr = [];
        const moduleArray = [];
        for (const module of item.module_) {
          let index = 1;
          for (const itemInCell of module.cells) {
            const obj = {
              cellName: `${item.rack_name_}-Cell-${index}`,
              cellVoltage: (dataInf[itemInCell.cellVoltage.register] * itemInCell.cellVoltage.scale).toFixed(2),
              cellTemperature: dataInf[itemInCell.cellTemperature.register] * itemInCell.cellTemperature.scale - Math.abs(itemInCell.cellTemperature.offset),
              cellSoc: (dataInf[itemInCell.cellSoc.register] * itemInCell.cellSoc.scale),
              cellSoh: (dataInf[itemInCell.cellSoh.register] * itemInCell.cellSoh.scale),
            }
            cellArr.push(obj)
            index += 1;
          };
          moduleArray.push({
            moduleName: module.moduleName,
            cells: cellArr,
          });
          cellArr = []
        };

        if (index === -1) {
          return [...prev, {
            id: item.rack_id_,
            rackName: item.rack_name_,
            model: item.model_,
            status: {
              statusId: dataInf[item.template_.status.register] || 0,
              statusName: rackNStatus[dataInf[item.template_.status.register]]
            },
            voltage: (Number(dataInf[item.template_.voltage.register]) * item.template_.voltage.scale).toFixed(2) || 0,
            maximumCellVoltage: (Number(dataInf[item.template_.maximumCellVoltage.register]) * item.template_.maximumCellVoltage.scale).toFixed(2) || 0,
            minimumCellVoltage: (Number(dataInf[item.template_.minimumCellVoltage.register]) * item.template_.minimumCellVoltage.scale).toFixed(2) || 0,
            current: (Number(dataInf[item.template_.current.register]) * item.template_.current.scale - Math.abs(item.template_.current.offset)).toFixed(2) || 0,
            temperature: Number(dataInf[item.template_.temperature.register] * item.template_.temperature.scale - Math.abs(item.template_.temperature.offset)).toFixed(0) || 0,
            maximumCellTemperature: Number(dataInf[item.template_.maximumCellTemperature.register] * item.template_.maximumCellTemperature.scale - Math.abs(item.template_.maximumCellTemperature.offset)).toFixed(0) || 0,
            minimumCellTemperature: Number(dataInf[item.template_.minimumCellTemperature.register] * item.template_.minimumCellTemperature.scale - Math.abs(item.template_.minimumCellTemperature.offset)).toFixed(0) || 0,
            soc: dataInf[item.template_.soc.register] || 0,
            soh: dataInf[item.template_.soh.register] || 0,
            module: moduleArray
          }]
        }
        return prev.map((rack) => (
          rack.rackName === item.rack_name_ ?
            {
              ...rack,
              status: {
                statusId: dataInf[item.template_.status.register],
                statusName: rackNStatus[dataInf[item.template_.status.register]]
              },
              voltage: (Number(dataInf[item.template_.voltage.register]) * item.template_.voltage.scale).toFixed(2) || 0,
              maximumCellVoltage: (Number(dataInf[item.template_.maximumCellVoltage.register]) * item.template_.maximumCellVoltage.scale).toFixed(2) || 0,
              minimumCellVoltage: (Number(dataInf[item.template_.minimumCellVoltage.register]) * item.template_.minimumCellVoltage.scale).toFixed(2) || 0,
              current: (Number(dataInf[item.template_.current.register]) * item.template_.current.scale - Math.abs(item.template_.current.offset)).toFixed(2) || 0,
              temperature: Number(dataInf[item.template_.temperature.register] * item.template_.temperature.scale - Math.abs(item.template_.temperature.offset)).toFixed(0) || 0,
              maximumCellTemperature: dataInf[item.template_.maximumCellTemperature.register] * item.template_.maximumCellTemperature.scale - Math.abs(Number(item.template_.maximumCellTemperature.offset)) || 0,
              minimumCellTemperature: dataInf[item.template_.minimumCellTemperature.register] * item.template_.minimumCellTemperature.scale - Math.abs(Number(item.template_.minimumCellTemperature.offset)) || 0,
              soc: dataInf[item.template_.soc.register] || 0,
              soh: dataInf[item.template_.soh.register] || 0,
              module: moduleArray
            }
            :
            rack
        ))
      })
    }
  }, [dataInf]);

  return (
    <>
      {isMobile ? (
        <div className="DAT_BatteryMobile">
          <div className="DAT_BatteryMobile_Overview">
            {mockContainers.map((c) => (
              <div
                key={c.id}
                className={`DAT_BatteryMobile_Overview_Card`}
                onClick={() => {
                  setSelectedContainer(c);
                  setSelectedRack(null);
                }}
              >
                <div className="DAT_BatteryMobile_Overview_Card_Header">
                  <div className="DAT_BatteryMobile_Overview_Card_Header_BoxTitle">
                    <div className="DAT_BatteryMobile_Overview_Card_Header_BoxTitle_Title">
                      <div className="DAT_BatteryMobile_Overview_Card_Header_BoxTitle_Title_Icon">
                        <RiBatteryChargeLine size={30} />

                      </div>
                      <div className="DAT_BatteryMobile_Overview_Card_Header_BoxTitle_Title_Label">{lang.formatMessage({ id: "bms_level" })}</div>
                    </div>
                    <StatusBadge status={batteryStatus[parseInt(dataInf?.['43-1'])] ?? 0} />
                  </div>

                  <div className="DAT_BatteryMobile_Overview_Card_Header_Box">
                    <div className="DAT_BatteryMobile_Overview_Card_Header_Box_Item">
                      <div className="DAT_BatteryMobile_Overview_Card_Header_Box_Item_Label">SoC:</div>
                      <div className="DAT_BatteryMobile_Overview_Card_Header_Box_Item_Value">{parseInt(dataInf?.['4-1']) || 0}%</div>
                    </div>

                    <div className="DAT_BatteryMobile_Overview_Card_Header_Box_Item">
                      <div className="DAT_BatteryMobile_Overview_Card_Header_Box_Item_Label">SoH:</div>
                      <div className="DAT_BatteryMobile_Overview_Card_Header_Box_Item_Value">{parseInt(dataInf?.['5-1']) || 0}%</div>
                    </div>

                    <div className="DAT_BatteryMobile_Overview_Card_Header_Box_Item">
                      <div className="DAT_BatteryMobile_Overview_Card_Header_Box_Item_Label">{lang.formatMessage({ id: "bms_max_temp" })}:</div>
                      <div className="DAT_BatteryMobile_Overview_Card_Header_Box_Item_Value">{parseFloat(dataInf?.['12-1']) - 40}°C</div>
                    </div>
                    <div className="DAT_BatteryMobile_Overview_Card_Header_Box_Item">
                      <div className="DAT_BatteryMobile_Overview_Card_Header_Box_Item_Label">{lang.formatMessage({ id: "bms_min_temp" })}:</div>
                      <div className="DAT_BatteryMobile_Overview_Card_Header_Box_Item_Value">{parseFloat(dataInf?.['15-1']) - 40}°C</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="DAT_BatteryMobile_RackList">
            <div className="DAT_BatteryMobile_RackList_Header">
              <span className="DAT_BatteryMobile_RackList_Header_Title">
                {lang.formatMessage({ id: "bms_rack_list" })}
              </span>
              <div className="DAT_BatteryMobile_RackList_Filter">
                <select
                  className="DAT_BatteryMobile_RackList_Filter_Select"
                  style={{ width: 130, height: 36 }}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">{lang.formatMessage({ id: "bms_all_status" })}</option>
                  <option value="Normal">{lang.formatMessage({ id: "bms_status_normal" })}</option>
                  <option value="Warning">{lang.formatMessage({ id: "bms_status_warning" })}</option>
                  <option value="Fault">{lang.formatMessage({ id: "bms_status_fault" })}</option>
                </select>
              </div>
            </div>
            <div className="DAT_BatteryMobile_RackList_Table">
              <table className="DAT_BatteryMobile_RackList_Table_Main">
                <thead className="DAT_BatteryMobile_RackList_Table_Main_Head">
                  <tr>
                    <th className="DAT_BatteryMobile_RackList_Table_Main_Head_Th">Rack</th>
                    <th className="DAT_BatteryMobile_RackList_Table_Main_Head_Th"> {lang.formatMessage({ id: "bms_status" })}</th>
                  </tr>
                </thead>
                <tbody className="DAT_BatteryMobile_RackList_Table_Main_Body">
                  {dataMapping.map((r) => (
                    <tr
                      key={r.rackName}
                      className={`DAT_BatteryMobile_RackList_Table_Main_Body_Row`}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedRack(r);
                        setIsModalOpen(true);
                      }}
                    >
                      <td className="DAT_BatteryMobile_RackList_Table_Main_Body_Row_Cell DAT_Battery_RackList_Table_Main_Body_Row_Cell--medium">{r.rackName.toUpperCase()}</td>
                      <td className="DAT_BatteryMobile_RackList_Table_Main_Body_Row_Cell">
                        <StatusBadge status={r.status.statusName} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {isModalOpen && lang && (
            <div className="DAT_ModalMobile_Overlay" onClick={() => setIsModalOpen(false)}>
              <div
                className="DAT_ModalMobile_Overlay_Box"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="DAT_ModalMobile_Overlay_Box_Header">
                  <h2>{selectedRack.rackName_.toUpperCase()} - {lang.formatMessage({ id: "bms_rack_detail" })}</h2>
                  <button
                    className="DAT_ModalMobile_Overlay_Box_Header_Close"
                    onClick={() => setIsModalOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                {/* KPI GRID */}
                <div className="DAT_ModalMobile_Overlay_Box_Grid">

                  <div className="DAT_ModalMobile_Overlay_Box_Grid_Card">
                    <span className="DAT_ModalMobile_Overlay_Box_Grid_Card_Label">SOC:</span>
                    <span className="DAT_ModalMobile_Overlay_Box_Grid_Card_Value">{selectedRack.soc}%</span>
                  </div>

                  <div className="DAT_ModalMobile_Overlay_Box_Grid_Card">
                    <span className="DAT_ModalMobile_Overlay_Box_Grid_Card_Label">SOH:</span>
                    <span className="DAT_ModalMobile_Overlay_Box_Grid_Card_Value">{selectedRack.soh}%</span>
                  </div>

                  <div className="DAT_ModalMobile_Overlay_Box_Grid_Card">
                    <span className="DAT_ModalMobile_Overlay_Box_Grid_Card_Label">{lang.formatMessage({ id: "bms_voltage" })}:</span>
                    <span className="DAT_ModalMobile_Overlay_Box_Grid_Card_Value">{selectedRack.voltage}V</span>
                  </div>

                  <div className="DAT_ModalMobile_Overlay_Box_Grid_Card">
                    <span className="DAT_ModalMobile_Overlay_Box_Grid_Card_Label">{lang.formatMessage({ id: "bms_current" })}:</span>
                    <span className="DAT_ModalMobile_Overlay_Box_Grid_Card_Value">{selectedRack.current}A</span>
                  </div>

                  <div className="DAT_ModalMobile_Overlay_Box_Grid_Card">
                    <span className="DAT_ModalMobile_Overlay_Box_Grid_Card_Label">{lang.formatMessage({ id: "bms_min_temp" })}:</span>
                    <span className="DAT_ModalMobile_Overlay_Box_Grid_Card_Value">{selectedRack.minimumCellTemperature}°C</span>
                  </div>

                  <div className="DAT_ModalMobile_Overlay_Box_Grid_Card">
                    <span className="DAT_ModalMobile_Overlay_Box_Grid_Card_Label">{lang.formatMessage({ id: "bms_max_temp" })}:</span>
                    <span className="DAT_ModalMobile_Overlay_Box_Grid_Card_Value">{selectedRack.maximumCellTemperature}°C</span>
                  </div>

                  <div className="DAT_ModalMobile_Overlay_Box_Grid_Card">
                    <span className="DAT_ModalMobile_Overlay_Box_Grid_Card_Label">{lang.formatMessage({ id: "bms_min_voltage" })}:</span>
                    <span className="DAT_ModalMobile_Overlay_Box_Grid_Card_Value">{selectedRack.minimumCellVoltage}V</span>
                  </div>

                  <div className="DAT_ModalMobile_Overlay_Box_Grid_Card">
                    <span className="DAT_ModalMobile_Overlay_Box_Grid_Card_Label">{lang.formatMessage({ id: "bms_max_voltage" })}:</span>
                    <span className="DAT_ModalMobile_Overlay_Box_Grid_Card_Value">{selectedRack.maximumCellVoltage}V</span>
                  </div>

                </div>

                <div className="DAT_ModalMobile_Overlay_Box_Module">
                  {selectedRack.module.map((m) => {
                    return (
                      <div className="DAT_ModalMobile_Overlay_Box_Module_Card" onClick={() => {
                        setIsModalOpen(false)
                        setIsModalModuleOpen(true)
                        setSelectedModule(m);
                      }}>
                        <span className="DAT_ModalMobile_Overlay_Box_Module_Card_Value">{m.moduleName}</span>
                      </div>
                    )
                  })}
                </div>

              </div>
            </div>
          )}

          {isModelModuleOpen && selectedModule && (
            <div className="DAT_ModalMobile_Overlay" onClick={() => setIsModalModuleOpen(false)}>
              <div
                className="DAT_ModalMobile_Overlay_BoxCell"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="DAT_ModalMobile_Overlay_BoxCell_Header">
                  <div className="DAT_ModalMobile_Overlay_BoxCell_Header_Back" onClick={() => {
                    setIsModalModuleOpen(false)
                    setIsModalOpen(true)
                  }}>
                    <div className="DAT_ModalMobile_Overlay_BoxCell_Header_Back_Icon">
                      <FaArrowLeftLong size={20} />
                    </div>
                    <h2>{selectedRack.rackName} - {selectedModule.moduleName} - Cells</h2>
                  </div>
                  <button
                    className="DAT_ModalMobile_Overlay_BoxCell_Header_Close"
                    onClick={() => setIsModalModuleOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="DAT_ModalMobile_Overlay_BoxCell_Cell">
                  {selectedModule.cells.map((cell) => {
                    return (
                      <div className={cell.cellTemperature <= 35 ? `DAT_Modal_Overlay_BoxCell_Cell_Card` : "DAT_Modal_Overlay_BoxCell_Cell_Card--High"}>
                        <div className="DAT_ModalMobile_Overlay_BoxCell_Cell_Card_Header">
                          <span className="DAT_ModalMobile_Overlay_BoxCell_Cell_Card_Header_Title">{cell.cellName}</span>
                          <div className="DAT_ModalMobile_Overlay_BoxCell_Cell_Card_Header_Status">
                            <span className="DAT_ModalMobile_Overlay_BoxCell_Cell_Card_Header_Status_Label">{lang.formatMessage({ id: "bms_temp" })}</span>
                            <span className={cell.cellTemperature <= 35 ? `DAT_ModalMobile_Overlay_BoxCell_Cell_Card_Header_Status_Value` : "DAT_ModalMobile_Overlay_BoxCell_Cell_Card_Header_Status_Value_High"}>
                              {cell.cellTemperature}°C
                            </span>
                          </div>
                        </div>
                        <div className="DAT_ModalMobile_Overlay_BoxCell_Cell_Card_Stats">
                          <div className="DAT_ModalMobile_Overlay_BoxCell_Cell_Card_Stats_Item">
                            <span className="DAT_ModalMobile_Overlay_BoxCell_Cell_Card_Stats_Item_Label">{lang.formatMessage({ id: "bms_voltage" })}:</span>
                            <span className="DAT_ModalMobile_Overlay_BoxCell_Cell_Card_Stats_Item_Value">{cell.cellVoltage}V</span>
                          </div>
                          <div className="">
                            <span className="DAT_ModalMobile_Overlay_BoxCell_Cell_Card_Stats_Item_Label">Soc</span>
                            <span className="DAT_ModalMobile_Overlay_BoxCell_Cell_Card_Stats_Item_Value">{cell.cellSoc}%</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="DAT_Battery">
          <div className="DAT_Battery_Overview">
            {mockContainers.map((c) => (
              <div
                key={c.id}
                className={`DAT_Battery_Overview_Card`}
                onClick={() => {
                  setSelectedContainer(c);
                  setSelectedRack(null);
                }}
              >
                <div className="DAT_Battery_Overview_Card_Header">
                  <div className="DAT_Battery_Overview_Card_Header_BoxTitle">
                    <div className="DAT_Battery_Overview_Card_Header_BoxTitle_Title">
                      <div className="DAT_Battery_Overview_Card_Header_BoxTitle_Title_Icon">
                        <RiBatteryChargeLine size={30} />

                      </div>
                      <div className="DAT_Battery_Overview_Card_Header_BoxTitle_Title_Label">{lang.formatMessage({ id: "bms_level" })}</div>
                    </div>
                    <StatusBadge status={batteryStatus[parseInt(dataInf?.['43-1'])] ?? 0} />
                  </div>

                  <div className="DAT_Battery_Overview_Card_Header_Box">
                    <div className="DAT_Battery_Overview_Card_Header_Box_Item">
                      <div className="DAT_Battery_Overview_Card_Header_Box_Item_Label">SoC:</div>
                      <div className="DAT_Battery_Overview_Card_Header_Box_Item_Value">{parseInt(dataInf?.['4-1']) || 0}%</div>
                    </div>

                    <div className="DAT_Battery_Overview_Card_Header_Box_Item">
                      <div className="DAT_Battery_Overview_Card_Header_Box_Item_Label">SoH:</div>
                      <div className="DAT_Battery_Overview_Card_Header_Box_Item_Value">{parseInt(dataInf?.['5-1']) || 0}%</div>
                    </div>

                    <div className="DAT_Battery_Overview_Card_Header_Box_Item">
                      <div className="DAT_Battery_Overview_Card_Header_Box_Item_Label">{lang.formatMessage({ id: "bms_max_temp" })}:</div>
                      <div className="DAT_Battery_Overview_Card_Header_Box_Item_Value">{parseFloat(dataInf?.['12-1']) - 40}°C</div>
                    </div>
                    <div className="DAT_Battery_Overview_Card_Header_Box_Item">
                      <div className="DAT_Battery_Overview_Card_Header_Box_Item_Label">{lang.formatMessage({ id: "bms_min_temp" })}:</div>
                      <div className="DAT_Battery_Overview_Card_Header_Box_Item_Value">{parseFloat(dataInf?.['15-1']) - 40}°C</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="DAT_Battery_RackList">
            <div className="DAT_Battery_RackList_Header">
              <span className="DAT_Battery_RackList_Header_Title">
                {lang.formatMessage({ id: "bms_rack_list" })}
              </span>
              <div className="DAT_Battery_RackList_Filter">
                <div className="DAT_Battery_RackList_Filter_Search" style={{ width: 180 }}>
                  <span className="DAT_Battery_RackList_Filter_Search_Icon">
                    <LuSearch />
                  </span>
                  <input
                    className="DAT_Battery_RackList_Filter_Search_Input"
                    style={{ height: 36 }}
                    placeholder={lang.formatMessage({ id: "bms_search" })}
                    value={searchRack}
                    onChange={(e) => setSearchRack(e.target.value)}
                  />
                </div>
                <select
                  className="DAT_Battery_RackList_Filter_Select"
                  style={{ width: 130, height: 36 }}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">{lang.formatMessage({ id: "bms_all_status" })}</option>
                  <option value="Normal">{lang.formatMessage({ id: "bms_status_normal" })}</option>
                  <option value="Warning">{lang.formatMessage({ id: "bms_status_warning" })}</option>
                  <option value="Fault">{lang.formatMessage({ id: "bms_status_fault" })}</option>
                </select>
              </div>
            </div>
            <div className="DAT_Battery_RackList_Table">
              <table className="DAT_Battery_RackList_Table_Main">
                <thead className="DAT_Battery_RackList_Table_Main_Head">
                  <tr>
                    <th className="DAT_Battery_RackList_Table_Main_Head_Th">Rack</th>
                    <th className="DAT_Battery_RackList_Table_Main_Head_Th"> {lang.formatMessage({ id: "bms_status" })}</th>
                    <th className="DAT_Battery_RackList_Table_Main_Head_Th">{lang.formatMessage({ id: "bms_voltage" })}</th>
                    <th className="DAT_Battery_RackList_Table_Main_Head_Th">{lang.formatMessage({ id: "bms_current" })}</th>
                    <th className="DAT_Battery_RackList_Table_Main_Head_Th">SOC</th>
                    <th className="DAT_Battery_RackList_Table_Main_Head_Th">SOH</th>
                    <th className="DAT_Battery_RackList_Table_Main_Head_Th">{lang.formatMessage({ id: "bms_temp" })}</th>
                  </tr>
                </thead>
                <tbody className="DAT_Battery_RackList_Table_Main_Body">
                  {dataMapping.map((r) => (
                    <tr
                      key={r.rackName}
                      className={`DAT_Battery_RackList_Table_Main_Body_Row`}
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedRack(r);
                        setIsModalOpen(true);
                      }}
                    >
                      <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell DAT_Battery_RackList_Table_Main_Body_Row_Cell--medium">{r.rackName.toUpperCase()}</td>
                      <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">
                        <StatusBadge status={r.status.statusName} />
                      </td>
                      <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">{r.voltage}V</td>
                      <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">{r.current}A</td>
                      <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">{r.soc}%</td>
                      <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">{r.soh}%</td>
                      <td className="DAT_Battery_RackList_Table_Main_Body_Row_Cell">{r.temperature}°C</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {isModalOpen && lang && (
            <div className="DAT_Modal_Overlay" onClick={() => setIsModalOpen(false)}>
              <div
                className="DAT_Modal_Overlay_Box"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="DAT_Modal_Overlay_Box_Header">
                  <h2>{selectedRack.rackName.toUpperCase()} - {lang.formatMessage({ id: "bms_rack_detail" })}</h2>
                  <button
                    className="DAT_Modal_Overlay_Box_Header_Close"
                    onClick={() => setIsModalOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                {/* KPI GRID */}
                <div className="DAT_Modal_Overlay_Box_Grid">

                  <div className="DAT_Modal_Overlay_Box_Grid_Card">
                    <span className="DAT_Modal_Overlay_Box_Grid_Card_Label">SOC:</span>
                    <span className="DAT_Modal_Overlay_Box_Grid_Card_Value">{selectedRack.soc}%</span>
                  </div>

                  <div className="DAT_Modal_Overlay_Box_Grid_Card">
                    <span className="DAT_Modal_Overlay_Box_Grid_Card_Label">SOH:</span>
                    <span className="DAT_Modal_Overlay_Box_Grid_Card_Value">{selectedRack.soh}%</span>
                  </div>

                  <div className="DAT_Modal_Overlay_Box_Grid_Card">
                    <span className="DAT_Modal_Overlay_Box_Grid_Card_Label">{lang.formatMessage({ id: "bms_voltage" })}:</span>
                    <span className="DAT_Modal_Overlay_Box_Grid_Card_Value">{selectedRack.voltage}V</span>
                  </div>

                  <div className="DAT_Modal_Overlay_Box_Grid_Card">
                    <span className="DAT_Modal_Overlay_Box_Grid_Card_Label">{lang.formatMessage({ id: "bms_current" })}:</span>
                    <span className="DAT_Modal_Overlay_Box_Grid_Card_Value">{selectedRack.current}A</span>
                  </div>

                  <div className="DAT_Modal_Overlay_Box_Grid_Card">
                    <span className="DAT_Modal_Overlay_Box_Grid_Card_Label">{lang.formatMessage({ id: "bms_min_temp" })}:</span>
                    <span className="DAT_Modal_Overlay_Box_Grid_Card_Value">{selectedRack.minimumCellTemperature}°C</span>
                  </div>

                  <div className="DAT_Modal_Overlay_Box_Grid_Card">
                    <span className="DAT_Modal_Overlay_Box_Grid_Card_Label">{lang.formatMessage({ id: "bms_max_temp" })}:</span>
                    <span className="DAT_Modal_Overlay_Box_Grid_Card_Value">{selectedRack.maximumCellTemperature}°C</span>
                  </div>

                  <div className="DAT_Modal_Overlay_Box_Grid_Card">
                    <span className="DAT_Modal_Overlay_Box_Grid_Card_Label">{lang.formatMessage({ id: "bms_min_voltage" })}:</span>
                    <span className="DAT_Modal_Overlay_Box_Grid_Card_Value">{selectedRack.minimumCellVoltage}V</span>
                  </div>

                  <div className="DAT_Modal_Overlay_Box_Grid_Card">
                    <span className="DAT_Modal_Overlay_Box_Grid_Card_Label">{lang.formatMessage({ id: "bms_max_voltage" })}:</span>
                    <span className="DAT_Modal_Overlay_Box_Grid_Card_Value">{selectedRack.maximumCellVoltage}V</span>
                  </div>

                </div>

                <div className="DAT_Modal_Overlay_Box_Module">
                  {selectedRack.module.map((m) => {
                    return (
                      <div className="DAT_Modal_Overlay_Box_Module_Card" onClick={() => {
                        setIsModalOpen(false)
                        setIsModalModuleOpen(true)
                        setSelectedModule(m);
                      }}>
                        <span className="DAT_Modal_Overlay_Box_Module_Card_Value">{m.moduleName}</span>
                      </div>
                    )
                  })}
                </div>

              </div>
            </div>
          )}

          {isModelModuleOpen && selectedModule && (
            <div className="DAT_Modal_Overlay" onClick={() => setIsModalModuleOpen(false)}>
              <div
                className="DAT_Modal_Overlay_BoxCell"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="DAT_Modal_Overlay_BoxCell_Header">
                  <div className="DAT_Modal_Overlay_BoxCell_Header_Back" onClick={() => {
                    setIsModalModuleOpen(false)
                    setIsModalOpen(true)
                  }}>
                    <div className="DAT_Modal_Overlay_BoxCell_Header_Back_Icon">
                      <FaArrowLeftLong size={20} />
                    </div>
                    <h2>{selectedRack.rackName} - {selectedModule.moduleName} - Cells</h2>
                  </div>
                  <button
                    className="DAT_Modal_Overlay_BoxCell_Header_Close"
                    onClick={() => setIsModalModuleOpen(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="DAT_Modal_Overlay_BoxCell_Cell">
                  {selectedModule.cells.map((cell) => {
                    return (
                      <div className={cell.cellTemperature <= 35 ? `DAT_Modal_Overlay_BoxCell_Cell_Card` : "DAT_Modal_Overlay_BoxCell_Cell_Card--High"}>
                        <div className="DAT_Modal_Overlay_BoxCell_Cell_Card_Header">
                          <span className="DAT_Modal_Overlay_BoxCell_Cell_Card_Header_Title">{cell.cellName}</span>
                          <div className="DAT_Modal_Overlay_BoxCell_Cell_Card_Header_Status">
                            <span className="DAT_Modal_Overlay_BoxCell_Cell_Card_Header_Status_Label">{lang.formatMessage({ id: "bms_temp" })}</span>
                            <span className={cell.cellTemperature <= 35 ? `DAT_Modal_Overlay_BoxCell_Cell_Card_Header_Status_Value` : "DAT_Modal_Overlay_BoxCell_Cell_Card_Header_Status_Value_High"}>
                              {cell.cellTemperature}°C
                            </span>
                          </div>
                        </div>
                        <div className="DAT_Modal_Overlay_BoxCell_Cell_Card_Stats">
                          <div className="DAT_Modal_Overlay_BoxCell_Cell_Card_Stats_Item">
                            <span className="DAT_Modal_Overlay_BoxCell_Cell_Card_Stats_Item_Label">{lang.formatMessage({ id: "bms_voltage" })}:</span>
                            <span className="DAT_Modal_Overlay_BoxCell_Cell_Card_Stats_Item_Value">{cell.cellVoltage}V</span>
                          </div>
                          <div className="">
                            <span className="DAT_Modal_Overlay_BoxCell_Cell_Card_Stats_Item_Label">Soc</span>
                            <span className="DAT_Modal_Overlay_BoxCell_Cell_Card_Stats_Item_Value">{cell.cellSoc}%</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
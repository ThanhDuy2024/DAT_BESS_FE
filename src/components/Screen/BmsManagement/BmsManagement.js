import "./BmsManagement.scss"
import { toast } from "sonner";
import { useIntl } from "react-intl";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { LuBatteryFull } from "react-icons/lu";
import { callApi } from "../../Api/Api"
import Modal from "../../Modal/Modal";
import { RackContext } from "../../contexts/RackContext";
import { FiEdit3 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const BmsManagement = () => {
    const navigate = useNavigate();
    const lang = useIntl();
    const { rackData, rackDispatch } = useContext(RackContext);
    const [modalType, setModalType] = useState(null);
    const [createRack, setCreateRack] = useState({});
    const [createModule, setCreateModule] = useState({});
    const [rackId, setRackId] = useState(null);
    const [selectedRack, setSelectedRack] = useState(null);
    const [selectedValue, setSelectedValue] = useState(null);

    const [tempValue, setTempValue] = useState({
        scale: null,
        offset: null,
        type: null
    });
    const [voltage, setVoltage] = useState({})
    const [current, setCurrent] = useState({})
    const [temperature, setTemperature] = useState({})
    const [soc, setSoc] = useState({})
    const [soh, setSoh] = useState({})
    const [maximumCellVoltage, setMaximumCellVoltage] = useState({})
    const [minimumCellVoltage, setMinimumCellVoltage] = useState({})
    const [maximumCellTemperature, setMaximumCellTemperature] = useState({})
    const [minimumCellTemperature, setMinimumCellTemperature] = useState({})
    const [cellVoltage, setCellVoltage] = useState({})
    const [cellTemperature, setCellTemperature] = useState({})
    const [cellSoc, setCellSoc] = useState({})
    const [cellSoh, setCellSoh] = useState({})

    const signals = {
        voltage: {
            value: voltage,
            setValue: setVoltage,
        },
        current: {
            value: current,
            setValue: setCurrent,
        },
        temperature: {
            value: temperature,
            setValue: setTemperature,
        },
        soc: {
            value: soc,
            setValue: setSoc,
        },
        soh: {
            value: soh,
            setValue: setSoh,
        },
        maximumCellVoltage: {
            value: maximumCellVoltage,
            setValue: setMaximumCellVoltage,
        },
        minimumCellVoltage: {
            value: minimumCellVoltage,
            setValue: setMinimumCellVoltage,
        },
        maximumCellTemperature: {
            value: maximumCellTemperature,
            setValue: setMaximumCellTemperature,
        },
        minimumCellTemperature: {
            value: minimumCellTemperature,
            setValue: setMinimumCellTemperature,
        },
        cellVoltage: {
            value: cellVoltage,
            setValue: setCellVoltage
        },
        cellTemperature: {
            value: cellTemperature,
            setValue: setCellTemperature
        },
        cellSoc: {
            value: cellSoc,
            setValue: setCellSoc
        },
        cellSoh: {
            value: cellSoh,
            setValue: setCellSoh
        },
    };

    const labelsRack = ["voltage", "current", "temperature", "soc", "soh", "maximumCellVoltage", "minimumCellVoltage", "maximumCellTemperature", "minimumCellTemperature"];
    const labelsModule = ["voltage", "temperature", "soc", "soh"]
    useEffect(() => {
        (async () => {
            const res = await callApi('get', `${process.env.REACT_APP_APIDEV}/data/getAllRack`, {});
            if (res.status === false) {
                console.log("Failed to get data");
            } else {
                rackDispatch({
                    type: "LOAD_RACK_DATA",
                    payload: {
                        rackData: res.data
                    }
                })
            }
        })()
    }, []);
    useEffect(() => {
        if (modalType === null) {
            setVoltage({
                scale: 0.1,
                offset: 0,
                type: "word"
            })
            setCurrent({
                scale: 0.1,
                offset: -3200,
                type: "word"
            })

            setTemperature({
                scale: 1,
                offset: -40,
                type: "word"
            })

            setSoc({
                scale: 1,
                offset: 0,
                type: "word"
            })
            setSoh({
                scale: 1,
                offset: 0,
                type: "word"
            })

            setMaximumCellVoltage({
                scale: 0.001,
                offset: 0,
                type: "word"
            })
            setMinimumCellVoltage({
                scale: 0.001,
                offset: 0,
                type: "word"
            })

            setMaximumCellTemperature({
                scale: 1,
                offset: -40,
                type: "word"
            })
            setMinimumCellTemperature({
                scale: 1,
                offset: -40,
                type: "word"
            })
            setCellVoltage({
                scale: 0.001,
                offset: 0,
                type: "word"
            })
            setCellTemperature({
                scale: 1,
                offset: -40,
                type: "word"
            })
            setCellSoc({
                scale: 1,
                offset: 0,
                type: "word"
            })
            setCellSoh({
                scale: 1,
                offset: 0,
                type: "word"
            })
            setCreateRack({})
            setCreateModule({})
        }
    }, [modalType]);
    const handleCreateRack = async () => {
        try {
            if (Object.keys(createRack).length === 0) {
                toast.error(lang.formatMessage({ id: "toast_error_data" }))
                return;
            }
            const res = await callApi("post", `${process.env.REACT_APP_APIDEV}/data/v2/createRack`, {
                rackName: createRack.rackName,
                model: createRack.model,
                brand: createRack.brand,
                voltage: voltage,
                current: current,
                temperature: temperature,
                soc: soc,
                soh: soh,
                maximumCellVoltage: maximumCellVoltage,
                minimumCellVoltage: minimumCellVoltage,
                maximumCellTemperature: maximumCellTemperature,
                minimumCellTemperature: minimumCellTemperature
            });
            if (res.status === false) {
                toast.error(res.msg);
            } else {
                toast.success(lang.formatMessage({ id: "toast_created" }));
                setModalType(null)
                rackDispatch({
                    type: "CREATE_RACK_DATA",
                    payload: {
                        rackData: {
                            id_: res.data.id_,
                            rack_name_: res.data.rack_name_,
                            model_: res.data.model_,
                            brand_: res.data.brand_,
                            start_rack_address_: res.data.start_rack_address_,
                            total_module_: 0,
                        }
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleCreateModule = async () => {
        try {
            if (Object.keys(createModule).length === 0) {
                toast.error(lang.formatMessage({ id: "toast_error_data" }))
                return;
            }
            const res = await callApi("post", `${process.env.REACT_APP_APIDEV}/data/v3/createModule`, {
                rackId: rackId,
                totalModules: Number(createModule.totalModules),
                totalCells: Number(createModule.totalCells),
                cellVoltage: cellVoltage,
                cellTemperature: cellTemperature,
                cellSoc: cellSoc,
                cellSoh: cellSoh
            });
            if (res.status === false) {
                toast.error(res.msg);
            } else {
                toast.success(lang.formatMessage({ id: "toast_created" }));
                setModalType(null)
                rackDispatch({
                    type: "CREATE_RACK_MODULE_DATA",
                    payload: {
                        rackId: rackId,
                        totalModules: Number(createModule.totalModules),
                    }
                })
            }
        } catch (error) {
            toast.error(lang.formatMessage({ id: "toast_cell_error" }))
            console.log(error);
        }
    }
    const handleSaveValueRack = () => {
        signals[selectedValue].setValue(prev => ({
            ...prev,
            scale: tempValue.scale === null ? prev.scale : tempValue.scale,
            offset: tempValue.offset === null ? prev.offset : tempValue.offset,
            type: tempValue.type === null ? prev.type : tempValue.type,
        }));
        setModalType("add");
    }
    const handleSaveValueModule = () => {
        signals[selectedValue].setValue(prev => ({
            ...prev,
            scale: tempValue.scale === null ? prev.scale : tempValue.scale,
            offset: tempValue.offset === null ? prev.offset : tempValue.offset,
            type: tempValue.type === null ? prev.type : tempValue.type,
        }));
        setModalType("addModule");
    }

    const renderModalAdd = () => {
        return (
            <div className="DAT_Bms_Form_Grid">
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "bms_rack_name" })}
                    </label>
                    <input
                        className="DAT_Bms_Form_Grid_Group_Input"
                        onChange={(e) => setCreateRack({ ...createRack, rackName: e.target.value })}
                    />
                </div>
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "bms_rack_model" })}
                    </label>
                    <input
                        className="DAT_Bms_Form_Grid_Group_Input"
                        onChange={(e) => setCreateRack({ ...createRack, model: e.target.value })}
                    />
                </div>
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "bms_rack_brand" })}
                    </label>
                    <input
                        className="DAT_Bms_Form_Grid_Group_Input"
                        onChange={(e) => setCreateRack({ ...createRack, brand: e.target.value })}
                    />
                </div>
                {labelsRack.map((item) => (
                    <div className="DAT_Bms_Form_Grid_Box" onClick={() => { setModalType("editValueRack"); setSelectedValue(item) }}>
                        <div className="DAT_Bms_Form_Grid_Box_Label">
                            {lang.formatMessage({ id: `${item}` })}
                        </div>
                        <div className="DAT_Bms_Form_Grid_Box_Content">
                            <div className="DAT_Bms_Form_Grid_Box_Content_Label">Scale: </div>
                            <div className="DAT_Bms_Form_Grid_Box_Content_Value">{signals[item].value.scale}</div>
                        </div>
                        <div className="DAT_Bms_Form_Grid_Box_Content">
                            <div className="DAT_Bms_Form_Grid_Box_Content_Label">Offset: </div>
                            <div className="DAT_Bms_Form_Grid_Box_Content_Value">{signals[item].value.offset}</div>
                        </div>
                        <div className="DAT_Bms_Form_Grid_Box_Content">
                            <div className="DAT_Bms_Form_Grid_Box_Content_Label">Type: </div>
                            <div className="DAT_Bms_Form_Grid_Box_Content_Value">{signals[item].value.type}</div>
                        </div>
                    </div>
                ))}


            </div>
        )
    };

    const renderEditValueRack = () => {
        return (
            <div className="DAT_Bms_Form_Grid">
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "scale" })}
                    </label>
                    <input
                        className="DAT_Bms_Form_Grid_Group_Input"
                        defaultValue={signals[selectedValue].value.scale}
                        onChange={(e) =>
                            setTempValue((prev) => ({
                                ...prev,
                                scale: Number(e.target.value),
                            }))
                        }
                    />
                </div>
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "offset" })}
                    </label>
                    <input
                        className="DAT_Bms_Form_Grid_Group_Input"
                        defaultValue={signals[selectedValue].value.offset}
                        onChange={(e) =>
                            setTempValue((prev) => ({
                                ...prev,
                                offset: Number(e.target.value),
                            }))
                        }
                    />
                </div>
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "type" })}
                    </label>
                    <input
                        className="DAT_Bms_Form_Grid_Group_Input"
                        defaultValue={signals[selectedValue].value.type}
                        onChange={(e) =>
                            setTempValue((prev) => ({
                                ...prev,
                                type: e.target.value,
                            }))
                        }
                    />
                </div>
            </div>
        )
    }

    const renderEditValueModule = () => {
        return (
            <div className="DAT_Bms_Form_Grid">
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "scale" })}
                    </label>
                    <input
                        className="DAT_Bms_Form_Grid_Group_Input"
                        defaultValue={signals[selectedValue].value.scale}
                        onChange={(e) =>
                            setTempValue((prev) => ({
                                ...prev,
                                scale: Number(e.target.value),
                            }))
                        }
                    />
                </div>
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "offset" })}
                    </label>
                    <input
                        className="DAT_Bms_Form_Grid_Group_Input"
                        defaultValue={signals[selectedValue].value.offset}
                        onChange={(e) =>
                            setTempValue((prev) => ({
                                ...prev,
                                offset: Number(e.target.value),
                            }))
                        }
                    />
                </div>
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "type" })}
                    </label>
                    <input
                        className="DAT_Bms_Form_Grid_Group_Input"
                        defaultValue={signals[selectedValue].value.type}
                        onChange={(e) =>
                            setTempValue((prev) => ({
                                ...prev,
                                type: e.target.value,
                            }))
                        }
                    />
                </div>
            </div>
        )
    }

    const renderModalAddModule = () => {
        return (
            <div className="DAT_Bms_Form_Grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }
            }>
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "bms_module_total" })}
                    </label>
                    <input
                        className="DAT_Bms_Form_Grid_Group_Input"
                        onChange={(e) => setCreateModule({ ...createModule, totalModules: e.target.value })}
                    />
                </div>
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "bms_total_cell" })}
                    </label>
                    <input
                        className="DAT_Bms_Form_Grid_Group_Input"
                        max={10}
                        onChange={(e) => setCreateModule({ ...createModule, totalCells: e.target.value })}
                    />
                </div>
                {labelsModule.map((item) => (
                    <div className="DAT_Bms_Form_Grid_Box" onClick={() => { setModalType("editValueModule"); setSelectedValue(item) }}>
                        <div className="DAT_Bms_Form_Grid_Box_Label">
                            {lang.formatMessage({ id: `${item}` })}
                        </div>
                        <div className="DAT_Bms_Form_Grid_Box_Content">
                            <div className="DAT_Bms_Form_Grid_Box_Content_Label">Scale: </div>
                            <div className="DAT_Bms_Form_Grid_Box_Content_Value">{signals[item].value.scale}</div>
                        </div>
                        <div className="DAT_Bms_Form_Grid_Box_Content">
                            <div className="DAT_Bms_Form_Grid_Box_Content_Label">Offset: </div>
                            <div className="DAT_Bms_Form_Grid_Box_Content_Value">{signals[item].value.offset}</div>
                        </div>
                        <div className="DAT_Bms_Form_Grid_Box_Content">
                            <div className="DAT_Bms_Form_Grid_Box_Content_Label">Type: </div>
                            <div className="DAT_Bms_Form_Grid_Box_Content_Value">{signals[item].value.type}</div>
                        </div>
                    </div>
                ))}
            </div>
        )
    };

    const renderModalEditRack = () => {
        return (
            <div className="DAT_Bms_Form_Grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }
            }>
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "bms_rack_id" })}
                    </label>
                    <input
                        className="DAT_Bms_Form_Grid_Group_Input"
                        disabled
                        value={`RACK-${selectedRack.id_ >= 10 ? `0${selectedRack.id_}` : `00${selectedRack.id_}`}`}                    // onChange={(e) => setCreateModule({ ...createModule, totalModules: e.target.value })}
                    />
                </div>
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "bms_start_address" })}
                    </label>
                    <input
                        className="DAT_Bms_Form_Grid_Group_Input"
                        disabled
                        value={selectedRack.start_rack_address_}
                    />
                </div>
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "bms_rack_name" })}
                    </label>
                    <input
                        className="DAT_Bms_Form_Grid_Group_Input"
                        value={selectedRack.rack_name_}
                    />
                </div>
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "bms_model_name" })}
                    </label>
                    <input
                        className="DAT_Bms_Form_Grid_Group_Input"
                        value={selectedRack.model_}
                    />
                </div>
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "bms_brand_name" })}
                    </label>
                    <input
                        className="DAT_Bms_Form_Grid_Group_Input"
                        value={selectedRack.brand_}
                    />
                </div>
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "bms_total_modules" })}
                    </label>
                    <div className="DAT_Bms_Form_Grid_Group_Box">
                        <input
                            className="DAT_Bms_Form_Grid_Group_Input"
                            disabled
                            value={selectedRack.total_module_}
                        />
                        <div className="DAT_Bms_Form_Grid_Group_Icon"
                            onClick={() => setModalType("editModule")}
                        ><FiEdit3 />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const renderModalEditModule = () => {
        return (
            <div className="DAT_Bms_Form_Grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }
            }>
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "bms_module_total" })}
                    </label>
                    <input
                        className="DAT_Bms_Form_Grid_Group_Input"
                        value={selectedRack.total_module_}
                        onChange={(e) => setCreateModule({ ...createModule, totalModules: e.target.value })}
                    />
                </div>
                <div className="DAT_Bms_Form_Grid_Group">
                    <label className="DAT_Bms_Form_Grid_Group_Label">
                        {lang.formatMessage({ id: "bms_total_cell" })}
                    </label>
                    <input
                        className="DAT_Bms_Form_Grid_Group_Input"
                        onChange={(e) => setCreateModule({ ...createModule, totalCells: e.target.value })}
                    />
                </div>
                {labelsModule.map((item) => (
                    <div className="DAT_Bms_Form_Grid_Box" onClick={() => { setModalType("editValueModule"); setSelectedValue(item) }}>
                        <div className="DAT_Bms_Form_Grid_Box_Label">
                            {lang.formatMessage({ id: `${item}` })}
                        </div>
                        <div className="DAT_Bms_Form_Grid_Box_Content">
                            <div className="DAT_Bms_Form_Grid_Box_Content_Label">Scale: </div>
                            <div className="DAT_Bms_Form_Grid_Box_Content_Value">{signals[item].value.scale}</div>
                        </div>
                        <div className="DAT_Bms_Form_Grid_Box_Content">
                            <div className="DAT_Bms_Form_Grid_Box_Content_Label">Offset: </div>
                            <div className="DAT_Bms_Form_Grid_Box_Content_Value">{signals[item].value.offset}</div>
                        </div>
                        <div className="DAT_Bms_Form_Grid_Box_Content">
                            <div className="DAT_Bms_Form_Grid_Box_Content_Label">Type: </div>
                            <div className="DAT_Bms_Form_Grid_Box_Content_Value">{signals[item].value.type}</div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    const renderTitle = () => {
        switch (modalType) {
            case "add":
                return lang.formatMessage({ id: "bms_modal_create_title" });
            case "addModule":
                return lang.formatMessage({ id: "bms_modal_create_module_title" });
            case "editRack":
                return lang.formatMessage({ id: "bms_modal_edit_rack_title" });
            case "editModule":
                return lang.formatMessage({ id: "bms_modal_edit_module_title" });
            case "editValueRack":
                return lang.formatMessage({ id: "bms_modal_edit_value_rack_title" });
            case "editValueModule":
                return lang.formatMessage({ id: "bms_modal_edit_value_module_title" });
            default:
                return "";
        }
    };

    const renderFooter = () => {
        switch (modalType) {
            case "add":
                return (
                    <>
                        <button
                            className="DAT_Bms_Modal_Footer_Button_Secondary"
                            onClick={() => setModalType(null)}
                        >
                            {lang.formatMessage({ id: "modal_cancel" })}
                        </button>
                        <button
                            className="DAT_Bms_Modal_Footer_Button_Primary"
                            onClick={() => handleCreateRack()}
                        >
                            {lang.formatMessage({ id: "modal_save" })}
                        </button>
                    </>
                );
            case "addModule":
                return (
                    <>
                        <button
                            className="DAT_Bms_Modal_Footer_Button_Secondary"
                            onClick={() => setModalType(null)}
                        >
                            {lang.formatMessage({ id: "modal_cancel" })}
                        </button>
                        <button
                            className="DAT_Bms_Modal_Footer_Button_Primary"
                            onClick={() => handleCreateModule()}
                        >
                            {lang.formatMessage({ id: "modal_save" })}
                        </button>
                    </>
                );
            case "editRack":
                return (
                    <>
                        <button
                            className="DAT_Bms_Modal_Footer_Button_Secondary"
                            onClick={() => setModalType(null)}
                        >
                            {lang.formatMessage({ id: "modal_cancel" })}
                        </button>
                        <button
                            className="DAT_Bms_Modal_Footer_Button_Primary"
                        // onClick={() => handleCreateModule()}
                        >
                            {lang.formatMessage({ id: "modal_save" })}
                        </button>
                    </>
                );
            case "editModule":
                return (
                    <>
                        <button
                            className="DAT_Bms_Modal_Footer_Button_Secondary"
                            onClick={() => setModalType(null)}
                        >
                            {lang.formatMessage({ id: "modal_cancel" })}
                        </button>
                        <button
                            className="DAT_Bms_Modal_Footer_Button_Primary"
                        // onClick={() => handleCreateModule()}
                        >
                            {lang.formatMessage({ id: "modal_save" })}
                        </button>
                    </>
                );
            case "editValueRack":
                return (
                    <>
                        <button
                            className="DAT_Bms_Modal_Footer_Button_Secondary"
                            onClick={() => setModalType("add")}
                        >
                            {lang.formatMessage({ id: "go_back" })}
                        </button>
                        <button
                            className="DAT_Bms_Modal_Footer_Button_Primary"
                            onClick={() => handleSaveValueRack()}
                        >
                            {lang.formatMessage({ id: "modal_save" })}
                        </button>
                    </>
                )
            case "editValueModule":
                return (
                    <>
                        <button
                            className="DAT_Bms_Modal_Footer_Button_Secondary"
                            onClick={() => setModalType("addModule")}
                        >
                            {lang.formatMessage({ id: "go_back" })}
                        </button>
                        <button
                            className="DAT_Bms_Modal_Footer_Button_Primary"
                            onClick={() => handleSaveValueModule()}
                        >
                            {lang.formatMessage({ id: "modal_save" })}
                        </button>
                    </>
                )
            default:
                return null;
        }
    };

    const renderBody = () => {
        switch (modalType) {
            case "add":
                return renderModalAdd();
            case "addModule":
                return renderModalAddModule();
            case "editRack":
                return renderModalEditRack();
            case "editModule":
                return renderModalEditModule();
            case "editValueRack":
                return renderEditValueRack();
            case "editValueModule":
                return renderEditValueModule();
            default:
                return null;
        }
    };

    return (
        <div className="DAT_Bms">
            <div className="DAT_Bms_HeaderCard">
                <div className="DAT_Bms_HeaderCard_Main">
                    <div className="DAT_Bms_HeaderCard_Main_Icon">
                        <LuBatteryFull size={25} />
                    </div>
                    <div className="DAT_Bms_HeaderCard_Main_Title">
                        {lang.formatMessage({ id: "bms_management" })}
                    </div>
                </div>
                <button
                    className="DAT_Bms_Card_Actions_Button_Primary"
                    onClick={() => setModalType("add")}
                >
                    {lang.formatMessage({ id: "add_rack" })}
                </button>
            </div>

            <div className="DAT_Bms_Container">
                <div className="DAT_Bms_Container_Table">
                    <table className="DAT_Bms_Container_Table_Main">
                        <thead>
                            <tr style={{ textAlign: "center" }}>
                                <th>{lang.formatMessage({ id: "bms_rack_id" })}</th>
                                <th>{lang.formatMessage({ id: "bms_rack_name" })}</th>
                                <th>{lang.formatMessage({ id: "bms_rack_model" })}</th>
                                <th>{lang.formatMessage({ id: "bms_rack_brand" })}</th>
                                <th>{lang.formatMessage({ id: "bms_rack_start_address" })}</th>
                                <th>{lang.formatMessage({ id: "bms_rack_module" })}</th>
                                <th>{lang.formatMessage({ id: "bms_actions" })}</th>
                            </tr>
                        </thead>
                        <tbody className="DAT_Bms_Container_Table_Main_Body">
                            {rackData.map((item) => {
                                return (
                                    <tr className='DAT_Bms_Container_Table_Main_Row'>
                                        <td className="DAT_Bms_Container_Table_Main_Cell">
                                            RACK-{item.id >= 10 ? `0${item.id_}` : `00${item.id_}`}
                                        </td>
                                        <td className="DAT_Bms_Container_Table_Main_Cell">
                                            {item.rack_name_}
                                        </td>
                                        <td className="DAT_Bms_Container_Table_Main_Cell">
                                            {item.model_}
                                        </td>
                                        <td className="DAT_Bms_Container_Table_Main_Cell">
                                            {item.brand_}
                                        </td>
                                        <td className="DAT_Bms_Container_Table_Main_Cell">
                                            {item.start_rack_address_}
                                        </td>
                                        <td className="DAT_Bms_Container_Table_Main_Cell">
                                            {item.total_module_}
                                        </td>
                                        <td className="DAT_RoleSetting_Container_Table_Main_Cell">
                                            <div className='DAT_RoleSetting_Container_Table_Main_Cell_Action'>
                                                <button className='DAT_RoleSetting_Container_Table_Main_Cell_Action_Button'
                                                    onClick={() => { setModalType("addModule"); setRackId(item.id_) }}
                                                >
                                                    {lang.formatMessage({ id: "bms_add_module" })}
                                                </button>
                                                <button className='DAT_RoleSetting_Container_Table_Main_Cell_Action_Button'
                                                    // onClick={() => { setModalType("editRack"); setSelectedRack(item) }}
                                                    onClick={() => navigate(`/bms/rack/edit/${item.id_}`)}
                                                >
                                                    {lang.formatMessage({ id: "bms_edit" })}
                                                </button>
                                                <button className='DAT_RoleSetting_Container_Table_Main_Cell_Action_Button'
                                                >
                                                    {lang.formatMessage({ id: "bms_delete" })}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={modalType !== null}
                onClose={() => setModalType(null)}
                title={renderTitle()}
                footer={renderFooter()}
                size="large"
            >
                {renderBody()}
            </Modal>
        </div >
    )
}

export default BmsManagement;
import "./BmsEdit.scss"
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl"
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { callApi } from "../../Api/Api"

const BmsEdit = () => {
    const { id } = useParams();

    const navigate = useNavigate();
    const lang = useIntl();
    const labelsRack = ["status", "voltage", "current", "temperature", "soc", "soh", "maximumCellVoltage", "minimumCellVoltage", "maximumCellTemperature", "minimumCellTemperature"];
    // const rackInput = {
    //     rack_id_: 18,
    //     rack_name_: 'rack5level_4',
    //     model_: 'rack5level',
    //     brand_: 'hithitum',
    //     start_rack_address_: 12100,
    //     template_: {
    //         soc: { type: 'word', scale: 1, offset: 0, register: '12118-1' },
    //         soh: { type: 'word', scale: 1, offset: 0, register: '12119-1' },
    //         status: { type: 'word', scale: 0, offset: 0, register: '12100-1' },
    //         current: { type: 'word', scale: 0.1, offset: -3200, register: '12116-1' },
    //         voltage: { type: 'word', scale: 0.1, offset: 0, register: '12115-1' },
    //         temperature: { type: 'word', scale: 1, offset: -40, register: '12117-1' },
    //         maximumCellVoltage: { type: 'word', scale: 0.001, offset: 0, register: '12123-1' },
    //         minimumCellVoltage: { type: 'word', scale: 0.001, offset: 0, register: '12125-1' },
    //         maximumCellTemperature: { type: 'word', scale: 1, offset: -40, register: '12127-1' },
    //         minimumCellTemperature: { type: 'word', scale: 1, offset: -40, register: '12129-1' }
    //     }
    // }
    const [rack, setRack] = useState({});
    useEffect(() => {
        const loadRackDetail = async (id) => {
            try {
                const res = await callApi('get', `${process.env.REACT_APP_APIDEV}/data/rackDetail/${id}`, {});
                if (res && res.status === true) {
                    setRack(res.data)
                }
            } catch (error) {
                console.log("Error loading role detail:", error);
            }
        }
        loadRackDetail(id)
    }, []);



    const handleSubmit = async () => {
        console.log(rack.template_.status);
        try {
            const res = await callApi("post", `${process.env.REACT_APP_APIDEV}/data/editRack`, {
                rackId: rack.rack_id_,
                rackName: rack.rack_name_,
                model: rack.model_,
                brand: rack.brand_,
                status: rack.template_.status,
                voltage: rack.template_.voltage,
                current: rack.template_.current,
                temperature: rack.template_.temperature,
                soc: rack.template_.soc,
                soh: rack.template_.soh,
                maximumCellVoltage: rack.template_.maximumCellVoltage,
                minimumCellVoltage: rack.template_.minimumCellVoltage,
                maximumCellTemperature: rack.template_.maximumCellTemperature,
                minimumCellTemperature: rack.template_.minimumCellTemperature
            });
            if (res.status === false) {
                toast.error(res.msg);
            } else {
                toast.success(lang.formatMessage({ id: "toast_created" }));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <div className="DAT_BmsEdit">
                <div className="DAT_BmsEdit_HeaderCard">
                    <div className="DAT_BmsEdit_HeaderCard_Main">
                        <div className="DAT_BmsEdit_HeaderCard_Main_Icon">
                            {/* <LuSettings size={25} /> */}
                        </div>
                        <div className="DAT_BmsEdit_HeaderCard_Main_Title">
                            {lang.formatMessage({ id: "rack_edit_title" })}
                        </div>
                    </div>
                </div>
                <div className="DAT_BmsEdit_Main">
                    <div className="DAT_BmsEdit_Main_Title">Rack Information</div>
                    <div className="DAT_BmsEdit_Main_Information">
                        <div className="DAT_BmsEdit_Main_Information_Group">
                            <label>Rack Name</label>
                            <input
                                type="text"
                                placeholder="Enter rack name"
                                defaultValue={rack.rack_name_}
                                onChange={(e) =>
                                    setRack(prev => ({
                                        ...prev,
                                        rack_name_: e.target.value
                                    }))
                                }
                            />
                        </div>
                        <div className="DAT_BmsEdit_Main_Information_Group">
                            <label>Model Name</label>
                            <input
                                type="text"
                                placeholder="Enter model name"
                                value={rack.model_}
                            // onChange={(e) => setRoleName(e.target.value)}
                            />
                        </div>
                        <div className="DAT_BmsEdit_Main_Information_Group">
                            <label>Brand Name</label>
                            <input
                                type="text"
                                placeholder="Enter brand name"
                                value={rack.brand_}
                            // onChange={(e) => setRoleName(e.target.value)}
                            />
                        </div>
                        <div className="DAT_BmsEdit_Main_Information_Group">
                            <label>Start Address</label>
                            <input
                                type="text"
                                disabled
                                value={rack.start_rack_address_}
                            // onChange={(e) => setRoleName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="DAT_BmsEdit_Main_Title">Rack Template</div>
                    <div className="DAT_BmsEdit_Main_Edit">
                        {labelsRack.map((item) => (
                            <div className="DAT_BmsEdit_Main_Edit_Group">
                                <div className="DAT_BmsEdit_Main_Edit_Group_Title">{item.toUpperCase()}</div>
                                <div className="DAT_BmsEdit_Main_Edit_Group_Box">
                                    <label>Scale</label>
                                    <input
                                        defaultValue={rack?.template_?.[item]?.scale ?? ""}
                                        onChange={(e) =>
                                            setRack(prev => ({
                                                ...prev,
                                                template_: {
                                                    ...prev.template_,
                                                    [item]: {
                                                        ...prev.template_[item],
                                                        scale: Number(e.target.value),
                                                    },
                                                },
                                            }))
                                        }
                                    ></input>
                                </div>
                                <div className="DAT_BmsEdit_Main_Edit_Group_Box">
                                    <label>Offset</label>
                                    <input
                                        defaultValue={rack?.template_?.[item]?.offset ?? ""}
                                        onChange={(e) =>
                                            setRack(prev => ({
                                                ...prev,
                                                template_: {
                                                    ...prev.template_,
                                                    [item]: {
                                                        ...prev.template_[item],
                                                        offset: Number(e.target.value),
                                                    },
                                                },
                                            }))
                                        }
                                    ></input>
                                </div>
                                <div className="DAT_BmsEdit_Main_Edit_Group_Box">
                                    <label>Type</label>
                                    <input
                                        defaultValue={rack?.template_?.[item]?.type ?? ""}
                                        onChange={(e) =>
                                            setRack(prev => ({
                                                ...prev,
                                                template_: {
                                                    ...prev.template_,
                                                    [item]: {
                                                        ...prev.template_[item],
                                                        type: e.target.value,
                                                    },
                                                },
                                            }))
                                        }
                                    ></input>
                                </div>

                            </div>
                        ))}
                    </div>
                    <div className="DAT_BmsEdit_Main_Footer">
                        <button
                            className="DAT_BmsEdit_Main_Footer_Save"
                            onClick={handleSubmit}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default BmsEdit;
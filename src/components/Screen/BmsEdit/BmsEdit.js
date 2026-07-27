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
            <div className="DAT_BmsEditModuleMobile">
                <div className="DAT_BmsEditModuleMobile_HeaderCard">
                    <div className="DAT_BmsEditModuleMobile_HeaderCard_Main">
                        <div className="DAT_BmsEditModuleMobile_HeaderCard_Main_Title">
                            {lang.formatMessage({ id: "bms_module_edit_title" })}
                        </div>
                        <button
                            className="DAT_BmsEditModuleMobile_HeaderCard_Main_Button"
                            onClick={() => navigate("/bms")}
                        >
                            {lang.formatMessage({ id: "go_back" })}
                        </button>
                    </div>
                </div>

                <form className="DAT_BmsEditModuleMobile_Main" onSubmit={handleSubmit}>
                    <div className="DAT_BmsEditModuleMobile_Main_Title">
                        {lang.formatMessage({ id: "bms_module_edit_infor" })}
                    </div>
                    <div className="DAT_BmsEditModuleMobile_Main_Information">
                        <div className="DAT_BmsEditModuleMobile_Main_Information_Group">
                            <label>{lang.formatMessage({ id: "bms_total_module" })}</label>
                            <input
                                type="text"
                                placeholder="Enter total module"
                                defaultValue={moduleDetail?.total?.total_module_ || 0}
                                name="totalModule"
                            />
                        </div>
                        <div className="DAT_BmsEditModuleMobile_Main_Information_Group">
                            <label>{lang.formatMessage({ id: "bms_total_cell" })}</label>
                            <input
                                type="text"
                                placeholder="Enter totalModule"
                                defaultValue={moduleDetail?.total?.total_cells_ || 0}
                                name="totalCells"
                            />
                        </div>
                    </div>

                    <div className="DAT_BmsEditModuleMobile_Main_Title">{lang.formatMessage({ id: "bms_module_template" })}</div>
                    <div className="DAT_BmsEditModuleMobile_Main_Edit">
                        {/* Voltage */}
                        <div className="DAT_BmsEditModuleMobile_Main_Edit_Group">
                            <div className="DAT_BmsEditModuleMobile_Main_Edit_Group_Title">{lang.formatMessage({ id: "voltage" })}</div>
                            <div className="DAT_BmsEditModuleMobile_Main_Edit_Group_Box">
                                <label>{lang.formatMessage({ id: "bms_scale" })}</label>
                                <input
                                    defaultValue={moduleDetail.template.cellVoltage.scale}
                                    name="scaleVoltage"
                                />
                            </div>
                            <div className="DAT_BmsEditModuleMobile_Main_Edit_Group_Box">
                                <label>{lang.formatMessage({ id: "bms_offset" })}</label>
                                <input
                                    defaultValue={moduleDetail.template.cellVoltage.offset}
                                    name="offsetVoltage"
                                />
                            </div>
                            <div className="DAT_BmsEditModuleMobile_Main_Edit_Group_Box">
                                <label>{lang.formatMessage({ id: "bms_type" })}</label>
                                <input
                                    defaultValue={moduleDetail.template.cellVoltage.type}
                                    name="typeVoltage"
                                />
                            </div>
                        </div>

                        {/* Temperature */}
                        <div className="DAT_BmsEditModuleMobile_Main_Edit_Group">
                            <div className="DAT_BmsEditModuleMobile_Main_Edit_Group_Title">{lang.formatMessage({ id: "bms_temp" })}</div>
                            <div className="DAT_BmsEditModuleMobile_Main_Edit_Group_Box">
                                <label>{lang.formatMessage({ id: "bms_scale" })}</label>
                                <input
                                    defaultValue={moduleDetail.template.cellTemperature.scale}
                                    name="scaleTemperature"
                                />
                            </div>
                            <div className="DAT_BmsEditModuleMobile_Main_Edit_Group_Box">
                                <label>{lang.formatMessage({ id: "bms_offset" })}</label>
                                <input
                                    defaultValue={moduleDetail.template.cellTemperature.offset}
                                    name="offsetTemperature"
                                />
                            </div>
                            <div className="DAT_BmsEditModuleMobile_Main_Edit_Group_Box">
                                <label>{lang.formatMessage({ id: "bms_type" })}</label>
                                <input
                                    defaultValue={moduleDetail.template.cellTemperature.type}
                                    name="typeTemperature"
                                />
                            </div>
                        </div>

                        {/* Soc */}
                        <div className="DAT_BmsEditModuleMobile_Main_Edit_Group">
                            <div className="DAT_BmsEditModuleMobile_Main_Edit_Group_Title">SoC</div>
                            <div className="DAT_BmsEditModuleMobile_Main_Edit_Group_Box">
                                <label>{lang.formatMessage({ id: "bms_scale" })}</label>
                                <input
                                    defaultValue={moduleDetail.template.cellSoc.scale}
                                    name="scaleSoc"
                                />
                            </div>
                            <div className="DAT_BmsEditModuleMobile_Main_Edit_Group_Box">
                                <label>{lang.formatMessage({ id: "bms_offset" })}</label>
                                <input
                                    defaultValue={moduleDetail.template.cellSoc.offset}
                                    name="offsetSoc"
                                />
                            </div>
                            <div className="DAT_BmsEditModuleMobile_Main_Edit_Group_Box">
                                <label>{lang.formatMessage({ id: "bms_type" })}</label>
                                <input
                                    defaultValue={moduleDetail.template.cellSoc.type}
                                    name="typeSoc"
                                />
                            </div>
                        </div>

                        {/* Soc */}
                        <div className="DAT_BmsEditModuleMobile_Main_Edit_Group">
                            <div className="DAT_BmsEditModuleMobile_Main_Edit_Group_Title">Soh</div>
                            <div className="DAT_BmsEditModuleMobile_Main_Edit_Group_Box">
                                <label>{lang.formatMessage({ id: "bms_scale" })}</label>
                                <input
                                    defaultValue={moduleDetail.template.cellSoc.scale}
                                    name="scaleSoc"
                                />
                            </div>
                            <div className="DAT_BmsEditModuleMobile_Main_Edit_Group_Box">
                                <label>{lang.formatMessage({ id: "bms_offset" })}</label>
                                <input
                                    defaultValue={moduleDetail.template.cellSoc.offset}
                                    name="offsetSoc"
                                />
                            </div>
                            <div className="DAT_BmsEditModuleMobile_Main_Edit_Group_Box">
                                <label>{lang.formatMessage({ id: "bms_type" })}</label>
                                <input
                                    defaultValue={moduleDetail.template.cellSoc.type}
                                    name="typeSoc"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="DAT_BmsEditModuleMobile_Main_Footer">
                        <button type="submit" className="DAT_BmsEditModuleMobile_Main_Footer_Save">
                            {lang.formatMessage({ id: "save" })}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default BmsEdit;
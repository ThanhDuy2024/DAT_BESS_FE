import "./BmsEditRack.scss";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { callApi } from "../../Api/Api";
import { useParams } from "react-router-dom";
import { toast } from "sonner"
const defaultGroup = { register: 0, scale: "", offset: "", type: "" };
const defaultTemplate = {
    status: { ...defaultGroup },
    voltage: { ...defaultGroup },
    current: { ...defaultGroup },
    soc: { ...defaultGroup },
    soh: { ...defaultGroup },
    temperature: { ...defaultGroup },
    minimumCellVoltage: { ...defaultGroup },
    maximumCellVoltage: { ...defaultGroup },
    minimumCellTemperature: { ...defaultGroup },
    maximumCellTemperature: { ...defaultGroup },
};

const BmsEditRack = () => {
    const lang = useIntl();
    const { id } = useParams();
    const [rackDetail, setRackDetail] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await callApi("get", `${process.env.REACT_APP_APIDEV}/data/rackDetail/${id}`, {});
                if (res?.status === true && res?.data) {
                    let parsedTemplate = res.data.template_;
                    if (typeof parsedTemplate === "string") {
                        try {
                            parsedTemplate = JSON.parse(parsedTemplate);
                        } catch (e) {
                            parsedTemplate = {};
                        }
                    }

                    setRackDetail({
                        ...res.data,
                        template_: {
                            ...defaultTemplate,
                            ...(parsedTemplate || {}),
                        },
                    });
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }, [id]);

    const template_ = rackDetail?.template_ || defaultTemplate;
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const payload = {
            rackId: id,
            rackName: data.rackName || "",
            model: data.model || "",
            brand: data.brand || "",

            status: {
                register: template_.status.register,
                scale: data.scaleStatus || "",
                offset: data.offsetStatus || "",
                type: data.typeStatus || "",
            },
            voltage: {
                register: template_.voltage.register || 0,
                scale: data.scaleVoltage || "",
                offset: data.offsetVoltage || "",
                type: data.typeVoltage || "",
            },
            current: {
                register: template_.current.register || 0,
                scale: data.scaleCurrent || "",
                offset: data.offsetCurrent || "",
                type: data.typeCurrent || "",
            },
            temperature: {
                register: template_.temperature.register || 0,
                scale: data.scaleTemperature || "",
                offset: data.offsetTemperature || "",
                type: data.typeTemperature || "",
            },
            soc: {
                register: template_.soc.register || 0,
                scale: data.scaleSoc || "",
                offset: data.offsetSoc || "",
                type: data.typeSoc || "",
            },

            soh: {
                register: template_.soh.register || 0,
                scale: data.scaleSoh || "",
                offset: data.offsetSoh || "",
                type: data.typeSoh || "",
            },

            minimumCellVoltage: {
                register: template_.minimumCellVoltage.register || 0,
                scale: data.scaleMinimumCellVoltage || "",
                offset: data.offsetMinimumCellVoltage || "",
                type: data.typeMinimumCellVoltage || "",
            },

            maximumCellVoltage: {
                register: template_.maximumCellVoltage.register || 0,
                scale: data.scaleMaximumCellVoltage || "",
                offset: data.offsetMaximumCellVoltage || "",
                type: data.typeMaximumCellVoltage || "",
            },

            minimumCellTemperature: {
                register: template_.minimumCellTemperature.register || 0,
                scale: data.scaleMinimumCellTemperature || "",
                offset: data.offsetMinimumCellTemperature || "",
                type: data.typeMinimumCellTemperature || "",
            },

            maximumCellTemperature: {
                register: template_.maximumCellTemperature.register || 0,
                scale: data.scaleMaximumCellTemperature || "",
                offset: data.offsetMaximumCellTemperature || "",
                type: data.typeMaximumCellTemperature || "",
            },
        };

        try {
            const res = await callApi("post", `${process.env.REACT_APP_APIDEV}/data/editRack`, payload);
            if (res.status === true) {
                toast.success(lang.formatMessage({ id: "toast_updated"}))
            } else {
                toast.error(lang.formatMessage({ id: "toast_error" }))
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="DAT_BmsEditRack">
            <div className="DAT_BmsEditRack_HeaderCard">
                <div className="DAT_BmsEditRack_HeaderCard_Main">
                    <div className="DAT_BmsEditRack_HeaderCard_Main_Title">
                        {lang.formatMessage({ id: "bms_rack_edit_title" })}
                    </div>
                </div>
            </div>

            <form className="DAT_BmsEditRack_Main" onSubmit={handleSubmit} key={rackDetail?.id || id}>
                <div className="DAT_BmsEditRack_Main_Title">{lang.formatMessage({ id: "bms_rack_edit_infor"})}</div>
                <div className="DAT_BmsEditRack_Main_Information">
                    <div className="DAT_BmsEditRack_Main_Information_Group">
                        <label>{lang.formatMessage({ id: "bms_rack_name"})}</label>
                        <input
                            type="text"
                            placeholder="Enter rack name"
                            defaultValue={rackDetail?.rack_name_ || ""}
                            name="rackName"
                        />
                    </div>
                    <div className="DAT_BmsEditRack_Main_Information_Group">
                        <label>{lang.formatMessage({ id: "bms_rack_model"})}</label>
                        <input
                            type="text"
                            placeholder="Enter model name"
                            defaultValue={rackDetail?.model_ || ""}
                            name="model"
                        />
                    </div>
                    <div className="DAT_BmsEditRack_Main_Information_Group">
                        <label>{lang.formatMessage({ id: "bms_rack_brand"})}</label>
                        <input
                            type="text"
                            placeholder="Enter brand name"
                            defaultValue={rackDetail?.brand_ || ""}
                            name="brand"
                        />
                    </div>
                    <div className="DAT_BmsEditRack_Main_Information_Group">
                        <label>{lang.formatMessage({id: "bms_rack_start_address"})}</label>
                        <input
                            type="text"
                            defaultValue={rackDetail?.start_rack_address_ || ""}
                            disabled
                        />
                    </div>
                </div>

                <div className="DAT_BmsEditRack_Main_Title">{lang.formatMessage({ id: "bms_rack_edit_template"})}</div>
                <div className="DAT_BmsEditRack_Main_Edit">

                    {/* Status */}
                    <div className="DAT_BmsEditRack_Main_Edit_Group--hidden">
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Title">Status</div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "status"})}</label>
                            <input
                                defaultValue={template_?.status?.scale ?? ""}
                                name="scaleStatus"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_offset"})}</label>
                            <input
                                defaultValue={template_?.status?.offset ?? ""}
                                name="offsetStatus"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_type"})}</label>
                            <input
                                defaultValue={template_?.status?.type ?? ""}
                                name="typeStatus"
                            />
                        </div>
                    </div>

                    {/* Voltage */}
                    <div className="DAT_BmsEditRack_Main_Edit_Group">
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Title">{lang.formatMessage({id: "voltage"})}</div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_scale"})}</label>
                            <input
                                defaultValue={template_?.voltage?.scale ?? ""}
                                name="scaleVoltage"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_offset"})}</label>
                            <input
                                defaultValue={template_?.voltage?.offset ?? ""}
                                name="offsetVoltage"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_type"})}</label>
                            <input
                                defaultValue={template_?.voltage?.type ?? ""}
                                name="typeVoltage"
                            />
                        </div>
                    </div>

                    {/* Current */}
                    <div className="DAT_BmsEditRack_Main_Edit_Group">
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Title">{lang.formatMessage({id: "current"})}</div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_scale"})}</label>
                            <input
                                defaultValue={template_?.current?.scale ?? ""}
                                name="scaleCurrent"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_offset"})}</label>
                            <input
                                defaultValue={template_?.current?.offset ?? ""}
                                name="offsetCurrent"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_type"})}</label>
                            <input
                                defaultValue={template_?.current?.type ?? ""}
                                name="typeCurrent"
                            />
                        </div>
                    </div>

                    {/* Soc */}
                    <div className="DAT_BmsEditRack_Main_Edit_Group">
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Title">Soc</div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_scale"})}</label>
                            <input
                                defaultValue={template_?.soc?.scale ?? ""}
                                name="scaleSoc"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_offset"})}</label>
                            <input
                                defaultValue={template_?.soc?.offset ?? ""}
                                name="offsetSoc"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_type"})}</label>
                            <input
                                defaultValue={template_?.soc?.type ?? ""}
                                name="typeSoc"
                            />
                        </div>
                    </div>

                    {/* Soh */}
                    <div className="DAT_BmsEditRack_Main_Edit_Group">
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Title">Soh</div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_scale"})}</label>
                            <input
                                defaultValue={template_?.soh?.scale ?? ""}
                                name="scaleSoh"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_offset"})}</label>
                            <input
                                defaultValue={template_?.soh?.offset ?? ""}
                                name="offsetSoh"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_type"})}</label>
                            <input
                                defaultValue={template_?.soh?.type ?? ""}
                                name="typeSoh"
                            />
                        </div>
                    </div>

                    {/* Temperature */}
                    <div className="DAT_BmsEditRack_Main_Edit_Group">
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Title">{lang.formatMessage({id: "bms_temp"})}</div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_scale"})}</label>
                            <input
                                defaultValue={template_?.temperature?.scale ?? ""}
                                name="scaleTemperature"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_offset"})}</label>
                            <input
                                defaultValue={template_?.temperature?.offset ?? ""}
                                name="offsetTemperature"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_type"})}</label>
                            <input
                                defaultValue={template_?.temperature?.type ?? ""}
                                name="typeTemperature"
                            />
                        </div>
                    </div>

                    {/* Minimum Cell Voltage */}
                    <div className="DAT_BmsEditRack_Main_Edit_Group">
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Title">{lang.formatMessage({id: "bms_min_voltage"})}</div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_scale"})}</label>
                            <input
                                defaultValue={template_?.minimumCellVoltage?.scale ?? ""}
                                name="scaleMinimumCellVoltage"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_offset"})}</label>
                            <input
                                defaultValue={template_?.minimumCellVoltage?.offset ?? ""}
                                name="offsetMinimumCellVoltage"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_type"})}</label>
                            <input
                                defaultValue={template_?.minimumCellVoltage?.type ?? ""}
                                name="typeMinimumCellVoltage"
                            />
                        </div>
                    </div>

                    {/* Maximum Cell Voltage */}
                    <div className="DAT_BmsEditRack_Main_Edit_Group">
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Title">{lang.formatMessage({id: "bms_max_voltage"})}</div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_scale"})}</label>
                            <input
                                defaultValue={template_?.maximumCellVoltage?.scale ?? ""}
                                name="scaleMaximumCellVoltage"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_offset"})}</label>
                            <input
                                defaultValue={template_?.maximumCellVoltage?.offset ?? ""}
                                name="offsetMaximumCellVoltage"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_type"})}</label>
                            <input
                                defaultValue={template_?.maximumCellVoltage?.type ?? ""}
                                name="typeMaximumCellVoltage"
                            />
                        </div>
                    </div>

                    {/* Minimum Cell Temperature */}
                    <div className="DAT_BmsEditRack_Main_Edit_Group">
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Title">{lang.formatMessage({id: "bms_min_temp"})}</div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_scale"})}</label>
                            <input
                                defaultValue={template_?.minimumCellTemperature?.scale ?? ""}
                                name="scaleMinimumCellTemperature"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_offset"})}</label>
                            <input
                                defaultValue={template_?.minimumCellTemperature?.offset ?? ""}
                                name="offsetMinimumCellTemperature"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_type"})}</label>
                            <input
                                defaultValue={template_?.minimumCellTemperature?.type ?? ""}
                                name="typeMinimumCellTemperature"
                            />
                        </div>
                    </div>

                    {/* Maximum Cell Temperature */}
                    <div className="DAT_BmsEditRack_Main_Edit_Group">
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Title">{lang.formatMessage({id: "bms_max_temp"})}</div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_scale"})}</label>
                            <input
                                defaultValue={template_?.maximumCellTemperature?.scale ?? ""}
                                name="scaleMaximumCellTemperature"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_offset"})}</label>
                            <input
                                defaultValue={template_?.maximumCellTemperature?.offset ?? ""}
                                name="offsetMaximumCellTemperature"
                            />
                        </div>
                        <div className="DAT_BmsEditRack_Main_Edit_Group_Box">
                            <label>{lang.formatMessage({id: "bms_type"})}</label>
                            <input
                                defaultValue={template_?.maximumCellTemperature?.type ?? ""}
                                name="typeMaximumCellTemperature"
                            />
                        </div>
                    </div>

                </div>

                <div className="DAT_BmsEditRack_Main_Footer">
                    <button type="submit" className="DAT_BmsEditRack_Main_Footer_Save">
                        {lang.formatMessage({ id: "save"})}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BmsEditRack;
import './BmsEditModule.scss'
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { callApi } from "../../Api/Api";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner"
import { isMobile } from 'react-device-detect';
const defaultGroup = { register: 0, scale: "", offset: "", type: "" };
const defaultTemplate = {
    status: { ...defaultGroup },
    voltage: { ...defaultGroup },
    soc: { ...defaultGroup },
    temperature: { ...defaultGroup },
};

const BmsEditModule = () => {
    const lang = useIntl();
    const navigate = useNavigate();
    const { id } = useParams();
    const [moduleDetail, setModuleDetail] = useState();

    useEffect(() => {
        (async () => {
            try {
                const res = await callApi("get", `${process.env.REACT_APP_APIDEV}/data/moduleDetail/${id}`)
                if (res.status === true) {
                    setModuleDetail(res.data);
                }
            } catch (error) {
                console.log(error);
            }
        })()
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const payload = {
            rackId: Number(id),
            totalModules: Number(data.totalModule),
            totalCells: Number(data.totalCells),
            cellVoltage: {
                scale: Number(data.scaleVoltage),
                offset: Number(data.offsetVoltage),
                type: data.typeVoltage,
            },

            cellTemperature: {
                scale: Number(data.scaleTemperature),
                offset: Number(data.offsetTemperature),
                type: data.typeTemperature,
            },

            cellSoc: {
                scale: Number(data.scaleSoc),
                offset: Number(data.offsetSoc),
                type: data.typeSoc,
            },

            cellSoh: {
                scale: Number(data.scaleSoh),
                offset: Number(data.offsetSoh),
                type: data.typeSoh,
            }
        };

        try {
            const res = await callApi("post", `${process.env.REACT_APP_APIDEV}/data/v2/editModule`, payload)
            if (res.status === true) {
                toast.success(lang.formatMessage({ id: "toast_updated" }))
            }
        } catch (error) {
            console.log(error);
            toast.error(lang.formatMessage({ id: "toast_error" }))
        }
    };
    return (
        <>
            {isMobile ? (
                <>
                    {moduleDetail && (
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
                    )}
                </>
            ) : (
                <>
                    {moduleDetail && (
                        <div className="DAT_BmsEditModule">
                            <div className="DAT_BmsEditModule_HeaderCard">
                                <div className="DAT_BmsEditModule_HeaderCard_Main">
                                    <div className="DAT_BmsEditModule_HeaderCard_Main_Title">
                                        {lang.formatMessage({ id: "bms_module_edit_title" })}
                                    </div>
                                    <button
                                        className="DAT_BmsEditModule_HeaderCard_Main_Button"
                                        onClick={() => navigate("/bms")}
                                    >
                                        {lang.formatMessage({ id: "go_back" })}
                                    </button>
                                </div>
                            </div>

                            <form className="DAT_BmsEditModule_Main" onSubmit={handleSubmit}>
                                <div className="DAT_BmsEditModule_Main_Title">
                                    {lang.formatMessage({ id: "bms_module_edit_infor" })}
                                </div>
                                <div className="DAT_BmsEditModule_Main_Information">
                                    <div className="DAT_BmsEditModule_Main_Information_Group">
                                        <label>{lang.formatMessage({ id: "bms_total_module" })}</label>
                                        <input
                                            type="text"
                                            placeholder="Enter total module"
                                            defaultValue={moduleDetail?.total?.total_module_ || 0}
                                            name="totalModule"
                                        />
                                    </div>
                                    <div className="DAT_BmsEditModule_Main_Information_Group">
                                        <label>{lang.formatMessage({ id: "bms_total_cell" })}</label>
                                        <input
                                            type="text"
                                            placeholder="Enter totalModule"
                                            defaultValue={moduleDetail?.total?.total_cells_ || 0}
                                            name="totalCells"
                                        />
                                    </div>
                                </div>

                                <div className="DAT_BmsEditModule_Main_Title">{lang.formatMessage({ id: "bms_module_template" })}</div>
                                <div className="DAT_BmsEditModule_Main_Edit">
                                    {/* Voltage */}
                                    <div className="DAT_BmsEditModule_Main_Edit_Group">
                                        <div className="DAT_BmsEditModule_Main_Edit_Group_Title">{lang.formatMessage({ id: "voltage" })}</div>
                                        <div className="DAT_BmsEditModule_Main_Edit_Group_Box">
                                            <label>{lang.formatMessage({ id: "bms_scale" })}</label>
                                            <input
                                                defaultValue={moduleDetail.template.cellVoltage.scale}
                                                name="scaleVoltage"
                                            />
                                        </div>
                                        <div className="DAT_BmsEditModule_Main_Edit_Group_Box">
                                            <label>{lang.formatMessage({ id: "bms_offset" })}</label>
                                            <input
                                                defaultValue={moduleDetail.template.cellVoltage.offset}
                                                name="offsetVoltage"
                                            />
                                        </div>
                                        <div className="DAT_BmsEditModule_Main_Edit_Group_Box">
                                            <label>{lang.formatMessage({ id: "bms_type" })}</label>
                                            <input
                                                defaultValue={moduleDetail.template.cellVoltage.type}
                                                name="typeVoltage"
                                            />
                                        </div>
                                    </div>

                                    {/* Temperature */}
                                    <div className="DAT_BmsEditModule_Main_Edit_Group">
                                        <div className="DAT_BmsEditModule_Main_Edit_Group_Title">{lang.formatMessage({ id: "bms_temp" })}</div>
                                        <div className="DAT_BmsEditModule_Main_Edit_Group_Box">
                                            <label>{lang.formatMessage({ id: "bms_scale" })}</label>
                                            <input
                                                defaultValue={moduleDetail.template.cellTemperature.scale}
                                                name="scaleTemperature"
                                            />
                                        </div>
                                        <div className="DAT_BmsEditModule_Main_Edit_Group_Box">
                                            <label>{lang.formatMessage({ id: "bms_offset" })}</label>
                                            <input
                                                defaultValue={moduleDetail.template.cellTemperature.offset}
                                                name="offsetTemperature"
                                            />
                                        </div>
                                        <div className="DAT_BmsEditModule_Main_Edit_Group_Box">
                                            <label>{lang.formatMessage({ id: "bms_type" })}</label>
                                            <input
                                                defaultValue={moduleDetail.template.cellTemperature.type}
                                                name="typeTemperature"
                                            />
                                        </div>
                                    </div>

                                    {/* Soc */}
                                    <div className="DAT_BmsEditModule_Main_Edit_Group">
                                        <div className="DAT_BmsEditModule_Main_Edit_Group_Title">SoC</div>
                                        <div className="DAT_BmsEditModule_Main_Edit_Group_Box">
                                            <label>{lang.formatMessage({ id: "bms_scale" })}</label>
                                            <input
                                                defaultValue={moduleDetail.template.cellSoc.scale}
                                                name="scaleSoc"
                                            />
                                        </div>
                                        <div className="DAT_BmsEditModule_Main_Edit_Group_Box">
                                            <label>{lang.formatMessage({ id: "bms_offset" })}</label>
                                            <input
                                                defaultValue={moduleDetail.template.cellSoc.offset}
                                                name="offsetSoc"
                                            />
                                        </div>
                                        <div className="DAT_BmsEditModule_Main_Edit_Group_Box">
                                            <label>{lang.formatMessage({ id: "bms_type" })}</label>
                                            <input
                                                defaultValue={moduleDetail.template.cellSoc.type}
                                                name="typeSoc"
                                            />
                                        </div>
                                    </div>

                                    {/* Soc */}
                                    <div className="DAT_BmsEditModule_Main_Edit_Group">
                                        <div className="DAT_BmsEditModule_Main_Edit_Group_Title">Soh</div>
                                        <div className="DAT_BmsEditModule_Main_Edit_Group_Box">
                                            <label>{lang.formatMessage({ id: "bms_scale" })}</label>
                                            <input
                                                defaultValue={moduleDetail.template.cellSoc.scale}
                                                name="scaleSoc"
                                            />
                                        </div>
                                        <div className="DAT_BmsEditModule_Main_Edit_Group_Box">
                                            <label>{lang.formatMessage({ id: "bms_offset" })}</label>
                                            <input
                                                defaultValue={moduleDetail.template.cellSoc.offset}
                                                name="offsetSoc"
                                            />
                                        </div>
                                        <div className="DAT_BmsEditModule_Main_Edit_Group_Box">
                                            <label>{lang.formatMessage({ id: "bms_type" })}</label>
                                            <input
                                                defaultValue={moduleDetail.template.cellSoc.type}
                                                name="typeSoc"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="DAT_BmsEditModule_Main_Footer">
                                    <button type="submit" className="DAT_BmsEditModule_Main_Footer_Save">
                                        {lang.formatMessage({ id: "save" })}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default BmsEditModule;
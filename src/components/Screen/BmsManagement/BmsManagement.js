import "./BmsManagement.scss"
import { toast } from "sonner";
import { useIntl } from "react-intl";
import { useContext } from "react";
import { useEffect, useState } from "react";
import { LuBatteryFull } from "react-icons/lu";
import { callApi } from "../../Api/Api"
import Modal from "../../Modal/Modal";
import { RackContext } from "../../contexts/RackContext";
const BmsManagement = () => {
    const lang = useIntl();
    const { rackData, rackDispatch } = useContext(RackContext);
    const [modalType, setModalType] = useState(null);
    const [createRack, setCreateRack] = useState({});

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

    const handleCreateRack = async () => {
        try {
            const res = await callApi("post", `${process.env.REACT_APP_APIDEV}/data/createRack`, {
                rackName: createRack.rackName,
                model: createRack.model,
                brand: createRack.brand
            });
            if(res.status === false) {
                toast.error(res.msg);
            } else {
                toast.success(lang.formatMessage({ id: "toast_created" }));
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
            </div>
        )
    };

    const renderTitle = () => {
        switch (modalType) {
            case "add":
                return lang.formatMessage({ id: "bms_modal_create_title" });
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
            default:
                return null;
        }
    };

    const renderBody = () => {
        switch (modalType) {
            case "add":
                return renderModalAdd();
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
                                                >
                                                    {lang.formatMessage({ id: "bms_add_module" })}
                                                </button>
                                                <button className='DAT_RoleSetting_Container_Table_Main_Cell_Action_Button'
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
            >
                {renderBody()}
            </Modal>
        </div>
    )
}

export default BmsManagement;
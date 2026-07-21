const INITIAL_STATE = {
    bmsData: [],
    rackData: []
}

const RackReducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_BMS_DATA':
            return {
                ...state,
                bmsData: action.payload.bmsData,
            }
        case 'LOAD_RACK_DATA':
            return {
                ...state,
                rackData: action.payload.rackData
            }
        case 'CREATE_RACK_DATA':
            return {
                ...state,
                rackData: [...state.rackData, action.payload.rackData]
            }
        case 'CREATE_RACK_MODULE_DATA': {
            const id = action.payload.rackId;

            const rackDetail = state.rackData.find(item => item.id_ === id);

            const newRackArray = state.rackData.filter(item => item.id_ !== id);

            const newRack = {
                ...rackDetail,
                total_module_: Number(rackDetail.total_module_) + action.payload.totalModules
            };

            const sorted = [...newRackArray, newRack].sort((a, b) => a.id_ - b.id_);

            return {
                ...state,
                rackData: sorted
            };
        }
        default:
            return state;
    }
}

export { INITIAL_STATE }
export default RackReducer;
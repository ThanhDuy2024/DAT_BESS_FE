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
        default:
            return state;
    }
}

export { INITIAL_STATE }
export default RackReducer;
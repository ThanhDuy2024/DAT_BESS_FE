const INITIAL_STATE = {
    bmsData: []
}

const RackReducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_BMS_DATA':
            return {
                bmsData: action.payload.bmsData,
            }
        default:
            return state;
    }
}

export { INITIAL_STATE }
export default RackReducer;
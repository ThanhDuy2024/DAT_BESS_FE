
const INITIAL_STATE = {
    userId: -1,
    username: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    roleName: "",
    permissions: [],
    status: false,
};

const SystemReducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_USR':

            return {
                ...state,
                userId: action.payload.userId,
                username: action.payload.username,
                name: action.payload.name,
                email: action.payload.email,
                phone: action.payload.phone,
                address: action.payload.address,
                roleName: action.payload.roleName,
                permissions: action.payload.permissions,
                status: action.payload.status
            }
        default:
            return state;
    }
}

export { INITIAL_STATE }
export default SystemReducer;
import { createContext, useReducer } from "react";
import RackReducer, { INITIAL_STATE } from "./RackReducer";

export const RackContext = createContext(INITIAL_STATE);

export const RackContextProvider = ({ children }) => {
    const [state, rackDispatch] = useReducer(RackReducer, INITIAL_STATE);

    return (
        <RackContext.Provider value={{
            bmsData: state.bmsData,
            rackData: state.rackData,
            rackDispatch
        }}
        >
            {children}
        </RackContext.Provider>
    )
}
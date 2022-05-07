const contractSelector = state => state.contract
export const pgcSelector = state => contractSelector(state).pgc.contract
export const exPGCSelector = state => contractSelector(state).exPGC.contract
export const tokenSwapSelector = state => contractSelector(state).tokenSwap.contract
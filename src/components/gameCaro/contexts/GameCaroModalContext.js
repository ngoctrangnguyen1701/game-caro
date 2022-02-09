import React, {createContext, useReducer} from 'react'

export const GameCaroModalContext = createContext()

//note: only boolean value that can be recevied
const initialState = {
  showFindingOpponentModal: false,
  prepareShowOpponentListModal: false,
  showOpponentListModal: false,
  showReplayFightingModal: false,
  messageReplayFightingModal: '',
  showLeaveFightingModal: false,
}

const reducer = (state, action) => {
  switch(action.type){
    case 'SHOW_FINDING_OPPONENT_MODAL':
      return {
        ...state,
        showFindingOpponentModal: action.payload
      }
    case 'PREPARE_SHOW_OPPONENT_LIST_MODAL':
      return {
        ...state,
        prepareShowOpponentListModal: action.payload
      }
    case 'SHOW_OPPONENT_LIST_MODAL':
      return {
        ...state,
        showOpponentListModal: action.payload
      }
    case 'SHOW_REPLAY_FIGHTING_MODAL':
      return {
        ...state,
        showReplayFightingModal: action.payload,
      }
    case 'MESSAGE_REPLAY_FIGHTING_MODAL':
      return {
        ...state,
        messageReplayFightingModal: action.payload,
      }
    case 'SHOW_LEAVE_FIGHTING_MODAL':
      return {
        ...state,
        showLeaveFightingModal: action.payload,
      }
    default:
      return state
  }
}

const GameCaroModalContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState)


  return (
    <GameCaroModalContext.Provider value={{state, dispatch}}>
      {children}
    </GameCaroModalContext.Provider>
  )
}

export default GameCaroModalContextProvider
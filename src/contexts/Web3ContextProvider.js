import React from "react";
import { NETWORK_BLOCKCHAIN } from "src/common/constants";
import Web3 from "web3";

export const Web3Context = React.createContext()

const Web3ContextProvider = ({children}) =>{
  const [web3, setWeb3] = React.useState(null)

  React.useEffect(() => {
    const web3Provider = new Web3(NETWORK_BLOCKCHAIN)
    setWeb3(web3Provider)
  }, [])

  return (
    <Web3Context.Provider value={web3}>
      {children}
    </Web3Context.Provider>
  )
}

export default Web3ContextProvider
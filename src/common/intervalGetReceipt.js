import Web3 from 'web3'
import {NETWORK_BLOCKCHAIN} from './constants'

function intervalGetReceipt(txHash) {
  console.log('intervalGetReceipt', txHash);
  if(txHash) {
    const web3 = new Web3(NETWORK_BLOCKCHAIN)
    let intervalFunction
    let receipt
    intervalFunction = setInterval(async() => {
      receipt = await new web3.eth.getTransactionReceipt(txHash)
      if(receipt) {
        clearInterval(intervalFunction)
        console.log('intervalGetReceipt', receipt);
        return receipt
      }
    }, 1000)
  }
  return null
}

export default intervalGetReceipt
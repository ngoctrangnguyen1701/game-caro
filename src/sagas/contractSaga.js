import {put, call, takeEvery, select} from 'redux-saga/effects'
import {contractAction} from 'src/reducers/contract/contractSlice'
import abi from 'src/common/abi'

export default function* saga() {
  yield takeEvery('contract/connect', getContract)
}

function* getContract(action) {
  //select dùng để lấy state hiện tại trong store
  const web3 = yield select(state => state.web3.provider)
  const contractName = action.payload
  const contract = yield call(connectContract, {contractName, web3})
  yield put(contractAction[contractName](contract))
}

async function connectContract(payload) {
  // const connectContact = await new web3.eth.Contract(contractList[contractName].abi, contractList[contractName].address)
  const {contractName, web3} = payload
  try { 
    return await new web3.eth.Contract(abi[contractName].abi, abi[contractName].address)
  } catch (error) {
    console.log(error);
  }
}
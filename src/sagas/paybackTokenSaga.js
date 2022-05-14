import {delay, put, call, takeEvery, select, fork} from 'redux-saga/effects'
import {contractAction} from 'src/reducers/contract/contractSlice'
import {paybackTokenAction} from 'src/reducers/paybackToken/paybackTokenSlice'
import abi from 'src/common/abi'
import paybackTokenApi from 'src/api/paybackTokenApi'
import { pgcSelector, exPGCSelector } from 'src/selectors/contractSelector'
import { walletAction } from 'src/reducers/wallet/walletSlice'
import { fullscreenLoadingAction } from 'src/reducers/fullscreenLoading/fullscreenLoadingSlice'

export default function* saga() {
  yield takeEvery('paybackToken/submitReceipt', submitReceipt)
  yield takeEvery('paybackToken/getList', getList)
}

function* submitReceipt(action) {
  try {
    const res = yield call(paybackTokenApi.submitReceipt, action.payload)

    yield fork(setBalanceToken, res.data)
    yield fork(setBalanceExToken, res.data)
    yield put(fullscreenLoadingAction.showLoading(false))
    yield put(paybackTokenAction.submitReceiptSuccess({paybackToken: res.data.paybackToken}))

  } catch (error) {
    yield put(fullscreenLoadingAction.showLoading(false))
    yield put(paybackTokenAction.submitReceiptFailed({message: error.message}))
  }
}

function* setBalanceToken(payload) {
  const web3 = yield select(state => state.web3.provider)
  const pgc = yield select(pgcSelector)
  const balanceToken = yield call(getToken, {web3, contract: pgc, account: payload.address})
  yield put(walletAction.setToken({token: balanceToken}))
}

function* setBalanceExToken(payload) {
  const web3 = yield select(state => state.web3.provider)
  const exPGC = yield select(exPGCSelector)
  const balanceToken = yield call(getToken, {web3, contract: exPGC, account: payload.address})
  yield put(walletAction.setExToken({exToken: balanceToken}))
}

async function getToken(payload) {
  //số token ở contract pgc hiện tại
  const {contract, account, web3} = payload
  const balanceWei = await contract.methods.balanceOf(account).call()
  return await web3.utils.fromWei(balanceWei)
}

function* getList(action) {
  try {
    const res = yield call(paybackTokenApi.list, action.payload)
    yield delay(300)
    yield put(paybackTokenAction.getListSuccess(res.data))
  } catch (error) {
    yield put(paybackTokenAction.getListFailed({message: error.message}))
  }
}
import {delay, put, call, takeEvery} from 'redux-saga/effects'
import {paybackTokenAction} from 'src/reducers/paybackToken/paybackTokenSlice'
import paybackTokenApi from 'src/api/paybackTokenApi'

export default function* saga() {
  yield takeEvery('paybackToken/getList', getList)
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
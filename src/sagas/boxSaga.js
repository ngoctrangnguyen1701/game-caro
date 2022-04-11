import {put, call, takeEvery} from 'redux-saga/effects'
import boxApi from "src/api/boxApi";
import {boxAction} from 'src/reducers/box/boxSlice'

export default function* saga() {
  yield takeEvery('box/getBox', getBox)
  yield takeEvery('box/buyBox', buyBox)
}

function* getBox() {
  try {
    const res = yield call(boxApi.getBox)
    yield put(boxAction.setAmount({amountOfBoxes: res.data.amountOfBoxes}))
  } catch (error) {
    console.log(error);
  }
}

function* buyBox(action) {
  try {
    const res = yield call(boxApi.buyBox, action.payload)
    yield put(boxAction.setAmount({amountOfBoxes: res.data.amountOfBoxes}))
  } catch (error) {
    console.log(error);
  }
}
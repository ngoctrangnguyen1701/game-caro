import {put, call, takeEvery} from 'redux-saga/effects'
import boxApi from "src/api/boxApi";
import {boxAction} from 'src/reducers/box/boxSlice'

export default function* saga() {
  yield takeEvery('box/getBox', getBox)
  yield takeEvery('box/buyBox', buyBox)
  yield takeEvery('box/openBox', openBox)
  yield takeEvery('box/receiveAward', receiveAward)
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

function* openBox(action) {
  try {
    const res = yield call(boxApi.openBox, action.payload)
    yield put(boxAction.setAmount({amountOfBoxes: res.data.amountOfBoxes}))
  } catch (error) {
    console.log(error);
  }
}

function* receiveAward(action) {
  try {
    const res = yield call(boxApi.receiveAward, action.payload)
    // yield put(boxAction.setAmount({amountOfBoxes: res.data.amountOfBoxes}))
  } catch (error) {
    console.log(error);
  }
}
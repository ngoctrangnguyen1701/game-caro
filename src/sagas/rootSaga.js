import {all, spawn} from 'redux-saga/effects'
import authSaga from './auth/authSaga'
import boxSaga from './boxSaga'
import contractSaga from './contractSaga'
import paybackTokenSaga from './paybackTokenSaga'

export default function* rootSaga(){
  // yield all([
  //   authSaga(),
  //   boxSaga(),
  //   contractSaga(),
  // ])
  //https://redux-saga.js.org/docs/api#spawnfn-args
  //xài fork hay all, nếu 1 trong các function bị lỗi, nó sẽ báo về function cha là rootSaga
  //và các function khác trong đó cũng sẽ ngưng lại không chạy
  //spawn là mạnh thằng nào thằng nấy chạy, function kia có bị lỗi thì function khác cũng sẽ không bị dừng lại
  yield spawn(authSaga)
  yield spawn(boxSaga)
  yield spawn(contractSaga)
  yield spawn(paybackTokenSaga)
}
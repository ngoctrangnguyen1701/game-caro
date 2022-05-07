import {all} from 'redux-saga/effects'
import authSaga from './auth/authSaga'
import boxSaga from './boxSaga'
import contractSaga from './contractSaga'

export default function* rootSaga(){
  yield all([
    authSaga(),
    boxSaga(),
    contractSaga(),
  ])
}
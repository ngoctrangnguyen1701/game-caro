import {all} from 'redux-saga/effects'
import authSaga from './auth/authSaga'
import boxSaga from './boxSaga'

export default function* rootSaga(){
  yield all([
    authSaga(),
    boxSaga(),
  ])
}
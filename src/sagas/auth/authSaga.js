import {call, delay, put, takeEvery} from 'redux-saga/effects'
import authApi from '../../api/authApi'
import { signUpAction } from '../../reducers/auth/signUpSlice'
import { logInAction } from '../../reducers/auth/logInSlice'


export default function* saga(){
  yield takeEvery('auth/signUp/submit', signUp)
  yield takeEvery('auth/logIn/submit', logIn)
  yield takeEvery('auth/logIn/logInWithSocialAccount', logIn)
}

function* signUp(action){
  try {
    const res = yield call(authApi.signUp, action.payload)
    yield put(signUpAction.success())
  } catch (error) {
    console.log(error);
    const responseError = error.request.response
    // console.log('responseError: ', responseError);
    if(responseError){
      yield put(signUpAction.failed(JSON.parse(responseError)))
    }
    else{
      yield put(signUpAction.failed({message: 'Can not sign up'}))
    }
  }
}

function* logIn(action){
  const requestData = action.payload

  try {
    let res
    if(requestData.username && requestData.password){
      res = yield call(authApi.logIn, action.payload)
    }
    else{
      // Login with google or facebook
      // check that account of email is signed up ?
      // requestData not include field 'password', but include field 'email'
      res = yield call(authApi.logInWithSocialAccount, action.payload)
    }
    
    const {accessToken} = res.data
    if(accessToken){
      sessionStorage.setItem('accessToken', JSON.stringify(accessToken))
      if(requestData?.isRememberLogIn) {
        localStorage.setItem('accessToken', JSON.stringify(accessToken))
      }
      yield delay(300) //--> deplay 300 để accessToken được lưu vào sessionStorage trước
      yield put(logInAction.success())
    }
  } catch (error) {
    console.log(error);
    const responseError = error.request.response
    // console.log('responseError: ', responseError);
    if(responseError){
      yield put(logInAction.failed(JSON.parse(responseError)))
    }
    else{
      yield put(logInAction.failed({message: 'Can not log in'}))
    }
  }
}
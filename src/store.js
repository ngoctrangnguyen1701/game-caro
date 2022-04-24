import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from '@redux-saga/core'

import reducer from './reducers/rootReducer'
import saga from './sagas/rootSaga'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
  reducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false
  }).concat(sagaMiddleware)
  //xài middleware mặc định của redux toolkit(thunk...) cộng với middlware redux-saga
})
sagaMiddleware.run(saga)

export default store

//sửa lỗi A non-serializable value was detected in the state kèm theo middleware saga
//https://stackoverflow.com/questions/68546192/redux-tool-kit-error-error-before-running-a-saga-you-must-mount-the-saga-middl
//https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using
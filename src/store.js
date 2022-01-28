import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from '@redux-saga/core'

import reducer from './reducers/rootReducer'
import saga from './sagas/rootSaga'

const sagaMiddleware = createSagaMiddleware()

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
    //xài middleware mặc định của redux toolkit(thunk...) cộng với middlware redux-saga
})
sagaMiddleware.run(saga)

export default store
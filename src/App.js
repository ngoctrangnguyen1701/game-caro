import React, {Suspense, useEffect} from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import { useDispatch } from 'react-redux';

import 'react-toastify/dist/ReactToastify.css';
import 'animate.css';
import io from 'socket.io-client'


import CircularProgress from '@mui/material/CircularProgress';

import { linkServer } from './constants/constants';
import routes from './routes'
import { onlineUserAction } from './reducers/onlineUser/onlineUserListSlice';
import { fightingAction } from './reducers/fighting/settingSlice';
import { fightingAction as fightingPlayAction } from './reducers/fighting/playSlice';
import { invitationAction } from './reducers/invitation/invitationSlice';

import NavBarMain from './components/NavBarMain'
import InvitationModal from './components/InvitationModal';

//<ToastContainer/> và file css của react-toastify là để giúp xuất hiện cái toast
//để phía bên ngoài thằng <App/> để tất cả component con nằm trong đều có thê sử dụng toast
//mà không cần phải import lại <ToastContainer/> và file css

// connect socket to server and export socket to another component will can use
export const socket = io(linkServer)
socket.on('connect', () => {
  console.log('socket connected: ', socket.id);
})
socket.on('disconnect', ()=>{
  console.log('socket disconnected', socket.id);
})

const style = {
  width: '100vw',
  height: '100vh',
  position: 'relative'
}

const elementLoading = (
  <div style={style}>
    <CircularProgress color="primary" style={{position: 'absolute', top: '50%', left: '50%'}}/>
  </div>
)

function App() {
  const dispatch = useDispatch()

  useEffect(()=>{
    socket.on('onlineUserList', data => {
      dispatch(onlineUserAction.fetchAll(data))
    })

    socket.on('onlineUser', data => {
      dispatch(onlineUserAction.add(data))
    })

    socket.on('offlineUser', data => {
      dispatch(onlineUserAction.prepareRemove(data))
      setTimeout(()=>{
        //sau 10s, sẽ gửi lệnh remove tới reducer,
        //trong đó sẽ so sánh nếu chưa có add lại thì sẽ remove nó đi
        return dispatch(onlineUserAction.remove(data))
        //dispatch chỗ này nếu không có return thì sẽ bị lặp lại dispatch thêm 1 lần nữa
        //nguyên nhân: chưa hiểu chắc liên quan đến callback
      }, 10000)

      dispatch(invitationAction.prepareRemove(data))
      setTimeout(()=>{
        return dispatch(invitationAction.remove(data))
      }, 10000)
    })

    socket.on('settingFighting', data => {
      //when two players are in fighting room
      // console.log('settingFighting: ', data)
      dispatch(fightingAction.setting(data))
      dispatch(fightingPlayAction.playOnline())
    })

    socket.on('updateFightingUserList', data => {
      // console.log('updateFightingUserList : ', data)
      dispatch(onlineUserAction.updateFightingStatus(data))
      dispatch(invitationAction.updateFightingStatus(data))
    })

    socket.on('waitingFightingUser', data => {
      console.log('waitingFightingUser: ', data)
      dispatch(onlineUserAction.add(data))
    })
    //don't need to off event of socket, cause when component App unmount, 
    //it's mean exsit to this webapp
  }, [])
  
  return (
    <div>
      <Router>
        <NavBarMain/>
        <ToastContainer/>
        <InvitationModal/>
        <Suspense fallback={elementLoading}>
          <Routes>
            {routes && routes.length > 0 && (
              routes.map((item, index) => <Route key={index} path={item.path} /* exact={item.exact} */ element={item.element}/>)
            )}
          </Routes>
        </Suspense>
      </Router>
    </div>
  )
}

export default App
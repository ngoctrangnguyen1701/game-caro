import React, {Suspense, useContext} from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';

import CircularProgress from '@mui/material/CircularProgress';

import {AuthContext} from '../contexts/AuthContextProvider'
import GameCaroModalContextProvider from 'src/components/gameCaro/contexts/GameCaroModalContext';
// import GameCaro from '../components/gameCaro/GameCaro';
import GameCaroHeader from 'src/components/gameCaro/GameCaroHeader';
import GameCaroModal from 'src/components/gameCaro/modals/GameCaroModal'

const GameCaroPlayYourself = React.lazy(() => import ('../components/gameCaro/GameCaroPlayYourself'))
const GameCaroPlayOnline = React.lazy(() => import ('../components/gameCaro/GameCaroPlayOnline'))


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

const GameCaroPage = props => {
  const {username} = useContext(AuthContext).user

  
  return (
    <>
      {!username && <Navigate to='/login'/>}
      {/* <GameCaro/> */}
      <GameCaroModalContextProvider>
        <GameCaroHeader/>
        <GameCaroModal/>
        <Suspense fallback={elementLoading}>
          <Routes>
            <Route
              path='play-yourself'
              element={<GameCaroPlayYourself/>}
            />
            <Route
              path='play-online'
              element={<GameCaroPlayOnline/>}
            />
          </Routes>
        </Suspense>
      </GameCaroModalContextProvider>
    </>
  );
};

export default React.memo(GameCaroPage)

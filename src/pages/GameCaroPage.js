import React, {useContext} from 'react';
import { Navigate } from 'react-router-dom';

import {AuthContext} from '../contexts/AuthContextProvider'
import GameCaro from '../components/gameCaro/GameCaro';


const GameCaroPage = props => {
  const {username} = useContext(AuthContext).user
  
  return (
    <>
      {!username && <Navigate to='/login'/>}
      <GameCaro/>
    </>
  );
};

export default GameCaroPage

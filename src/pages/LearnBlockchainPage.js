import React from 'react'
import LearnBlockChain from 'src/components/learnBlockchain/LearnBlockChain';
import {AuthContext} from '../contexts/AuthContextProvider'
import { Navigate } from 'react-router-dom';

const LearnBlockchainPage = () => {
  const {username} = React.useContext(AuthContext).user

  return (
    <>
      {!username && <Navigate to='/login'/>}
      <LearnBlockChain/>
    </>
  );
};

export default React.memo(LearnBlockchainPage)
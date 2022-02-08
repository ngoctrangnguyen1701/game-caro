import React, {useState, useEffect, useContext} from 'react'
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import {
  Dialog, Grid
} from '@mui/material';

import { onlineUserListSelector } from 'src/selectors/onlineUserSelector';
import { GameCaroModalContext } from './contexts/GameCaroModalContext';

import GameCaroOpponent from './GameCaroOpponent';

const ModifyDialog = styled(Dialog)`
  // .css-1t1j96h-MuiPaper-root-MuiDialog-paper{
  //class có chữ 'css' này khi deploy lên product sẽ bị thay đổi
  //nên đừng lấy nó để set lại style cho material ui
  .MuiDialog-paperWidthSm{
    max-width: 800px;
    width: 800px;

    transform: ${props => props.showscale === 'true' ? 'scaleY(1)' : 'scaleY(0)'};
    transition: .3s;
  }
`


const GameCaroOpponentListModal = props => {
  // const {isShowModal, setIsShowModal, setPrepareShowOpponentListModal} = props
  const showOpponentListModal = useContext(GameCaroModalContext).state.showOpponentListModal
  const dispatchModalContext = useContext(GameCaroModalContext).dispatch

  const list = useSelector(onlineUserListSelector)

  const [showScale, setShowScale] = useState(false)

  useEffect(()=>{
    let deplayScaleTimeout
    if(showOpponentListModal){
      deplayScaleTimeout = setTimeout(()=>{
        setShowScale(true)
      }, 300)
    }
    else{
      setShowScale(false)
    }
    return () => clearTimeout(deplayScaleTimeout)
  }, [showOpponentListModal])

  const onClose = () => {
    // setIsShowModal(false);
    // setPrepareShowOpponentListModal(false)
    dispatchModalContext({type: 'SHOW_OPPONENT_LIST_MODAL', payload: false})
    dispatchModalContext({type: 'PREPARE_SHOW_OPPONENT_LIST_MODAL', payload: false})
  }
  
  let elementOpponent = []
  if(list && list.length > 0){
    elementOpponent = list.map((item, index) => (
      <GameCaroOpponent key={index} {...item}/>
    ))
  }

  return (
    <ModifyDialog
      // open={isShowModal}
      open={showOpponentListModal}
      onClose={onClose}
      showscale={showScale ? 'true' : 'false'}
    >
      <Grid container spacing={2} sx={{padding: 2}}>
        {elementOpponent}
      </Grid>
    </ModifyDialog>
  );
};

export default React.memo(GameCaroOpponentListModal);
import React from 'react'

import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import {
  Button,
  Tooltip,
} from '@mui/material'

import formatDate from 'src/common/formatDate';
import formatNumber from 'src/common/formatNumber';
import formatDotString from 'src/common/formatDotString';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { confirmRewardAction } from 'src/reducers/confirmReward/confirmRewardSlice';

const doneStyle = {
  width: '28px',
  height: '28px',
  textAlign: 'center',
  borderRadius: '50%',
  background: 'green',
  margin: '0 auto',
}

const noDoneStyle = {
  width: '28px',
  height: '28px',
  textAlign: 'center',
  borderRadius: '50%',
  background: 'red',
  margin: '0 auto',
}

const ReceiptItem = ({ item }) => {
  const dispatch = useDispatch()

  return (
    <tr className='text-center'>
      <td style={{ verticalAlign: 'middle' }}>{item.address}</td>
      <td style={{ verticalAlign: 'middle' }}>{formatNumber(item.paybackToken)}</td>
      <td style={{ verticalAlign: 'middle' }}>{formatDate(item.paybackTime * 1000)}</td>
      <td style={{ verticalAlign: 'middle' }}>
        <Tooltip title={item.transactionHash} arrow placement="top">
          <a href={`https://testnet.bscscan.com/tx/${item.transactionHash}`} target="_blank">{formatDotString(item.transactionHash)}</a>
        </Tooltip>
      </td>
      <td style={{ verticalAlign: 'middle' }}>
        <Button
          variant='contained'
          color='success'
        onClick={() => dispatch(confirmRewardAction.showModal({detail: item}))}
        >Detail</Button>
      </td>
      <td style={{ verticalAlign: 'middle' }}>
        {item.isRewarded ?
          <div style={doneStyle}>
            <DoneIcon />
          </div>
          :
          <div style={noDoneStyle}>
            <CloseIcon />
          </div>
        }
      </td>
      <td style={{ verticalAlign: 'middle' }}>{formatDate(item.rewardTime * 1000)}</td>
    </tr>
  )
};

export default React.memo(ReceiptItem);
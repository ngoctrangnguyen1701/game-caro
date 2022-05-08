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

  return (
    <>
      <tr className='text-center'>
        <td style={{ verticalAlign: 'middle' }}>{item.address}</td>
        <td style={{ verticalAlign: 'middle' }}>{formatNumber(item.paybackToken)}</td>
        <td style={{ verticalAlign: 'middle' }}>{formatDate(item.paybackTime)}</td>
        <td style={{ verticalAlign: 'middle' }}>{formatDotString(item.transactionHash)}</td>
        <td style={{ verticalAlign: 'middle' }}>
          {item.isPayback ?
            <div style={doneStyle}>
              <DoneIcon />
            </div>
            :
            <div style={noDoneStyle}>
              <CloseIcon />
            </div>
          }
        </td>
        <td style={{ verticalAlign: 'middle' }}>
          <Button 
            variant='contained' 
            color='success'
            // onClick={() => showDetail(item._id)}
          >Detail</Button>
        </td>
      </tr>
      {/* <tr style={{ display: listShowDetail.includes(item._id) ? 'table-row' : 'none' }}>
        <td colSpan={4}>
          <table className='table table-danger table-bordered'>
            <thead>
              <tr className='text-center'>
                <th>Payback Token</th>
                <th>Payback Time</th>
                <th>Transaction Hash</th>
              </tr>
            </thead>
            <tbody>
              <tr className='text-center'>
                <td>{item.paybackToken} PGC</td>
                <td>{formatDate(item.paybackTime)}</td>
                <td>
                  <Tooltip title={item.transactionHash} arrow placement="top">
                    <a href={`https://testnet.bscscan.com/tx/${item.transactionHash}`} target="_blank">{dotString(item.transactionHash)}</a>
                  </Tooltip>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr> */}
    </>
  )
};

export default React.memo(ReceiptItem);
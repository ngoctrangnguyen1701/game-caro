import React from 'react';
import moment from 'moment'
import { useNavigate } from "react-router-dom";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Tooltip,
} from '@mui/material'

import pgcApi from 'src/api/pgcApi';
import { useSelector } from 'react-redux';
import { ContractContext } from 'src/contexts/ContractContextProvider';
import { toast } from 'react-toastify';

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

const formatDate = timestamp => {
  if (timestamp) {
    return moment(timestamp).format('YYYY-MM-DD, HH:MM:SS')
  }
  return null
}

const dotString = string => {
  if(string) {
    const head = string.slice(0, 5)
    const foot = string.slice(string.length - 5)
    return `${head}...${foot}`
  }
}

const Dashboard = props => {
  const navigate = useNavigate() 
  const web3 = useSelector(state => state.web3.provider)
  const isAdmin = useSelector(state => state.wallet.isAdmin)
  const account = useSelector(state => state.wallet.account)
  // const exContract = useSelector(state => state.contract.pgc.contract)

  const {exPGC, newPGC} = React.useContext(ContractContext)

  const [list, setList] = React.useState([])
  const [listShowDetail, setListShowDetail] = React.useState([])

  const [isShowModal, setIsShowModal] = React.useState(false)
  const [id, setId] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [paybackToken, setPaybackToken] = React.useState('')

  React.useEffect(() => {
    if (isAdmin) {
      pgcApi.requestTokenList().then(response => {
        setList(response.data)
      }).catch(err => {
        console.log(err);
      })
    }
    else {
      // navigate('/') //--> tắt chức năng đẩy về
    }
  }, [isAdmin])

  const showDetail = id => {
    let newArr = []
    if (listShowDetail.includes(id)) {
      newArr = listShowDetail.filter(item => item !== id)
    }
    else {
      newArr = [...listShowDetail, id]
    }
    setListShowDetail(newArr)
  }



  const RequestItem = ({item}) => {
    return (
      <>
        <tr className='text-center'>
          <td style={{ verticalAlign: 'middle' }}>{item.address}</td>
          <td style={{ verticalAlign: 'middle' }}>{formatDate(item.requestTime)}</td>
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
            <Button variant='contained' color='success' onClick={() => showDetail(item._id)}>Detail</Button>
          </td>
        </tr>
        <tr style={{ display: listShowDetail.includes(item._id) ? 'table-row' : 'none'}}>
          {/* <tr> */}
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
        </tr>
      </>
    )
  }


  return (
    <div className='mt-5'>
      <h3 className='text-center'>Request Token List</h3>
      <table className="table table-striped table-dark table-hover table-bordered">
        <thead>
          <tr style={{ textAlign: 'center' }}>
            <th className='bg-warning text-dark'>Address</th>
            <th className='bg-warning text-dark'>Request Time</th>
            <th className='bg-warning text-dark'>Payback</th>
            <th className='bg-warning text-dark'></th>
          </tr>
        </thead>
        <tbody>
          {list && list.length > 0 ?
            list.map((item, index) => <RequestItem item={item} key={index}/>)
             : <tr><td colSpan="4" className='text-center'>No Data</td></tr>
          }
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(Dashboard);
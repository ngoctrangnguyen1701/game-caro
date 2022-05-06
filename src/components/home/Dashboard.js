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
import styled from 'styled-components';
import formatNumber from 'src/common/formatNumber'

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

const Amount = styled.div`
  font-size: 20px;
  span {
    font-weight: bold;
  }
`

const formatDate = timestamp => {
  if (timestamp) {
    return moment(timestamp).format('YYYY-MM-DD, HH:MM:SS')
  }
  return null
}

const dotString = string => {
  if (string) {
    const head = string.slice(0, 5)
    const foot = string.slice(string.length - 5)
    return `${head}...${foot}`
  }
}

let i = 0
const Dashboard = props => {
  const navigate = useNavigate()
  const web3 = useSelector(state => state.web3.provider)
  const { isAdmin, account } = useSelector(state => state.wallet)
  // const exContract = useSelector(state => state.contract.pgc.contract)

  const { pgc, tokenSwap } = React.useContext(ContractContext).contractList

  const [list, setList] = React.useState([])
  const [listShowDetail, setListShowDetail] = React.useState([])

  // const [isShowModal, setIsShowModal] = React.useState(false)
  // const [id, setId] = React.useState('')
  // const [address, setAddress] = React.useState('')
  // const [paybackToken, setPaybackToken] = React.useState('')
  const [approvalNewToken, setApprovalNewToken] = React.useState('')
  const [allowanceNewToken, setAllowanceNewToken] = React.useState('0')

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

  React.useEffect(() => {
    if (web3 && pgc.contract.methods) {
      getAllowanceNewToken()
    }
  }, [web3, pgc])


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

  const onConfirmValue = value => {
    const regex = /^[0-9]+$/
    //https://stackoverflow.com/questions/9011524/regex-to-check-whether-a-string-contains-only-numbers
    //check a string contain only number
    if (value && regex.test(value)) {
      setApprovalNewToken(value)
    }
  }
  const getAllowanceNewToken = async () => {
    const balanceWei = await pgc.contract.methods.allowance(account, tokenSwap.address).call()
    const balance = await web3.utils.fromWei(balanceWei)
    // console.log('getAllowanceNewToken', balance);
    setAllowanceNewToken(balance)
  }


  const onChangeAllowanceNewToken = async (type) => {
    if (parseFloat(approvalNewToken) > 0) {
      try {
        const balanceWei = await web3.utils.toWei(approvalNewToken)

        const gasPrice = await web3.eth.getGasPrice()
        let gas
        let data
        if (type === 'increase') {
          gas = await pgc.contract.methods.increaseAllowance(tokenSwap.address, balanceWei)
            .estimateGas({
              gas: 50000,
              from: account,
              value: '0'
            })
          data = await pgc.contract.methods.increaseAllowance(tokenSwap.address, balanceWei).encodeABI()
          //encondeABI tương đương với việc chuyển đổi thành chuỗi Hex
        }
        else {
          gas = await pgc.contract.methods.decreaseAllowance(tokenSwap.address, balanceWei)
            .estimateGas({
              gas: 50000,
              from: account,
              value: '0'
            })
          data = await pgc.contract.methods.decreaseAllowance(tokenSwap.address, balanceWei).encodeABI()
        }

        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            gasPrice: web3.utils.toHex(gasPrice),
            gas: web3.utils.toHex(gas),
            from: account,
            to: pgc.address,
            value: '0',
            data
          }]
        })
        // console.log(txHash);
        let intervalGetReceipt
        let receipt

        //khi metamask gửi transaction sẽ trả về 1 cái hash
        //nhưng mà cái transaction đó vẫn chưa được ghi vào blockchain(chưa được đào)
        //nên khi gọi methods 'getTransactionReceipt' sẽ trả về null
        //khi nào transaction đó được ghi nhận vào blockchain(đã được đào)
        //thì nó sẽ trả về object
        intervalGetReceipt = setInterval(async() => {
          receipt = await web3.eth.getTransactionReceipt(txHash);
          // console.log(receipt);
          if(receipt) {
            clearInterval(intervalGetReceipt)
            getAllowanceNewToken()
            toast.success('Change appoval new token successfully')
          }
        }, 1000)

      } catch (error) {
        toast.error(error.message)
      }
      setApprovalNewToken('')
    }
  }
  const RequestItem = ({ item }) => {
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
        <tr style={{ display: listShowDetail.includes(item._id) ? 'table-row' : 'none' }}>
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
      <div className='frame-info-admin container'>
        <p className='mb-0 text-danger'>Amount of approval new token</p>
        <form className='mb-3'>
          <input
            className='form-control rounded-0'
            value={approvalNewToken}
            onChange={e => onConfirmValue(e.target.value)}
            style={{ width: '300px' }}
          />
          <div className='mt-1'>
            <Button
              variant='contained'
              color="primary"
              className='rounded-0 me-2'
              onClick={() => onChangeAllowanceNewToken('increase')}
            >Increase </Button>
            <Button
              variant='contained'
              color="primary"
              className='rounded-0'
              onClick={() => onChangeAllowanceNewToken('decrease')}
            >Decrease </Button>
          </div>
        </form>
        <div className='d-flex'>
          <div className='border border-success p-1'>
            <div className='border border-success p-3'>
              <Amount>
                Allowance of new token: <span>{formatNumber(parseFloat(allowanceNewToken))} PGC</span>
              </Amount>
              <Amount>
                {/* Total payback token: <span> PGC</span> */}
              </Amount>
            </div>
          </div>
        </div>


      </div>
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
            list.map((item, index) => <RequestItem item={item} key={index} />)
            : <tr><td colSpan="4" className='text-center'>No Data</td></tr>
          }
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(Dashboard);
import React from 'react'
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'

import pgcApi from 'src/api/pgcApi'
import formatNumber from 'src/common/formatNumber'
import abi from 'src/common/abi'
import { pgcSelector } from 'src/selectors/contractSelector'
import { fullscreenLoadingAction } from 'src/reducers/fullscreenLoading/fullscreenLoadingSlice'

import ReceiptItem from './ReceiptItem'
import { paybackTokenAction } from 'src/reducers/paybackToken/paybackTokenSlice'
import DualRingLoading from '../global/DualRingLoading'
import Pagination from '../global/Pagination'

const Amount = styled.div`
  font-size: 20px;
  span {
    font-weight: bold;
  }
`

const Dashboard = props => {
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const web3 = useSelector(state => state.web3.provider)
  const { isAdmin, account } = useSelector(state => state.wallet)
  const pgc = useSelector(pgcSelector)
  const { loading, list, message } = useSelector(state => state.paybackToken)

  // const [list, setList] = React.useState([])
  const [listShowDetail, setListShowDetail] = React.useState([])

  const [approvalNewToken, setApprovalNewToken] = React.useState('')
  const [allowanceNewToken, setAllowanceNewToken] = React.useState('0')
  const [filterAddress, setFilterAddress] = React.useState('')
  const [filterTransaction, setFilterTransaction] = React.useState('')
  const [sortBy, setSortBy] = React.useState('default')

  React.useEffect(() => {
    if (isAdmin) {
      dispatch(paybackTokenAction.getList())
    }
    else {
      // navigate('/') //--> tắt chức năng đẩy về
    }
  }, [isAdmin])

  React.useEffect(() => {
    if (web3 && pgc.methods) getAllowanceNewToken()
  }, [web3, pgc])

  React.useEffect(() => {
    if (message) {
      toast.warning(message)
    }
    return () => dispatch(paybackTokenAction.clearState())
  }, [message])

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
    const balanceWei = await pgc.methods.allowance(account, abi.tokenSwap.address).call()
    const balance = await web3.utils.fromWei(balanceWei)
    setAllowanceNewToken(balance)
  }


  const onChangeAllowanceNewToken = async (type) => {
    if (parseFloat(approvalNewToken) > 0) {
      dispatch(fullscreenLoadingAction.showLoading(true))

      try {
        const balanceWei = await web3.utils.toWei(approvalNewToken)
        const gasPrice = await web3.eth.getGasPrice()
        let gas
        let data
        if (type === 'increase') {
          gas = await pgc.methods.increaseAllowance(abi.tokenSwap.address, balanceWei)
            .estimateGas({
              gas: 50000,
              from: account,
              value: '0'
            })
          data = await pgc.methods.increaseAllowance(abi.tokenSwap.address, balanceWei).encodeABI()
          //encondeABI tương đương với việc chuyển đổi thành chuỗi Hex
        }
        else {
          gas = await pgc.methods.decreaseAllowance(abi.tokenSwap.address, balanceWei)
            .estimateGas({
              gas: 50000,
              from: account,
              value: '0'
            })
          data = await pgc.methods.decreaseAllowance(abi.tokenSwap.address, balanceWei).encodeABI()
        }

        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            gasPrice: web3.utils.toHex(gasPrice),
            gas: web3.utils.toHex(gas),
            from: account,
            to: abi.pgc.address,
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
        intervalGetReceipt = setInterval(async () => {
          receipt = await web3.eth.getTransactionReceipt(txHash);
          // console.log(receipt);
          if (receipt) {
            clearInterval(intervalGetReceipt)
            getAllowanceNewToken()
            toast.success('Change appoval new token successfully')
            dispatch(fullscreenLoadingAction.showLoading(false))
            setApprovalNewToken('')
          }
        }, 1000)

      } catch (error) {
        toast.error(error.message)
        dispatch(fullscreenLoadingAction.showLoading(false))
        setApprovalNewToken('')
      }
    }
  }

  const onPageChange = (value) => {
    const payload = {
      address: filterAddress ? filterAddress.toLowerCase() : null,
      transactionHash: filterTransaction ? filterTransaction : null,
      sortBy: sortBy === 'default' ? null : sortBy,
      page: value
    }
    dispatch(paybackTokenAction.getList(payload))
  }

  const onSortBy = value => {
    setSortBy(value)
    const payload = {
      address: filterAddress ? filterAddress.toLowerCase() : null,
      transactionHash: filterTransaction ? filterTransaction : null,
      sortBy: value === 'default' ? null : value,
      page: 1, //khi nào có sortBy thì sẽ trả về tìm kiếm từ page 1
    }
    dispatch(paybackTokenAction.getList(payload))
  }

  const onSearch = () => {
    setSortBy('default')
    const payload = {
      address: filterAddress ? filterAddress.toLowerCase() : null,
      transactionHash: filterTransaction ? filterTransaction : null,
      sortBy: null, //khi nào có search thì sẽ trả về tìm kiếm theo sắp xếp mặc định
      page: 1, //khi nào có search thì sẽ trả về tìm kiếm từ page 1
    }
    dispatch(paybackTokenAction.getList(payload))
  }

  const onReset = () => {
    setSortBy('default')
    setFilterAddress('')
    setFilterTransaction('')
    dispatch(paybackTokenAction.getList())
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
      <h3 className='text-center mt-3 text-primary'>Payback Token List</h3>
      <div className='container'>
        <div>
          <TextField
            label="Address"
            variant="outlined"
            color='primary'
            value={filterAddress}
            onChange={e => setFilterAddress(e.target.value)}
          />
          <TextField
            label="Transaction"
            variant="outlined"
            color='secondary'
            value={filterTransaction}
            onChange={e => setFilterTransaction(e.target.value)}
            className="mx-2"
          />
          <FormControl>
            <InputLabel id="demo-simple-select-label">Sort by</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={sortBy}
              label="Sort By"
              onChange={e => onSortBy(e.target.value)}
            >
              <MenuItem value='default'>Default</MenuItem>
              <MenuItem value='latest'>Latest</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
          <Button
            variant='contained'
            color='error'
            className='m-1'
            onClick={onSearch}
          >
            Search
          </Button>
          <Button
            variant='outlined'
            color='warning'
            className='m-1'
            onClick={onReset}
          >
            Reset
          </Button>
        </div>
      </div>
      <table className="table table-striped table-dark table-hover table-bordered">
        <thead>
          <tr style={{ textAlign: 'center' }}>
            <th className='bg-warning text-dark'>Address</th>
            <th className='bg-warning text-dark'>Payback Token</th>
            <th className='bg-warning text-dark'>Payback Time</th>
            <th className='bg-warning text-dark'>Hash</th>
            <th className='bg-warning text-dark'>Reward</th>
            <th className='bg-warning text-dark'>Action</th>
          </tr>
        </thead>
        <tbody>
          {loading &&
            <tr>
              <td colSpan={6}>
                <div className='d-flex justify-content-center'>
                  <DualRingLoading showLoading={loading} />
                </div>
              </td>
            </tr>}
          {!loading && list && list.length > 0 &&
            list.map((item, index) => <ReceiptItem item={item} key={index} />)
          }
          {!loading && list && list.length === 0 &&
            <tr><td colSpan="6" className='text-center'>No Data</td></tr>
          }
        </tbody>
      </table>
      {!loading && list && list.length > 0 &&
        <div className='mb-5'>
          <Pagination
            page={1}
            totalPages={10}
            onPageChange={onPageChange}
          />
        </div>
      }
    </div>
  );
};

export default React.memo(Dashboard);
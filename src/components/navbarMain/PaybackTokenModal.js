import React from 'react';
import {
  Typography,
  Button,
  Dialog,
  DialogContent,
  Divider
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  exPGCSelector,
  tokenSwapSelector,
  pgcSelector,
} from 'src/selectors/contractSelector'
import abi from 'src/common/abi';
import formatNumber from 'src/common/formatNumber';
import { walletAction } from 'src/reducers/wallet/walletSlice';
import { fullscreenLoadingAction } from 'src/reducers/fullscreenLoading/fullscreenLoadingSlice';
import {paybackTokenAction} from 'src/reducers/paybackToken/paybackTokenSlice';
import { Web3Context } from 'src/contexts/Web3ContextProvider';
import paybackTokenApi from 'src/api/paybackTokenApi';

const PaybackTokenModal = (props) => {
  const dispatch = useDispatch()
  const web3 = React.useContext(Web3Context)

  const { account, exToken } = useSelector(state => state.wallet)
  const tokenSwap = useSelector(tokenSwapSelector)
  const exPGC = useSelector(exPGCSelector)
  const pgc = useSelector(pgcSelector)
  const {status, message: messagePaybackToken, isShowModal} = useSelector(state => state.paybackToken)

  const [paybackToken, setPaybackToken] = React.useState('')
  const [message, setMessage] = React.useState('')

  React.useEffect(() => {
    if (exPGC.methods) getExToken()
  }, [exPGC])

  React.useEffect(() => {
    if (parseFloat(exToken) === 0 || parseFloat(paybackToken) === 0) {
      setMessage('Token equal 0 that can not be received payback')
    }
    else if (parseFloat(paybackToken) > parseFloat(exToken)) {
      setMessage('Payback token can not be less than balance old token')
    }
    else {
      setMessage('')
    }
  }, [exToken, paybackToken])

  React.useEffect(() => {
    if(status) {
      if(status === 'success') {
        toast.success(messagePaybackToken)
      }
      else {
        toast.error(messagePaybackToken)
      }
      setPaybackToken('')
    }
  }, [status, messagePaybackToken])

  React.useEffect(() => {
    if(isShowModal) {
      getExToken() //cập nhật lại token cũ hiện có mỗi khi show modal lên
    }
    else {
      setPaybackToken('')
    }
  }, [isShowModal])

  const onConfirmValue = value => {
    const regex = /^[0-9]+$/
    //https://stackoverflow.com/questions/9011524/regex-to-check-whether-a-string-contains-only-numbers
    //check a string contain only number
    if (value && regex.test(value)) {
      setPaybackToken(value)
    }
  }

  const getExToken = async () => {
    //số token ở contract pgc cũ
    const balanceWei = await exPGC.methods.balanceOf(account).call()
    const balanceExToken = await web3.utils.fromWei(balanceWei)
    dispatch(walletAction.setExToken({exToken: balanceExToken}))
  }

  const onTakeBackMyToken = async () => {
    try {
      const balanceWei = await web3.utils.toWei(paybackToken)
      const gasPrice = await web3.eth.getGasPrice()
      const gas = await tokenSwap.methods.swap(balanceWei)
        .estimateGas({
          gas: 500000,
          from: account,
          value: '0'
        })
      const data = await tokenSwap.methods.swap(balanceWei).encodeABI()
      //encondeABI tương đương với việc chuyển đổi thành chuỗi Hex

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          gasPrice: web3.utils.toHex(gasPrice),
          gas: web3.utils.toHex(gas),
          from: account,
          to: abi.tokenSwap.address,
          value: '0',
          data
        }]
      })

      let intervalGetReceipt
      let receipt
      intervalGetReceipt = setInterval(async () => {
        receipt = await web3.eth.getTransactionReceipt(txHash)
        if (receipt) {
          clearInterval(intervalGetReceipt)
          const blockNumber = await web3.eth.getBlock(receipt.blockNumber)

          //CALL API
          const payload = {
            address: account,
            paybackToken,
            paybackTime: blockNumber.timestamp,
            transactionHash: txHash
          }
          const res = await paybackTokenApi.submitReceipt(payload)
          toast.success(`You have received ${res.data.paybackToken} PGC`)
          dispatch(paybackTokenAction.showModal(false))
          dispatch(fullscreenLoadingAction.showLoading(false))
          getToken()
        }
      }, 1000)
    } catch (error) {
      toast.error(error.message)
      dispatch(paybackTokenAction.showModal(false))
      dispatch(fullscreenLoadingAction.showLoading(false))
    }
  }

  //Đầu tiên để có thể swap token cũ và token mới, người dùng phải approve cho contract 'tokenSwap' số lượng token cũ, sau đó mới gọi đến hàm'swap' của contract 'tokenSwap' (phía chủ của token mới cũng phải approve cho contract 'tokenSwap' sử dụng 1 lượng token mới tương ứng)
  const onApprove = async () => {
    if (parseFloat(paybackToken) > 0) {
      try {
        dispatch(fullscreenLoadingAction.showLoading(true))
        const balanceWei = await web3.utils.toWei(paybackToken)

        const gasPrice = await web3.eth.getGasPrice()
        const gas = await exPGC.methods.approve(abi.tokenSwap.address, balanceWei)
          .estimateGas({
            gas: 50000,
            from: account,
            value: '0'
          })
        const data = await exPGC.methods.approve(abi.tokenSwap.address, balanceWei).encodeABI()
        //encondeABI tương đương với việc chuyển đổi thành chuỗi Hex
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            gasPrice: web3.utils.toHex(gasPrice),
            gas: web3.utils.toHex(gas),
            from: account,
            to: abi.exPGC.address,
            value: '0',
            data
          }]
        })

        let intervalGetReceipt
        let receipt
        intervalGetReceipt = setInterval(async () => {
          receipt = await new web3.eth.getTransactionReceipt(txHash)
          if (receipt) {
            clearInterval(intervalGetReceipt)
            onTakeBackMyToken()
          }
        }, 1000)
      } catch (error) {
        toast.error(error.message)
        dispatch(paybackTokenAction.showModal(false))
        dispatch(fullscreenLoadingAction.showLoading(false))
      }
    }
    else {
      toast.error('Token equal 0 that can not be received payback')
      dispatch(paybackTokenAction.showModal(false))
    }
  }

  const getToken = async () => {
    //số token ở contract pgc hiện tại
    const balanceWei = await pgc.methods.balanceOf(account).call()
    const balanceToken = await web3.utils.fromWei(balanceWei)
    dispatch(walletAction.setToken({ token: balanceToken }))
  }

  return (
    <Dialog
      open={isShowModal}
      onClose={() => dispatch(paybackTokenAction.showModal(false))}
    >
      <DialogContent>
        <Typography id="modal-modal-title" variant="h6" color="error" className='mb-3'>
          Please check and input information
        </Typography>
        <p className='mb-0'>Address: <span style={{ fontWeight: 'bold' }}>{account}</span></p>
        <p className='mb-0'>Balance old token: <span style={{ fontWeight: 'bold' }}> {formatNumber(exToken)} PGC</span></p>
        <Divider variant="middle" className="w-50 mx-auto my-4" />
        <div>
          <label className='text-primary'>Want to payback</label>
          <input
            className='form-control border-primary'
            value={paybackToken}
            onChange={e => onConfirmValue(e.target.value)}
            disabled={parseFloat(exToken) === 0 ? true : false}
          />
        </div>
        <span className='text-danger' style={{ fontSize: '14px', fontStyle: 'italic' }}>{message}</span>
        <Button
          variant="contained"
          color="primary"
          className="d-block mx-auto mt-3"
          onClick={onApprove}
          disabled={message ? true : false}
        >
          Submit
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(PaybackTokenModal);
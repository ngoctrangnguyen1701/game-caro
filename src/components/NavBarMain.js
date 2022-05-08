import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';

import { AuthContext } from '../contexts/AuthContextProvider'
import { socket } from 'src/App'

import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Container,
  Avatar,
  Grid,
  Tooltip,
  Button,
  Dialog,
  DialogContent,
} from '@mui/material'

import { fightingAction } from 'src/reducers/fighting/playSlice'
import { walletAction } from 'src/reducers/wallet/wallet'
import { contractAction } from 'src/reducers/contract/contractSlice'
import { fullscreenLoadingAction } from 'src/reducers/fullscreenLoading/fullscreenLoadingSlice'

import { fightingIsPlayOnlineSelector, fightingStatusSelector } from 'src/selectors/fightingSelector'

import paybackTokenApi from 'src/api/paybackTokenApi'

import {
  pgcSelector,
  exPGCSelector,
  tokenSwapSelector,
} from 'src/selectors/contractSelector'

import formatNumber from 'src/common/formatNumber'
import abi from 'src/common/abi'

const NavBarMain = () => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(AuthContext)
  const { username, avatar, } = user

  const dispatch = useDispatch()
  const status = useSelector(fightingStatusSelector)
  const isPlayOnline = useSelector(fightingIsPlayOnlineSelector)

  const web3 = useSelector(state => state.web3.provider)
  const { account, token, isAdmin } = useSelector(state => state.wallet)
  const pgc = useSelector(pgcSelector)
  const exPGC = useSelector(exPGCSelector)
  const tokenSwap = useSelector(tokenSwapSelector)

  const [isShowModal, setIsShowModal] = React.useState(false)
  const [paybackToken, setPaybackToken] = React.useState('')

  useEffect(() => {
    if (web3) {
      //CONNECT METAMASK
      const connectMetamask = async () => {
        if (!window.ethereum) {
          return toast.error('Please connect to Metamask')
        }
        else {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          dispatch(walletAction.setAccount({ account: accounts[0] }))

          window.ethereum.on('accountsChanged', () => {
            //lắng nghe sự kiện khi có sự thay đổi account ở metamask, trang sẽ reload
            window.location.reload()
          })

          //CONNECT CONTRACT VIA SAGA
          dispatch(contractAction.connect('pgc'))
          dispatch(contractAction.connect('exPGC'))
          dispatch(contractAction.connect('tokenSwap'))
        }
      }
      connectMetamask()
    }
  }, [web3])

  useEffect(() => {
    if (pgc.methods) getToken()
      //đã lấy được các methods của contract 'pgc'
  }, [pgc])

  useEffect(() => {
    if (pgc.methods) getExToken()
  }, [exPGC])

  useEffect(() => {
    if (status === 'setting' && isPlayOnline) {
      console.log(`navigate('/game-caro/play-online')`)
      navigate('/game-caro/play-online')
    }
  }, [status, isPlayOnline])

  const handleLogOut = () => {
    localStorage.clear()
    sessionStorage.clear()
    navigate('/')
    setUser({}) //--> set empty object for authContext of setUser
    socket.emit('offline', { username, socketId: socket.id })
    dispatch(fightingAction.waiting())
  }

  const getExToken = async () => {
    //số token ở contract pgc cũ
    const balanceWei = await exPGC.methods.balanceOf(account).call()
    const balanceExToken = await web3.utils.fromWei(balanceWei)
    setPaybackToken(balanceExToken)
  }

  const getToken = async () => {
    //số token ở contract pgc hiện tại
    const balanceWei = await pgc.methods.balanceOf(account).call()
    const balanceToken = await web3.utils.fromWei(balanceWei)
    dispatch(walletAction.setToken({ token: balanceToken }))
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
          paybackTokenApi.submitReceipt(payload).then(
            response => {
              getToken()
              getExToken()
              dispatch(fullscreenLoadingAction.showLoading(false))
              toast.success(`You have received ${paybackToken} PGC`)
              setIsShowModal(false)
            }
          ).catch(err => {
            toast.error(err.message)
            dispatch(fullscreenLoadingAction.showLoading(false))
            setIsShowModal(false)
          })
        }
      }, 1000)
    } catch (error) {
      setIsShowModal(false)
      toast.error(error.message)
      dispatch(fullscreenLoadingAction.showLoading(false))
    }
  }

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
        intervalGetReceipt = setInterval(async() => {
          receipt = await new web3.eth.getTransactionReceipt(txHash)
          if(receipt) {
            clearInterval(intervalGetReceipt)
            onTakeBackMyToken()
          }
        }, 1000)
      } catch (error) {
        toast.error(error.message)
        setIsShowModal(false)
        dispatch(fullscreenLoadingAction.showLoading(false))
      }
    }
    else {
      toast.error('Token equal 0 that can not be received payback')
      setIsShowModal(false)
    }
  }


  return (
    <AppBar position="static" style={{ backgroundColor: '#121212' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters className="d-flex">
          <Grid item xs={3} className="d-flex align-items-center">
            <Link to='/' className='d-block'>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ mr: 2, display: 'inline-block' }}
              >
                HOME
              </Typography>
            </Link>
            {isAdmin &&
              <Link to="/admin" className='d-block'>
                <Button
                  color='warning'
                  variant='outlined'
                  className="me-2"
                >Dashboard</Button>
              </Link>
            }
          </Grid>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {!isAdmin &&
              <>
                <Button
                  color='secondary'
                  variant='contained'
                  onClick={() => setIsShowModal(true)}
                  className="me-2"
                >Take back my token</Button>
              </>
            }
            <span className='d-inline-block me-2'>{formatNumber(token)} PGC</span>
            {isAdmin ?
              <Link to="/admin/mint">
                <Button variant="outlined" color="error" className='me-2'>
                  Mint
                </Button>
              </Link>
              :
              <Link to="/buy-pgc">
                <Button variant="outlined" color="error" className='me-2'>
                  Buy more
                </Button>
              </Link>
            }
            {username ? (
              <div className='d-flex align-items-center'>
                <Tooltip title="Edit profile">
                  <Link to='/profile' className='d-inline-block me-2'>
                    <div className='d-flex align-items-center'>
                      <h5 className='d-inline-block me-2 mb-0'>{username || ''}</h5>
                      <Avatar
                        alt={username}
                        src={avatar || "/static/images/avatar/1.jpg"}
                      />
                    </div>
                  </Link>
                </Tooltip>
                <h5
                  className='d-inline-block mb-0 text-primary'
                  style={{ cursor: 'pointer' }}
                  onClick={handleLogOut}
                >Log out</h5>
              </div>
            ) : (
              <Link to='/login'>
                <h5 className='d-inline-block me-2 text-right'>Log in</h5>
              </Link>
            )}
          </Box>
        </Toolbar>
        <Dialog
          open={isShowModal}
          onClose={() => setIsShowModal(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <Typography id="modal-modal-title" variant="h6" color="error" className='mb-3'>
              Please check information
            </Typography>
            <p className='mb-0'>Address: <span style={{ fontWeight: 'bold' }}>{account}</span></p>
            <p className='mb-0'>Payback token: <span style={{ fontWeight: 'bold' }}> {paybackToken} PGC</span></p>
            <Button
              variant="contained"
              color="success"
              className="d-block mx-auto mt-3"
              onClick={onApprove}
            >
              Submit
            </Button>
          </DialogContent>
        </Dialog>
      </Container>
    </AppBar>
  );
};
export default React.memo(NavBarMain);
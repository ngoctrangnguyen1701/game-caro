import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

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

import { fightingIsPlayOnlineSelector, fightingStatusSelector } from 'src/selectors/fightingSelector'
import { fightingAction } from 'src/reducers/fighting/playSlice';
import { toast } from 'react-toastify';
// import pgcApi from 'src/api/pgcApi'
import { walletAction } from 'src/reducers/wallet/wallet'
import { ContractContext } from 'src/contexts/ContractContextProvider';
// import { contractAction } from 'src/reducers/contract/contractSlice';
import paybackTokenApi from 'src/api/paybackTokenApi';

const NavBarMain = () => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(AuthContext)
  const { username, avatar, } = user
  const { contractList, interactContract } = useContext(ContractContext)
  const { pgc, exPGC, tokenSwap } = contractList

  const dispatch = useDispatch()
  const status = useSelector(fightingStatusSelector)
  const isPlayOnline = useSelector(fightingIsPlayOnlineSelector)

  const web3 = useSelector(state => state.web3.provider)
  const { account, token, isAdmin } = useSelector(state => state.wallet)
  // const isAdmin = useSelector(state => state.wallet.isAdmin)

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
          interactContract('pgc')
          // interactContract('tokenSwap')

          window.ethereum.on('accountsChanged', () => {
            //lắng nghe sự kiện khi có sự thay đổi account ở metamask, trang sẽ reload
            window.location.reload()
          })
        }
      }
      connectMetamask()
    }
  }, [web3])

  useEffect(() => {
    if (account && pgc.contract.methods) {
      //khi nào đã có các methods của contract 'pgc', 
      //mới gọi để set up methods của contract 'tokenSwap'
      //nếu gọi hàm 'interactContract' cùng lúc, thì nó không lấy được hết các methods bỏ vào tương ứng với contract (bi lấy cái sau cùng)
      const getToken = async () => {
        interactContract('exPGC')
        //số token ở contact hiện tại
        const balanceWei = await pgc.contract.methods.balanceOf(account).call()
        const token = await web3.utils.fromWei(balanceWei)
        dispatch(walletAction.setToken({ token }))
      }
      getToken()
    }
  }, [account, pgc])

  useEffect(() => {
    if (account && exPGC.contract.methods) {
      interactContract('tokenSwap')
      getExToken()
    }
  }, [account, exPGC])

  useEffect(() => {
    if(!contractList.tokenSwap.contract.methods) interactContract('tokenSwap')
    //sau khi obj 'exPGC' đã có các methods của contract,
    //mới gọi hàm interactContract để có thể lấy các methods của contract tiếp theo
    //còn nếu gọi 2 cái liên tiếp thì nó lại lấy cái state cũ ở contract
  }, [contractList])

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
    interactContract('exPGC')
    //số token ở contract pgc cũ
    const balanceWei = await exPGC.contract.methods.balanceOf(account).call()
    const balanceExToken = await web3.utils.fromWei(balanceWei)
    setPaybackToken(balanceExToken)
  }

  const onTakeBackMyToken = async () => {
    try {
      const balanceWei = await web3.utils.toWei(paybackToken)
  
      const gasPrice = await web3.eth.getGasPrice()
      const gas = await tokenSwap.contract.methods.swap(balanceWei)
        .estimateGas({
          gas: 50000,
          from: account,
          value: '0'
        })
      const data = await tokenSwap.contract.methods.swap(balanceWei).encodeABI()
      //encondeABI tương đương với việc chuyển đổi thành chuỗi Hex
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          gasPrice: web3.utils.toHex(gasPrice),
          gas: web3.utils.toHex(gas),
          from: tokenSwap.address,
          to: account,
          value: '0',
          data
        }]
      })
      // console.log('onTakeBackMyToken: ', txHash);
      let intervalGetReceipt
      let receipt
      intervalGetReceipt = setInterval(async() => {
        receipt = await web3.eth.getTransactionReceipt(txHash)
        if(receipt) {
          console.log(receipt);
          clearInterval(intervalGetReceipt)

          const blockNumber = await web3.eth.getBlock(receipt.blockNumber)
          console.log(blockNumber)
          
          //CALL API
          const payload = {
            address: account,
            paybackToken,
            // paybackTime: new Date().getTime(),
            paybackTime: blockNumber.timestamp,
            transactionHash: txHash
          }
          paybackTokenApi.submitReceipt(payload).then(
            response => {
              getExToken()
              toast.success(`You have received ${paybackToken} PGC`)
              setIsShowModal(false)
            }
          ).catch(err => toast.error(err.message))
        }
      }, 1000)
      
      setIsShowModal(false)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const onApprove = async () => {
    if (parseFloat(paybackToken) > 0) {
      try {
        const balanceWei = await web3.utils.toWei(paybackToken)

        const gasPrice = await web3.eth.getGasPrice()
        const gas = await exPGC.contract.methods.approve(tokenSwap.address, balanceWei)
          .estimateGas({
            gas: 50000,
            from: account,
            value: '0'
          })
        const data = await exPGC.contract.methods.approve(tokenSwap.address, balanceWei).encodeABI()
        //encondeABI tương đương với việc chuyển đổi thành chuỗi Hex
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            gasPrice: web3.utils.toHex(gasPrice),
            gas: web3.utils.toHex(gas),
            from: account,
            to: exPGC.address,
            value: '0',
            data
          }]
        })
        // console.log('onApprove: ', txHash);
        onTakeBackMyToken()
      } catch (error) {
        // console.log(error);
        toast.error(error.message)
      }
    }
    else {
      toast.error('Token equal 0 that can be received payback')
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
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {username ? (
              <div className='d-flex align-items-center'>
                {!isAdmin &&
                  <>
                    <Button
                      color='secondary'
                      variant='contained'
                      onClick={() => setIsShowModal(true)}
                      className="me-2"
                    >Take back my token</Button>
                    <span className='d-inline-block me-2'>{token} PGC</span>
                    <Link to="/buy-pgc">
                      <Button variant="outlined" color="error" className='me-2'>
                        Buy more
                      </Button>
                    </Link>
                  </>
                }

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

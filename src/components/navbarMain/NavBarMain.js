import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import Web3 from 'web3';

import { AuthContext } from '../../contexts/AuthContextProvider'
import { socket } from 'src/App'
import abi from 'src/common/abi';

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
} from '@mui/material'

import { fightingAction } from 'src/reducers/fighting/playSlice'
import { walletAction } from 'src/reducers/wallet/walletSlice'
import { contractAction } from 'src/reducers/contract/contractSlice'

import { fightingIsPlayOnlineSelector, fightingStatusSelector } from 'src/selectors/fightingSelector'

import {
  pgcSelector,
} from 'src/selectors/contractSelector'

import formatNumber from 'src/common/formatNumber'
import PaybackTokenModal from './PaybackTokenModal';
import { paybackTokenAction } from 'src/reducers/paybackToken/paybackTokenSlice';
import authApi from 'src/api/authApi';
import { fullscreenLoadingAction } from 'src/reducers/fullscreenLoading/fullscreenLoadingSlice';
import { Web3Context } from 'src/contexts/Web3ContextProvider';

const NavBarMain = () => {
  const navigate = useNavigate()
  const { user, setUser } = useContext(AuthContext)
  const { username, avatar, } = user
  const web3 = useContext(Web3Context)

  const dispatch = useDispatch()
  const status = useSelector(fightingStatusSelector)
  const isPlayOnline = useSelector(fightingIsPlayOnlineSelector)

  const { account, token, isAdmin, } = useSelector(state => state.wallet)
  const pgc = useSelector(pgcSelector)


  useEffect(() => {
    if (web3) {
      //CONNECT METAMASK
      const connectMetamask = async () => {
        if (!window.ethereum) {
          return toast.error('Please connect to Metamask')
        }
        else {
          dispatch(fullscreenLoadingAction.showLoading(true))
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          dispatch(walletAction.setAccount({ account: accounts[0] }))
          try {
            //do cái này tương tác với metamask nên provider của web3 phải là cái window.ethereum,
            //chứ không phải là cái mạng blockchain nào đó như bsc
            const web3Metamask = new Web3(window.ethereum)
            // const signature = await web3.eth.sign('message to login', accounts[0])
            const message = 'message to login'
            const signature = await web3Metamask.eth.personal.sign(message, accounts[0])
            const res = await authApi.submitSignature({ signature, message })
            if(res && res.data !== null && res.data.adminToken) {
              //nếu có adminToken trả về sẽ lưu vào session
              //lý do lưu vào session là do session khi tắt trình duyệt sẽ tự động mất những cái đã lưu
              sessionStorage.setItem('adminToken', JSON.stringify(res.data.adminToken))
              dispatch(walletAction.setIsAdmin(true))
            }
            else {
              sessionStorage.removeItem('adminToken')
              dispatch(walletAction.setIsAdmin(false))
            }
            dispatch(fullscreenLoadingAction.showLoading(false))

          } catch (error) {
            toast.error(error.message)
            dispatch(fullscreenLoadingAction.showLoading(false))
            dispatch(walletAction.setIsAdmin(false))
          }


          window.ethereum.on('accountsChanged', () => {
            //lắng nghe sự kiện khi có sự thay đổi account ở metamask, trang sẽ reload
            window.location.reload()
          })

          //CONNECT CONTRACT
          connectContract('pgc')
          connectContract('exPGC')
          connectContract('tokenSwap')
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
    if (status === 'setting' && isPlayOnline) {
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

  const getToken = async () => {
    //số token ở contract pgc hiện tại
    const balanceWei = await pgc.methods.balanceOf(account).call()
    const balanceToken = await web3.utils.fromWei(balanceWei)
    dispatch(walletAction.setToken({ token: balanceToken }))
  }

  const connectContract = async(contractName) => {
    try {
      const contract = await new web3.eth.Contract(abi[contractName].abi, abi[contractName].address)
      dispatch(contractAction[contractName](contract))
    } catch (error) {
      toast.error(error.message)
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
                  onClick={() => dispatch(paybackTokenAction.showModal(true))}
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
        <PaybackTokenModal />
      </Container>
    </AppBar>
  );
};
export default React.memo(NavBarMain);
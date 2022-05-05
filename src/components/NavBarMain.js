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
import { contractAction } from 'src/reducers/contract/contractSlice';

const NavBarMain = () => {
  // const { state: stateContract, interactContact } = useContext(ContractContext)
  const { contractList, interactContact } = useContext(ContractContext)
  const { user, setUser } = useContext(AuthContext)
  const { username, avatar, } = user
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const status = useSelector(fightingStatusSelector)
  const isPlayOnline = useSelector(fightingIsPlayOnlineSelector)

  const web3 = useSelector(state => state.web3.provider)
  const account = useSelector(state => state.wallet.account)
  const isAdmin = useSelector(state => state.wallet.isAdmin)
  // const expContract = useSelector(state => state.contract.pgc)

  const [isShowModal, setIsShowModal] = React.useState(false)
  const [paybackToken, setPaybackToken] = React.useState('')

  useEffect(() => {
    if (web3) {
      // let timeoutInteractContract
      //CONNECT METAMASK
      const connectMetamask = async () => {
        if (!window.ethereum) {
          return toast.error('Please connect to Metamask')
        }
        else {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          dispatch(walletAction.setAccount({account: accounts[0]}))
          interactContact('exPGC')

          window.ethereum.on('accountsChanged', () => {
            //lắng nghe sự kiện khi có sự thay đổi account ở metamask, trang sẽ reload
            window.location.reload()
          })
        }
      }
      connectMetamask()
      // return () => clearTimeout(timeoutInteractContract)
    }
  }, [web3])

  useEffect(() => {
    if(!contractList.tokenSwap.contract.methods) interactContact('tokenSwap')
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

  const onTakeBackMyToken = async () => {
    if (paybackToken > 0) {
      // const payload = {
      //   address: account,
      //   requestTime: new Date().getTime(),
      // }
      // pgcApi.requestToken(payload).then(response => {
      //   toast.success(`You will have ${paybackToken} PGC if your request is correct `)
      //   setIsShowModal(false)
      // }).catch(err => { console.log(err); })

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
          <Grid item xs={6} className="d-flex align-items-center">
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
                    <Link to="/buy-pgc">
                      <Button variant="outlined" color="error" className='me-2'>
                        Buy PGC
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
              onClick={onTakeBackMyToken}
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

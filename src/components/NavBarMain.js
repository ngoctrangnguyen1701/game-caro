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
  Modal,
} from '@mui/material'

import { fightingIsPlayOnlineSelector, fightingStatusSelector } from 'src/selectors/fightingSelector'
import { fightingAction } from 'src/reducers/fighting/playSlice';
import { toast } from 'react-toastify';
import pgcApi from 'src/api/pgcApi'
import { ADMIN_WALLET } from 'src/constants/constants';



const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


const NavBarMain = () => {
  const { user, setUser } = useContext(AuthContext)
  const { username, avatar, } = user
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const status = useSelector(fightingStatusSelector)
  const isPlayOnline = useSelector(fightingIsPlayOnlineSelector)

  const [isShowModal, setIsShowModal] = React.useState(false)
  const [address, setAddress] = React.useState('')
  const [isAdmin, setIsAdmin] = React.useState(false)

  useEffect(() => {
    //CONNECT METAMASK
    const connectMetamask = async () => {
      if (!window.ethereum) {
        return toast.error('Please connect to Metamask')
      }
      else {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0]
        if(account === ADMIN_WALLET.toLowerCase()) {
          setIsAdmin(true)
        }

        window.ethereum.on('accountsChanged', () => {
          //lắng nghe sự kiện khi có sự thay đổi account ở metamask, trang sẽ reload
          window.location.reload()
        })
      }
    }
    connectMetamask()
  }, [])

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
    if (address) {
      pgcApi.requestToken({ address }).then(response => {
        setIsShowModal(false)
        setAddress('')

        toast.success(`Your request have submitted. You will have ${response.data.amountOfToken} PGC if your request is correct `)
      }).catch(err => { console.log(err); })
    }
    else {
      toast.error('Please input your address wallet')
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
        <Modal
          open={isShowModal}
          onClose={() => setIsShowModal(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" color="error">
              Input you wallet
            </Typography>
            <div>
              <input
                className='form-control border-success'
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>
            <Button
              variant="contained"
              color="success"
              className="d-block mx-auto mt-3"
              onClick={onTakeBackMyToken}
            >
              Submit
            </Button>
          </Box>
        </Modal>
      </Container>
    </AppBar>
  );
};
export default React.memo(NavBarMain);

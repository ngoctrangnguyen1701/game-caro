import React, {useContext, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'

import {AuthContext} from '../contexts/AuthContextProvider'
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
} from '@mui/material'

import { fightingStatusSelector } from 'src/selectors/fightingSelector'



const NavBarMain = () => {
  const {user, setUser} = useContext(AuthContext)
  const {username, avatar, } = user
  const navigate = useNavigate()
  const fightingStatus = useSelector(fightingStatusSelector)

  useEffect(()=>{
    if(fightingStatus === 'setting') navigate('/game-caro')
  }, [fightingStatus])

  const handleLogOut = () =>{
    localStorage.clear()
    sessionStorage.clear()
    navigate('/')
    setUser({}) //--> set empty object for authContext of setUser
    socket.emit('offline', {username, socketId: socket.id})
  }

  return (
    <AppBar position="static" style={{backgroundColor: '#121212'}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters className="d-flex">
          <Grid item xs={6}>
            <Link to='/'>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ mr: 2, display: { xs: '6', md: 'flex' } }}
              >
                HOME
              </Typography>
            </Link>
          </Grid>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end'}}>
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
                  style={{cursor: 'pointer'}}
                  onClick={()=>handleLogOut()}
                >Log out</h5>
              </div>
            ) : (
              <Link to='/login'>
                <h5 className='d-inline-block me-2 text-right'>Log in</h5>
              </Link>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default React.memo(NavBarMain);

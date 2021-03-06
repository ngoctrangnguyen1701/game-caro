import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@mui/material'

function Home() {
  const envProduction = () => {
    return process.env.NODE_ENV === 'production' ? true : false
  }

  return (
    <>
      <Link to='/game-caro'>
        <Button
          color='success'
          variant='contained'
          sx={{ display: 'block', margin: '15px auto 0' }}
        >
          <i className="fas fa-fighter-jet"></i>
          <span className='d-inline-block ms-2'>LET PLAY GAME CARO </span>
        </Button>
      </Link>
      {!envProduction() &&
        <Link to='/chat-room'>
          <Button
            color='warning'
            variant='contained'
            sx={{ display: 'block', margin: '15px auto 0' }}
          >
            <i className="fas fa-comments"></i>
            <span className='d-inline-block ms-2'>CHAT ROOM (developing...)</span>
          </Button>
        </Link>
      }
    </>
  )
}

export default React.memo(Home);
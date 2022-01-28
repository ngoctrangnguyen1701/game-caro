import React from 'react'
import {Link} from 'react-router-dom'


function Home() {

  return (
    <div className='d-flex'>
      <Link to='/game-caro' className='d-inline-block mx-auto mt-5'>
        <button className='btn btn-success'>LET PLAY GAME CARO</button>
      </Link>
    </div>
  )
}

export default Home;
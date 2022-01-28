import React from 'react'
import {Link} from 'react-router-dom'

import Button from '@mui/material/Button';

const Page404 = props => {
  return (
    <div className='container mt-3'>
      <div className='w-50 mx-auto'>
        <img src='/images/page404.jpg' className='w-100' alt="page404"/>
      </div>
      <Link to='/'>
        <Button 
          variant="contained"
          className='d-block mx-auto mt-3'
        >Back to Home</Button>
      </Link>
    </div>
  );
};

export default Page404;
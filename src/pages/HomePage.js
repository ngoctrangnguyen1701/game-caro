import React from 'react';
import {useMatch} from 'react-router-dom'
import Home from '../components/home/Home';
import Dashboard from '../components/home/Dashboard'

const HomePage = props => {
  const isAdmin = useMatch('/admin')


  return (
    <>
      {isAdmin ? <Dashboard/> : <Home/>}
    </>
  );
};

export default HomePage
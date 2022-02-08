import React from 'react'

const HomePage = React.lazy(() => import ('./pages/HomePage'))
const GameCaroPage = React.lazy(() => import ('./pages/GameCaroPage'))
const LogInPage = React.lazy(() => import ('./pages/LogInPage'))
const SignUpPage = React.lazy(() => import ('./pages/SignUpPage'))
const Page404 = React.lazy(() => import ('./components/page404/Page404'))

const routers = [
  {
    path: '/',
    // exact: true,
    element: <HomePage/>,
  },
  {
    path: '/login',
    // exact: false,
    element: <LogInPage/>,
  },
  {
    path: 'signup',
    // exact: false,
    element: <SignUpPage/>,
  },
  {
    path: '/game-caro/*',
    // exact: false,
    element: <GameCaroPage/>,
  },
  {
    path: '*',
    // exact: false,
    element: <Page404/>,
  },
]

export default routers

//syntax react-route-dom dont need 'exact'
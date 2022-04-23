import React from 'react'

const Page404 = React.lazy(() => import ('./components/page404/Page404'))
const HomePage = React.lazy(() => import ('./pages/HomePage'))
const GameCaroPage = React.lazy(() => import ('./pages/GameCaroPage'))
const LogInPage = React.lazy(() => import ('./pages/LogInPage'))
const SignUpPage = React.lazy(() => import ('./pages/SignUpPage'))
const ChatRoomPage = React.lazy(() => import ('./pages/ChatRoomPage'))
const LearnBlockchainPage = React.lazy(() => import ('./pages/LearnBlockchainPage'))
const BuyPGCPage = React.lazy(() => import ('./pages/BuyPGCPage'))

const routes = [
  {
    path: '*',
    // exact: false,
    element: <Page404/>,
  },
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
    path: '/chat-room/*',
    element: <ChatRoomPage/>,
  },
  {
    path: '/learn-blockchain',
    element: <LearnBlockchainPage/>,
  },
  {
    path: '/buy-pgc',
    element: <BuyPGCPage/>,
  },
]

export default routes

//syntax react-route-dom dont need 'exact'
//do version 6 route đã tự động match theo exact, page404 có thể đem lên đầu mảng routes
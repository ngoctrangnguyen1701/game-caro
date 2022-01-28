import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {toast} from 'react-toastify'
import axios from 'axios';

import { linkServer } from '../constants/constants'
import {socket} from '../App'
import { logInStatusSelector } from "src/selectors/logInSelector";

export const AuthContext = React.createContext()

const isLogedIn = JSON.parse(localStorage.getItem('accessToken')) || JSON.parse(sessionStorage.getItem('accessToken'))
//if isLogedIn is valid, it's mean remember login is used


const AuthContextProvider = ({children}) =>{
  const status = useSelector(logInStatusSelector)
  const [user, setUser] = useState({})
  const [accessToken, setAccessToken] = useState(()=>{
    if(isLogedIn){
      sessionStorage.setItem('accessToken', JSON.stringify(isLogedIn))
      return isLogedIn
    }
  })

  useEffect(()=>{
    if(status === 'success'){
      toast.success('Log in successfully!')
      setAccessToken(JSON.parse(sessionStorage.getItem('accessToken')))
    }
  }, [status])

  useEffect(()=>{
    if(accessToken){
      const config = {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : 'Bearer'
        } 
      }
      axios.get(`${linkServer}/auth/getUser`, config)
        .then(res => {
          const {username} = res.data
          setUser({...res.data})
          socket.emit('online', {username, socketId: socket.id})
          //--> phát tín hiệu tới socket của server thông qua event ‘online’
          // kèm theo dữ liệu là 1 obj
        })
        .catch(err => {
          console.log(err)
        })
    }
  }, [accessToken])


  return (
    <AuthContext.Provider value={{user, setUser}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider
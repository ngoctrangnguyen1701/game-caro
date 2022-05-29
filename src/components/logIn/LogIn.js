import React, { useEffect, useContext} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {useNavigate} from 'react-router-dom'
import { Link } from 'react-router-dom';
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'

import {logInAction} from '../../reducers/auth/logInSlice'
import {AuthContext} from '../../contexts/AuthContextProvider'
import firebase from '../../firebase/firebaseConfig';
import { logInSelector } from 'src/selectors/logInSelector';

import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify';


const LogIn = props => {
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const {loading, message} = useSelector(logInSelector)

  const {user} = useContext(AuthContext)
  const {username} = user


  useEffect(()=>{
    dispatch(logInAction.clear())
  }, [])

  useEffect(()=>{
    if(username) navigate('/')
  }, [username])


  const formik = {
    initialValues: {
      username: '',
      password: '',
      isRememberLogIn: false,
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      password: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
        isRememberLogIn: Yup.boolean()
    }),
    onSubmit: values => {
      localStorage.clear()
      dispatch(logInAction.clear())
      dispatch(logInAction.submit(values))
    }
  }

  //LOG IN WITH FACEBOOK OR GOOGLE
  const onLogInWithSocialAccount = name => {
    let provider
    if(name === 'google'){
      provider = new firebase.auth.GoogleAuthProvider()
    }
    else if(name === 'facebook'){
      provider = new firebase.auth.FacebookAuthProvider()
    }
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        // console.log('firebase: ', res);
        //when login with facebook or google successlly
        const {isNewUser} = res.additionalUserInfo
        const {user: socialAccount} = res.user.multiFactor
        // console.log('socialAccount: ', socialAccount)

        const {displayName, photoURL, email} = socialAccount
        const payload = {
          username: displayName,
          email,
          avatar: photoURL,
          isNewUser
        }
        dispatch({type: 'auth/logIn/logInWithSocialAccount', payload}) 
      })
      .catch(err => {
        toast.error(err.message)
      })
  }

  return (
    <section className="vh-100">
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-9 col-lg-6 col-xl-5">
            <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" className="img-fluid"
              alt="Sample image"/>
          </div>
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <Formik {...formik}>
              <Form>
                <div className="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                  <p className="lead fw-normal mb-0 me-3">Sign in with</p>
                  <button
                    type="button"
                    className="btn btn-primary btn-floating mx-1"
                    onClick={()=>onLogInWithSocialAccount('facebook')}
                  >
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-floating mx-1"
                    onClick={()=>onLogInWithSocialAccount('google')}
                  >
                    <i className="fab fa-google"></i>
                  </button>
                </div>

                <div className="divider d-flex align-items-center my-4">
                  <p className="text-center fw-bold mx-3 mb-0">Or</p>
                </div>

                <div className="form-outline mb-4">
                  <label className="form-label">Username</label>
                  <Field
                    type="text"
                    name="username"
                    className="form-control form-control-lg"
                    placeholder="Enter username"
                  />
                  <div className='text-danger'><ErrorMessage name="username" /></div>
                </div>

                <div className="form-outline mb-3">
                  <label className="form-label">Password</label>
                  <Field
                    type="password"
                    name="password"
                    className="form-control form-control-lg"
                    placeholder="Enter password"
                  />
                  <div className='text-danger'><ErrorMessage name="password" /></div>
                </div>
                
                <div className="d-flex justify-content-between align-items-center">
                  <div className="form-check mb-0">
                    <Field
                      type="checkbox"
                      name="isRememberLogIn"
                      className="form-check-input me-2"
                    />
                    <label className="form-check-label">
                      Remember me
                    </label>
                  </div>
                </div>
                <div className='text-danger'>{message}</div>
                <div className="text-center text-lg-start mt-4 pt-2">
                  <button type="submit" className="btn btn-primary btn-lg d-flex align-items-center"
                    style={{paddingLeft: '2.5rem', paddingRight: '2.5rem'}}>
                      {loading && <CircularProgress color="inherit" size={20} className="me-2"/>}
                      Login
                    </button>
                  <p className="small fw-bold mt-2 pt-1 mb-0">Don't have an account? 
                    <Link to="/signup" className="link-danger d-inline-block ms-2">Register</Link>
                  </p>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(LogIn)

{/* <a href="#!" className="text-body">Forgot password?</a> */}
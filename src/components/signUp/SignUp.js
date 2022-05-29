import React, { useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Field, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Navigate } from 'react-router-dom'
import {toast} from 'react-toastify'

import { signUpAction } from '../../reducers/auth/signUpSlice'
import { signUpSelector } from 'src/selectors/signUpSelector'

import CircularProgress from '@mui/material/CircularProgress'
//tham khảo cách sử dụng https://formik.org/docs/tutorial
const SignUp = props => {
  const dispatch = useDispatch()
  const {loading, message, status} = useSelector(signUpSelector)

  useEffect(()=>{
    dispatch(signUpAction.clear())
    return () => dispatch(signUpAction.clear())
    //khi render ra component và khi component unmount sẽ chạy clear các state trong redux 
  }, [])

  useEffect(()=>{
    if(status === 'success') toast.success('Sign up successfully!')
  }, [status])

  const formik = {
    initialValues: {
      username: '',
      password: '',
      email: ''
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      password: Yup.string()
        .max(20, 'Must be 20 characters or less')
        .required('Required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
    }),
    onSubmit: values => {
      // dispatch({type: 'auth/createUser', payload: values}) --> redux gửi obj gồm có type và payload
      //redux toolkit, sử dụng createSlice đã kết hợp reducer và actionCreator
      //nên chỉ cần dùng tên action bỏ giá trị vào là nó sẽ tự tạo ra obj gồm có type và payload là cái value truyền vào
      dispatch(signUpAction.clear())
      dispatch(signUpAction.submit(values))
    }
  }
  

  return (
    <section className="vh-100">
      {/* sau khi tạo user mới thành công chuyển hướng sang trang login */}
      {status === 'success' && <Navigate to='/login'/>}
      <div className="container-fluid h-custom">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
            <h2 className="mb-4 text-danger">Sign Up</h2>
            <Formik {...formik}>
              <Form>
                <div className="form-outline mb-4">
                  <label className="form-label">Username</label>
                  <Field className="form-control form-control-lg" name="username" type="text" />
                  <span className="text-danger"><ErrorMessage name="username" /></span>
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label">Password</label>
                  <Field className="form-control form-control-lg" name="password" type="password" />
                  <span className="text-danger"><ErrorMessage name="password" /></span>
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label">Email</label>
                  <Field className="form-control form-control-lg" name="email" type="email" />
                  <span className="text-danger"><ErrorMessage name="email" /></span>
                </div>
                <div className="text-center text-lg-start mt-4 pt-2">
                  <button 
                    type="submit"
                    className="btn btn-primary btn-lg d-flex align-items-center"
                    style={{paddingLeft: '2.5rem', paddingRight: '2.5rem'}}
                    disabled={loading}
                  >
                    {loading && <CircularProgress color="inherit" size={20} className="me-2"/>}
                    Sign up
                  </button>
                  <div className='text-danger'>{message}</div>
                </div>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(SignUp)
import React from 'react';
import moment from 'moment'
import { useNavigate } from "react-router-dom";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

import pgcApi from 'src/api/pgcApi';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';

const doneStyle = {
  width: '28px',
  height: '28px',
  textAlign: 'center',
  borderRadius: '50%',
  background: 'green',
  margin: '0 auto',
}

const noDoneStyle = {
  width: '28px',
  height: '28px',
  textAlign: 'center',
  borderRadius: '50%',
  background: 'red',
  margin: '0 auto',
}

const Dashboard = props => {
  const isAdmin = useSelector(state => state.wallet.isAdmin)
  const [list, setList] = React.useState([])
  const [listShowDetail, setListShowDetail] = React.useState([])
  const navigate = useNavigate()

  React.useEffect(() => {
    if (isAdmin) {
      pgcApi.requestTokenList().then(response => {
        setList(response.data)
      }).catch(err => {
        console.log(err);
      })
    }
    else {
      // navigate('/') //--> tắt chức năng đẩy về
    }
  }, [isAdmin])

  const onPayBack = async () => {

  }

  const formatDate = timestamp => {
    if (timestamp) {
      return moment(timestamp).format('YYYY-MM-DD, HH:MM:SS')
    }
    return null
  }

  const showDetail = id => {
    // console.log(id);
    // let newArr = [...listShowDetail]
    let newArr = []
    if (listShowDetail.includes(id)) {
      newArr = listShowDetail.filter(item => item !== id)
    }
    else {
      newArr = [...listShowDetail, id]
    }
    setListShowDetail(newArr)
  }

  const RequestItem = ({item}) => {
    return (
      <>
        <tr className='text-center'>
          <td style={{ verticalAlign: 'middle', textAlign: 'left' }}>{item.address}</td>
          <td style={{ verticalAlign: 'middle' }}>{formatDate(item.requestTime)}</td>
          <td style={{ verticalAlign: 'middle' }}>
            {item.isPayback ?
              <div style={doneStyle}>
                <DoneIcon />
              </div>
              :
              <div style={noDoneStyle}>
                <CloseIcon />
              </div>
            }
          </td>
          <td style={{ verticalAlign: 'middle' }}>
            {item.isPayback ? 
              <Button variant='contained' color='success' onClick={() => showDetail(item._id)}>Detail</Button>
              :
              <Button variant='contained' color='primary' onClick={onPayBack}>Payback</Button>
            }
          </td>
        </tr>
        <tr style={{ display: listShowDetail.includes(item._id) ? 'table-row' : 'none'}}>
          {/* <tr> */}
          <td colSpan={4}>
            <table className='table table-danger'>
              <thead>
                <tr>
                  <th>Payback Token</th>
                  <th>Payback Time</th>
                  <th>Transaction Hash</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Payback Token</td>
                  <td>Payback Time</td>
                  <td>Transaction Hash</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </>
    )
  }


  return (
    <div className='mt-5'>
      <h3 className='text-center'>Request Token List</h3>
      <table className="table table-striped table-dark table-hover table-bordered">
        <thead>
          <tr style={{ textAlign: 'center' }}>
            <th className='bg-warning text-dark' style={{ textAlign: 'left' }}>Address</th>
            <th className='bg-warning text-dark'>Request Time</th>
            <th className='bg-warning text-dark'>Payback</th>
            <th className='bg-warning text-dark'></th>
          </tr>
        </thead>
        <tbody>
          {list && list.length > 0 ?
            list.map((item, index) => <RequestItem item={item} key={index}/>)
             : <tr><td colSpan="4" className='text-center'>No Data</td></tr>
          }
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(Dashboard);
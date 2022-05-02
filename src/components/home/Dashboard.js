import React from 'react';
import moment from 'moment'
import { useNavigate } from "react-router-dom";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import {
  Button,
  Dialog,
  DialogContent,
  Typography,
} from '@mui/material'

import pgcApi from 'src/api/pgcApi';
import { useSelector } from 'react-redux';
import { ContractContext } from 'src/contexts/ContractContextProvider';
import { toast } from 'react-toastify';

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

const formatDate = timestamp => {
  if (timestamp) {
    return moment(timestamp).format('YYYY-MM-DD, HH:MM:SS')
  }
  return null
}

const Dashboard = props => {
  const navigate = useNavigate() 
  const web3 = useSelector(state => state.web3.provider)
  const isAdmin = useSelector(state => state.wallet.isAdmin)
  const account = useSelector(state => state.wallet.account)
  // const exContract = useSelector(state => state.contract.pgc.contract)

  const {exPGC, newPGC} = React.useContext(ContractContext)

  const [list, setList] = React.useState([])
  const [listShowDetail, setListShowDetail] = React.useState([])

  const [isShowModal, setIsShowModal] = React.useState(false)
  const [id, setId] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [paybackToken, setPaybackToken] = React.useState('')
  const [weiToken, setWeiToken] = React.useState('')

  const [exContract, setExContact] = React.useState('')
  const [newContract, setNewContact] = React.useState('')

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

  React.useEffect(() => {
    if(web3) {
      const connectContract = async() => {
        const old = await new web3.eth.Contract(exPGC.abi, exPGC.address)
        setExContact(old)
        const current = await new web3.eth.Contract(newPGC.abi, newPGC.address)
        setNewContact(current)
      }
      connectContract()
    }
  }, [web3])

  const showDetail = id => {
    let newArr = []
    if (listShowDetail.includes(id)) {
      newArr = listShowDetail.filter(item => item !== id)
    }
    else {
      newArr = [...listShowDetail, id]
    }
    setListShowDetail(newArr)
  }

  const showPaybackModal = async (address, id) => {
    const balanceWei = await exContract.methods.balanceOf(address).call()
    const balanceToken = await web3.utils.fromWei(balanceWei)
    setWeiToken(balanceWei)
    setPaybackToken(balanceToken)
    setId(id)
    setAddress(address)
    setIsShowModal(true)
  }

  const onTransferToken = async() => {
    try {
      const gasPrice = await web3.eth.getGasPrice()
      const gas = await newContract.methods.transfer(address, weiToken).estimateGas({
        gas: 500000,
        from: account,
        value: '0'
      })
      const data = await newContract.methods.transfer(address, weiToken).encodeABI()
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          gasPrice: web3.utils.toHex(gasPrice),
          gas: web3.utils.toHex(gas),
          to: newPGC.address,
          from: account,
          value: '0',
          data,
        }]
      })
      console.log(txHash);
      const payload = {
        id,
        transactionHash: txHash,
        paybackToken,
        paybackTime: new Date().getTime(),
      }
      pgcApi.paybackToken(payload).then(response => {
        toast.success(`Transfer token ${response.data.paybackToken} PGC successfully`)
      }).catch(err => {
        console.log(err);
        toast.error('Can not save in database')
      })
    } catch (error) {
      console.log(error);
      toast.error('Can not transfer token')
    }
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
              <Button variant='contained' color='primary' onClick={() => showPaybackModal(item.address, item._id)}>Payback</Button>
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

      <Dialog
          open={isShowModal}
          onClose={() => setIsShowModal(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Typography id="modal-modal-title" variant="h6" className='py-2 text-center bg-dark text-white'>
            CONFIRM
          </Typography>
          <DialogContent>
            <p className='mb-0'>Id request: <span style={{ fontWeight: 'bold' }}>{id}</span></p>
            <p className='mb-0'>Address: <span style={{ fontWeight: 'bold' }}>{address}</span></p>
            <p className='mb-0'>Payback token: <span style={{ fontWeight: 'bold', color: 'red'}}> {paybackToken} PGC</span></p>
            {parseFloat(paybackToken) > 0 ?
              <Button
                variant="contained"
                color="success"
                className="d-block mx-auto mt-3"
                onClick={onTransferToken}
              >
                Transfer token
              </Button>
              :
              <Button
                variant="outlined"
                color="error"
                className="d-block mx-auto mt-3"
                // onClick={onTakeBackMyToken}
              >
                Cancel request
              </Button>
            }
          </DialogContent>
        </Dialog>
    </div>
  );
};

export default React.memo(Dashboard);
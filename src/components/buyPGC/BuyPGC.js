import React from 'react';
import {
  Frame,
  SmallFrame,
  Input,
  Unit,
} from './styles/BuyPGCStyle'
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

const BuyPGC = () => {
  const dispatch = useDispatch()
  const web3 = useSelector(state => state.web3.provider)
  const [amount, setAmount] = React.useState(0)

  const onConfirmValue = value => {
    const regex = /^[0-9]+$/
    //https://stackoverflow.com/questions/9011524/regex-to-check-whether-a-string-contains-only-numbers
    //check a string contain only number
    if (value && regex.test(value)) {
      console.log(value)
      setAmount(parseInt(value))
    }
  }

  const connectMetamask = async () => {
    //check connect Meatamask
    if (!window.ethereum) {
      return toast.error(`You don't have Metamask`)
    }
    else {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      console.log({ account });
      const balanceWei = await web3.eth.getBalance(account)
      const balanceBNB = await web3.utils.fromWei(balanceWei, 'ether')
      console.log({balanceBNB});
    }
  }

  const onBuyPGC = async () => {


    if (!amount) {
      return toast.error('Please input amount of token you want to buy')
    }
  }

  return (
    <div className='mt-5'>
      <Button
        color='primary'
        variant='contained'
        onClick={connectMetamask}
      >Connect Metamask</Button>
      <div className='bg-dark col-lg-6 mx-auto rounded' style={{ padding: '15px 10%' }}>
        <h3 className='text-white text-center text-danger mb-4'>BUY PGC</h3>
        <div>
          <label className='text-white'>You want to buy</label>
          <SmallFrame>
            <Input
              className='form-control'
              onChange={e => onConfirmValue(e.target.value)}
              value={amount}
            />
            <Unit>PGC</Unit>
          </SmallFrame>
        </div>
        <div className='text-center mt-2 text-success' style={{ fontSize: '20px' }}>
          <i className="fas fa-arrow-alt-circle-down"></i>
        </div>
        <div>
          <label className='text-white'>You will pay</label>
          <SmallFrame>
            <Input className='form-control' readOnly value={amount * 0.0001} />
            <Unit>BNB</Unit>
          </SmallFrame>
        </div>
        <div className='d-flex justify-content-center mt-3'>
          <Button
            variant='contained'
            color="success"
            className="d-block me-3"
            onClick={onBuyPGC}
          >Agree</Button>
          <Button
            variant='outlined'
            color="error"
            className="d-block"
            onClick={() => setAmount(0)}
          >Reset</Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BuyPGC);
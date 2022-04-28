import React from 'react';
import {
  SmallFrame,
  Input,
  Unit,
} from './styles/BuyPGCStyle'
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { walletAction } from 'src/reducers/wallet/wallet';
import { pgcAction } from 'src/reducers/contract/pgcSlice';
import { ContractContext } from 'src/contexts/ContractContextProvider';


const BuyPGC = () => {
  const dispatch = useDispatch()
  const web3 = useSelector(state => state.web3.provider)
  const {account, balance, token} = useSelector(state => state.wallet)
  const pgc = useSelector(state => state.contract.pgc)

  const {address: addressContract, abi} = React.useContext(ContractContext).pgc


  const [amountPGC, setAmountPGC] = React.useState(0)
  const [amountBNB, setAmountBNB] = React.useState(0)
  const [isConnentMetamask, setIsConnentMetamask] = React.useState(false)

  const onConfirmValue = value => {
    const regex = /^[0-9]+$/
    //https://stackoverflow.com/questions/9011524/regex-to-check-whether-a-string-contains-only-numbers
    //check a string contain only number
    if (value && regex.test(value)) {
      setAmountPGC(parseFloat(value))
      setAmountBNB(parseFloat(value * 0.0001))
    }
  }

  const connectMetamask = async () => {
    //check connect Meatamask
    if (!window.ethereum) {
      return toast.error(`You don't have Metamask`)
    }
    else {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0]

      const balanceWei = await web3.eth.getBalance(account)
      const balanceBNB = await web3.utils.fromWei(balanceWei)

      const contract = await new web3.eth.Contract(abi, addressContract)
      dispatch(pgcAction.interactContract({contract}))

      const tokenWei = await contract.methods.balanceOf(account).call()
      //gọi methods balanceOf để biết được tài khoản đang có bao nhiêu token
      //***Lưu ý:
      //Những hàm tương tác với Smart Contract mà làm thay đổi Blockchain (vd: thực hiện 1 giao dịch) sẽ tốn 1 lượng phí gas
      // Còn những hàm dùng để tra cứu không làm thay đổi Blockchain(vd: xem số dư) sẽ không bị tốn phí gas
      const tokenPGC = await web3.utils.fromWei(tokenWei)

      dispatch(walletAction.setAccount(
        {
          account,
          balance: balanceBNB,
          token: tokenPGC,
        }
      ))

      setIsConnentMetamask(true)
    }
  }

  const onBuyPGC = async () => {
    if (!isConnentMetamask) {
      return toast.error('Please connect to Metamask')
    }
    else if (!amountPGC) {
      return toast.error('Please input amount of token you want to buy')
    }
    else if (amountBNB > balance) {
      return toast.error('Amount of BNB must be smaller than balance of wallet')
    }
    else if (amountPGC < 100 || amountPGC > 10000) {
      return toast.error('Limit 100 - 10.000 PGC for one time to buy')
    }

    try {
      const amountPGCToWei = await web3.utils.toWei(amountPGC.toString())
      const amountBNBToWei = await web3.utils.toWei(amountBNB.toString())

      const gasPrice = await web3.eth.getGasPrice()
      const gas = await pgc.contract.methods.receiveToken(amountPGCToWei).estimateGas({
        gas: 500000,
        from: account,
        value: amountBNBToWei //-->biến BNB thành đơn vị Wei
      })
      const data = await pgc.contract.methods.receiveToken(amountPGCToWei).encodeABI()
      //encondeABI tương đương với việc chuyển đổi thành chuỗi Hex
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [{
          gasPrice: web3.utils.toHex(gasPrice),
          gas: web3.utils.toHex(gas),
          to: pgc.address,
          from: account,
          value: web3.utils.toHex(amountBNBToWei),
          data
        }]
      })
      console.log(txHash);
      toast.success(`Buy ${amountPGC} PGC success`)

      // setup lại các giá trị
      setAmountPGC(0)
      setAmountBNB(0)
      connectMetamask() //--> chạy lại hàm để cập nhật lại balance BNB
    } catch (error) {
      console.log(error);
      toast.error('Buy PGC failed')
    }
  }

  return (
    <div className='mt-4 container'>
      {isConnentMetamask ? (
        <div>
          <h5 className='mb-0'>Address: <span className='text-danger'>{account}</span></h5>
          <h5 className='mb-0'>Balance: <span className='text-success'>{balance} BNB</span></h5>
          <h5 className='mb-0'>Token: <span className='text-secondary'>{token} PGC</span></h5>
        </div>
      ) : (
        <Button
          color='primary'
          variant='contained'
          onClick={connectMetamask}
        >Connect Metamask</Button>
      )
      }

      <div className='bg-dark col-lg-6 mx-auto rounded mt-3' style={{ padding: '15px 10%' }}>
        <h3 className='text-white text-center text-danger mb-4'>BUY PGC</h3>
        <div>
          <label className='text-white'>You want to buy</label>
          <SmallFrame>
            <Input
              className='form-control'
              onChange={e => onConfirmValue(e.target.value)}
              value={amountPGC}
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
            <Input className='form-control' readOnly value={amountBNB} />
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
            onClick={() => setAmountBNB(0)}
          >Reset</Button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BuyPGC);
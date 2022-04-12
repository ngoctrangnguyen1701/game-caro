import React from 'react';
import { Button, Container } from '@mui/material';
import { toast } from 'react-toastify';
import './scss/learnBlockchainStyle.scss'
import Web3 from 'web3'
import { AuthContext } from 'src/contexts/AuthContextProvider';
import { useDispatch, useSelector } from 'react-redux';
import { boxAction } from 'src/reducers/box/boxSlice';
import { amountOfBoxesSelector } from 'src/selectors/boxSelector';

const abi = [
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "BuyBox",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "_receiver",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "ReceiveAward",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]

const addressContract = '0x79ee2aa766Df896477e5DE2125B15e1c9D99EB03'

const LearnBlockChain = () => {
  const [account, setAccount] = React.useState('')
  const [web3, setWeb3] = React.useState(null)
  const [contract, setContract] = React.useState(null)

  const [isOpenBoxRed, setIsOpenBoxRed] = React.useState(false)
  const [isOpenBoxViolet, setIsOpenBoxViolet] = React.useState(false)
  const [moneyBoxRed, setMoneyBoxRed] = React.useState(0)
  const [moneyBoxViolet, setMoneyBoxViolet] = React.useState(0)
  

  const { user } = React.useContext(AuthContext)
  const dispatch = useDispatch()
  const amountOfBoxes = useSelector(amountOfBoxesSelector)

  React.useEffect(() => {
    async function connect() {
      const connectWeb3 = new Web3('HTTP://127.0.0.1:7545')
      setWeb3(connectWeb3)
      const connectContract = await new connectWeb3.eth.Contract(abi, addressContract)
      setContract(connectContract)
    }
    connect()

    //call api getbox
    dispatch(boxAction.getBox())

    if (window.ethereum) {
      return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
    }
  }, [])


  const handleAccountsChanged = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setAccount(accounts[0])
  }

  const connectMetamask = async () => {
    if (window.ethereum) {
      //nếu đã log in vào metamask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      // console.log({ accounts })
      setAccount(accounts[0])
      window.ethereum.on('accountsChanged', handleAccountsChanged);

    }
    else {
      toast.error('Please connect Metamask!')
    }
  }

  const onOpenBox = async(color) => {
    if (!account) {
      return toast.error('Please connect Metamask!')
    }

    if (amountOfBoxes === 0) {
      return toast.error('Please buy more box!')
    }

    const random = Math.floor(Math.random() * 101)
    console.log(random);
    if(color === 'red') {
      setIsOpenBoxRed(true)
      dispatch(boxAction.openBox())

      if(random < 61) {
        // const value = random < 61 ? 2 : 0
        setMoneyBoxRed(2)
        try {
          const amount = web3.utils.toWei('2', 'ether')
          const result = await contract.methods.ReceiveAward(account, amount).send({
            from: account,
            value: 0
          })
          console.log(result);
          const obj = {transactionHash: result.transactionHash}
          dispatch(boxAction.receiveAward(obj))
          toast.success(`Congratulation! You have received 2 ETH`)
        } catch (error) {
          console.log(error);
          toast.error('Sorry! You can not received award')
        }
      }
      else {
        setMoneyBoxRed(0)
      }
    }
    else {
      setIsOpenBoxViolet(true)
      const value = random < 41 ? 3 : 0
      setMoneyBoxViolet(value)
    }
    // setIsOpenBox(true)
  }

  const onBuyBox = async () => {
    setIsOpenBoxRed(false)
    setIsOpenBoxViolet(false)
    setMoneyBoxRed(0)
    setMoneyBoxViolet(0)

    if (!account) {
      return toast.error('Please login Metamask!')
    }
    if (window.confirm('Do you want to buy one box?')) {
      try {
        //1 box = 1 ETH
        const result = await contract.methods.BuyBox().send({
          from: account,
          // value: 0, //hàm BuyBox trên contract hiện giờ là nonpayable(tức là không cần tốn phí)
          value: web3.utils.toWei('1', 'ether')
        })
        console.log(result);
        const obj = {
          buyBox: 1,
          transactionHash: result.transactionHash
        }
        dispatch(boxAction.buyBox(obj))
        toast.success('Buy box success')
      } catch (error) {
        console.log(error);
        toast.error('Buy box failed')
      }
    }
  }


  return (
    <Container className="learn-blockchain">
      <Button
        variant="contained"
        onClick={connectMetamask}
        className="mt-3"
      >Connect Metamask</Button>
      {!account && <h5 className='text-danger'>You don't login Metamask yet</h5>}
      {account &&
        <h5 className='mb-0'>Your wallet:
          <span className='text-danger d-inline-block ms-2'>{account}</span>
        </h5>}

      <div className='d-flex mt-3'>
        <div className='times bg-warning me-3'>
          <p className='mb-0 text-white'>Times to open box: </p>
          <div>{amountOfBoxes}</div>
        </div>
        <Button variant="contained" color="error" onClick={onBuyBox}>
          Buy box
        </Button>
      </div>

      <div className="row mt-3">
        <div className="col-12 mt-5 d-flex justify-content-around">
          <div className="box">
            <div className={isOpenBoxRed ? "box-body open" : "box-body"}>
              <div className='money'>{moneyBoxRed} ETH</div>
              <div className="box-lid">
                <div className="box-bowtie"></div>
              </div>
            </div>
            <div className="col-12 mt-4">
              <Button
                color='success'
                variant="contained"
                className="px-5 d-block mx-auto"
                size="large"
                onClick={()=>onOpenBox('red')}
              >Open box</Button>
              <h6 className='text-center' style={{color: '#cc231e'}}>60% you can get 2 ETH</h6>
            </div>
          </div>
          <div className="box box-violet">
            <div className={isOpenBoxViolet ? "box-body open" : "box-body"}>
              <div className='money'>{moneyBoxViolet} ETH</div>
              <div className="box-lid">
                <div className="box-bowtie"></div>
              </div>
            </div>
            <div className="col-12 mt-4">
              <Button
                color='success'
                variant="contained"
                className="px-5 d-block mx-auto"
                size="large"
                onClick={()=>onOpenBox('violet')}
              >Open box</Button>
              <h6 className='text-center' style={{color: '#3103ff'}}>40% you can get 3 ETH</h6>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default React.memo(LearnBlockChain);
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
    "inputs": [
      {
        "internalType": "string",
        "name": "_id",
        "type": "string"
      }
    ],
    "name": "BuyBox",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "address_wallet",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "id",
            "type": "string"
          }
        ],
        "internalType": "struct OpenBox.Receipt",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  }
]

const addressContract = '0x73a226dD5FC3f7811F5883d24AEFb9288947cbD5'

const LearnBlockChain = () => {
  const [account, setAccount] = React.useState('')
  const [isOpenBox, setIsOpenBox] = React.useState(false)
  const [web3, setWeb3] = React.useState(null)
  const [contract, setContract] = React.useState(null)

  const {user} = React.useContext(AuthContext)
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
      toast.error('Please login Metamask!')
    }
  }

  const onOpenBox = () => {
    if (!account) {
      toast.error('Please login Metamask!')
    }
    else if (amountOfBoxes === 0) {
      toast.error('Please buy more box!')
    }
    // setIsOpenBox(true)
  }

  const onBuyBox = async() => {
    if (window.confirm('Do you want to buy one box?')) {
      try {
        //1 box = 1 ETH
        const result = await contract.methods.BuyBox(user.id).send({
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
        <>
          <h5 className='mb-0'>Your wallet:
            <span className='text-danger d-inline-block ms-2'>{account}</span>
          </h5>

          <div className='d-flex mt-3'>
            <div className='times bg-warning me-3'>
              <p className='mb-0 text-white'>Times to open box: </p>
              <div>{amountOfBoxes}</div>
            </div>
            <Button variant="contained" color="error" onClick={onBuyBox}>
              Buy box
            </Button>
          </div>
        </>
      }

      <div className="row mt-3">
        <div className="col-12 mt-5 d-flex justify-content-center">
          <div className="box">
            <div className={isOpenBox ? "box-body open" : "box-body"}>
              <img className="img" src="https://via.placeholder.com/150" alt='' />
              <div className="box-lid">

                <div className="box-bowtie"></div>

              </div>
            </div>
          </div>
        </div>
        <div className="col-12 mt-4">
          <Button
            color='success'
            variant="contained"
            className="px-5 d-block mx-auto"
            size="large"
            onClick={onOpenBox}
          >Open box</Button>
        </div>
      </div>
    </Container>
  )
}

export default React.memo(LearnBlockChain);
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
  const [balance, setBalance] = React.useState(0)

  const [isOpenBoxRed, setIsOpenBoxRed] = React.useState(false)
  const [isOpenBoxViolet, setIsOpenBoxViolet] = React.useState(false)
  const [moneyBoxRed, setMoneyBoxRed] = React.useState(0)
  const [moneyBoxViolet, setMoneyBoxViolet] = React.useState(0)
  const [isCanOpenBox, setIsCanOpenBox] = React.useState(true)


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
      //remove listen event when componnent unmount
      return () => window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
    }
  }, [])

  React.useEffect(() => {
    let timeoutOpenBox
    if (!isCanOpenBox) {
      timeoutOpenBox = setTimeout(() => {
        setIsCanOpenBox(true)
        closeBox()
      }, 3000)
    }
    return () => clearTimeout(timeoutOpenBox) //clear Timeout when component unmount
  }, [isCanOpenBox])

  const getBalance = async (account) => {
    const balanceWei = await web3.eth.getBalance(account)
    const balanceETH = await web3.utils.fromWei(balanceWei, 'ether')
    //balance nhận được là wei, format từ wei sang ether để hiển thị ra
    setBalance(parseFloat(balanceETH).toFixed(2))
  }

  const handleAccountsChanged = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    setAccount(accounts[0])
    getBalance(accounts[0])
  }

  const connectMetamask = async () => {
    if (window.ethereum) {
      //nếu đã log in vào metamask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      // console.log({ accounts })
      setAccount(accounts[0])
      getBalance(accounts[0])

      //listen event when user change account on metamask
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    else {
      toast.error('Please connect Metamask!')
    }
  }

  const onOpenBox = async (color) => {
    if (!account) {
      return toast.error('Please connect Metamask!')
    }

    if (amountOfBoxes === 0) {
      return toast.error('Please buy more box!')
    }

    if (isCanOpenBox === false) {
      return toast.error('Please wait 3 seconds!')
    }

    const random = Math.floor(Math.random() * 101)
    console.log(random);

    //** Trong trường hợp nhận được tiền thưởng, mà lỗi mạng hay contract có vấn đề gì đó
    //mà không nhận được tiền từ contract thì cũng không trừ số box của user
    //--> gọi api openBox khi nhận được tiền từ contract

    if (color === 'red') {
      setIsOpenBoxRed(true)

      if (random < 41) { //bên ngoài để tỉ lệ 60%, nhưng bên trong sẽ là 40%
        setMoneyBoxRed(2)
        try {
          // const amount = web3.utils.toWei('2', 'ether')
          // const result = await contract.methods.ReceiveAward(account, amount).send({
          //   from: account,
          //   value: 0
          // })
          // console.log(result);
          // const obj = {transactionHash: result.transactionHash}

          //--------------------GỬI TỚI CONTRACT THÔNG QUA METAMASK--------------------
          const amount = web3.utils.toWei('2', 'ether')
          const gasPrice = await web3.eth.getGasPrice()
          const gas = await contract.methods.ReceiveAward(account, amount).estimateGas({
            gas: 500000,
            from: account,
            value: '0'
          })
          const data = await contract.methods.ReceiveAward(account, amount).encodeABI()
          const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              gasPrice: web3.utils.toHex(gasPrice),
              gas: web3.utils.toHex(gas),
              to: addressContract,
              from: account,
              value: '0',
              data,
            }]
          })
          console.log(txHash);
          const obj = { transactionHash: txHash }

          dispatch(boxAction.receiveAward(obj))
          dispatch(boxAction.openBox()) //--> gọi đến api mở box để trừ số box
          getBalance(account) //--> cập nhật lại balance
          toast.success(`Congratulation! You have received 2 ETH`)
        } catch (error) {
          console.log(error);
          toast.error('Sorry! You can not receive award')
        }
      }
      else {
        setMoneyBoxRed(0)
        toast.info('Unlucky! Please try again')
        dispatch(boxAction.openBox()) //--> gọi đến api mở box để trừ số box
      }
    }
    else {
      setIsOpenBoxViolet(true)

      if (random < 21) { //bên ngoài để tỉ lệ 40%, nhưng bên trong sẽ là 20%
        setMoneyBoxViolet(3)
        try {
          // const amount = web3.utils.toWei('3', 'ether')
          // const result = await contract.methods.ReceiveAward(account, amount).send({
          //   from: account,
          //   value: 0
          // })
          // console.log(result);
          // const obj = {transactionHash: result.transactionHash}

          //--------------------GỬI TỚI CONTRACT THÔNG QUA METAMASK--------------------
          const amount = web3.utils.toWei('3', 'ether')
          const gasPrice = await web3.eth.getGasPrice()
          const gas = await contract.methods.ReceiveAward(account, amount).estimateGas({
            gas: 500000,
            from: account,
            value: '0'
          })
          const data = await contract.methods.ReceiveAward(account, amount).encodeABI()
          const txHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [{
              gasPrice: web3.utils.toHex(gasPrice),
              gas: web3.utils.toHex(gas),
              to: addressContract,
              from: account,
              value: '0',
              data,
            }]
          })
          console.log(txHash);
          const obj = { transactionHash: txHash }

          dispatch(boxAction.receiveAward(obj))
          dispatch(boxAction.openBox()) //--> gọi đến api mở box để trừ số box
          getBalance(account) //--> cập nhật lại balance
          toast.success(`Congratulation! You have received 3 ETH`)
        } catch (error) {
          console.log(error);
          toast.error('Sorry! You can not receive award')
        }
      }
      else {
        setMoneyBoxViolet(0)
        toast.info('Unlucky! Please try again')
        dispatch(boxAction.openBox()) //--> gọi đến api mở box để trừ số box
      }
    }
    setIsCanOpenBox(false)
  }

  const closeBox = () => {
    setIsOpenBoxRed(false)
    setIsOpenBoxViolet(false)
    setMoneyBoxRed(0)
    setMoneyBoxViolet(0)
  }

  const onBuyBox = async () => {
    closeBox()

    if (!account) {
      return toast.error('Please login Metamask!')
    }
    if (window.confirm('Do you want to buy one box?')) {
      try {
        //1 box = 1 ETH
        //cái này là cách gửi thẳng trực tiếp tới contract luôn, không có thông qua metamask
        // const result = await contract.methods.BuyBox().send({
        //   from: account,
        //   // value: 0, //hàm BuyBox trên contract hiện giờ là nonpayable(tức là không cần tốn phí)
        //   value: web3.utils.toWei('1', 'ether')
        // })
        // console.log(result);
        // const obj = {
        //   buyBox: 1,
        //   transactionHash: result.transactionHash
        // }
        // dispatch(boxAction.buyBox(obj))

        //--------------------GỬI TỚI CONTRACT THÔNG QUA METAMASK--------------------
        // https://docs.metamask.io/guide/sending-transactions.html?
        const gasPrice = await web3.eth.getGasPrice() //giá trị của 1 gas tương ứng bao nhiêu eth trong mạng lưới
        // console.log({gasPrice});

        // https://web3js.readthedocs.io/en/v1.2.11/web3-eth-contract.html#contract-estimategas
        const gas = await contract.methods.BuyBox().estimateGas(
          {
            gas: 5000000,
            from: account,
            value: web3.utils.toWei('1', 'ether')
          }
        ) //--> ước tính gas cho cái methods
        // console.log(web3.utils.toHex(gas));
        // console.log(web3.utils.toHex(web3.utils.toWei('1', 'ether')));
        const data = await contract.methods.BuyBox().encodeABI()
        //trả về 1 chuỗi byte code tương đương với việc sử dụng hàm toHex của web3
        // console.log(data); 
        // console.log(web3.utils.toHex(data));
        //2 console.log trên sẽ cho ra kết quả giống nhau

        //những tham số gasPrice, gas, value, data sẽ phải chuyển thành chuỗi Hex hoặc encodeABI
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            gasPrice: web3.utils.toHex(gasPrice),
            gas: web3.utils.toHex(gas),
            to: addressContract,
            from: account,
            value: web3.utils.toHex(web3.utils.toWei('1', 'ether')),
            data,
          }]
        })

        // console.log(txHash);
        const obj = {
          buyBox: 2, // mua được 2 box
          transactionHash: txHash
        }
        dispatch(boxAction.buyBox(obj))

        toast.success('Buy box success')
        getBalance(account)
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
          <h6 className='mb-0'>Balance:
            <span className='text-danger d-inline-block ms-2 me-1'>{balance}</span>
            ETH
          </h6>
        </>
      }

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
                onClick={() => onOpenBox('red')}
              >Open box</Button>
              <h6 className='text-center' style={{ color: '#cc231e' }}>60% you can get 2 ETH</h6>
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
                onClick={() => onOpenBox('violet')}
              >Open box</Button>
              <h6 className='text-center' style={{ color: '#3103ff' }}>40% you can get 3 ETH</h6>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default React.memo(LearnBlockChain);
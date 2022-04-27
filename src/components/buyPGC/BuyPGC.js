import React from 'react';
import Web3 from 'web3';
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
  // const web3 = useSelector(state => state.web3.provider)
  // const pgc = useSelector(state => state.contract.pgc)

  const [amountPGC, setAmountPGC] = React.useState(0)
  const [amountBNB, setAmountBNB] = React.useState(0)
  const [account, setAccount] = React.useState('')
  const [balance, setBalance] = React.useState(0)
  const [token, setToken] = React.useState(0)
  const [isConnentMetamask, setIsConnentMetamask] = React.useState(false)
  const [web3, setWeb3] = React.useState(null)
  const [pgc, setPGC] = React.useState({
    contract: {},
    address: '0xDb155F03982Ed455Aa88892E573357509F13394f',
    abi: [
      {
        inputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "constructor"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "Approval",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "previousOwner",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "OwnershipTransferred",
        type: "event"
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address"
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address"
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256"
          }
        ],
        name: "Transfer",
        type: "event"
      },
      {
        constant: true,
        inputs: [
          {
            internalType: "address",
            name: "owner",
            type: "address"
          },
          {
            internalType: "address",
            name: "spender",
            type: "address"
          }
        ],
        name: "allowance",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          }
        ],
        name: "approve",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "balanceBNB",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address"
          }
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [
          {
            internalType: "uint8",
            name: "",
            type: "uint8"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "subtractedValue",
            type: "uint256"
          }
        ],
        name: "decreaseAllowance",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "getOwner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            internalType: "address",
            name: "spender",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "addedValue",
            type: "uint256"
          }
        ],
        name: "increaseAllowance",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          }
        ],
        name: "mint",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "name",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          }
        ],
        name: "receiveToken",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        payable: true,
        stateMutability: "payable",
        type: "function"
      },
      {
        constant: false,
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "symbol",
        outputs: [
          {
            internalType: "string",
            name: "",
            type: "string"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: true,
        inputs: [],
        name: "totalSupply",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256"
          }
        ],
        payable: false,
        stateMutability: "view",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            internalType: "address",
            name: "recipient",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          }
        ],
        name: "transfer",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            internalType: "address",
            name: "sender",
            type: "address"
          },
          {
            internalType: "address",
            name: "recipient",
            type: "address"
          },
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          }
        ],
        name: "transferFrom",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool"
          }
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address"
          }
        ],
        name: "transferOwnership",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [],
        name: "withdrawAllMoney",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      },
      {
        constant: false,
        inputs: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256"
          }
        ],
        name: "withdrawAmount",
        outputs: [],
        payable: false,
        stateMutability: "nonpayable",
        type: "function"
      }
    ]
  })

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
      const account = accounts[0];
      // console.log({ account });
      setAccount(account)
      
      const connectWeb3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/')
      setWeb3(connectWeb3)

      const balanceWei = await connectWeb3.eth.getBalance(account)
      const balanceBNB = await connectWeb3.utils.fromWei(balanceWei, 'ether')
      // console.log({ balanceBNB });
      setBalance(parseFloat(balanceBNB))
      setIsConnentMetamask(true)

      const contract = await new connectWeb3.eth.Contract(pgc.abi, pgc.address)
      setPGC({
        ...pgc,
        contract
      })
      //gọi methods balanceOf để biết được tài khoản đang có bao nhiêu token
      //***Lưu ý:
      //Những hàm tương tác với Smart Contract mà làm thay đổi Blockchain (vd: thực hiện 1 giao dịch) sẽ tốn 1 lượng phí gas
      // Còn những hàm dùng để tra cứu không làm thay đổi Blockchain(vd: xem số dư) sẽ không bị tốn phí gas

      const balanceWeiOfToken = await contract.methods.balanceOf(account).call()
      const balanceToken = await connectWeb3.utils.fromWei(balanceWeiOfToken, 'ether')
      setToken(balanceToken)
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
      toast.success(`Buy ${amountPGC} success`)

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
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract OpenBox {
  address public owner = msg.sender;

  constructor() {
    owner = msg.sender; //địa chỉ khởi tạo(deploy) cái ví này chính là owner
  }

  // struct Receipt {
  //   address address_wallet;
  //   string id;
  // }

  //hàm BuyBox miễn phí
  // function BuyBox(string memory _id) public view returns (Receipt memory){
  //   return Receipt(msg.sender, _id);
  // }

  //hàm BuyBox có tính phí (1 ETH = 2 box)
  function BuyBox(uint _amount) public payable {
    require(msg.value >= 1 ether, 'Please send minium 1ETH');
    require(_amount >= 1, 'Please send minium 1 box');
  }

  function GetBalance() public view returns (uint){
    require(msg.sender == owner, 'You are not owner of this contract');
    return address(this).balance;
  }

  //contract chuyển eth cho người trúng thưởng
  function ReceiveAward(address payable _receiver, uint _amount) public {
    require(GetBalance() >= _amount, 'Contract is not enough money'); //--> kiểm tra xem contract có đủ balance để transfer không
    _receiver.transfer(_amount);
  }

  //withdraw from contract
  function WithdrawAllMoney(address payable _receiver) public {
    // require(owner == _receiver, 'Only owner of contract can widthdraw');
    require(owner == _receiver, 'Only owner of contract can widthdraw');
    _receiver.transfer(GetBalance()); //--> transfer hết toàn bộ balance cho người gọi hàm
  }

  function WithdrawAmount(address payable _receiver, uint _amount) public {
    require(owner == _receiver, 'Only owner of contract can widthdraw');
    require(GetBalance() >= _amount, 'Contract is not enough money');
    _receiver.transfer(_amount);
  }

  //deposit to contract
  function DepositAmount() public payable {
    require(owner == msg.sender, 'Only owner of contract can widthdraw');
    require(msg.value >= 1 ether, 'Please send minium 1ETH');
  }
}
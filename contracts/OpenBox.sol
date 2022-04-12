// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract OpenBox {
  address public owner = msg.sender;

  // struct Receipt {
  //   address address_wallet;
  //   string id;
  // }

  //hàm BuyBox miễn phí
  // function BuyBox(string memory _id) public view returns (Receipt memory){
  //   return Receipt(msg.sender, _id);
  // }

  //hàm BuyBox có tính phí (1 box = 1 ETH)
  function BuyBox() public payable {
    require(msg.value == 1 ether, 'Please send 1ETH'); 
  }

  //contract chuyển eth cho người trúng thưởng
  function ReceiveAward(address payable _receiver, uint _amount) public {
    require(address(this).balance >= _amount, 'Contract is not enough money');
    _receiver.transfer(_amount);
  }
}

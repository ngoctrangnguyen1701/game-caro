// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract OpenBox {
  address public owner = msg.sender;

  struct Receipt {
    address address_wallet;
    string id;
  }

  //hàm BuyBox miễn phí
  // function BuyBox(string memory _id) public view returns (Receipt memory){
  //   return Receipt(msg.sender, _id);
  // }

  //hàm BuyBox có tính phí (1 box = 1 ETH)
  function BuyBox(string memory _id) public payable returns (Receipt memory){
    // require(msg.value == amount); 
    //kiểm tra số tiền được đính kèm trong transaction message và số tiền mà ng gửi chuyển như 1 đối số của hàm BuyBox
    return Receipt(msg.sender, _id);
  }
}

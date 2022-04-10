// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract OpenBox {
  address public owner = msg.sender;

  event BuyBox_Data(address _address, string _id);

  function BuyBox(string memory _id) public {
    //khi client gọi function BuyBox có truyền vào tham số id
    //từ phía contract sẽ phát ra sự kiện BuyBox_Data
    //kèm theo địa chỉ ví người thực hiện function (msg.sender) và id
    //serve sẽ lấy dữ liệu để xác nhận số box cho id đó
    emit BuyBox_Data(msg.sender, _id);
  }
}

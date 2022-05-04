pragma solidity ^0.8.0;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol';
// totalSupply()
// balanceOf(account)
// transfer(to, amount)
// allowance(owner, spender)
// approve(spender, amount)
// transferFrom(from, to, amount)

contract TokenSwap {
    ERC20 public exToken; //token PGC ở contact cũ
    ERC20 public newToken; //token PGC ở contact mới
    address public owner;

    constructor(address _exToken, address _newToken) {
        exToken = ERC20(_exToken); //--> exToken sẽ có các hàm của chuẩn ERC20 
        newToken = ERC20(_newToken);
        owner = msg.sender;
    }

    // function swap(address _receiver, uint amount) external {
    //     // require(msg.sender == owner, 'You are not owner of contract');
    //     //kiểm tra receiver đã approve số lượng token ở contract cũ cho contract swap token này chưa
    //     require(exToken.allowance(_receiver, address(this)) >= amount, 'Approval exToken is not enought');

    //     //kiểm tra người thực thi function (chủ contact này)
    //     require(newToken.allowance(msg.sender, address(this)) >= amount, 'Approval newToken is not enought');

    //     //thỏa các điều kiện, tiến hành chuyển đổi
    //     exToken.transferFrom(_receiver, msg.sender, amount);
    //     newToken.transferFrom(msg.sender, _receiver, amount);
    // }

    //thay đổi thành người dùng tự swap, không còn phải đợi admin thực thi
    function swap(uint amount) external {
        // require(msg.sender == owner, 'You are not owner of contract');
        //kiểm tra người thực thi function đã approve số lượng token ở contract cũ cho contract swap token này chưa
        require(exToken.allowance(msg.sender, address(this)) >= amount, 'Approval exToken is not enought');

        //kiểm tra chủ contact này đã approve số lượng token ở contract mới cho contract swap token này chưa
        require(newToken.allowance(owner, address(this)) >= amount, 'Approval newToken is not enought');

        //thỏa các điều kiện, tiến hành chuyển đổi
        exToken.transferFrom(msg.sender, owner, amount);
        newToken.transferFrom(owner, msg.sender, amount);
    }
}
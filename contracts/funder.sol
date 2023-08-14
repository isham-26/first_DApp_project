//SPDX-License-Identifier: MIT

pragma solidity  ^0.8.19;
contract Funder{
    uint256 public numOfFunders;
    mapping(uint256=> address) private funders;

    receive() external payable{}

    function transfer() external payable{
        funders[numOfFunders]=msg.sender;
        numOfFunders++;
    }
    function withdraw(uint256 withdrawAmount) external{
           require(withdrawAmount<=2000000000000000000,"Con't transfer more than 2 ether");
           payable(msg.sender).transfer(withdrawAmount);
    }
}

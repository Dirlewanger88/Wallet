//SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;
pragma abicoder v2;

contract Wallet {
    address[] public approvers;
    uint public quorum;


    struct Transfer {
        uint id;
        uint amount;
        address payable to;
        uint approvers;
        bool sent;
    }

    Transfer[] public transfers;
    mapping(address => mapping(uint => bool)) public approvals;


    constructor(address[] memory _approvers, uint _quorum) public {
        approvers = _approvers;
        quorum = _quorum;
    }

    function getApprovers() external view returns (address[] memory){
        return approvers;
    }

    function getTransfer() external view returns (Transfer[] memory){
        return transfers;
    }

    function createTransfer(uint amount, address payable to) external onlyApprover {
        transfers.push(Transfer(
        transfers.length,
        amount,
        to,
        0,
        false
        ));
    }

    function approveTransfer(uint _id) external onlyApprover() {
        require(transfers[_id].sent == false, 'transfers has already been exact');
        require(approvals[msg.sender][_id] == false, 'cannot aprove tarnsfer');

        approvals[msg.sender][_id] = true;
        transfers[_id].approvers++;

        if (transfers[_id].approvers >= quorum) {
            transfers[_id].sent = true;
            address payable to = transfers[_id].to;
            uint amount = transfers[_id].amount;
            to.transfer(amount);
        }
    }

    receive() external payable {}

    modifier onlyApprover() {
        bool allowed = false;
        for (uint i = 0; i < approvers.length; i++) {
            if (approvers[i] == msg.sender) {
                allowed = true;
            }
        }
        require(allowed == true, 'only approver allowed');
        _;
    }
}
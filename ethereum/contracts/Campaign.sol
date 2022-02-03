// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Ballot
 * @dev Implements voting process along with vote delegation
 */

contract CampaignFactory {
    address[] public deployedCampaigns;

    function createCampaign(uint256 minimum) public {
        address newCampaign = address(new Campaign(minimum, msg.sender));
        deployedCampaigns.push(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalsCount;
        mapping(address => bool) peopleApproved;
    }
    Request[] public requests;
    address public manager;
    uint256 public minimumContribution;

    mapping(address => bool) public approvers;
    uint256 public approversCount;

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    constructor(uint256 minimum, address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(
            (msg.value > minimumContribution),
            "minimumContribution not met"
        );

        approvers[msg.sender] = true;
        approversCount++;
    }

    function createRequest(
        string memory description,
        uint256 value,
        address recipient
    ) public restricted {
        // Request memory newRequest = Request({
        //     description: description,
        //     value: value,
        //     recepient: recepient,
        //     complete: false,
        //     approvalCount: 0
        // });
        Request storage newRequest = requests.push();
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalsCount = 0;

        // requests.push(newRequest);
    }

    function approveRequest(uint256 index) public {
        Request storage currentRequest = requests[index]; // storage because, we want to modify original value later

        require(approvers[msg.sender], "sender did not donate"); //check whether the sender has donated to the campaign or not
        require(
            !currentRequest.peopleApproved[msg.sender],
            "sender has already voted"
        ); //only one vote per user

        currentRequest.approvalsCount++;
        currentRequest.peopleApproved[msg.sender] = true;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage currentRequest = requests[index];

        require(!currentRequest.complete, "this request is already finalized");
        require(
            currentRequest.approvalsCount > (approversCount / 2),
            "request does not have enough approvals"
        );

        payable(currentRequest.recipient).transfer(currentRequest.value);
        currentRequest.complete = true;
    }

    function getSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address
        )
    {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager
        );
    }

    function getRequestCount() public view returns (uint256) {
        return requests.length;
    }
}

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Campaign from "../../../../ethereum/campaign";
import RequestRow from "../../../../components/RequestRow";

import { Button, Table, Message } from "semantic-ui-react";

function ViewRequests(props) {
  const router = useRouter();
  const { address } = router.query;

  const { requests, requestCount, approversCount } = props;

  const { Header, Row, Body, HeaderCell } = Table;

  const [errorMessage, setErrorMessage] = useState("");

  const renderTableRows = () => {
    return requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
          address={address}
          approversCount={approversCount}
          setErrorMessage={setErrorMessage}
        />
      );
    });
  };

  return (
    <div>
      <h3>Requests</h3>
      <Link href={`/campaigns/${address}/requests/new`}>
        <a>
          <Button primary floated="right" style={{marginBottom:'15px'}}>Create Request</Button>
        </a>
      </Link>
      <Table>
        <Header>
          <Row>
            <HeaderCell>ID</HeaderCell>
            <HeaderCell>Description</HeaderCell>
            <HeaderCell>Amount (ether)</HeaderCell>
            <HeaderCell>Recepient</HeaderCell>
            <HeaderCell>Approval count</HeaderCell>
            <HeaderCell>Approve</HeaderCell>
            <HeaderCell>Finalize</HeaderCell>
          </Row>
        </Header>
        <Body>{renderTableRows()}</Body>
      </Table>
      <h5>Found {requestCount} requests</h5>
      {!!errorMessage && (
        <Message error header="Approval/Finalize failed" content={errorMessage} />
      )}
    </div>
  );
}

ViewRequests.getInitialProps = async (props) => {
  const { address } = props.query;
  const campaign = Campaign(address);

  const requestCount = await campaign.methods.getRequestCount().call();
  const approversCount = await campaign.methods.approversCount().call();

  const requests = await Promise.all(
    Array(parseInt(requestCount))
      .fill()
      .map((element, index) => {
        return campaign.methods.requests(index).call();
      })
  );

  return { requests, requestCount, approversCount };
};

export default ViewRequests;

import React, { useState } from "react";
import { Button, Table } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { useRouter } from "next/router";

function RequestRow(props) {
  const { Row, Cell } = Table;
  const { request, address, id, approversCount, setErrorMessage } = props;

  const router = useRouter();

  const [approveLoading, setApproveLoading] = useState(false);
  const [finalizeLoading, setFinalizeLoading] = useState(false);

  const readyToFinalize = (request.approvalsCount > approversCount/2) && !request.complete;

  const onApprove = async () => {
    try {
      setApproveLoading(true);
      setErrorMessage("");
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();

      await campaign.methods.approveRequest(id).send({
        from: accounts[0],
      });
      router.replace(`/campaigns/${address}/requests`);
    } catch (err) {
      setErrorMessage(err.message);
    }
    setApproveLoading(false);
  };

  const onFinalize = async () => {
    try {
        setFinalizeLoading(true);
        setErrorMessage("");
        const campaign = Campaign(address);
        const accounts = await web3.eth.getAccounts();
  
        await campaign.methods.finalizeRequest(id).send({
          from: accounts[0],
        });
        router.replace(`/campaigns/${address}/requests`);
      } catch (err) {
        setErrorMessage(err.message);
      }
      setFinalizeLoading(false);
  };

  return (
    <Row disabled={request.complete} positive={readyToFinalize}>
      <Cell>{id + 1}</Cell>
      <Cell>{request.description}</Cell>
      <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
      <Cell>{request.recipient}</Cell>
      <Cell>{`${request.approvalsCount}/${approversCount}`}</Cell>
      <Cell>
        <Button
          color="green"
          basic
          onClick={onApprove}
          loading={approveLoading}
          disabled={request.complete}
        >
          Approve
        </Button>
      </Cell>
      <Cell>
        <Button
          color="teal"
          basic
          loading={finalizeLoading}
          onClick={onFinalize}
          disabled={request.complete}
        >
          Finalize
        </Button>
      </Cell>
    </Row>
  );
}

export default RequestRow;

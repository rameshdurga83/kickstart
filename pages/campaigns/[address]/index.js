import React from "react";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../../ethereum/web3";
import Link from "next/link";

import Campaign from "../../../ethereum/campaign";
import ContributeForm from "../../../components/ContributeForm";

function CampaignShow(props) {
  const { address } = props;
  function renderCards() {
    const {
      minimumContribution,
      balance,
      requestsCount,
      approversCount,
      manager,
    } = props;

    const items = [
      {
        header: manager,
        meta: "Address of the manager",
        description:
          "The manager created this campaign and can create requests to withdraw money.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: web3.utils.fromWei(balance, "ether"),
        meta: "Campaign Balance (ether)",
        description: "The Balance amount in campaign",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimun contribution (Wei)",
        description: "Minimun contribution in Wei to become an approver",
        style: { overflowWrap: "break-word" },
      },
      {
        header: requestsCount,
        meta: "No of requests",
        description:
          "Number of requests created by manager to withdraw money. Requests must be approved by approver",
        style: { overflowWrap: "break-word" },
      },
      {
        header: approversCount,
        meta: "Number of approvers",
        description:
          "Total number of people who have contributed to the campaign",
        style: { overflowWrap: "break-word" },
      },
    ];

    return <Card.Group items={items} />;
  }

  return (
    <div>
      <h3>campaign details</h3>
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>{renderCards()}</Grid.Column>
          <Grid.Column width={5}>
            <ContributeForm address={address} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link href={`/campaigns/${address}/requests`}>
              <a>
                <Button primary>View Requests</Button>
              </a>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

CampaignShow.getInitialProps = async (props) => {
  const campaign = Campaign(props.query.address);

  const campaignSummary = await campaign.methods.getSummary().call();

  return {
    address: props.query.address,
    minimumContribution: campaignSummary[0],
    balance: campaignSummary[1],
    requestsCount: campaignSummary[2],
    approversCount: campaignSummary[3],
    manager: campaignSummary[4],
  };
};

export default CampaignShow;

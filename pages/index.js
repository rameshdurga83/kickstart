import React, { useEffect } from "react";

import { useRouter } from "next/router";
import Link from "next/link";
import factory from "../ethereum/factory";


import { Card, Button } from "semantic-ui-react";

function CampaignIndex(props) {
  const router = useRouter();
  const items = props.campaigns.map((address) => {
    return {
      header: address,
      description: (
        <Link href={`/campaigns/${address}`}>
          <a>View Campaign</a>
        </Link>
      ),
      fluid: true,
      color: "blue",
    };
  });

  return (
      <div>
        <h3>Open campaigns</h3>
        <Link href="/campaigns/new">
          <a>
            <Button
              content="Create Campaign"
              icon="add circle"
              floated="right"
              primary
            />
          </a>
        </Link>
        <Card.Group items={items} />
      </div>
  );
}

CampaignIndex.getInitialProps = async () => {
  // for class components you can add like this --- static async getInitialProps()
  const campaigns = await factory.methods.getDeployedCampaigns().call();
  return { campaigns }; // the returned value is aaded as a prop in the component
};

export default CampaignIndex;

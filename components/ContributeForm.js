import React, { useState } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import {useRouter} from "next/router";

function ContributeForm({address}) {
  const [amount, setAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onInputChange = (event) => {
    setAmount(event.target.value);
  };

  const onFormSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setErrorMessage("");
      const campaign = Campaign(address);
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(amount, 'ether')
      });

      router.replace(`/campaigns/${address}`);
    } catch (err) {
      setErrorMessage(err.message);
    }
    setLoading(false);
    setAmount('');
  };

  return (
    <div>
      <Form onSubmit={onFormSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Amount to contribute</label>
          <Input
            label="ether"
            labelPosition="right"
            placeholder="Enter amount to contribute..."
            value={amount}
            onChange={onInputChange}
          />
        </Form.Field>
        <Message error header="Oops..!" content={errorMessage} />
        <Button primary type="submit" loading={loading}>
          Contribute!
        </Button>
      </Form>
    </div>
  );
}

export default ContributeForm;

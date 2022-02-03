import React, { useState } from "react";
import { Form, Button, Input, Message, Icon} from "semantic-ui-react";
import web3 from "../../../../ethereum/web3";
import Campaign from "../../../../ethereum/campaign";
import { useRouter } from "next/router";
import Link from "next/link";

function newRequest({balance}) {
  const router = useRouter();
  const { address } = router.query;

  const [description, setDescription] = useState("");
  const [value, setvalue] = useState("");
  const [recepient, setRecepient] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (event) =>{
      event.preventDefault();

      try{
          setLoading(true);
          setErrorMessage('');
          const campaign = Campaign(address);

          const accounts = await web3.eth.getAccounts();

          await campaign.methods.createRequest(
            description,
            web3.utils.toWei(value, 'ether'),
            recepient
          ).send({
            from: accounts[0]
          });
          router.push(`/campaigns/${address}/requests`);

      }catch(err){
        setErrorMessage(err.message);
      }
      setLoading(false);
  }

  return (
    <div>
        <Link href={`/campaigns/${address}/requests`}>
        <a><Icon name="left chevron" />Back</a>
        </Link>
      <h3>Create a New Request</h3>
      <h5>Balance: {web3.utils.fromWei(balance,'ether')} ether</h5>
      <Form onSubmit={onSubmit} error={!!errorMessage}>
        <Form.Field>
          <label>Description</label>
          <Input
            placeholder="Enter Description..."
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Value in Ether</label>
          <Input
            label="ether"
            labelPosition="right"
            placeholder="Enter amount to transfer..."
            value={value}
            onChange={(event) => {
              setvalue(event.target.value);
            }}
          />
        </Form.Field>
        <Form.Field>
          <label>Recepient</label>
          <Input
            placeholder="Enter recepient address..."
            value={recepient}
            onChange={(event) => {
              setRecepient(event.target.value);
            }}
          />
        </Form.Field>
        <Message error header="Oops..!" content={errorMessage} />
        <Button primary loading={loading}>Create</Button>
      </Form>
    </div>
  );
}

newRequest.getInitialProps = async(props)=>{
    const balance = await web3.eth.getBalance(props.query.address);
    return{balance}
}

export default newRequest;
